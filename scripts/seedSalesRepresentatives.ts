import { client } from '../frontend/sanity/lib/client'

const sampleRepresentatives = [
  {
    _type: 'salesRepresentative',
    name: 'John Smith',
    territoryRegion: 'Pacific Northwest',
    territoryZipCodes: ['98001', '98002', '98003', '98004', '98005', '98101', '98102', '98103', '98104', '98105'],
    email: 'john.smith@timberlineupfitters.com',
    phone: {
      countryCode: '+1',
      number: '206-555-0123',
      extension: '101'
    },
    mobile: {
      countryCode: '+1',
      number: '206-555-0124'
    },
    fax: {
      countryCode: '+1',
      number: '206-555-0125'
    },
    bio: 'Specializing in commercial fleet solutions with over 15 years of experience in the Pacific Northwest market.',
    specialties: ['Commercial Vehicles', 'Fleet Sales', 'Custom Upfitting'],
    isActive: true,
    sortOrder: 0
  },
  {
    _type: 'salesRepresentative',
    name: 'Sarah Johnson',
    territoryRegion: 'Southwest',
    territoryZipCodes: ['85001', '85002', '85003', '85004', '85005', '85006', '85007', '85008', '85009', '85010'],
    email: 'sarah.johnson@timberlineupfitters.com',
    phone: {
      countryCode: '+1',
      number: '602-555-0123',
      extension: '102'
    },
    mobile: {
      countryCode: '+1',
      number: '602-555-0124'
    },
    bio: 'Expert in agricultural and construction equipment with deep knowledge of Southwest regional needs.',
    specialties: ['Agricultural Equipment', 'Construction Equipment', 'Government Contracts'],
    isActive: true,
    sortOrder: 1
  },
  {
    _type: 'salesRepresentative',
    name: 'Mike Rodriguez',
    territoryRegion: 'Northeast',
    territoryZipCodes: ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'],
    email: 'mike.rodriguez@timberlineupfitters.com',
    phone: {
      countryCode: '+1',
      number: '212-555-0123',
      extension: '103'
    },
    mobile: {
      countryCode: '+1',
      number: '212-555-0124'
    },
    fax: {
      countryCode: '+1',
      number: '212-555-0125'
    },
    bio: 'Focused on urban fleet solutions and last-mile delivery vehicles for the Northeast corridor.',
    specialties: ['Fleet Sales', 'Custom Upfitting', 'Recreational Vehicles'],
    isActive: true,
    sortOrder: 2
  },
  {
    _type: 'salesRepresentative',
    name: 'Lisa Chen',
    territoryRegion: 'Southeast',
    territoryZipCodes: ['30001', '30002', '30003', '30004', '30005', '30006', '30007', '30008', '30009', '30010'],
    email: 'lisa.chen@timberlineupfitters.com',
    phone: {
      countryCode: '+1',
      number: '404-555-0123',
      extension: '104'
    },
    mobile: {
      countryCode: '+1',
      number: '404-555-0124'
    },
    bio: 'Specializing in utility and service vehicles with expertise in Southeast market dynamics.',
    specialties: ['Utility Vehicles', 'Service Vehicles', 'Custom Upfitting'],
    isActive: true,
    sortOrder: 3
  },
  {
    _type: 'salesRepresentative',
    name: 'David Thompson',
    territoryRegion: 'Midwest',
    territoryZipCodes: ['60001', '60002', '60003', '60004', '60005', '60006', '60007', '60008', '60009', '60010'],
    email: 'david.thompson@timberlineupfitters.com',
    phone: {
      countryCode: '+1',
      number: '312-555-0123',
      extension: '105'
    },
    mobile: {
      countryCode: '+1',
      number: '312-555-0124'
    },
    fax: {
      countryCode: '+1',
      number: '312-555-0125'
    },
    bio: 'Expert in heavy-duty commercial vehicles and specialized equipment for Midwest industrial applications.',
    specialties: ['Heavy-Duty Vehicles', 'Industrial Equipment', 'Fleet Sales'],
    isActive: true,
    sortOrder: 4
  }
]

async function seedSalesRepresentatives() {
  try {
    console.log('Seeding sales representatives...')
    
    for (const rep of sampleRepresentatives) {
      const result = await client.create(rep)
      console.log(`Created sales representative: ${rep.name} (${result._id})`)
    }
    
    console.log('Sales representatives seeded successfully!')
  } catch (error) {
    console.error('Error seeding sales representatives:', error)
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedSalesRepresentatives()
}

export { seedSalesRepresentatives }
