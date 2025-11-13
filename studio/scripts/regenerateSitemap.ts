/**
 * Regenerate Sitemap Script
 * 
 * This script triggers sitemap regeneration by calling the frontend sitemap endpoint.
 * It's designed to run after Sanity Studio deployment to ensure the sitemap is up-to-date.
 * 
 * Usage:
 *   npx tsx scripts/regenerateSitemap.ts
 * 
 * Environment variables:
 *   FRONTEND_URL - The URL of the frontend application (e.g., https://yourdomain.com)
 *                  If not set, will attempt to construct from NEXT_PUBLIC_SANITY_STUDIO_URL
 */

import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: './.env' })
dotenv.config({ path: './.env.local' })

// Check if sitemap regeneration should be skipped
if (process.env.SKIP_SITEMAP_REGENERATION === 'true') {
  console.log('⏭️  Sitemap regeneration skipped (SKIP_SITEMAP_REGENERATION=true)')
  process.exit(0)
}

// Get frontend URL from environment or construct it
let frontendUrl = process.env.FRONTEND_URL

if (!frontendUrl) {
  // Try to construct from studio URL
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || process.env.SANITY_STUDIO_STUDIO_URL
  if (studioUrl) {
    frontendUrl = studioUrl.replace('/studio', '').replace(/\/$/, '')
  }
}

// Fallback to VERCEL_URL if available
if (!frontendUrl && process.env.VERCEL_URL) {
  frontendUrl = `https://${process.env.VERCEL_URL}`
}

if (!frontendUrl) {
  console.error('❌ Error: Frontend URL is required')
  console.error('')
  console.error('   Set one of these in your studio/.env file:')
  console.error('   - FRONTEND_URL=https://yourdomain.com')
  console.error('   - NEXT_PUBLIC_SANITY_STUDIO_URL=https://yourdomain.com/studio')
  console.error('   - VERCEL_URL=yourdomain.com (will be prefixed with https://)')
  console.error('')
  process.exit(1)
}

async function checkSiteAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Sanity-Studio-Post-Deploy/1.0'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    return response.ok || response.status === 404 // 404 means site is up, just route not found
  } catch {
    return false
  }
}

async function regenerateSitemap() {
  try {
    const sitemapUrl = `${frontendUrl}/sitemap.xml`
    const baseUrl = frontendUrl
    
    console.log('🔄 Regenerating sitemap...')
    console.log(`📡 Frontend URL: ${baseUrl}`)
    console.log(`📡 Sitemap URL: ${sitemapUrl}`)
    console.log('')

    // First, check if the frontend site is accessible
    console.log('🔍 Checking if frontend is accessible...')
    const siteAccessible = await checkSiteAccessible(baseUrl)
    
    if (!siteAccessible) {
      console.warn('⚠️  Frontend site appears to be unreachable or not deployed yet')
      console.warn('')
      console.warn('   This is normal if:')
      console.warn('   • The frontend hasn\'t been deployed yet')
      console.warn('   • The frontend URL is incorrect')
      console.warn('   • The site is temporarily unavailable')
      console.warn('')
      console.warn('   The sitemap will be generated automatically when:')
      console.warn('   • The frontend is deployed and someone accesses /sitemap.xml')
      console.warn('   • Your cron job runs (if configured)')
      console.warn('   • You manually trigger it later')
      console.warn('')
      console.warn('   To manually regenerate later, run:')
      console.warn(`   curl ${sitemapUrl}`)
      console.warn('')
      process.exit(0)
    }

    console.log('✓ Frontend is accessible')
    console.log('')

    // Make a request to the sitemap endpoint to trigger regeneration
    const response = await fetch(sitemapUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Sanity-Studio-Post-Deploy/1.0',
        'Cache-Control': 'no-cache',
        'Accept': 'application/xml, text/xml, */*'
      },
      signal: AbortSignal.timeout(30000) // 30 second timeout for sitemap generation
    })

    if (response.status === 404) {
      console.warn('⚠️  Sitemap endpoint returned 404')
      console.warn('')
      console.warn('   Possible reasons:')
      console.warn('   • The frontend may need to be rebuilt/redeployed')
      console.warn('   • The sitemap route may not be configured correctly')
      console.warn('   • Next.js metadata routes may need to be regenerated')
      console.warn('')
      console.warn('   Troubleshooting steps:')
      console.warn('   1. Verify the frontend is deployed and accessible')
      console.warn('   2. Check if /sitemap.xml is accessible in a browser')
      console.warn('   3. Try rebuilding the frontend: cd frontend && npm run build')
      console.warn('   4. The sitemap will auto-generate when first accessed')
      console.warn('')
      console.warn('   To manually test, visit:')
      console.warn(`   ${sitemapUrl}`)
      console.warn('')
      process.exit(0)
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`)
    }

    // Read the response to ensure it's generated
    const sitemapContent = await response.text()
    
    if (sitemapContent && sitemapContent.includes('<?xml')) {
      // Count URLs in sitemap
      const urlCount = (sitemapContent.match(/<url>/g) || []).length
      
      console.log('✅ Sitemap regenerated successfully!')
      console.log(`   • Found ${urlCount} URL(s) in sitemap`)
      console.log(`   • Sitemap available at: ${sitemapUrl}`)
    } else {
      console.warn('⚠️  Sitemap response received but may not be valid XML')
      console.log(`   Response preview: ${sitemapContent.substring(0, 200)}...`)
      console.log(`   Response length: ${sitemapContent.length} bytes`)
    }

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Request timed out - the sitemap generation may be taking too long')
      console.error('   This can happen if the site is slow or has many pages')
    } else {
      console.error('❌ Error regenerating sitemap:', error)
      if (error instanceof Error) {
        console.error('   Message:', error.message)
      }
    }
    console.error('')
    console.error('   Note: This is not a critical error. The sitemap will still be')
    console.error('   generated on-demand when accessed, or via your cron job.')
    console.error('')
    console.error('   To manually regenerate later, run:')
    console.error(`   curl ${frontendUrl}/sitemap.xml`)
    // Don't exit with error code - deployment should still succeed
    process.exit(0)
  }
}

// Run the regeneration
regenerateSitemap()
  .then(() => {
    console.log('')
    console.log('✨ Sitemap regeneration completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Sitemap regeneration failed:', error)
    // Exit with 0 to not fail deployment
    process.exit(0)
  })

