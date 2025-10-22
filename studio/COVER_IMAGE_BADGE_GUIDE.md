# Cover Image Badge Enhancement for Sanity Studio

## Overview

This enhancement adds a visual "Cover" badge to gallery images in the Sanity Studio UI when the `isBuildCoverImage` field is set to `true`. This helps content editors quickly identify which images are designated as cover images for vehicle builds.

## Features

### Visual Badge
- **Location**: Top-right corner of the image preview
- **Style**: Orange background with white text
- **Text**: "COVER" in uppercase
- **Visibility**: Only appears when `isBuildCoverImage` is `true`

### Enhanced Preview
- **Title**: Shows the image caption or alt text
- **Subtitle**: Shows "Cover Image" for flagged images, "Gallery Image" for others
- **Media**: Displays the actual image with the badge overlay

## Implementation

### Files Modified
1. **`studio/src/components/GalleryImagePreview.tsx`** - Custom preview component
2. **`studio/src/schemaTypes/documents/vehicle.ts`** - Updated to use custom preview

### Key Components

#### GalleryImagePreview Component
```tsx
export function GalleryImagePreview(props: GalleryImagePreviewProps) {
  const { asset, alt, caption, isBuildCoverImage } = props

  return {
    title: caption || alt || 'Gallery Image',
    subtitle: isBuildCoverImage ? 'Cover Image' : 'Gallery Image',
    media: asset?.url ? (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img src={asset.url} alt={alt || 'Gallery image'} />
        {isBuildCoverImage && (
          <div style={{ /* badge styles */ }}>
            Cover
          </div>
        )}
      </div>
    ) : <ImageIcon />
  }
}
```

#### Vehicle Schema Integration
```tsx
preview: {
  select: {
    asset: 'asset',
    alt: 'alt',
    caption: 'caption',
    isBuildCoverImage: 'isBuildCoverImage'
  },
  prepare(selection) {
    return GalleryImagePreview(selection)
  }
}
```

## Usage

### For Content Editors
1. **Navigate** to a Vehicle document in Sanity Studio
2. **Scroll** to the "Image Gallery" section
3. **Upload** or select gallery images
4. **Toggle** the "Is Cover Image for Build" checkbox for desired images
5. **Observe** the "Cover" badge appears on flagged images in the gallery list

### Visual Indicators
- ✅ **Cover Image**: Shows "Cover Image" subtitle and orange "COVER" badge
- 📷 **Regular Image**: Shows "Gallery Image" subtitle with no badge

## Benefits

1. **Quick Identification**: Editors can instantly see which images are cover images
2. **Visual Clarity**: The badge stands out against the image background
3. **Workflow Efficiency**: Reduces confusion about which images will appear as covers
4. **Consistent UX**: Maintains Sanity Studio's design patterns while adding functionality

## Technical Notes

- The badge is positioned absolutely within the image container
- Uses Sanity's design system colors (orange: #f59e0b)
- Responsive and works across different image sizes
- Gracefully handles missing or invalid image assets
- TypeScript support with proper type definitions

## Future Enhancements

Potential improvements could include:
- Different badge colors for different build types
- Hover effects on the badge
- Click-to-toggle functionality
- Build grouping visualization
- Export/import cover image settings
