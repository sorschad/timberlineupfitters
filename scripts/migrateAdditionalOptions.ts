import { createClient } from '@sanity/client'
import slugify from 'slugify'
import dotenv from 'dotenv'

// Load environment variables from studio/.env
dotenv.config({ path: './studio/.env' })

// Validate required environment variables
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '9jrxfm1d'
const dataset = process.env.SANITY_STUDIO_DATASET || 'staging'
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌ Error: SANITY_WRITE_TOKEN or SANITY_API_TOKEN environment variable is required')
  console.error('   Please set this in studio/.env file')
  process.exit(1)
}

// Use the same configuration as other scripts
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
  features?: {
    additionalOptions?: string[]
  }
}

interface AdditionalOption {
  _id: string
  name: string
  slug: { current: string }
}

async function migrateAdditionalOptions() {
  console.log('🚀 Starting Additional Options migration...')
  console.log(`📋 Using project: ${projectId}, dataset: ${dataset}`)

  try {
    // Fetch all vehicles with their current additionalOptions
    const vehicles = await client.fetch(`
      *[_type == "vehicle" && defined(features.additionalOptions)] {
        _id,
        title,
        features {
          additionalOptions
        }
      }
    `)

    console.log(`📋 Found ${vehicles.length} vehicles with additional options`)

    // Collect all unique additional option strings
    const allAdditionalOptions = new Set<string>()
    vehicles.forEach((vehicle: Vehicle) => {
      if (vehicle.features?.additionalOptions) {
        vehicle.features.additionalOptions.forEach(option => {
          if (option && option.trim()) {
            allAdditionalOptions.add(option.trim())
          }
        })
      }
    })

    console.log(`🔍 Found ${allAdditionalOptions.size} unique additional options`)

    // Create Additional Option documents for each unique string
    const additionalOptionMap = new Map<string, string>() // string -> document ID

    for (const optionName of allAdditionalOptions) {
      const slug = slugify(optionName, { 
        lower: true,
        remove: /[*+~.()'"!:@\/]/g
      })

      try {
        // Check if option already exists
        const existingOption = await client.fetch(`
          *[_type == "additionalOption" && slug.current == $slug][0] {
            _id,
            name
          }
        `, { slug })

        if (existingOption) {
          console.log(`✅ Option already exists: ${optionName} (${existingOption._id})`)
          additionalOptionMap.set(optionName, existingOption._id)
          continue
        }

        // Create new Additional Option document
        const newOption = await client.create({
          _type: 'additionalOption',
          name: optionName,
          slug: {
            _type: 'slug',
            current: slug
          },
          description: `Additional option: ${optionName}`,
          isActive: true,
          sortOrder: 0,
          // We'll need to set manufacturer and brand later
          // For now, we'll use a default or find the most common one
        })

        console.log(`✅ Created option: ${optionName} (${newOption._id})`)
        additionalOptionMap.set(optionName, newOption._id)

      } catch (error) {
        console.error(`❌ Failed to create option "${optionName}":`, error)
      }
    }

    // Update vehicles to use references instead of strings
    let updatedVehicles = 0
    for (const vehicle of vehicles) {
      if (!vehicle.features?.additionalOptions) continue

      const optionReferences = vehicle.features.additionalOptions
        .map((option: string) => {
          const optionId = additionalOptionMap.get(option.trim())
          return optionId ? { _type: 'reference', _ref: optionId } : null
        })
        .filter(Boolean)

      if (optionReferences.length > 0) {
        try {
          await client
            .patch(vehicle._id)
            .set({
              'features.additionalOptions': optionReferences
            })
            .commit()

          console.log(`✅ Updated vehicle: ${vehicle.title} with ${optionReferences.length} additional options`)
          updatedVehicles++
        } catch (error) {
          console.error(`❌ Failed to update vehicle "${vehicle.title}":`, error)
        }
      }
    }

    console.log(`🎉 Migration completed!`)
    console.log(`📊 Summary:`)
    console.log(`   - Created ${additionalOptionMap.size} additional option documents`)
    console.log(`   - Updated ${updatedVehicles} vehicles`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run the migration
migrateAdditionalOptions()
  .then(() => {
    console.log('✅ Migration script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error)
    process.exit(1)
  })
