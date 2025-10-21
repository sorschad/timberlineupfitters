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
How the isBuildCoverImage field works:

1. In Sanity Studio, editors can mark specific gallery images as "Is Cover Image for Build"
2. When useBuildGallery={true}, the component will:
   - Find all images where isBuildCoverImage === true
   - Use these as cover images for each build
   - Group other images by caption to associate them with builds
   - If no cover images are marked, it creates a default build with the first image

3. Each cover image becomes a clickable build card that opens a lightbox
4. The lightbox shows all images associated with that build as thumbnails

Example gallery data structure:
[
  {
    _id: "img1",
    asset: { ... },
    alt: "Exterior front view",
    caption: "Adventure Build",
    isBuildCoverImage: true,  // This will be the cover for "Adventure Build"
    tags: ["exterior"]
  },
  {
    _id: "img2", 
    asset: { ... },
    alt: "Interior dashboard",
    caption: "Adventure Build",  // Same caption = same build
    isBuildCoverImage: false,
    tags: ["interior"]
  },
  {
    _id: "img3",
    asset: { ... },
    alt: "Work truck exterior", 
    caption: "Work Build",
    isBuildCoverImage: true,  // This will be the cover for "Work Build"
    tags: ["exterior"]
  }
]

This would create two build cards:
- "Adventure Build" (cover: img1, gallery: img1, img2)
- "Work Build" (cover: img3, gallery: img3)
*/
