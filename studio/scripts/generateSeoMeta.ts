/**
 * Script: Generate SEO Meta Titles and Descriptions for Vehicles
 * 
 * This script generates SEO-friendly meta titles and descriptions for all vehicles
 * in the staging dataset and updates them in Sanity.
 * 
 * Usage (from studio directory):
 *   npx tsx scripts/generateSeoMeta.ts
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
  modelYear?: number
  model?: string
  brand?: string
  trim?: string
  vehicleType?: string
  excerpt?: string
  manufacturer?: {
    _id: string
    name: string
  }
  specifications?: {
    drivetrain?: string[]
    bedLength?: string
    cabStyle?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

/**
 * Generate SEO meta title (max 60 characters)
 */
function generateMetaTitle(vehicle: Vehicle): string {
  const parts: string[] = []
  
  // Add year if available
  if (vehicle.modelYear) {
    parts.push(vehicle.modelYear.toString())
  }
  
  // Add manufacturer name
  if (vehicle.manufacturer?.name) {
    parts.push(vehicle.manufacturer.name)
  }
  
  // Add model
  if (vehicle.model) {
    parts.push(vehicle.model)
  }
  
  // Add brand (Timberline, TSport, etc.) or trim
  if (vehicle.brand) {
    parts.push(vehicle.brand)
  } else if (vehicle.trim) {
    parts.push(vehicle.trim)
  }
  
  // Add drivetrain if available and space allows
  if (vehicle.specifications?.drivetrain && vehicle.specifications.drivetrain.length > 0) {
    const drivetrain = vehicle.specifications.drivetrain[0]
    if (drivetrain === '4WD' || drivetrain === '4x4') {
      parts.push('4x4')
    }
  }
  
  // Join parts with spaces
  let title = parts.join(' ')
  
  // If no parts, use the vehicle title
  if (!title || title.trim().length === 0) {
    title = vehicle.title
  }
  
  // Add "| Timberline Upfitters" if space allows
  const suffix = ' | Timberline Upfitters'
  const maxTitleLength = 60 - suffix.length
  
  if (title.length <= maxTitleLength) {
    title += suffix
  } else {
    // Truncate title to fit suffix
    title = title.substring(0, maxTitleLength - 3).trim() + '...' + suffix
  }
  
  // Final truncation to ensure max 60 characters (safety check)
  if (title.length > 60) {
    title = title.substring(0, 57).trim() + '...'
  }
  
  return title
}

/**
 * Generate SEO meta description (max 160 characters)
 */
function generateMetaDescription(vehicle: Vehicle): string {
  const parts: string[] = []
  
  // Start with action verb
  parts.push('Explore')
  
  // Add year, manufacturer, model
  const vehicleName: string[] = []
  if (vehicle.modelYear) {
    vehicleName.push(vehicle.modelYear.toString())
  }
  if (vehicle.manufacturer?.name) {
    vehicleName.push(vehicle.manufacturer.name)
  }
  if (vehicle.model) {
    vehicleName.push(vehicle.model)
  }
  if (vehicle.brand) {
    vehicleName.push(vehicle.brand)
  }
  
  if (vehicleName.length > 0) {
    parts.push(`the ${vehicleName.join(' ')}`)
  } else {
    parts.push(vehicle.title)
  }
  
  // Add key features or excerpt
  if (vehicle.excerpt && vehicle.excerpt.trim().length > 0) {
    // Use excerpt but truncate if needed
    const currentLength = parts.join(' ').length
    const cta = '. View specs, pricing & customization options.'
    const maxExcerptLength = 160 - currentLength - cta.length - 5 // -5 for spacing and "..."
    
    if (vehicle.excerpt.length <= maxExcerptLength) {
      parts.push(vehicle.excerpt.trim())
    } else {
      parts.push(vehicle.excerpt.substring(0, maxExcerptLength - 3).trim() + '...')
    }
  } else {
    // Add generic description based on vehicle type
    const vehicleType = vehicle.vehicleType || 'truck'
    const typeDescription = vehicleType === 'truck' 
      ? 'custom truck build' 
      : vehicleType === 'suv'
      ? 'custom SUV build'
      : 'custom vehicle build'
    
    // Add key specs if available
    const specs: string[] = []
    if (vehicle.specifications?.drivetrain && vehicle.specifications.drivetrain.length > 0) {
      const drivetrain = vehicle.specifications.drivetrain[0]
      if (drivetrain === '4WD' || drivetrain === '4x4') {
        specs.push('4x4')
      }
    }
    if (vehicle.specifications?.bedLength) {
      specs.push(vehicle.specifications.bedLength + ' bed')
    }
    
    if (specs.length > 0) {
      parts.push(`${typeDescription} with ${specs.join(', ')}`)
    } else {
      parts.push(typeDescription)
    }
  }
  
  // Add call to action
  const cta = '. View specs, pricing & customization options.'
  let description = parts.join(' ')
  
  // Ensure we don't exceed 160 characters
  if (description.length + cta.length <= 160) {
    description += cta
  } else {
    // Truncate to fit CTA
    const maxLength = 160 - cta.length - 3 // -3 for "..."
    description = description.substring(0, maxLength).trim() + '...' + cta
  }
  
  // Final truncation to ensure max 160 characters (safety check)
  if (description.length > 160) {
    description = description.substring(0, 157).trim() + '...'
  }
  
  return description
}

