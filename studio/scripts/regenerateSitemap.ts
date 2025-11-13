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

async function regenerateSitemap() {
  try {
    const sitemapUrl = `${frontendUrl}/sitemap.xml`
    
    console.log('🔄 Regenerating sitemap...')
    console.log(`📡 Calling: ${sitemapUrl}`)
    console.log('')

    // Make a request to the sitemap endpoint to trigger regeneration
    const response = await fetch(sitemapUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Sanity-Studio-Post-Deploy/1.0',
        'Cache-Control': 'no-cache'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
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
      console.log(`   Response length: ${sitemapContent.length} bytes`)
    }

  } catch (error) {
    console.error('❌ Error regenerating sitemap:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
    console.error('')
    console.error('   Note: This is not a critical error. The sitemap will still be')
    console.error('   generated on-demand when accessed, or via your cron job.')
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

