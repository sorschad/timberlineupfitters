import React, { useState, useCallback } from 'react'
import { UploadIcon, ImageIcon } from '@sanity/icons'
import { Button, Card, Flex, Text, Spinner, Box, Dialog, TextInput, Stack } from '@sanity/ui'
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
  const [bulkCaption, setBulkCaption] = useState<string>('')
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState<string>('')
  const [isLoadingFromDrive, setIsLoadingFromDrive] = useState(false)
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
          caption: bulkCaption || image.folderName || '', // Use bulk caption if provided, otherwise folder name
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
  }, [galleryValue, handlePatch, uploadImageToSanity, bulkCaption])

  // Load images from Google Drive folder
  const loadImagesFromGoogleDriveFolder = useCallback(async () => {
    if (!googleDriveFolderId.trim()) {
      alert('Please enter a Google Drive folder ID')
      return
    }

    const apiKey = process.env.SANITY_STUDIO_GOOGLE_API_KEY
    if (!apiKey) {
      alert('Google Drive API key not configured. Please set SANITY_STUDIO_GOOGLE_API_KEY in your environment variables.')
      return
    }

    setIsLoadingFromDrive(true)
    setUploadingImages([])

    try {
      const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3'
      
      // Query for image files in the folder
      const query = `'${googleDriveFolderId.trim()}' in parents and trashed=false and (mimeType contains 'image/')`
      
      const url = `${GOOGLE_DRIVE_API_BASE}/files?` + new URLSearchParams({
        q: query,
        fields: 'files(id, name, mimeType, thumbnailLink, size)',
        orderBy: 'name',
        pageSize: '100',
        key: apiKey,
      })

      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const imageFiles = data.files || []

      if (imageFiles.length === 0) {
        alert('No image files found in the specified folder.')
        setIsLoadingFromDrive(false)
        return
      }

      // Create UploadedImage objects for tracking
      const newImages: UploadedImage[] = imageFiles.map((file: any) => ({
        file: null as any, // Will be set after download
        preview: file.thumbnailLink || '',
        uploading: true,
        folderName: googleDriveFolderId,
      }))

      setUploadingImages(newImages)

      // Download and upload each image
      for (let i = 0; i < imageFiles.length; i++) {
        const driveFile = imageFiles[i]
        try {
          // Download the image
          const downloadUrl = `${GOOGLE_DRIVE_API_BASE}/files/${driveFile.id}?` + new URLSearchParams({
            alt: 'media',
            key: apiKey,
          })

          const downloadResponse = await fetch(downloadUrl)
          
          if (!downloadResponse.ok) {
            throw new Error(`Failed to download ${driveFile.name}: ${downloadResponse.statusText}`)
          }

          const blob = await downloadResponse.blob()
          const file = new File([blob], driveFile.name, { type: driveFile.mimeType })

          // Upload to Sanity
          const assetId = await uploadImageToSanity(file)

          // Create the gallery image object
          const galleryImage = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: assetId,
            },
            alt: driveFile.name.replace(/\.[^/.]+$/, ''),
            caption: bulkCaption || '', // Use bulk caption if provided
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

          // Update uploading state
          setUploadingImages(prev => prev.map((img, idx) => 
            idx === i ? { ...img, uploading: false } : img
          ))
        } catch (error) {
          console.error(`Error processing ${driveFile.name}:`, error)
          setUploadingImages(prev => prev.map((img, idx) => 
            idx === i ? { ...img, uploading: false, error: error instanceof Error ? error.message : 'Upload failed' } : img
          ))
        }
      }

      // Clear uploading images after all uploads complete
      setTimeout(() => {
        setUploadingImages([])
        setGoogleDriveFolderId('') // Clear folder ID after successful import
      }, 2000)
    } catch (error) {
      console.error('Error loading images from Google Drive:', error)
      alert(`Failed to load images from Google Drive: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoadingFromDrive(false)
    }
  }, [googleDriveFolderId, bulkCaption, galleryValue, handlePatch, uploadImageToSanity])

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
          onClose={() => {
            setIsOpen(false)
            setBulkCaption('')
            setGoogleDriveFolderId('')
          }}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              {/* Bulk Caption Input */}
              <Card padding={3} radius={2} tone="transparent">
                <Stack space={2}>
                  <Text size={1} weight="semibold">
                    Bulk Caption (Optional)
                  </Text>
                  <Text size={0} muted>
                    This caption will be applied to all imported images. Leave empty to use individual file names or folder names.
                  </Text>
                  <TextInput
                    value={bulkCaption}
                    onChange={(e) => setBulkCaption(e.currentTarget.value)}
                    placeholder="Enter caption for all images..."
                    fontSize={1}
                  />
                </Stack>
              </Card>

              {/* Google Drive Folder Import */}
              <Card padding={3} radius={2} tone="transparent" style={{ border: '1px solid #e5e7eb' }}>
                <Stack space={3}>
                  <Text size={1} weight="semibold">
                    Import from Google Drive Folder
                  </Text>
                  <Text size={0} muted>
                    Enter a Google Drive folder ID to import all images from that folder. The folder must be shared with "Anyone with the link" permission.
                  </Text>
                  <Flex gap={2}>
                    <TextInput
                      value={googleDriveFolderId}
                      onChange={(e) => setGoogleDriveFolderId(e.currentTarget.value)}
                      placeholder="Enter Google Drive folder ID..."
                      fontSize={1}
                      style={{ flex: 1 }}
                      disabled={isLoadingFromDrive}
                    />
                    <Button
                      text={isLoadingFromDrive ? 'Loading...' : 'Import Folder'}
                      onClick={loadImagesFromGoogleDriveFolder}
                      tone="primary"
                      fontSize={1}
                      disabled={isLoadingFromDrive || !googleDriveFolderId.trim()}
                    />
                  </Flex>
                  {isLoadingFromDrive && (
                    <Flex align="center" gap={2}>
                      <Spinner />
                      <Text size={0} muted>
                        Loading images from Google Drive...
                      </Text>
                    </Flex>
                  )}
                </Stack>
              </Card>

              {/* Divider */}
              <Box style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <Text size={1} weight="semibold" align="center" style={{ marginBottom: '1rem' }}>
                  OR
                </Text>
              </Box>

              {/* Local File Upload Area */}
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
                <Card padding={3} tone="primary">
                  <Flex align="center" gap={2}>
                    <Spinner />
                    <Text size={1}>
                      Uploading {totalUploading} image{totalUploading > 1 ? 's' : ''}...
                    </Text>
                  </Flex>
                </Card>
              )}

              {/* Current Gallery Count */}
              <Box>
                <Text size={1} muted>
                  Current gallery has {galleryValue.length} image{galleryValue.length !== 1 ? 's' : ''}
                </Text>
              </Box>
            </Stack>
          </Box>
        </Dialog>
      )}
    </>
  )
}
