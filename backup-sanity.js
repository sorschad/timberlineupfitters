#!/usr/bin/env node

/**
 * Sanity Database Backup Script
 * 
 * This script creates a backup of your Sanity dataset by exporting all documents
 * to JSON files. Run this from the project root directory.
 * 
 * Usage:
 *   node backup-sanity.js
 * 
 * Requirements:
 *   - SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET environment variables
 *   - @sanity/client package installed
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Create Sanity client
const client = createClient({
  projectId,
  dataset,
  useCdn: false, // Always get fresh data for backups
  apiVersion: '2023-05-03',
})

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.join(__dirname, 'backups', `backup-${timestamp}`)
  
  // Create backup directory
  fs.mkdirSync(backupDir, { recursive: true })
  
  console.log(`🔄 Creating backup for project: ${projectId}`)
  console.log(`📁 Dataset: ${dataset}`)
  console.log(`📂 Backup directory: ${backupDir}`)
  
  try {
    // Get all documents
    const query = '*[_type in ["brand", "page", "post", "vehicle", "manufacturer", "settings"]]'
    const documents = await client.fetch(query)
    
    console.log(`📄 Found ${documents.length} documents to backup`)
    
    // Group documents by type
    const documentsByType = documents.reduce((acc, doc) => {
      if (!acc[doc._type]) {
        acc[doc._type] = []
      }
      acc[doc._type].push(doc)
      return acc
    }, {})
    
    // Save each document type to separate files
    for (const [type, docs] of Object.entries(documentsByType)) {
      const filename = path.join(backupDir, `${type}.json`)
      fs.writeFileSync(filename, JSON.stringify(docs, null, 2))
      console.log(`✅ Backed up ${docs.length} ${type} documents to ${filename}`)
    }
    
    // Create a complete backup file
    const completeBackup = {
      metadata: {
        projectId,
        dataset,
        timestamp: new Date().toISOString(),
        documentCount: documents.length,
        documentTypes: Object.keys(documentsByType)
      },
      documents
    }
    
    const completeBackupFile = path.join(backupDir, 'complete-backup.json')
    fs.writeFileSync(completeBackupFile, JSON.stringify(completeBackup, null, 2))
    
    console.log(`\n🎉 Backup completed successfully!`)
    console.log(`📊 Total documents: ${documents.length}`)
    console.log(`📁 Backup location: ${backupDir}`)
    console.log(`\n📋 Document types backed up:`)
    Object.entries(documentsByType).forEach(([type, docs]) => {
      console.log(`   - ${type}: ${docs.length} documents`)
    })
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message)
    process.exit(1)
  }
}

// Run the backup
createBackup()
