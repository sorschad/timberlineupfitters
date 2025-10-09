import { createClient } from '@sanity/client'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-10-28'
})

interface Vehicle {
  _id: string
  title: string
  slug: { current: string }
  vehicleType?: string
  model: string
  trim?: string
  modelYear: number
  manufacturer?: {
    _id: string
    name: string
  }
  specifications?: {
    engine?: Array<{
      type?: string
      horsepower?: number
      torque?: number
      fuelType?: string
      transmission?: string
    }>
    towingCapacity?: number
    payloadCapacity?: number
    fuelEconomy?: {
      city?: number
      highway?: number
      combined?: number
    }
    bedLength?: string
    cabStyle?: string
  }
  features?: {
    exteriorFeatures?: string[]
    interiorFeatures?: string[]
    safetyFeatures?: string[]
    technologyFeatures?: string[]
    performanceFeatures?: string[]
  }
  tags?: string[]
}

function generateVehicleExcerpt(vehicle: Vehicle): string {
  const { title, vehicleType, model, trim, modelYear, manufacturer, specifications, features, tags } = vehicle
  
  // Extract brand name from tags (heavily weighted)
  const brandName = tags?.find(tag => 
    ['Timberline', 'TSport', 'Alpine'].includes(tag)
  ) || 'Timberline'
  
  const manufacturerName = manufacturer?.name || 'Unknown'
  const vehicleTypeFormatted = vehicleType ? vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1) : 'Vehicle'
  
  // Build key specifications for the excerpt
  const keySpecs = []
  
  // Engine information
  if (specifications?.engine && specifications.engine.length > 0) {
    const engine = specifications.engine[0]
    if (engine.horsepower) {
      keySpecs.push(`${engine.horsepower}HP`)
    }
    if (engine.type) {
      keySpecs.push(engine.type)
    }
  }
  
  // Towing capacity
  if (specifications?.towingCapacity) {
    keySpecs.push(`${specifications.towingCapacity.toLocaleString()}lbs towing`)
  }
  
  // Payload capacity
  if (specifications?.payloadCapacity) {
    keySpecs.push(`${specifications.payloadCapacity.toLocaleString()}lbs payload`)
  }
  
  // Key features
  const keyFeatures = []
  if (features?.exteriorFeatures && features.exteriorFeatures.length > 0) {
    keyFeatures.push(features.exteriorFeatures[0])
  }
  if (features?.technologyFeatures && features.technologyFeatures.length > 0) {
    keyFeatures.push(features.technologyFeatures[0])
  }
  
  // Generate the excerpt
  let excerpt = `The ${modelYear} ${manufacturerName} ${model}${trim ? ` ${trim}` : ''} represents the pinnacle of ${brandName} engineering, combining ${vehicleTypeFormatted.toLowerCase()} versatility with premium ${brandName} craftsmanship.`
  
  // Add specifications if available
  if (keySpecs.length > 0) {
    excerpt += ` This ${brandName}-built ${vehicleTypeFormatted.toLowerCase()} delivers ${keySpecs.slice(0, 2).join(' and ')}${keySpecs.length > 2 ? ' and more' : ''}.`
  } else if (keyFeatures.length > 0) {
    excerpt += ` This ${brandName}-built ${vehicleTypeFormatted.toLowerCase()} features ${keyFeatures[0]} and premium ${brandName} quality throughout.`
  } else {
    excerpt += ` This ${brandName}-built ${vehicleTypeFormatted.toLowerCase()} delivers exceptional performance and reliability for demanding applications.`
  }
  
  return excerpt
}

async function generateExcerptsForAllVehicles() {
  try {
    console.log('🚗 Fetching all vehicles...')
    
    // Fetch all vehicles with necessary fields
    const vehicles = await client.fetch(`
      *[_type == "vehicle" && defined(slug.current)] {
        _id,
        title,
        slug,
        vehicleType,
        model,
        trim,
        modelYear,
        manufacturer->{
          _id,
          name
        },
        specifications,
        features,
        tags
      }
    `)
    
    console.log(`📋 Found ${vehicles.length} vehicles to process`)
    
    // Process each vehicle
    for (const vehicle of vehicles) {
      try {
        const excerpt = generateVehicleExcerpt(vehicle)
        
        console.log(`\n🔧 Processing: ${vehicle.title}`)
        console.log(`📝 Generated excerpt: ${excerpt}`)
        
        // Update the vehicle with the generated excerpt
        await client
          .patch(vehicle._id)
          .set({ excerpt })
          .commit()
        
        console.log(`✅ Updated ${vehicle.title}`)
        
      } catch (error) {
        console.error(`❌ Error processing ${vehicle.title}:`, error)
      }
    }
    
    console.log('\n🎉 All vehicle excerpts generated successfully!')
    
  } catch (error) {
    console.error('❌ Error fetching vehicles:', error)
  }
}

// Run the script
if (require.main === module) {
  generateExcerptsForAllVehicles()
}

export { generateExcerptsForAllVehicles, generateVehicleExcerpt }
