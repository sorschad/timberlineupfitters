import React, { useState, useCallback } from 'react'
import { ArrayOfObjectsInputProps, PatchEvent, set } from 'sanity'
import { Button, Flex, Dialog, Box, Card, Stack, Text, TextInput, Spinner } from '@sanity/ui'
// Google Drive icon SVG component
const GoogleDriveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.71 6.5L1.15 19h4.56l6.56-12.5H7.71zm9.58 0h-4.56l2.67 5.08L19.85 19h4.56L17.29 6.5zm-5.15 9.79l-2.67-5.08L3.85 19h4.56l2.67-5.08 1.26 2.37z"/>
  </svg>
)
import { useClient } from 'sanity'

const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3'

// Helper function to extract folder ID from Google Drive share link
const extractFolderId = (input: string): string => {
  if (!input.includes('/') && !input.includes('?')) {
    return input.trim()
  }
  
  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return input.trim()
}

/**
 * Custom input component for the vehicle gallery field
 * Adds a Google Drive import button next to the gallery title
 */
export function GalleryWithGoogleDrive(props: ArrayOfObjectsInputProps) {
  const { schemaType, value = [], onChange, renderDefault } = props
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [folderIdInput, setFolderIdInput] = useState<string>('')
  const [bulkCaption, setBulkCaption] = useState<string>('')
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const client = useClient()

  const apiKey = process.env.SANITY_STUDIO_GOOGLE_API_KEY

  // Load and import all images from a Google Drive folder
  const importFolderImages = useCallback(async (folderId: string) => {
    if (!apiKey) {
      alert('Google Drive API key not configured. Please set SANITY_STUDIO_GOOGLE_API_KEY in your environment variables.')
      return
    }

    setIsLoading(true)
    setImportProgress(null)
    setError(null)

    try {
      // Query for image files in the folder
      const query = `'${folderId.trim()}' in parents and trashed=false and (mimeType contains 'image/')`
      
      const url = `${GOOGLE_DRIVE_API_BASE}/files?` + new URLSearchParams({
        q: query,
        fields: 'files(id, name, mimeType, size)',
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
        setIsLoading(false)
        return
      }

      setImportProgress({ current: 0, total: imageFiles.length })

      const newGalleryItems = []

      // Download and upload each image
      for (let i = 0; i < imageFiles.length; i++) {
        const driveFile = imageFiles[i]
        try {
          setImportProgress({ current: i + 1, total: imageFiles.length })

          // Download the image
          const downloadUrl = `${GOOGLE_DRIVE_API_BASE}/files/${driveFile.id}?` + new URLSearchParams({
            alt: 'media',
            key: apiKey,
          })

          const downloadResponse = await fetch(downloadUrl)
          
          if (!downloadResponse.ok) {
            console.error(`Failed to download ${driveFile.name}: ${downloadResponse.statusText}`)
            continue
          }

          const blob = await downloadResponse.blob()
          const file = new File([blob], driveFile.name, { type: driveFile.mimeType })

          // Upload to Sanity
          const uploadedAsset = await client.assets.upload('image', file)

          // Create gallery item with caption
          const fileName = driveFile.name.replace(/\.[^/.]+$/, '')
          const galleryItem = {
            _type: 'image',
            _key: `google-drive-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            asset: {
              _type: 'reference',
              _ref: uploadedAsset._id,
            },
            alt: fileName,
            caption: bulkCaption || fileName, // Use bulkCaption if provided, otherwise use filename
            isBuildCoverImage: false,
            view: 'Exterior Front',
            tags: ['exterior'],
            gridSpan: {
              mobile: { col: 1, row: 1 },
              tablet: { col: 1, row: 1 },
              desktop: { col: 1, row: 1 }
            }
          }

          newGalleryItems.push(galleryItem)
        } catch (error) {
          console.error(`Error processing ${driveFile.name}:`, error)
          // Continue with other files even if one fails
        }
      }

      if (newGalleryItems.length > 0) {
        // Add new items to existing gallery
        const updatedValue = [...(value || []), ...newGalleryItems]
        onChange(PatchEvent.from(set(updatedValue)))
        
        // Close dialog and reset
        setIsGoogleDriveOpen(false)
        setFolderIdInput('')
        setBulkCaption('')
        alert(`Successfully imported ${newGalleryItems.length} image${newGalleryItems.length !== 1 ? 's' : ''} from the folder.`)
      } else {
        alert('Failed to import any images. Please check file permissions.')
      }
    } catch (error) {
      console.error('Error importing folder from Google Drive:', error)
      alert(`Failed to import folder: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
      setImportProgress(null)
    }
  }, [apiKey, value, onChange, bulkCaption, client])

  const handleImportFolder = useCallback(() => {
    if (!folderIdInput.trim()) {
      setError('Please enter a folder ID or share link')
      return
    }
    const folderId = extractFolderId(folderIdInput)
    importFolderImages(folderId)
  }, [folderIdInput, importFolderImages])

  return (
    <Box>
      {/* Render default array input with custom styling */}
      <Box style={{ position: 'relative' }}>
        {renderDefault(props)}
        
        {/* Position button absolutely to align with title */}
        <Box
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            zIndex: 10,
          }}
        >
          <Button
            icon={GoogleDriveIcon}
            text="Import from Google Drive"
            onClick={() => setIsGoogleDriveOpen(true)}
            mode="ghost"
            tone="primary"
            fontSize={1}
            disabled={isLoading}
          />
        </Box>
      </Box>

      {/* Google Drive Folder Import Dialog */}
      {isGoogleDriveOpen && (
        <Dialog
          header="Import Folder from Google Drive"
          id="google-drive-gallery-import"
          onClose={() => {
            setIsGoogleDriveOpen(false)
            setFolderIdInput('')
            setBulkCaption('')
            setError(null)
          }}
          width={2}
        >
          <Box padding={4}>
            <Stack space={4}>
              {/* Bulk Caption Input */}
              <Card padding={3} radius={2} tone="transparent" style={{ border: '1px solid #e5e7eb' }}>
                <Stack space={2}>
                  <Text size={0} weight="semibold" muted>
                    Bulk Caption (Optional)
                  </Text>
                  <Text size={0} muted>
                    This caption will be applied to all imported images. Leave empty to use file names.
                  </Text>
                  <TextInput
                    value={bulkCaption}
                    onChange={(e) => setBulkCaption(e.currentTarget.value)}
                    placeholder="Enter caption for all images..."
                    fontSize={1}
                    disabled={isLoading}
                  />
                </Stack>
              </Card>

              {/* Folder Selection */}
              <Card padding={3} radius={2} tone="transparent" style={{ border: '1px solid #e5e7eb' }}>
                <Stack space={3}>
                  <Text size={1} weight="semibold">
                    Select Google Drive Folder
                  </Text>
                  <Text size={0} muted>
                    Enter a Google Drive folder ID or share link to import all images from that folder. The folder must be shared with "Anyone with the link" permission.
                  </Text>
                  <Flex gap={2}>
                    <TextInput
                      value={folderIdInput}
                      onChange={(e) => setFolderIdInput(e.currentTarget.value)}
                      placeholder="Enter Google Drive folder ID or share link..."
                      fontSize={1}
                      style={{ flex: 1 }}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoading && folderIdInput.trim()) {
                          handleImportFolder()
                        }
                      }}
                    />
                    <Button
                      text={isLoading ? 'Importing...' : 'Import Folder'}
                      onClick={handleImportFolder}
                      tone="primary"
                      fontSize={1}
                      disabled={isLoading || !folderIdInput.trim()}
                    />
                  </Flex>
                  
                  {/* Import Progress */}
                  {importProgress && (
                    <Card padding={2} radius={2} tone="primary">
                      <Flex align="center" gap={2}>
                        <Spinner />
                        <Text size={0} muted>
                          Importing {importProgress.current} of {importProgress.total} images...
                        </Text>
                      </Flex>
                    </Card>
                  )}

                  {/* Error message */}
                  {error && (
                    <Card padding={2} radius={2} tone="critical">
                      <Text size={0}>{error}</Text>
                    </Card>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Box>
  )
}

