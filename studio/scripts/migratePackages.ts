/**
 * Migration Script: Convert Vehicle Package Strings to Package Documents
 * 
 * This script:
 * 1. Finds all unique package string values from existing vehicles
 * 2. Creates Package documents for each unique value (using string as name)
 * 3. Updates all vehicles to reference the newly created Package documents
 * 
 * Usage (from studio directory):
 *   npx tsx scripts/migratePackages.ts
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
const dataset = process.env.SANITY_STUDIO_DATASET || 'staging'
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  console.error('❌ Error: SANITY_STUDIO_PROJECT_ID environment variable is required')
  console.error('')
  console.error('   Make sure you have a .env file in the studio directory with:')
  console.error('   SANITY_STUDIO_PROJECT_ID=your-project-id')
  console.error('   SANITY_STUDIO_DATASET=staging')
  console.error('   SANITY_API_WRITE_TOKEN=your-token')
  process.exit(1)
}

if (!token) {
  console.error('❌ Error: Sanity API token is required')
  console.error('')
  console.error('   Set one of these in your studio/.env file:')
  console.error('   - SANITY_WRITE_TOKEN=your-token (preferred)')
  console.error('   - SANITY_API_TOKEN=your-token')
  console.error('   - SANITY_API_WRITE_TOKEN=your-token')
  process.exit(1)
}

// Create Sanity client
const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-10-28'
})

interface Vehicle {
  _id: string
  title: string
  package?: string
}

interface PackageDoc {
  _id: string
  name: string
  slug?: {
    current: string
  }
}

/**
 * Generate a slug from a package name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Main migration function
 */
async function migratePackages() {
  console.log('🚀 Starting Package Migration')
  console.log(`📋 Project ID: ${projectId}`)
  console.log(`📋 Dataset: ${dataset}`)
  console.log('')

  try {
    // Step 1: Fetch all vehicles with package strings
    console.log('📥 Step 1: Fetching all vehicles with package strings...')
    const vehicles = await client.fetch<Vehicle[]>(`
      *[_type == "vehicle" && defined(package) && !(_id in path("drafts.**"))] {
        _id,
        title,
        package
      }
    `)

    if (!vehicles || vehicles.length === 0) {
      console.log('⚠️  No vehicles found with package strings')
      console.log('   Migration not needed or already completed.')
      return
    }

    console.log(`✅ Found ${vehicles.length} vehicle(s) with package strings`)
    console.log('')

    // Step 2: Extract unique package values
    console.log('📦 Step 2: Extracting unique package values...')
    const uniquePackages = new Set<string>()
    
    for (const vehicle of vehicles) {
      if (vehicle.package && typeof vehicle.package === 'string' && vehicle.package.trim()) {
        uniquePackages.add(vehicle.package.trim())
      }
    }

    const packageNames = Array.from(uniquePackages).sort()
    console.log(`✅ Found ${packageNames.length} unique package(s):`)
    packageNames.forEach((pkg, index) => {
      console.log(`   ${index + 1}. ${pkg}`)
    })
    console.log('')

    if (packageNames.length === 0) {
      console.log('⚠️  No valid package strings found to migrate')
      return
    }

    // Step 3: Check for existing Package documents
    console.log('🔍 Step 3: Checking for existing Package documents...')
    const existingPackages = await client.fetch<PackageDoc[]>(`
      *[_type == "package"] {
        _id,
        name,
        "slug": slug.current
      }
    `)

    const existingPackageMap = new Map<string, string>()
    for (const pkg of existingPackages) {
      if (pkg.name) {
        existingPackageMap.set(pkg.name.toLowerCase().trim(), pkg._id)
      }
    }

    console.log(`✅ Found ${existingPackages.length} existing Package document(s)`)
    console.log('')

    // Step 4: Create Package documents for missing packages
    console.log('📝 Step 4: Creating Package documents...')
    const packageIdMap = new Map<string, string>() // Maps package name to Package document ID

    for (const packageName of packageNames) {
      const normalizedName = packageName.toLowerCase().trim()
      
      // Check if Package already exists
      if (existingPackageMap.has(normalizedName)) {
        const existingId = existingPackageMap.get(normalizedName)!
        packageIdMap.set(packageName, existingId)
        console.log(`⏭️  Skipping "${packageName}" (Package document already exists)`)
        continue
      }

      // Create new Package document
      try {
        const slug = generateSlug(packageName)
        
        // Check if slug is already taken
        const existingWithSlug = await client.fetch(
          `*[_type == "package" && slug.current == $slug][0] { _id }`,
          { slug }
        )

        let finalSlug = slug
        if (existingWithSlug) {
          // Append timestamp to make it unique
          finalSlug = `${slug}-${Date.now()}`
        }

        const packageDoc = {
          _type: 'package',
          name: packageName,
          slug: {
            _type: 'slug',
            current: finalSlug
          }
        }

        const createdPackage = await client.create(packageDoc)
        packageIdMap.set(packageName, createdPackage._id)
        console.log(`✅ Created Package: "${packageName}" (ID: ${createdPackage._id})`)
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        console.error(`❌ Error creating Package "${packageName}":`, error.message)
      }
    }

    console.log('')
    console.log(`✅ Created/Found ${packageIdMap.size} Package document(s)`)
    console.log('')

    // Step 5: Update vehicles to reference Package documents
    console.log('🔄 Step 5: Updating vehicles to reference Package documents...')
    let updatedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const vehicle of vehicles) {
      if (!vehicle.package || typeof vehicle.package !== 'string' || !vehicle.package.trim()) {
        skippedCount++
        continue
      }

      const packageName = vehicle.package.trim()
      const packageId = packageIdMap.get(packageName)

      if (!packageId) {
        console.error(`⚠️  No Package ID found for "${packageName}" in vehicle ${vehicle.title}`)
        errorCount++
        continue
      }

      try {
        // Update vehicle to reference the Package document
        await client
          .patch(vehicle._id)
          .set({
            package: {
              _type: 'reference',
              _ref: packageId
            }
          })
          .commit()

        console.log(`✅ Updated vehicle: ${vehicle.title} → Package: ${packageName}`)
        updatedCount++

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        console.error(`❌ Error updating vehicle ${vehicle.title}:`, error.message)
        errorCount++
      }
    }

    // Summary
    console.log('')
    console.log('📊 Migration Summary:')
    console.log(`   ✅ Vehicles updated: ${updatedCount}`)
    console.log(`   ⏭️  Vehicles skipped: ${skippedCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📦 Total vehicles processed: ${vehicles.length}`)
    console.log(`   📦 Packages created/found: ${packageIdMap.size}`)
    console.log('')
    console.log('✨ Package migration complete!')

  } catch (error: any) {
    console.error('❌ Error during migration:', error.message)
    console.error('   Stack:', error.stack)
    process.exit(1)
  }
}

// Run the migration
migratePackages()
  .then(() => {
    console.log('')
    console.log('🎉 Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })

