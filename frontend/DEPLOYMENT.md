# Netlify Deployment Guide

## Environment Variables Required

Set these in your Netlify dashboard under Site Settings > Environment Variables:

### Required:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Your Sanity dataset (usually "production")
- `SANITY_API_READ_TOKEN` - Your Sanity API token

### Optional:
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version (defaults to "2024-10-28")
- `NEXT_PUBLIC_SANITY_STUDIO_URL` - Studio URL for draft mode

## Deployment Steps

1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - The `netlify.toml` in the root directory will automatically configure the build

2. **Build Settings (Auto-configured):**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`
   - Node version: 18

3. **Environment Variables:**
   - Add all required environment variables in Netlify dashboard
   - Make sure to use your actual Sanity project values

4. **Deploy:**
   - Netlify will automatically build and deploy your site
   - Your API routes will work at `/api/*` endpoints

## Notes

- The `netlify.toml` file in the root directory is configured for the monorepo structure
- API routes will be available at your domain + `/api/*`
- Static assets will be served from the CDN
- Draft mode and preview functionality will work with proper environment variables
- The Next.js plugin handles all the complex routing and optimization automatically
