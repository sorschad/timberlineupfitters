/**
 * Slug History Tracker Plugin
 * 
 * Automatically tracks slug changes for vehicle documents by adding the previous
 * slug to the slugHistory array when a slug is changed and the document is published.
 * 
 * This ensures that old URLs continue to work even after slug changes, preventing
 * broken bookmarks, browser history, and search engine cached URLs.
 * 
 * IMPLEMENTATION NOTE: This plugin is currently a no-op to prevent React component errors.
 * Slug history tracking is handled via the webhook at /api/cms/webhook which processes
 * mutations after publish. For real-time tracking, consider implementing a mutation
 * listener or using Sanity's document history API.
 */

import { definePlugin } from 'sanity'

/**
 * Sanity plugin for slug history tracking
 * 
 * Currently implemented as a no-op to prevent "useHook is not a function" errors.
 * The actual slug history tracking is handled by the webhook endpoint which
 * processes document mutations after they're published.
 * 
 * The slugHistory field in the vehicle schema is still functional and can be:
 * - Manually edited by content editors
 * - Automatically populated via the webhook (basic initialization)
 * - Enhanced with full slug change tracking via document history API
 */
export const slugHistoryTracker = definePlugin({
  name: 'slug-history-tracker',
  // Plugin is intentionally minimal to prevent React component structure issues
  // Slug history tracking happens via webhook mutations
})

