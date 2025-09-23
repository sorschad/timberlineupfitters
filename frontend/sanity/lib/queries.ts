import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const brandFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "name": coalesce(name, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  features,
  "launchDate": coalesce(launchDate, _updatedAt),
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "brand": brand->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "brand" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allBrandsQuery = defineQuery(`
  *[_type == "brand" && defined(slug.current)] | order(launchDate desc, _updatedAt desc) {
    ${brandFields}
  }
`)

export const moreBrandsQuery = defineQuery(`
  *[_type == "brand" && _id != $skip && defined(slug.current)] | order(launchDate desc, _updatedAt desc) [0...$limit] {
    ${brandFields}
  }
`)

export const homepageBrandsQuery = defineQuery(`
  *[_type == "brand" && defined(slug.current)] | order(name asc) {
    ${brandFields}
  }
`)

export const brandQuery = defineQuery(`
  *[_type == "brand" && slug.current == $slug] [0] {
    description[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${brandFields}
  }
`)

export const brandPagesSlugs = defineQuery(`
  *[_type == "brand" && defined(slug.current)]
  {"slug": slug.current}
`)


export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

// Manufacturer queries
export const manufacturerQuery = defineQuery(`
  *[_type == "manufacturer" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    logo,
    description,
    
    // Hero Section
    heroImage,
    heroTitle,
    heroSubtitle,
    heroCtaText,
    
    // Showcase Images
    showcaseImages[] {
      model,
      image,
      altText
    },
    
    // Gallery Images
    galleryImages[] {
      image,
      caption,
      category,
      altText
    },
    
    // CTA Section
    ctaTitle,
    ctaDescription,
    ctaStats[] {
      value,
      label
    },
    additionalLinks[] {
      text,
      url
    },
    
    // SEO
    seoTitle,
    seoDescription,
    seoImage,
    
    "vehicles": *[_type == "vehicle" && references(^._id)] {
      _id,
      title,
      slug,
      model,
      vehicleType,
      modelYear,
      upfitter,
      package,
      "manufacturer": manufacturer->name
    } | order(model asc, upfitter asc, package asc)
  }
`)

export const manufacturerSlugs = defineQuery(`
  *[_type == "manufacturer" && defined(slug.current)]
  {"slug": slug.current}
`)

export const allManufacturersQuery = defineQuery(`
  *[_type == "manufacturer" && defined(slug.current)] | order(name asc) {
    _id,
    name,
    slug,
    logo,
    "vehicleCount": count(*[_type == "vehicle" && references(^._id)])
  }
`)
