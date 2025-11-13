/**
 * Migration Script: Initialize Slug History for Existing Vehicles
 * 
 * This script initializes the slugHistory field for all existing vehicle documents
 * in Sanity. It sets an empty array for vehicles that don't have slug history yet.
 * 
 * Usage (from studio directory):
 *   npx tsx scripts/initializeSlugHistory.ts
 * 
 * Or from root directory:
 *   cd studio && npx tsx scripts/initializeSlugHistory.ts
 * 
 * Environment variables are loaded from studio/.env file
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables from studio/.env
dotenv.config({ path: './.env' })
dotenv.config({ path: './.env.local' })

// Sanity client configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
// Support multiple token variable names (matching other scripts)
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  console.error('❌ Error: SANITY_STUDIO_PROJECT_ID environment variable is required')
  console.error('')
  console.error('   Make sure you have a .env file in the studio directory with:')
  console.error('   SANITY_STUDIO_PROJECT_ID=your-project-id')
  console.error('   SANITY_STUDIO_DATASET=production')
  console.error('   SANITY_API_WRITE_TOKEN=your-token')
  console.error('')
  console.error('   Get your token from: https://www.sanity.io/manage/personal/api-tokens')
  process.exit(1)
}

if (!token) {
  console.error('❌ Error: Sanity API token is required')
  console.error('')
  console.error('   Set one of these in your studio/.env file:')
  console.error('   - SANITY_WRITE_TOKEN=your-token (preferred)')
  console.error('   - SANITY_API_TOKEN=your-token')
  console.error('   - SANITY_API_WRITE_TOKEN=your-token')
  console.error('')
  console.error('   Get your token from: https://www.sanity.io/manage/personal/api-tokens')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

interface SlugHistoryEntry {
  _type: 'object'
  _key: string
  slug: string
  activeFrom: string
  activeTo: string
}

/**
 * Attempt to backfill slug history from document revisions
 * This tries to find previous slugs by querying document history
 */
async function backfillSlugHistoryFromRevisions(vehicleId: string, currentSlug: string): Promise<SlugHistoryEntry[]> {
  try {
    // Query for all revisions of this document
    // Note: This is a simplified approach - Sanity's history API might be needed for full accuracy
    const revisions = await client.fetch(
      `*[_id == $id] | order(_updatedAt desc) {
        _id,
        _updatedAt,
        "slug": slug.current
      }`,
      { id: vehicleId }
    )

    if (!revisions || revisions.length <= 1) {
      return []
    }

    const history: SlugHistoryEntry[] = []
    const seenSlugs = new Set<string>([currentSlug])

    // Go through revisions in reverse chronological order (oldest first)
    const sortedRevisions = [...revisions].reverse()
    
    for (let i = 0; i < sortedRevisions.length - 1; i++) {
      const revision = sortedRevisions[i]
      const nextRevision = sortedRevisions[i + 1]
      
      if (revision.slug && nextRevision.slug && revision.slug !== nextRevision.slug) {
        // Slug changed between these revisions
        const oldSlug = revision.slug
        const newSlug = nextRevision.slug
        
        // Only add if we haven't seen this slug before and it's different from current
        if (!seenSlugs.has(oldSlug) && oldSlug !== currentSlug) {
          history.push({
            _type: 'object',
            _key: `slug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            slug: oldSlug,
            activeFrom: revision._updatedAt || new Date().toISOString(),
            activeTo: nextRevision._updatedAt || new Date().toISOString()
          })
          seenSlugs.add(oldSlug)
        }
      }
    }

    return history
  } catch (error) {
    console.error(`  ⚠️  Could not backfill history for ${vehicleId}:`, error)
    return []
  }
}

async function initializeSlugHistory() {
  try {
    console.log('🚀 Starting slug history initialization...')
    console.log(`📊 Project: ${projectId}`)
    console.log(`📊 Dataset: ${dataset}`)
    console.log('')

    // Fetch all vehicles
    const vehicles = await client.fetch(`
      *[_type == "vehicle"] {
        _id,
        title,
        "currentSlug": slug.current,
        _createdAt,
        _updatedAt,
        slugHistory
      }
    `)

    if (!vehicles || vehicles.length === 0) {
      console.log('ℹ️  No vehicles found in the dataset.')
      return
    }

    console.log(`📦 Found ${vehicles.length} vehicle(s)`)
    console.log('')

    // Process each vehicle
    let initialized = 0
    let backfilled = 0
    let skipped = 0

    for (const vehicle of vehicles) {
      const hasHistory = Array.isArray(vehicle.slugHistory) && vehicle.slugHistory.length > 0
      
      if (hasHistory) {
        console.log(`  ✓ ${vehicle.title || vehicle._id} - Already has slug history`)
        skipped++
        continue
      }

      // Try to backfill from document revisions
      let history: SlugHistoryEntry[] = []
      if (vehicle.currentSlug) {
        console.log(`  🔍 ${vehicle.title || vehicle._id} - Attempting to backfill slug history...`)
        history = await backfillSlugHistoryFromRevisions(vehicle._id, vehicle.currentSlug)
        
        if (history.length > 0) {
          console.log(`    ✓ Found ${history.length} previous slug(s) in document history`)
          backfilled++
        } else {
          console.log(`    ℹ️  No previous slugs found (vehicle may not have had slug changes)`)
        }
      }

      // Initialize or update slugHistory
      await client
        .patch(vehicle._id)
        .set({ slugHistory: history })
        .commit()

      initialized++
    }

    console.log('')
    console.log(`✅ Migration completed!`)
    console.log(`   • Initialized: ${initialized} vehicle(s)`)
    console.log(`   • Backfilled with history: ${backfilled} vehicle(s)`)
    console.log(`   • Already had history: ${skipped} vehicle(s)`)
    console.log('')
    console.log('📝 Next steps:')
    console.log('   1. The slugHistory field will now automatically track slug changes via webhook')
    console.log('   2. When you change a vehicle slug and publish, the old slug will be added to history')
    console.log('   3. Old URLs will continue to work via the slug history lookup')

  } catch (error) {
    console.error('❌ Error initializing slug history:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
    process.exit(1)
  }
}

// Run the migration
initializeSlugHistory()
  .then(() => {
    console.log('✨ Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })

