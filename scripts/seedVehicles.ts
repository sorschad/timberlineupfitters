import sanityClient from '@sanity/client'
import slugify from 'slugify'

const client = sanityClient({
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // add in .env
})

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

async function run() {
  for (const v of vehicles) {
    const title = `${v.manufacturer} ${v.model}${v.upfitter ? ` - ${v.upfitter}` : ''}${v.package ? ` ${v.package}` : ''}`
    const slug = slugify(title, { lower: true })

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

    console.log(`Upserted: ${title}`)
  }
}

run().catch(console.error)
