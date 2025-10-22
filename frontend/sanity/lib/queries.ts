import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  appLogo
}`)

export const homepageQuery = defineQuery(`*[_type == "page" && name == "Homepage"][0]{
  _id,
  name,
  heading,
  subheading,
  heroBackgroundImages[]{
    asset->{
      _id,
      url
    },
    alt,
    title,
    subtitle
  }
}`)

const brandFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "name": coalesce(name, "Untitled"),
  "slug": slug.current,
  excerpt,
  description,
  coverImage,
  sectionImage,
  primaryLogo,
  secondaryLogo,
  website,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  features,
  "launchDate": coalesce(launchDate, _updatedAt),
  "manufacturers": manufacturers[]->{
    _id,
    name,
    "slug": slug.current,
    logo
  },
`

const brandFieldsWithSlogan = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "name": coalesce(name, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  sectionImage,
  logo,
  features,
  slogan,
  sidebarMenuSortOrder,
  "launchDate": coalesce(launchDate, _updatedAt),
  "manufacturers": manufacturers[]->{
    _id,
    name,
    "slug": slug.current,
    logo
  },
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
    heroBackgroundImages[]{
      asset->{
        _id,
        url
      },
      alt
    },
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
    heroImage {
      asset-> {
        url
      }
    },
    heroTitle,
    heroSubtitle,
    heroCtaText,
    
    // Showcase Images
    showcaseImages[] {
      model,
      image {
        asset-> {
          url
        }
      },
      altText
    },
    
    // Gallery Images
    galleryImages[] {
      image {
        asset-> {
          url
        }
      },
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
    seoImage {
      asset-> {
        url
      }
    },
    
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

// Vehicle queries
export const allVehiclesQuery = defineQuery(`
  *[_type == "vehicle" && defined(slug.current)] | order(modelYear desc, title asc) {
    _id,
    title,
    slug,
    model,
    vehicleType,
    modelYear,
    trim,
    "manufacturer": manufacturer->{
      _id,
      name,
      logo{
        asset->{
          _id,
          url
        }
      }
    },
    coverImage{
      asset->{
        _id,
        url
      }
    },
    specifications,
    features,
    inventory,
    tags
  }
`)

// Timberline tagged vehicles (used by sidebar mega menu)
export const timberlineVehiclesQuery = defineQuery(`
  *[_type == "vehicle" && defined(slug.current)] | order(modelYear desc, title asc) {
    _id,
    title,
    slug,
    model,
    vehicleType,
    modelYear,
    trim,
    sidebarSortOrder,
    "manufacturer": manufacturer->{
      _id,
      name,
      logo{
        asset->{
          _id,
          url
        }
      }
    },
    coverImage{
      asset->{
        _id,
        url
      }
    },
    specifications,
    features,
    inventory,
    tags
  }
`)

export const vehicleQuery = defineQuery(`
  *[_type == "vehicle" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    model,
    vehicleType,
    modelYear,
    trim,
    "manufacturer": manufacturer->{
      _id,
      name,
      logo
    },
    coverImage,
    vehicleDetailsPageHeaderBackgroundImage,
    headerVehicleImage,
    gallery,
    videoTour,
    specifications,
    features,
    customizationOptions,
    inventory,
    description,
    tags,
    seo
  }
`)

export const vehicleSlugs = defineQuery(`
  *[_type == "vehicle" && defined(slug.current)]
  {"slug": slug.current}
`)

// Brands query for sidebar mega menu with slogans
export const brandsWithSloganQuery = defineQuery(`
  *[_type == "brand" && defined(slug.current)] | order(sidebarMenuSortOrder asc, name asc) {
    ${brandFieldsWithSlogan}
  }
`)

// Vehicles by brand query
export const vehiclesByBrandQuery = defineQuery(`
  *[_type == "vehicle" && references($brandId) && defined(slug.current)] | order(modelYear desc, title asc) [0...6] {
    _id,
    title,
    slug,
    model,
    vehicleType,
    modelYear,
    trim,
    coverImage{
      asset->{
        _id,
        url
      }
    }
  }
`)
