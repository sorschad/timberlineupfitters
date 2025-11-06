// Example usage of VehicleGallery with isBuildCoverImage functionality
import VehicleGallery from './VehicleGallery'

interface ExampleProps {
  vehicleData: {
    title: string
    gallery: Array<{
      _id: string
      asset: any
      alt?: string
      caption?: string
      isBuildCoverImage?: boolean
      tags?: string[]
    }>
  }
}

export default function VehicleGalleryUsageExample({ vehicleData }: ExampleProps) {
  return (
    <div>
      {/* Build-based gallery using isBuildCoverImage field */}
      <VehicleGallery
        gallery={vehicleData.gallery}
        vehicleTitle={vehicleData.title}
        useBuildGallery={true}
      />
    </div>
  )
}

/*
How the build gallery fields work:

1. In Sanity Studio, editors can mark specific gallery images as:
   - "Is Cover Image for Build" (isBuildCoverImage: true)
   - "Is Text Summary Block for Build" (isBuildTextSummaryBlock: true)

2. When useBuildGallery={true}, the component will:
   - Find all images where isBuildCoverImage === true
   - Use these as cover images for each build
   - Group other images by caption to associate them with builds
   - Find text summary blocks for each build
   - If no cover images are marked, it creates a default build with the first image

3. Each cover image becomes a clickable build card that opens a lightbox
4. The lightbox shows all images associated with that build as thumbnails
5. Text summary blocks are displayed below the build gallery as summary cards

Example gallery data structure:
[
  {
    _id: "img1",
    asset: { ... },
    alt: "Exterior front view",
    caption: "Adventure Build",
    isBuildCoverImage: true,  // This will be the cover for "Adventure Build"
    isBuildTextSummaryBlock: false,
    tags: ["exterior"]
  },
  {
    _id: "img2", 
    asset: { ... },
    alt: "Interior dashboard",
    caption: "Adventure Build",  // Same caption = same build
    isBuildCoverImage: false,
    isBuildTextSummaryBlock: false,
    tags: ["interior"]
  },
  {
    _id: "img3",
    asset: { ... },
    alt: "Adventure Build Summary",
    caption: "This build features premium off-road suspension and all-terrain tires for maximum adventure capability.",
    isBuildCoverImage: false,
    isBuildTextSummaryBlock: true,  // This will be the text summary for "Adventure Build"
    tags: ["summary"]
  },
  {
    _id: "img4",
    asset: { ... },
    alt: "Work truck exterior", 
    caption: "Work Build",
    isBuildCoverImage: true,  // This will be the cover for "Work Build"
    isBuildTextSummaryBlock: false,
    tags: ["exterior"]
  }
]

This would create:
- "Adventure Build" card (cover: img1, gallery: img1, img2, text summary: img3)
- "Work Build" card (cover: img4, gallery: img4)
- Text summary section with Adventure Build summary card
*/
