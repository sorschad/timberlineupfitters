import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const brandFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "name": coalesce(name, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  category,
  features,
  "launchDate": coalesce(launchDate, _updatedAt),
  status,
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
