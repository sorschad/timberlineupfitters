import sanityClient from '@sanity/client'
import slugify from 'slugify'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
if (!token) throw new Error('Missing SANITY_WRITE_TOKEN (with write access)')

const client = sanityClient({ projectId, dataset, useCdn: false, apiVersion: '2024-10-28', token })

type BasePage = {
  name: string
  heading: string
  subheading?: string
  slug?: string
}

const pages: BasePage[] = [
  {
    name: 'Privacy Policy',
    heading: 'Privacy Policy',
    subheading: 'Our commitment to protecting your information.',
    slug: 'privacy-policy',
  },
  {
    name: 'Terms of Service',
    heading: 'Terms of Service',
    subheading: 'The rules for using Timberline Upfitters digital services.',
    slug: 'terms-of-service',
  },
  {
    name: 'Warranty',
    heading: 'Warranty',
    subheading: 'Coverage details and how to get support.',
    slug: 'warranty',
  },
  {
    name: 'Heritage',
    heading: 'Heritage',
    subheading: 'Our story and commitment to adventure-ready vehicles.',
    slug: 'heritage',
  },
]

async function upsertPages() {
  for (const p of pages) {
    const slug = p.slug || slugify(p.name, { lower: true })
    const docId = `page-${slug}`

    await client.createOrReplace({
      _id: docId,
      _type: 'page',
      name: p.name,
      slug: { _type: 'slug', current: slug },
      heading: p.heading,
      subheading: p.subheading,
      pageBuilder: [],
    })

    // Also ensure published by patching to setIfMissing so drafts don't block
    console.log(`Upserted page: ${p.name} -> /${slug}`)
  }
}

upsertPages().catch((err) => {
  console.error(err)
  process.exit(1)
})


