import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData, vehicleSlugs} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more about sitemaps in Next.js here: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * Be sure to update the `changeFrequency` and `priority` values to match your application's content.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allBrandsAndPages = await sanityFetch({
    query: sitemapData,
  })
  const vehicleSlugsData = await sanityFetch({
    query: vehicleSlugs,
  })
  const headersList = await headers()
  const sitemap: MetadataRoute.Sitemap = []
  const domain: String = headersList.get('host') as string
  
  // Add main pages
  sitemap.push({
    url: domain as string,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
  })
  
  // Add vehicles landing page
  sitemap.push({
    url: `${domain}/vehicles`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: 'weekly',
  })

  if (allBrandsAndPages != null && allBrandsAndPages.data.length != 0) {
    let priority: number
    let changeFrequency:
      | 'monthly'
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'yearly'
      | 'never'
      | undefined
    let url: string

    for (const p of allBrandsAndPages.data) {
      switch (p._type) {
        case 'page':
          priority = 0.8
          changeFrequency = 'monthly'
          url = `${domain}/${p.slug}`
          break
        case 'brand':
          priority = 0.6
          changeFrequency = 'monthly'
          url = `${domain}/brands/${p.slug}`
          break
      }
      sitemap.push({
        lastModified: p._updatedAt || new Date(),
        priority,
        changeFrequency,
        url,
      })
    }
  }

  // Add vehicle pages
  if (vehicleSlugsData != null && vehicleSlugsData.data.length != 0) {
    for (const vehicle of vehicleSlugsData.data) {
      sitemap.push({
        url: `${domain}/vehicles/${vehicle.slug}`,
        lastModified: new Date(),
        priority: 0.7,
        changeFrequency: 'monthly',
      })
    }
  }

  return sitemap
}
