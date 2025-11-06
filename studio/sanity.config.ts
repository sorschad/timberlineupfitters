/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 * 
 * Document History & Audit Logs:
 * - Document versioning and history are ENABLED BY DEFAULT in all Sanity projects
 * - Cannot be disabled - it's a built-in feature
 * - Every document change automatically creates a new version
 * - Accessible in Studio via the History button in the document toolbar
 * - Audit logs track all operations: create, update, delete with timestamps and user identity
 * - To verify history/audit logs are working, run: npm run verify-history
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {assist} from '@sanity/assist'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'staging'


// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Sanity + Next.js Starter Template',

  projectId,
  dataset,

  plugins: [
    structureTool(),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    assist(),
    visionTool(),
  ],

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },
})
