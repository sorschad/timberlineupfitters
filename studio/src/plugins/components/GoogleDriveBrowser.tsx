/**
 * Google Drive Browser Component
 * 
 * React component that allows users to browse and select files from Google Drive
 * Uses API key authentication (no OAuth required)
 * 
 * Note: API key only works with:
 * - Public files (shared with "Anyone with the link")
 * - Files in shared folders with public access
 * - Service account files (if using service account)
 */

import React, {useState, useEffect, useCallback} from 'react'
import {Stack, Card, Button, Text, Spinner, Box, Flex, TextInput} from '@sanity/ui'
import {AssetSourceComponentProps} from 'sanity'

// Google Drive API types
interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  webContentLink?: string
  size?: string
  modifiedTime?: string
}

interface GoogleDriveFolder {
  id: string
  name: string
  mimeType: string
}

type DriveItem = GoogleDriveFile | GoogleDriveFolder

const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3'

// Helper function to extract folder ID from Google Drive share link
const extractFolderId = (input: string): string => {
  // If it's already just an ID (no slashes or special chars), return as is
  if (!input.includes('/') && !input.includes('?')) {
    return input.trim()
  }
  
  // Try to extract from various Google Drive URL formats
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

export function GoogleDriveBrowser(props: AssetSourceComponentProps) {
  const {onSelect, onClose} = props
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<DriveItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [folderIdInput, setFolderIdInput] = useState<string>('')

  const apiKey = process.env.SANITY_STUDIO_GOOGLE_API_KEY
  const defaultFolderId = process.env.SANITY_STUDIO_GOOGLE_DRIVE_DEFAULT_FOLDER_ID || 'root'
  
  // Initialize with default folder ID from environment variable
  const [currentFolderId, setCurrentFolderId] = useState<string>(defaultFolderId)
  const [folderStack, setFolderStack] = useState<string[]>([defaultFolderId])

  // Function to load files from current folder
  const loadFiles = useCallback(async () => {
    if (!apiKey) return

    setIsLoading(true)
    setError(null)

    try {
      const query = currentFolderId === 'root' 
        ? "trashed=false and 'root' in parents"
        : `'${currentFolderId}' in parents and trashed=false`
      
      const url = `${GOOGLE_DRIVE_API_BASE}/files?` + new URLSearchParams({
        q: query,
        fields: 'files(id, name, mimeType, thumbnailLink, webContentLink, size, modifiedTime)',
        orderBy: 'folder, name',
        pageSize: '100',
        key: apiKey,
      })

      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const items: DriveItem[] = data.files || []
      setFiles(items)
    } catch (err) {
      console.error('Error loading files:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to load files: ${errorMessage}. Note: API key only works with public files or files shared with "Anyone with the link".`)
    } finally {
      setIsLoading(false)
    }
  }, [apiKey, currentFolderId])

  // Load files when folder changes
  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  // Auto-refresh when dialog opens and when it regains focus
  useEffect(() => {
    const handleFocus = () => {
      // Refresh files when window regains focus
      loadFiles()
    }
    
    // Refresh when the browser tab/window becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadFiles()
      }
    }
    
    // Set up event listeners
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loadFiles])

  const handleNavigateToFolder = useCallback(() => {
    if (!folderIdInput.trim()) {
      setError('Please enter a folder ID or share link')
      return
    }
    const folderId = extractFolderId(folderIdInput)
    setFolderStack([folderId])
    setCurrentFolderId(folderId)
    setFolderIdInput('')
    setError(null)
  }, [folderIdInput])

  const handleFolderClick = useCallback((folderId: string, folderName: string) => {
    setFolderStack(prev => [...prev, folderId])
    setCurrentFolderId(folderId)
  }, [])

  const handleBack = useCallback(() => {
    if (folderStack.length > 1) {
      const newStack = [...folderStack]
      newStack.pop()
      setFolderStack(newStack)
      setCurrentFolderId(newStack[newStack.length - 1])
    }
  }, [folderStack])

  const handleFileSelect = useCallback(async (file: GoogleDriveFile) => {
    if (!apiKey) {
      setError('API key not configured')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let downloadUrl: string
      let mimeType = file.mimeType
      let fileName = file.name

      // Handle Google Workspace files (Docs, Sheets, Slides) - need to export
      if (file.mimeType.startsWith('application/vnd.google-apps.')) {
        // Map Google Workspace MIME types to export formats
        const exportMimeTypes: Record<string, string> = {
          'application/vnd.google-apps.document': 'application/pdf',
          'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.google-apps.drawing': 'image/png',
        }

        const exportMimeType = exportMimeTypes[file.mimeType] || 'application/pdf'
        downloadUrl = `${GOOGLE_DRIVE_API_BASE}/files/${file.id}/export?` + new URLSearchParams({
          mimeType: exportMimeType,
          key: apiKey,
        })
        mimeType = exportMimeType
        
        // Update file extension based on export type
        const extension = exportMimeType.includes('pdf') ? 'pdf' :
                         exportMimeType.includes('spreadsheet') ? 'xlsx' :
                         exportMimeType.includes('presentation') ? 'pptx' :
                         exportMimeType.includes('png') ? 'png' : 'pdf'
        fileName = `${file.name}.${extension}`
      } else {
        // For regular files, always use the Drive API endpoint with API key
        // webContentLink requires OAuth, so we use the API endpoint instead
        downloadUrl = `${GOOGLE_DRIVE_API_BASE}/files/${file.id}?` + new URLSearchParams({
          alt: 'media',
          key: apiKey,
        })
      }

      // Download file from Google Drive using the API endpoint
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': mimeType,
        },
      })

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData.error?.message) {
            errorMessage = errorData.error.message
          }
        } catch {
          // If response is not JSON, use the status text
          const text = await response.text().catch(() => '')
          if (text) {
            errorMessage = text.substring(0, 200)
          }
        }
        
        // Provide helpful error messages
        if (response.status === 403) {
          throw new Error(`Access denied. Make sure the file is shared with "Anyone with the link" permission. ${errorMessage}`)
        } else if (response.status === 404) {
          throw new Error(`File not found. The file may have been moved or deleted. ${errorMessage}`)
        } else {
          throw new Error(`Failed to download file: ${errorMessage}`)
        }
      }

      const blob = await response.blob()
      const fileObj = new File([blob], fileName, {type: mimeType})

      // Create asset object for Sanity
      // In Sanity v4, all assets use 'file' kind, images are handled by mimeType
      const asset = {
        kind: 'file' as const,
        value: fileObj,
        assetDocumentProps: {
          source: {
            name: 'google-drive',
            id: file.id,
            url: downloadUrl,
          },
        },
      }

      onSelect([asset])
    } catch (err) {
      console.error('Error selecting file:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to import file: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [onSelect, apiKey])

  // Check if item is a folder
  const isFolder = (item: DriveItem): item is GoogleDriveFolder => {
    return item.mimeType === 'application/vnd.google-apps.folder'
  }

  // Check if item is an image
  const isImage = (item: DriveItem): item is GoogleDriveFile => {
    return item.mimeType.startsWith('image/')
  }

  if (!apiKey) {
    return (
      <Card padding={4} radius={2} shadow={1}>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Configuration Required
          </Text>
          <Text size={1} muted>
            Please set SANITY_STUDIO_GOOGLE_API_KEY environment variable in your .env.local file.
          </Text>
          <Text size={0} muted style={{marginTop: '8px'}}>
            Note: API key authentication only works with public files or files shared with "Anyone with the link".
          </Text>
          <Button text="Close" onClick={onClose} />
        </Stack>
      </Card>
    )
  }

  return (
    <Card padding={4} radius={2} shadow={1} style={{minHeight: '400px'}}>
      <Stack space={3}>
        {/* Header */}
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2}>
            {folderStack.length > 1 && (
              <Button
                text="← Back"
                onClick={handleBack}
                mode="ghost"
                fontSize={1}
              />
            )}
            <Button
              text="Default Folder"
              onClick={() => {
                setCurrentFolderId(defaultFolderId)
                setFolderStack([defaultFolderId])
              }}
              mode="ghost"
              fontSize={1}
            />
            <Text size={1} weight="semibold">
              Google Drive
            </Text>
          </Flex>
          <Button
            text="Refresh"
            onClick={loadFiles}
            mode="ghost"
            fontSize={1}
            disabled={isLoading}
            title="Refresh to see newly added files and folders"
          />
        </Flex>

        {/* Folder Navigation */}
        {defaultFolderId === 'root' && (
          <Card padding={3} radius={2} tone="transparent">
            <Stack space={2}>
              <Text size={0} weight="semibold" muted>
                Navigate to Folder (by ID)
              </Text>
              <Flex gap={2}>
                <TextInput
                  value={folderIdInput}
                  onChange={(e) => setFolderIdInput(e.currentTarget.value)}
                  placeholder="Enter folder ID or share link"
                  fontSize={1}
                  style={{flex: 1}}
                />
                <Button
                  text="Go"
                  onClick={handleNavigateToFolder}
                  tone="primary"
                  fontSize={1}
                />
              </Flex>
              <Text size={0} muted>
                Paste a Google Drive folder ID or share link to browse that folder
              </Text>
            </Stack>
          </Card>
        )}
        {defaultFolderId !== 'root' && (
          <Card padding={3} radius={2} tone="transparent">
            <Stack space={2}>
              <Text size={0} weight="semibold" muted>
                Navigate to Different Folder
              </Text>
              <Flex gap={2}>
                <TextInput
                  value={folderIdInput}
                  onChange={(e) => setFolderIdInput(e.currentTarget.value)}
                  placeholder="Enter folder ID or share link"
                  fontSize={1}
                  style={{flex: 1}}
                />
                <Button
                  text="Go"
                  onClick={handleNavigateToFolder}
                  tone="primary"
                  fontSize={1}
                />
              </Flex>
              <Text size={0} muted>
                Currently viewing default folder. Enter a different folder ID or share link to navigate.
              </Text>
            </Stack>
          </Card>
        )}

        {/* Error message */}
        {error && (
          <Card padding={3} radius={2} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        )}

        {/* Loading state */}
        {isLoading && files.length === 0 && (
          <Flex align="center" justify="center" style={{minHeight: '200px'}}>
            <Spinner />
          </Flex>
        )}

        {/* File list */}
        {!isLoading && files.length === 0 && (
          <Box padding={4}>
            <Text size={1} muted align="center">
              No files found in this folder
            </Text>
          </Box>
        )}

        {files.length > 0 && (
          <Stack space={2}>
            {files.map((item) => {
              if (isFolder(item)) {
                return (
                  <Card
                    key={item.id}
                    padding={3}
                    radius={2}
                    shadow={1}
                    style={{cursor: 'pointer'}}
                    onClick={() => handleFolderClick(item.id, item.name)}
                  >
                    <Flex align="center" gap={2}>
                      <Text size={2}>📁</Text>
                      <Text size={1} weight="medium">
                        {item.name}
                      </Text>
                    </Flex>
                  </Card>
                )
              }

              if (isImage(item)) {
                return (
                  <Card
                    key={item.id}
                    padding={3}
                    radius={2}
                    shadow={1}
                    style={{cursor: 'pointer'}}
                    onClick={() => handleFileSelect(item)}
                  >
                    <Flex align="center" gap={3}>
                      {item.thumbnailLink ? (
                        <img
                          src={item.thumbnailLink}
                          alt={item.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      ) : (
                        <Box style={{width: '48px', height: '48px', backgroundColor: '#eee', borderRadius: '4px'}} />
                      )}
                      <Stack space={1} flex={1}>
                        <Text size={1} weight="medium">
                          {item.name}
                        </Text>
                        {item.size && (
                          <Text size={0} muted>
                            {(parseInt(item.size) / 1024 / 1024).toFixed(2)} MB
                          </Text>
                        )}
                      </Stack>
                    </Flex>
                  </Card>
                )
              }

              // Other file types
              return (
                <Card
                  key={item.id}
                  padding={3}
                  radius={2}
                  shadow={1}
                  style={{cursor: 'pointer'}}
                  onClick={() => handleFileSelect(item as GoogleDriveFile)}
                >
                  <Flex align="center" gap={2}>
                    <Text size={2}>📄</Text>
                    <Text size={1} weight="medium">
                      {item.name}
                    </Text>
                    {item.size && (
                      <Text size={0} muted>
                        {(parseInt(item.size) / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    )}
                  </Flex>
                </Card>
              )
            })}
          </Stack>
        )}

        {/* Cancel button */}
        <Button text="Cancel" onClick={onClose} mode="ghost" />
      </Stack>
    </Card>
  )
}

