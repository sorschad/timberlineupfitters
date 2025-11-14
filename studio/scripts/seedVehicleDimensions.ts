/**
 * Script: Seed Vehicle Dimensions
 * 
 * This script updates vehicle dimension fields (vehicle_length, vehicle_width, vehicle_height)
 * in the staging dataset with provided data.
 * 
 * Dimensions are provided in inches and converted to feet (with 2 decimal places).
 * 
 * Usage (from studio directory):
 *   npx tsx scripts/seedVehicleDimensions.ts
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

interface VehicleDimensionData {
  vehicleTitle: string
  lengthInches: number
  widthInches: number
  heightInches: number
}

// Vehicle dimension data (in inches)
const dimensionData: VehicleDimensionData[] = [
  { vehicleTitle: 'Ford F-150 TSport', lengthInches: 243.7, widthInches: 79.9, heightInches: 77.6 },
  { vehicleTitle: 'Jeep Wrangler Alpine', lengthInches: 188.4, widthInches: 73.8, heightInches: 73.6 },
  { vehicleTitle: 'Ford Bronco TSport', lengthInches: 189.4, widthInches: 75.9, heightInches: 73.9 },
  { vehicleTitle: 'Ford SuperDuty TSport', lengthInches: 266.2, widthInches: 96.0, heightInches: 81.7 },
  { vehicleTitle: 'Ram 2500 Timberline', lengthInches: 242.9, widthInches: 82.1, heightInches: 80.6 },
  { vehicleTitle: 'Ford Maverick TSport', lengthInches: 199.7, widthInches: 72.6, heightInches: 68.7 },
  { vehicleTitle: 'Jeep Gladiator Timberline', lengthInches: 218.0, widthInches: 73.8, heightInches: 75.0 },
  { vehicleTitle: 'Ford Dually TSport', lengthInches: 266.2, widthInches: 96.0, heightInches: 81.7 },
  { vehicleTitle: 'Ford Ranger Ford', lengthInches: 210.8, widthInches: 77.5, heightInches: 71.5 }
]

/**
 * Convert inches to feet and round to 2 decimal places
 */
function inchesToFeet(inches: number): number {
  const feet = inches / 12
  return Math.round(feet * 100) / 100
}

/**
 * Normalize string for comparison (lowercase, remove extra spaces)
 */
function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ')
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = []

  for (let i = 0; i <= m; i++) {
    dp[i] = [i]
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        )
      }
    }
  }

  return dp[m][n]
}

/**
 * Calculate similarity score between two strings (0-1, where 1 is identical)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeString(str1)
  const normalized2 = normalizeString(str2)

  // Exact match
  if (normalized1 === normalized2) {
    return 1.0
  }

  // Check if one contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return 0.9
  }

  // Token-based matching
  const tokens1 = normalized1.split(/\s+/)
  const tokens2 = normalized2.split(/\s+/)
  const commonTokens = tokens1.filter(token => tokens2.includes(token))
  const tokenSimilarity = (commonTokens.length * 2) / (tokens1.length + tokens2.length)

  // Levenshtein distance
  const maxLength = Math.max(normalized1.length, normalized2.length)
  const distance = levenshteinDistance(normalized1, normalized2)
  const levenshteinSimilarity = 1 - (distance / maxLength)

  // Weighted combination: tokens are more important for vehicle names
  return (tokenSimilarity * 0.7) + (levenshteinSimilarity * 0.3)
}

/**
 * Find best matching vehicle from a list using similarity scoring
 */
function findBestMatch(searchTitle: string, vehicles: any[]): { vehicle: any; score: number } | null {
  if (vehicles.length === 0) {
    return null
  }

  let bestMatch: { vehicle: any; score: number } | null = null

  for (const vehicle of vehicles) {
    const score = calculateSimilarity(searchTitle, vehicle.title)
    
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { vehicle, score }
    }
  }

  return bestMatch
}

/**
 * Find vehicle by title with intelligent fuzzy matching
 */
