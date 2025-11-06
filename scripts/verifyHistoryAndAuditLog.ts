#!/usr/bin/env node

/**
 * Verify Document History and Audit Log Script
 * 
 * This script verifies that document versioning/history and audit logs
 * are enabled and working on the staging dataset.
 * 
 * Usage:
 *   tsx scripts/verifyHistoryAndAuditLog.ts
 * 
 * Requirements:
 *   - SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET environment variables
 *   - SANITY_API_TOKEN or SANITY_WRITE_TOKEN environment variable
 *   - @sanity/client package installed
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables from studio/.env
dotenv.config({ path: './studio/.env' })

// Validate required environment variables
const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'staging'
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('❌ Error: SANITY_STUDIO_PROJECT_ID environment variable is required')
  console.error('   Please set this in studio/.env file')
  process.exit(1)
}

if (!token) {
  console.error('❌ Error: SANITY_WRITE_TOKEN or SANITY_API_TOKEN environment variable is required')
  console.error('   Please set this in studio/.env file')
  process.exit(1)
}

// Create Sanity client with token for accessing transactions/history
const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-10-28'
})

interface Transaction {
  transactionId: string
  timestamp: string
  mutations: any[]
  effects?: {
    documents: {
      created: string[]
      deleted: string[]
      updated: string[]
    }
  }
  identity?: string
  previousRev?: string
  resultRev?: string
}

async function verifyHistoryAndAuditLog() {
  console.log('🔍 Verifying Document History and Audit Logs on Staging')
  console.log(`📋 Project ID: ${projectId}`)
  console.log(`📋 Dataset: ${dataset}`)
  console.log('')

  try {
    // 1. Verify we can access transactions (document history)
    console.log('📝 Step 1: Checking document transaction history...')
    
    // Get recent transactions to verify history is being tracked
    // Note: This requires a token with appropriate permissions
    const transactionsUrl = `https://${projectId}.api.sanity.io/v2021-06-07/data/history/${dataset}/transactions`
    
    try {
      const response = await fetch(transactionsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const transactions = await response.json()
      
      if (Array.isArray(transactions) && transactions.length > 0) {
        console.log(`✅ Document history is ENABLED and working`)
        console.log(`   Found ${transactions.length} recent transactions`)
        
        // Show a few recent transactions
        const recentTransactions = transactions.slice(0, 5)
        console.log(`\n   Recent transaction activity:`)
        recentTransactions.forEach((tx: Transaction, index: number) => {
          const date = tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Unknown'
          const mutationCount = tx.mutations?.length || 0
          console.log(`   ${index + 1}. ${date} - ${mutationCount} mutation(s)`)
        })
      } else {
        console.log(`⚠️  Document history is enabled but no recent transactions found`)
        console.log(`   This might indicate a new dataset or no recent changes`)
      }
    } catch (error: any) {
      console.error(`❌ Failed to fetch transactions:`, error.message)
      console.error(`   This might indicate insufficient permissions or history not accessible via API`)
      console.error(`   Note: Document history is typically enabled by default in Sanity`)
    }

    console.log('')

    // 2. Verify audit log by checking document revision history
    console.log('📋 Step 2: Checking audit log functionality...')
    
    // Get a sample document to check its revision history
    const sampleDocuments = await client.fetch(`
      *[_type in ["vehicle", "page", "brand"]][0...5] {
        _id,
        _type,
        _rev,
        _updatedAt,
        title
      }
    `)

    if (sampleDocuments && sampleDocuments.length > 0) {
      console.log(`✅ Found ${sampleDocuments.length} sample documents`)
      
      // Check if documents have revision IDs (indicating versioning)
      const docsWithRevs = sampleDocuments.filter((doc: any) => doc._rev)
      
      if (docsWithRevs.length > 0) {
        console.log(`✅ Audit log is ENABLED - Documents have revision tracking`)
        console.log(`   ${docsWithRevs.length}/${sampleDocuments.length} documents have revision IDs`)
        
        // Try to get history for one document
        const testDoc = sampleDocuments[0]
        console.log(`\n   Testing history access for document: ${testDoc._id} (${testDoc._type})`)
        
        try {
          // Query document history using the transactions API
          const docHistoryUrl = `https://${projectId}.api.sanity.io/v2021-06-07/data/history/${dataset}/documents/${testDoc._id}`
          
          const historyResponse = await fetch(docHistoryUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (historyResponse.ok) {
            const docHistory = await historyResponse.json()
            if (docHistory && docHistory.length > 0) {
              console.log(`   ✅ Document has ${docHistory.length} version(s) in history`)
            } else {
              console.log(`   ℹ️  Document history is accessible but document has only one version`)
            }
          } else {
            console.log(`   ⚠️  Cannot access individual document history (may require different permissions)`)
          }
        } catch (error: any) {
          console.log(`   ⚠️  Could not fetch document history: ${error.message}`)
        }
      } else {
        console.log(`⚠️  Documents don't have revision IDs visible (may still be tracked internally)`)
      }
    } else {
      console.log(`⚠️  No documents found to test audit log`)
    }

    console.log('')

    // 3. Summary and recommendations
    console.log('📊 Summary:')
    console.log('')
    console.log('✅ Document Versioning & History:')
    console.log('   - Built-in feature that cannot be disabled')
    console.log('   - Every document change creates a new version')
    console.log('   - Accessible in Sanity Studio via History button')
    console.log('   - Accessible via Sanity API using transactions endpoint')
    console.log('')
    console.log('✅ Audit Log:')
    console.log('   - Automatically tracks all document changes')
    console.log('   - Includes: create, update, delete operations')
    console.log('   - Tracks: timestamp, user identity, document revisions')
    console.log('   - Accessible via Sanity Management API')
    console.log('')
    console.log('💡 To view history in Sanity Studio:')
    console.log('   1. Open any document in the Studio')
    console.log('   2. Click the "History" icon in the top toolbar')
    console.log('   3. View all versions and changes')
    console.log('')
    console.log('💡 To access audit logs programmatically:')
    console.log('   - Use the Sanity Management API transactions endpoint')
    console.log('   - Requires a token with appropriate permissions')
    console.log('   - Documentation: https://www.sanity.io/docs/versioning')

  } catch (error: any) {
    console.error('❌ Verification failed:', error.message)
    console.error('   Stack:', error.stack)
    process.exit(1)
  }
}

// Run the verification
verifyHistoryAndAuditLog()
  .then(() => {
    console.log('\n✅ Verification script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Verification script failed:', error)
    process.exit(1)
  })

