import React from 'react'
import { ImageIcon } from '@sanity/icons'

interface GalleryImagePreviewProps {
  asset?: any
  alt?: string
  caption?: string
  isBuildCoverImage?: boolean
}

export function GalleryImagePreview(props: GalleryImagePreviewProps) {
  const { asset, alt, caption, isBuildCoverImage } = props

  return {
    title: caption || alt || 'Gallery Image',
    subtitle: isBuildCoverImage ? 'Cover Image' : 'Gallery Image',
    media: asset ? (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Use Sanity's default image rendering */}
        <div style={{ 
          width: '100%', 
          height: '100%', 
          background: `url(${asset.url || asset._ref}) center/cover`,
          borderRadius: '4px'
        }} />
        {isBuildCoverImage && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#f59e0b',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              zIndex: 1
            }}
          >
            Cover
          </div>
        )}
      </div>
    ) : (
      <ImageIcon />
    ),
  }
}
