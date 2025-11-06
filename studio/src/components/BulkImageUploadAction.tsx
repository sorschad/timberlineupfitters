import React, { useState, useCallback } from 'react'
import { UploadIcon, ImageIcon } from '@sanity/icons'
import { Button, Card, Flex, Text, Spinner, Box, Dialog } from '@sanity/ui'
import { useClient } from 'sanity'
import { PatchEvent, set } from 'sanity'
import { useFormValue } from 'sanity'

interface BulkImageUploadActionProps {
  value?: any
  onChange: (event: PatchEvent) => void
  onFocus?: () => void
  onBlur?: () => void
  onPatch?: (patches: PatchEvent) => void
}

interface UploadedImage {
  file: File
  preview: string
  uploading: boolean
  error?: string
  folderName?: string
}

export function BulkImageUploadAction(props: BulkImageUploadActionProps) {
  const { value, onChange, onFocus, onBlur, onPatch } = props
  const [isOpen, setIsOpen] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<UploadedImage[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const client = useClient()
  
  // Get the current gallery value from the document
  const galleryValue = useFormValue(['gallery']) as any[] || []
  
  // Use onPatch if available, otherwise use onChange
  const handlePatch = onPatch || onChange
  
  // This component doesn't use the string value, it only manages the gallery
  // The string field is just a UI helper, so we ignore the value prop

  const uploadImageToSanity = useCallback(async (file: File): Promise<string> => {
    const asset = await client.assets.upload('image', file)
    return asset._id
  }, [client])

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return

    const newImages: UploadedImage[] = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      folderName: file.webkitRelativePath ? 
        file.webkitRelativePath.split('/')[0] : 
        'Build' // fallback if no folder structure
    }))

    setUploadingImages(prev => [...prev, ...newImages])

    // Upload each image to Sanity
    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i]
      try {
        const assetId = await uploadImageToSanity(image.file)
        
        // Create the gallery image object with all required fields
        const galleryImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: assetId,
          },
          alt: image.file.name.replace(/\.[^/.]+$/, ''),
          caption: image.folderName || 'Build', // Use folder name as caption
          isBuildCoverImage: false,
          view: 'Exterior Front',
          tags: ['exterior'],
          gridSpan: {
            mobile: { col: 1, row: 1 },
            tablet: { col: 1, row: 1 },
            desktop: { col: 1, row: 1 }
          }
        }

        // Add to existing gallery
        const newValue = [...galleryValue, galleryImage]
        handlePatch(PatchEvent.from(set(newValue, ['gallery'])))

        // Update the value reference for next iteration
        galleryValue.push(galleryImage)
      } catch (error) {
        console.error('Error uploading image:', error)
        // Update the image with error state
        setUploadingImages(prev => prev.map(img => 
          img === image ? { ...img, uploading: false, error: 'Upload failed' } : img
        ))
      }
    }

    // Clear uploading images after all uploads complete
    setTimeout(() => {
      setUploadingImages([])
    }, 1000)
  }, [galleryValue, handlePatch, uploadImageToSanity])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const items = e.dataTransfer.items
    const files: File[] = []
    
    // Process each dropped item
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry()
        if (entry) {
          // If it's a directory, we can't process it via drag and drop
          // Show a message to use the click method instead
          if (entry.isDirectory) {
            alert('Please use the "Click to select" button to upload folders. Drag and drop only supports individual files.')
            return
          }
        }
      }
    }
    
    // Process regular files
    const fileList = e.dataTransfer.files
    const imageFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      handleFileSelect(imageFiles as any)
    }
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }, [handleFileSelect])

  const totalUploading = uploadingImages.length

  return (
    <>
      <Button
        mode="ghost"
        icon={UploadIcon}
        text="Bulk Upload Images"
        onClick={() => setIsOpen(true)}
      />
      
      {isOpen && (
        <Dialog
          header="Bulk Upload Images"
          id="bulk-upload-dialog"
          onClose={() => setIsOpen(false)}
          width={1}
        >
          <Box padding={4}>
            {/* Upload Area */}
            <Card
              padding={4}
              radius={2}
              style={{
                border: isDragOver ? '2px dashed #f59e0b' : '2px dashed #e5e7eb',
                backgroundColor: isDragOver ? '#fef3c7' : '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('bulk-upload-input')?.click()}
            >
              <Flex direction="column" align="center" gap={3}>
                <UploadIcon style={{ fontSize: '2rem', color: '#6b7280' }} />
                <Text size={2} weight="medium" align="center">
                  {isDragOver ? 'Drop images here' : 'Click to select images or drag and drop'}
                </Text>
                <Text size={1} muted align="center">
                  Drag & drop: individual files • Click: files or folders
                </Text>
          <input
            id="bulk-upload-input"
            type="file"
            multiple
            {...({ webkitdirectory: '' } as any)}
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
              </Flex>
            </Card>

            {/* Upload Progress */}
            {totalUploading > 0 && (
              <Card marginTop={3} padding={3} tone="primary">
                <Flex align="center" gap={2}>
                  <Spinner />
                  <Text size={1}>
                    Uploading {totalUploading} image{totalUploading > 1 ? 's' : ''}...
                  </Text>
                </Flex>
              </Card>
            )}

            {/* Current Gallery Count */}
            <Box marginTop={3}>
              <Text size={1} muted>
                Current gallery has {galleryValue.length} image{galleryValue.length !== 1 ? 's' : ''}
              </Text>
            </Box>
          </Box>
        </Dialog>
      )}
    </>
  )
}