async function findVehicleByTitle(title: string, allVehicles: any[]): Promise<{ vehicle: any; matchType: string; score?: number } | null> {
  // Try exact match first
  const exactMatch = allVehicles.find(v => v.title === title)
  if (exactMatch) {
    return { vehicle: exactMatch, matchType: 'exact' }
  }

  // Try case-insensitive match
  const caseInsensitiveMatch = allVehicles.find(v => normalizeString(v.title) === normalizeString(title))
  if (caseInsensitiveMatch) {
    return { vehicle: caseInsensitiveMatch, matchType: 'case-insensitive' }
  }

  // Try contains match
  const normalizedSearch = normalizeString(title)
  const containsMatches = allVehicles.filter(v => 
    normalizeString(v.title).includes(normalizedSearch) || 
    normalizedSearch.includes(normalizeString(v.title))
  )
  
  if (containsMatches.length > 0) {
    const bestContains = findBestMatch(title, containsMatches)
    if (bestContains && bestContains.score > 0.7) {
      return { vehicle: bestContains.vehicle, matchType: 'contains', score: bestContains.score }
    }
  }

  // Use intelligent fuzzy matching on all vehicles
  const bestMatch = findBestMatch(title, allVehicles)
  if (bestMatch && bestMatch.score > 0.5) {
    return { vehicle: bestMatch.vehicle, matchType: 'fuzzy', score: bestMatch.score }
  }

  return null
}

/**
 * Update vehicle dimensions
 */
async function updateVehicleDimensions(vehicleId: string, lengthFeet: number, widthFeet: number, heightFeet: number): Promise<boolean> {
  try {
    await client
      .patch(vehicleId)
      .set({
        'specifications.vehicle_length': lengthFeet,
        'specifications.vehicle_width': widthFeet,
        'specifications.vehicle_height': heightFeet
      })
      .commit()

    return true
  } catch (error) {
    console.error(`   ❌ Error updating vehicle ${vehicleId}:`, error)
    return false
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting vehicle dimension seeding...')
  console.log(`📊 Dataset: ${dataset}`)
  console.log(`📦 Vehicles to update: ${dimensionData.length}`)
  console.log('')

  let successCount = 0
  let notFoundCount = 0
  let errorCount = 0

  for (const data of dimensionData) {
    const { vehicleTitle, lengthInches, widthInches, heightInches } = data

    // Convert to feet
    const lengthFeet = inchesToFeet(lengthInches)
    const widthFeet = inchesToFeet(widthInches)
    const heightFeet = inchesToFeet(heightInches)

    console.log(`🔍 Looking for vehicle: "${vehicleTitle}"`)
    console.log(`   Dimensions: ${lengthInches}" × ${widthInches}" × ${heightInches}"`)
    console.log(`   Converting to: ${lengthFeet}ft × ${widthFeet}ft × ${heightFeet}ft`)

    // Find vehicle
    const vehicle = await findVehicleByTitle(vehicleTitle)

    if (!vehicle) {
      console.log(`   ⚠️  Vehicle not found: "${vehicleTitle}"`)
      notFoundCount++
      console.log('')
      continue
    }

    console.log(`   ✅ Found vehicle: "${vehicle.title}" (ID: ${vehicle._id})`)

    // Update dimensions
    const success = await updateVehicleDimensions(
      vehicle._id,
      lengthFeet,
      widthFeet,
      heightFeet
    )

    if (success) {
      console.log(`   ✅ Successfully updated dimensions`)
      successCount++
    } else {
      console.log(`   ❌ Failed to update dimensions`)
      errorCount++
    }

    console.log('')
  }

  // Summary
  console.log('📊 Summary:')
  console.log(`   ✅ Successfully updated: ${successCount}`)
  console.log(`   ⚠️  Not found: ${notFoundCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📦 Total processed: ${dimensionData.length}`)
  console.log('')

  if (notFoundCount > 0) {
    console.log('⚠️  Some vehicles were not found. Please verify the vehicle titles in Sanity Studio.')
  }

  if (errorCount > 0) {
    console.log('❌ Some vehicles failed to update. Check the errors above.')
    process.exit(1)
  }

  if (successCount === dimensionData.length) {
    console.log('🎉 All vehicle dimensions successfully updated!')
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

