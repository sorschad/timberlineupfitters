#!/usr/bin/env node

/**
 * Sanity Database Restore Script
 * 
 * This script restores a Sanity dataset from a backup created by backup-sanity.js
 * 
 * Usage:
 *   node restore-sanity.mjs <backup-directory>
 * 
 * Example:
 *   node restore-sanity.mjs backups/backup-2024-01-15T10-30-00-000Z
 * 
 * WARNING: This will overwrite existing data in your dataset!
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: './studio/.env' })

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

if (!projectId || !dataset) {
  console.error('❌ Missing required environment variables:')
  console.error('   SANITY_STUDIO_PROJECT_ID:', projectId || 'NOT SET')
  console.error('   SANITY_STUDIO_DATASET:', dataset || 'NOT SET')
  console.error('\nPlease check your studio/.env file')
  process.exit(1)
}

// Get backup directory from command line arguments
const backupDir = process.argv[2]

if (!backupDir) {
  console.error('❌ Please specify a backup directory')
  console.error('Usage: node restore-sanity.mjs <backup-directory>')
  console.error('Example: node restore-sanity.mjs backups/backup-2024-01-15T10-30-00-000Z')
  process.exit(1)
}

if (!fs.existsSync(backupDir)) {
  console.error(`❌ Backup directory not found: ${backupDir}`)
  process.exit(1)
}

// Create Sanity client
const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_WRITE_TOKEN, // You'll need a write token for restore
})

async function restoreBackup() {
  console.log(`🔄 Restoring backup from: ${backupDir}`)
  console.log(`📁 Target project: ${projectId}`)
  console.log(`📂 Target dataset: ${dataset}`)
  
  // Check for complete backup file
  const completeBackupFile = path.join(backupDir, 'complete-backup.json')
  
  if (!fs.existsSync(completeBackupFile)) {
    console.error(`❌ Complete backup file not found: ${completeBackupFile}`)
    process.exit(1)
  }
  
  try {
    // Read the complete backup
    const backupData = JSON.parse(fs.readFileSync(completeBackupFile, 'utf8'))
    const documents = backupData.documents
    
    console.log(`📄 Found ${documents.length} documents to restore`)
    console.log(`📅 Backup created: ${backupData.metadata.timestamp}`)
    
    // Confirm before proceeding
    console.log('\n⚠️  WARNING: This will overwrite existing data in your dataset!')
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...')
    
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Restore documents in batches
    const batchSize = 10
    let restored = 0
    
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      
      const transaction = client.transaction()
      
      batch.forEach(doc => {
        // Remove _rev to allow overwriting
        const { _rev, ...docWithoutRev } = doc
        transaction.createOrReplace(docWithoutRev)
      })
      
      await transaction.commit()
      restored += batch.length
      
      console.log(`✅ Restored ${restored}/${documents.length} documents`)
    }
    
    console.log(`\n🎉 Restore completed successfully!`)
    console.log(`📊 Total documents restored: ${restored}`)
    
  } catch (error) {
    console.error('❌ Restore failed:', error.message)
    process.exit(1)
  }
}

// Run the restore
restoreBackup()