/**
 * Main function to generate and update SEO meta for all vehicles
 */
async function generateSeoMeta() {
  console.log('🚀 Starting SEO Meta Generation for Vehicles')
  console.log(`📋 Project ID: ${projectId}`)
  console.log(`📋 Dataset: ${dataset}`)
  console.log('')

  try {
    // Fetch all vehicles with necessary fields
    console.log('📥 Fetching all vehicles...')
    const vehicles = await client.fetch<Vehicle[]>(`
      *[_type == "vehicle"] | order(modelYear desc, title asc) {
        _id,
        title,
        modelYear,
        model,
        brand,
        trim,
        vehicleType,
        excerpt,
        "manufacturer": manufacturer->{
          _id,
          name
        },
        specifications {
          drivetrain,
          bedLength,
          cabStyle
        },
        seo {
          metaTitle,
          metaDescription
        }
      }
    `)

    if (!vehicles || vehicles.length === 0) {
      console.log('⚠️  No vehicles found in the dataset')
      return
    }

    console.log(`✅ Found ${vehicles.length} vehicle(s)`)
    console.log('')

    let updatedCount = 0
    let skippedCount = 0
    let errorCount = 0

    // Process each vehicle
    for (const vehicle of vehicles) {
      try {
        // Generate SEO meta
        const metaTitle = generateMetaTitle(vehicle)
        const metaDescription = generateMetaDescription(vehicle)

        // Check if SEO already exists and is different
        const existingTitle = vehicle.seo?.metaTitle
        const existingDescription = vehicle.seo?.metaDescription

        // Only update if different or doesn't exist
        if (existingTitle === metaTitle && existingDescription === metaDescription) {
          console.log(`⏭️  Skipping ${vehicle.title} (SEO meta already matches)`)
          skippedCount++
          continue
        }

        // Update the vehicle document
        await client
          .patch(vehicle._id)
          .set({
            seo: {
              _type: 'object',
              metaTitle,
              metaDescription
            }
          })
          .commit()

        console.log(`✅ Updated: ${vehicle.title}`)
        console.log(`   Title: ${metaTitle} (${metaTitle.length} chars)`)
        console.log(`   Description: ${metaDescription.substring(0, 80)}... (${metaDescription.length} chars)`)
        console.log('')
        
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
    console.log('📊 Summary:')
    console.log(`   ✅ Updated: ${updatedCount}`)
    console.log(`   ⏭️  Skipped: ${skippedCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📦 Total: ${vehicles.length}`)
    console.log('')
    console.log('✨ SEO meta generation complete!')

  } catch (error: any) {
    console.error('❌ Error generating SEO meta:', error.message)
    console.error('   Stack:', error.stack)
    process.exit(1)
  }
}

// Run the script
generateSeoMeta()
  .then(() => {
    console.log('')
    console.log('🎉 Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('💥 Script failed:', error)
    process.exit(1)
  })

