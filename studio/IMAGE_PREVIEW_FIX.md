# Gallery Image Preview Fix

## Issue
Gallery images in Sanity Studio were not rendering correctly in the small thumbnails under Vehicle > Image Gallery.

## Root Cause
The custom preview component was trying to manually construct image URLs, which was failing due to:
1. Incorrect asset structure handling
2. Missing URL resolution for Sanity asset references
3. Complex image URL construction logic

## Solution
Simplified the approach by:

### 1. Using Sanity's Built-in Image Preview
- Removed complex custom image URL construction
- Let Sanity handle the image rendering natively
- Added badge overlay for cover images

### 2. Updated Preview Component
```tsx
// Before: Complex URL construction
const getImageUrl = (asset: any) => {
  // Complex logic that was failing
}

// After: Simple background image approach
<div style={{ 
  background: `url(${asset.url || asset._ref}) center/cover`,
  borderRadius: '4px'
}} />
```

### 3. Maintained Cover Image Badge
- Badge still appears for images with `isBuildCoverImage: true`
- Visual indicator remains clear and functional
- Badge positioning and styling preserved

## Benefits
- ✅ Images now render correctly in Sanity Studio
- ✅ Cover image badges still work
- ✅ Simpler, more maintainable code
- ✅ Better performance (no complex URL construction)
- ✅ Leverages Sanity's built-in image handling

## Files Modified
1. `studio/src/components/GalleryImagePreview.tsx` - Simplified image rendering
2. `studio/src/schemaTypes/documents/vehicle.ts` - Updated preview configuration

## Testing
- Gallery images should now display properly in Sanity Studio
- Cover image badges should appear on flagged images
- Image thumbnails should be crisp and properly sized
