import React, { useState, useCallback, useEffect } from 'react'
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

// Google Drive folder type
interface GoogleDriveFolder {
  id: string
  name: string
  mimeType: string
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
  const defaultFolderId = process.env.SANITY_STUDIO_GOOGLE_DRIVE_DEFAULT_FOLDER_ID || 'root'

  // Folder navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string>(defaultFolderId)
  const [folderStack, setFolderStack] = useState<Array<{ id: string; name: string }>>([{ id: defaultFolderId, name: 'Root' }])
  const [folders, setFolders] = useState<GoogleDriveFolder[]>([])
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)

  // Load folders from current folder
  const loadFolders = useCallback(async () => {
    if (!apiKey) return

    setIsLoadingFolders(true)
    setError(null)

    try {
      const query = currentFolderId === 'root'
        ? "trashed=false and 'root' in parents and mimeType='application/vnd.google-apps.folder'"
        : `'${currentFolderId}' in parents and trashed=false and mimeType='application/vnd.google-apps.folder'`

      const url = `${GOOGLE_DRIVE_API_BASE}/files?` + new URLSearchParams({
        q: query,
        fields: 'files(id, name, mimeType)',
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
      const folderItems: GoogleDriveFolder[] = data.files || []
      setFolders(folderItems)
    } catch (err) {
      console.error('Error loading folders:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to load folders: ${errorMessage}`)
    } finally {
      setIsLoadingFolders(false)
    }
  }, [apiKey, currentFolderId])

  // Load folders when dialog opens or folder changes
  useEffect(() => {
    if (isGoogleDriveOpen) {
      loadFolders()
    }
  }, [isGoogleDriveOpen, currentFolderId, loadFolders])

  // Reset folder navigation when dialog opens
  useEffect(() => {
    if (isGoogleDriveOpen) {
      setCurrentFolderId(defaultFolderId)
      setFolderStack([{ id: defaultFolderId, name: 'Root' }])
      setFolderIdInput('')
      setError(null)
    }
  }, [isGoogleDriveOpen, defaultFolderId])

  // Navigate to a folder
  const handleFolderClick = useCallback((folder: GoogleDriveFolder) => {
    setFolderStack(prev => [...prev, { id: folder.id, name: folder.name }])
    setCurrentFolderId(folder.id)
  }, [])

  // Navigate back
  const handleBack = useCallback(() => {
    if (folderStack.length > 1) {
      const newStack = [...folderStack]
      newStack.pop()
      setFolderStack(newStack)
      setCurrentFolderId(newStack[newStack.length - 1].id)
    }
  }, [folderStack])

  // Navigate to default folder
  const handleGoToDefault = useCallback(() => {
    setCurrentFolderId(defaultFolderId)
    setFolderStack([{ id: defaultFolderId, name: 'Root' }])
  }, [defaultFolderId])

  // Navigate to folder from manual input
  const handleNavigateToFolder = useCallback(() => {
    if (!folderIdInput.trim()) {
      setError('Please enter a folder ID or share link')
      return
    }
    const folderId = extractFolderId(folderIdInput)
    setCurrentFolderId(folderId)
    setFolderStack([{ id: folderId, name: 'Custom Folder' }])
    setFolderIdInput('')
    setError(null)
  }, [folderIdInput])

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

  // Select current folder for import
  const handleSelectCurrentFolder = useCallback(() => {
    importFolderImages(currentFolderId)
  }, [currentFolderId, importFolderImages])

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
                  <Flex align="center" justify="space-between">
                    <Text size={1} weight="semibold">
                      Select Google Drive Folder
                    </Text>
                    <Flex gap={2}>
                      {folderStack.length > 1 && (
                        <Button
                          text="← Back"
                          onClick={handleBack}
                          mode="ghost"
                          fontSize={1}
                          disabled={isLoading || isLoadingFolders}
                        />
                      )}
                      {currentFolderId !== defaultFolderId && (
                        <Button
                          text="Default Folder"
                          onClick={handleGoToDefault}
                          mode="ghost"
                          fontSize={1}
                          disabled={isLoading || isLoadingFolders}
                        />
                      )}
                      <Button
                        text="Refresh"
                        onClick={loadFolders}
                        mode="ghost"
                        fontSize={1}
                        disabled={isLoading || isLoadingFolders}
                      />
                    </Flex>
                  </Flex>

                  {/* Breadcrumbs */}
                  <Flex align="center" gap={1} wrap="wrap">
                    {folderStack.map((folder, index) => (
                      <React.Fragment key={folder.id}>
                        {index > 0 && <Text size={0} muted>/</Text>}
                        <Button
                          text={folder.name}
                          onClick={() => {
                            const newStack = folderStack.slice(0, index + 1)
                            setFolderStack(newStack)
                            setCurrentFolderId(folder.id)
                          }}
                          mode="ghost"
                          fontSize={0}
                          padding={1}
                          disabled={isLoading || isLoadingFolders || index === folderStack.length - 1}
                        />
                      </React.Fragment>
                    ))}
                  </Flex>

                  {/* Current Folder Selection */}
                  <Card padding={2} radius={2} tone="primary" style={{ backgroundColor: '#f0f9ff' }}>
                    <Flex align="center" justify="space-between">
                      <Stack space={1}>
                        <Text size={0} weight="semibold">
                          Current Folder
                        </Text>
                        <Text size={0} muted>
                          {folderStack[folderStack.length - 1].name} {currentFolderId !== 'root' && `(${currentFolderId})`}
                        </Text>
                      </Stack>
                      <Button
                        text={isLoading ? 'Importing...' : 'Import This Folder'}
                        onClick={handleSelectCurrentFolder}
                        tone="primary"
                        fontSize={1}
                        disabled={isLoading || isLoadingFolders}
                      />
                    </Flex>
                  </Card>

                  {/* Folder Browser */}
                  <Box>
                    <Text size={0} weight="semibold" muted style={{ marginBottom: '8px', display: 'block' }}>
                      Browse Folders
                    </Text>
                    {isLoadingFolders ? (
                      <Flex align="center" justify="center" padding={4}>
                        <Spinner />
                      </Flex>
                    ) : folders.length === 0 ? (
                      <Card padding={3} radius={2} tone="transparent" style={{ border: '1px dashed #e5e7eb' }}>
                        <Text size={0} muted align="center">
                          No subfolders found in this folder
                        </Text>
                      </Card>
                    ) : (
                      <Stack space={2} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {folders.map((folder) => (
                          <Card
                            key={folder.id}
                            padding={3}
                            radius={2}
                            shadow={1}
                            style={{
                              cursor: 'pointer',
                              border: '1px solid #e5e7eb',
                              transition: 'all 0.2s',
                            }}
                            onClick={() => handleFolderClick(folder)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f9fafb'
                              e.currentTarget.style.borderColor = '#d1d5db'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.borderColor = '#e5e7eb'
                            }}
                          >
                            <Flex align="center" gap={2}>
                              <Text size={2}>📁</Text>
                              <Text size={1} weight="medium">
                                {folder.name}
                              </Text>
                            </Flex>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Box>

                  {/* Manual Folder ID Input (Override) */}
                  <Box style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                    <Text size={0} weight="semibold" muted style={{ marginBottom: '8px', display: 'block' }}>
                      Or Enter Folder ID Manually (Override)
                    </Text>
                    <Text size={0} muted style={{ marginBottom: '8px', display: 'block' }}>
                      Enter a Google Drive folder ID or share link to navigate directly to that folder. The folder must be shared with "Anyone with the link" permission.
                    </Text>
                    <Flex gap={2}>
                      <TextInput
                        value={folderIdInput}
                        onChange={(e) => setFolderIdInput(e.currentTarget.value)}
                        placeholder="Enter Google Drive folder ID or share link..."
                        fontSize={1}
                        style={{ flex: 1 }}
                        disabled={isLoading || isLoadingFolders}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isLoading && !isLoadingFolders && folderIdInput.trim()) {
                            handleNavigateToFolder()
                          }
                        }}
                      />
                      <Button
                        text="Go"
                        onClick={handleNavigateToFolder}
                        tone="primary"
                        fontSize={1}
                        disabled={isLoading || isLoadingFolders || !folderIdInput.trim()}
                      />
                    </Flex>
                  </Box>
                  
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

