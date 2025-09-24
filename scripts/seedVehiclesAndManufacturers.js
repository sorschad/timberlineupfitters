import { createClient } from '@sanity/client'
import slugify from 'slugify'
import dotenv from 'dotenv'

// Load environment variables from studio/.env
dotenv.config({ path: './studio/.env' })

// Environment variables loaded from studio/.env

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '9jrxfm1d',
  dataset: process.env.SANITY_STUDIO_DATASET || 'staging',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2023-05-03',
})

// 1. Manufacturers
const manufacturers = ['Ford', 'Ram', 'Jeep']

// 2. Vehicles + Packages
const vehicles = [
  // Ford
  { manufacturer: 'Ford', model: 'F-150', upfitter: 'TSport', package: 'Sportsman' },
  { manufacturer: 'Ford', model: 'F-150', upfitter: 'TSport', package: 'Valor' },
  { manufacturer: 'Ford', model: 'F-150', upfitter: 'TSport', package: 'Anthem' },
  { manufacturer: 'Ford', model: 'F-150', upfitter: 'TSport', package: 'Lowered Sportsman' },
  { manufacturer: 'Ford', model: 'SuperDuty', upfitter: 'TSport', package: 'Sportsman' },
  { manufacturer: 'Ford', model: 'SuperDuty', upfitter: 'TSport', package: 'Valor' },
  { manufacturer: 'Ford', model: 'Bronco', upfitter: 'TSport', package: 'Sportsman' },
  { manufacturer: 'Ford', model: 'Bronco', upfitter: 'TSport', package: 'Valor' },

  // Ram
  { manufacturer: 'Ram', model: '1500', upfitter: 'Timberline', package: 'Trailhead' },
  { manufacturer: 'Ram', model: '1500', upfitter: 'Timberline', package: 'Overlook' },
  { manufacturer: 'Ram', model: '2500/3500', upfitter: 'Timberline', package: 'Trailhead' },
  { manufacturer: 'Ram', model: '2500/3500', upfitter: 'Timberline', package: 'Overlook' },

  // Jeep
  { manufacturer: 'Jeep', model: 'Wrangler (JL)', upfitter: 'Alpine', package: 'Ocean' },
  { manufacturer: 'Jeep', model: 'Wrangler (JL)', upfitter: 'Alpine', package: 'Brigade' },
  { manufacturer: 'Jeep', model: 'Wrangler (JL)', upfitter: 'Timberline', package: 'Trailhead' },
  { manufacturer: 'Jeep', model: 'Wrangler (JL)', upfitter: 'Timberline', package: 'Waypoint' },
  { manufacturer: 'Jeep', model: 'Wrangler (JL)', upfitter: 'Timberline', package: 'Overlook' },
  { manufacturer: 'Jeep', model: 'Gladiator', upfitter: 'Timberline', package: 'Trailhead' },
  { manufacturer: 'Jeep', model: 'Gladiator', upfitter: 'Timberline', package: 'Overlook' },
]

async function seedManufacturers() {
  for (const m of manufacturers) {
    const slug = slugify(m, { lower: true })
    const id = `manufacturer-${slug}`

    await client.createOrReplace({
      _id: id,
      _type: 'manufacturer',
      title: m,
    })

    console.log(`✅ Upserted manufacturer: ${m}`)
  }
}

async function seedVehicles() {
  for (const v of vehicles) {
    const title = `${v.manufacturer} ${v.model}${v.upfitter ? ` - ${v.upfitter}` : ''}${v.package ? ` ${v.package}` : ''}`
    const slug = slugify(title, { 
      lower: true,
      remove: /[*+~.()'"!:@\/]/g // Remove special characters including parentheses and slashes
    })

    await client.createOrReplace({
      _id: slug,
      _type: 'vehicle',
      title,
      slug: { _type: 'slug', current: slug },
      vehicleType: ['Bronco', 'Wrangler (JL)'].includes(v.model) ? 'suv' : 'truck',
      manufacturer: { _type: 'reference', _ref: `manufacturer-${v.manufacturer.toLowerCase()}` },
      model: v.model,
      modelYear: 2025,
      upfitter: v.upfitter,
      package: v.package,
    })

    console.log(`🚀 Upserted vehicle: ${title}`)
  }
}

async function run() {
  console.log('🌱 Seeding manufacturers...')
  await seedManufacturers()
  console.log('🌱 Seeding vehicles...')
  await seedVehicles()
  console.log('✅ Done seeding!')
}

run().catch(console.error)
