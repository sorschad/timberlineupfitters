# Slug History Implementation Guide

## Overview

This implementation adds automatic slug history tracking to vehicle documents in Sanity Studio. When a vehicle's slug changes, the old slug is automatically preserved in a `slugHistory` array, ensuring that old URLs continue to work even after slug changes.

## What Was Implemented

### 1. Schema Changes (`studio/src/schemaTypes/documents/vehicle.ts`)

Added two new fields to the vehicle schema:

- **`slugHistory`** (read-only, auto-managed): Array of previous slugs with timestamps
  - Each entry contains: `slug`, `activeFrom`, `activeTo`
  - Automatically populated when slug changes
  - Not manually editable

- **`slugAliases`** (manual): Array of string aliases for manual redirects
  - Useful for marketing campaigns or legacy URLs
  - Manually editable by content editors

### 2. Document Action Plugin (`studio/src/plugins/slugHistoryTracker.ts`)

A custom Sanity plugin that intercepts the publish action for vehicle documents:

- Detects when a slug has changed
- Automatically adds the previous slug to `slugHistory` before publishing
- Prevents duplicate entries
- Only runs for vehicle document type

### 3. Updated GROQ Queries

All vehicle queries now include `slugHistory` and `slugAliases`:

- `frontend/sanity/lib/queries.ts` - Updated `vehicleQuery`, `allVehiclesQuery`, `timberlineVehiclesQuery`
- `frontend/app/api/cms/all-content/route.ts` - Updated comprehensive content query

### 4. Enhanced Vehicle Lookup API (`frontend/app/api/vehicles/by-slug/route.ts`)

The vehicle lookup endpoint now:

- Searches by current slug (primary)
- Falls back to searching `slugHistory` if not found
- Also checks `slugAliases`
- Returns metadata indicating if the slug is historical and requires redirect

### 5. Migration Script (`scripts/initializeSlugHistory.ts`)

A script to initialize `slugHistory` for existing vehicles:

```bash
# Set environment variables
export SANITY_STUDIO_PROJECT_ID="your-project-id"
export SANITY_STUDIO_DATASET="production"
export SANITY_API_WRITE_TOKEN="your-write-token"

# Run the migration
npx tsx scripts/initializeSlugHistory.ts
```

## How It Works

### Automatic Slug Tracking

1. Content editor changes a vehicle slug in Sanity Studio
2. Editor clicks "Publish"
3. Plugin intercepts the publish action
4. Plugin detects slug change (compares draft vs published)
5. Plugin adds previous slug to `slugHistory` with timestamps
6. Document is published with updated history

### Frontend Lookup Flow

1. User requests vehicle with slug: `/vehicles/old-slug`
2. API first searches by current slug
3. If not found, searches all vehicles' `slugHistory` and `slugAliases`
4. If found in history/aliases, returns vehicle with `redirect: true` flag
5. Frontend can update URL to current slug without page reload

## Usage Examples

### In Sanity Studio

1. Open a vehicle document
2. Change the slug field
3. Click "Publish"
4. The old slug is automatically added to "Slug History" section
5. You can manually add aliases in the "Slug Aliases" field

### In Frontend Code

```typescript
// Fetch vehicle by slug (handles historical slugs automatically)
const response = await fetch(`/api/vehicles/by-slug?slug=${slug}`)
const { data: vehicle, meta } = await response.json()

if (meta.redirect) {
  // Slug is historical, update URL to current slug
  window.history.replaceState(null, '', `?view=vehicle-detail&vehicleId=${meta.currentSlug}`)
  // Vehicle data is still available, just update the URL
}
```

## API Response Format

```json
{
  "success": true,
  "data": {
    "_id": "vehicle-123",
    "title": "Ranger TSport Valor",
    "slug": {
      "current": "ford-ranger-tsport-valor"
    },
    "slugHistory": [
      {
        "slug": "ford-f-150-tsport-valor",
        "activeFrom": "2024-01-15T10:00:00Z",
        "activeTo": "2025-11-13T15:30:00Z"
      }
    ],
    "slugAliases": ["f150-valor", "tsport-valor-truck"]
  },
  "meta": {
    "slug": "ford-f-150-tsport-valor",
    "currentSlug": "ford-ranger-tsport-valor",
    "isHistoricalSlug": true,
    "redirect": true,
    "found": true,
    "timestamp": "2025-01-20T12:00:00Z"
  }
}
```

## Testing Checklist

### Sanity Studio
- [ ] `slugHistory` field appears on vehicle documents (read-only)
- [ ] `slugAliases` field appears on vehicle documents (editable)
- [ ] Publishing with slug change triggers history update
- [ ] History shows previous slug with timestamps
- [ ] Manual aliases can be added and saved

### Frontend API
- [ ] `/api/cms/all-content` returns vehicles with `slugHistory`
- [ ] `/api/vehicles/by-slug?slug=CURRENT_SLUG` finds vehicle
- [ ] `/api/vehicles/by-slug?slug=OLD_SLUG` finds vehicle via history
- [ ] Response includes `redirect: true` for historical slugs
- [ ] Response includes `currentSlug` for redirects

### User Experience
- [ ] Old bookmark redirects to current URL
- [ ] Browser back button works correctly
- [ ] No 404 errors for historical slugs
- [ ] URL bar updates to show current slug (if implemented in frontend)

## Migration Steps

1. **Deploy Schema Changes**
   ```bash
   cd studio
   npm run build
   npm run deploy
   ```

2. **Run Migration Script**
   ```bash
   # Set environment variables
   export SANITY_STUDIO_PROJECT_ID="your-project-id"
   export SANITY_STUDIO_DATASET="production"
   export SANITY_API_WRITE_TOKEN="your-write-token"
   
   # Run migration
   npx tsx scripts/initializeSlugHistory.ts
   ```

3. **Deploy Frontend Changes**
   ```bash
   cd frontend
   npm run build
   # Deploy to Vercel or your hosting platform
   ```

4. **Test**
   - Change a vehicle slug in Sanity Studio
   - Verify old slug still works via API
   - Verify redirect metadata is returned

## Troubleshooting

### Plugin Not Tracking Slug Changes

- Check that plugin is registered in `studio/sanity.config.ts`
- Verify plugin is loaded (check browser console)
- Ensure you're publishing, not just saving drafts

### Historical Slugs Not Found

- Verify `slugHistory` field exists on vehicle documents
- Check that migration script ran successfully
- Verify GROQ queries include `slugHistory` field

### Performance Concerns

- The fallback query fetches all vehicles (for history lookup)
- Consider caching or indexing if you have many vehicles
- Future optimization: Add GROQ index for slug history lookups

## Future Enhancements

1. **GROQ Index**: Create a Sanity index for faster slug history lookups
2. **Bulk Migration**: Add script to backfill historical slugs from document history
3. **Analytics**: Track how often historical slugs are accessed
4. **Cleanup**: Add script to remove very old historical slugs (optional)

## Files Modified

- `studio/src/schemaTypes/documents/vehicle.ts` - Added schema fields
- `studio/src/plugins/slugHistoryTracker.ts` - Created plugin
- `studio/sanity.config.ts` - Registered plugin
- `frontend/sanity/lib/queries.ts` - Updated queries
- `frontend/app/api/cms/all-content/route.ts` - Updated content query
- `frontend/app/api/vehicles/by-slug/route.ts` - Enhanced lookup logic
- `scripts/initializeSlugHistory.ts` - Created migration script

## Support

For issues or questions:
1. Check Sanity Studio console for plugin errors
2. Verify environment variables are set correctly
3. Check API responses for error messages
4. Review Sanity document history to verify slug changes

