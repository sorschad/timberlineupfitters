import { client } from '@/sanity/lib/client'

interface SlugHistoryEntry {
  _type: 'object'
  _key: string
  slug: string
  activeFrom: string
  activeTo: string
}

// Add CORS headers function
function addCorsHeaders(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', 'https://carve-geo-83436247.figma.site')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

/**
 * Track slug changes for vehicle documents
 * This function is called when a vehicle document is published
 * It compares the current slug with the previous published version to detect changes
 */
async function trackSlugHistory(documentId: string, mutations: any[]) {
  try {
    // Fetch the current published document (after mutation)
    const currentDoc = await client.fetch(
      `*[_type == "vehicle" && _id == $id][0] {
        _id,
        _createdAt,
        _updatedAt,
        "currentSlug": slug.current,
        slugHistory
      }`,
      { id: documentId }
    )

    if (!currentDoc) {
      return
    }

    // Initialize slugHistory if it doesn't exist
    const existingHistory: SlugHistoryEntry[] = Array.isArray(currentDoc.slugHistory) 
      ? currentDoc.slugHistory 
      : []

    // Check if this is a new document (no previous published version)
    // For new documents, just initialize empty history
    if (!currentDoc.currentSlug) {
      if (!Array.isArray(currentDoc.slugHistory)) {
        await client
          .patch(documentId)
          .set({ slugHistory: [] })
          .commit()
      }
      return
    }

    // Try to find the previous published version by checking document revisions
    // We'll query for all published versions and get the one before the current
    const allVersions = await client.fetch(
      `*[_id == $id && !(_id in path("drafts.**"))] | order(_updatedAt desc) {
        _id,
        _updatedAt,
        "slug": slug.current
      }`,
      { id: documentId }
    )

    // Find the previous published version (second in the list, since first is current)
    const previousVersion = allVersions && allVersions.length > 1 ? allVersions[1] : null
    const previousSlug = previousVersion?.slug

    // Check if slug has changed
    if (previousSlug && previousSlug !== currentDoc.currentSlug) {
      // Slug has changed - add to history
      const slugAlreadyInHistory = existingHistory.some(
        (entry) => entry.slug === previousSlug
      )

      if (!slugAlreadyInHistory) {
        const now = new Date().toISOString()
        const newHistoryEntry: SlugHistoryEntry = {
          _type: 'object',
          _key: `slug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          slug: previousSlug,
          activeFrom: previousVersion._updatedAt || currentDoc._createdAt || now,
          activeTo: now
        }

        const updatedHistory = [...existingHistory, newHistoryEntry]

        // Update the document with new history
        await client
          .patch(documentId)
          .set({ slugHistory: updatedHistory })
          .commit()

        console.log(`✅ Slug history updated for vehicle ${documentId}: ${previousSlug} → ${currentDoc.currentSlug}`)
      }
    } else if (!Array.isArray(currentDoc.slugHistory)) {
      // Initialize empty array if it doesn't exist (for new documents or documents without history)
      await client
        .patch(documentId)
        .set({ slugHistory: [] })
        .commit()
      
      console.log(`📝 Slug history initialized for vehicle: ${documentId}`)
    }
  } catch (error) {
    console.error('Error tracking slug history:', error)
    // Don't throw - webhook should still succeed even if slug tracking fails
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle Sanity webhook events
    if (body.type === 'mutation') {
      const mutations = body.mutations || []
      
      // Track vehicle document IDs that were mutated
      const vehicleIds = new Set<string>()

      // Process each mutation to find vehicle documents
      for (const mutation of mutations) {
        if (mutation.create && mutation.create._type === 'vehicle') {
          vehicleIds.add(mutation.create._id)
        } else if (mutation.patch && mutation.patch.id) {
          // Check if this is a vehicle document
          const doc = await client.fetch(
            `*[_id == $id][0] { _type }`,
            { id: mutation.patch.id }
          )
          if (doc && doc._type === 'vehicle') {
            vehicleIds.add(mutation.patch.id)
          }
        }
      }

      // Track slug history for each vehicle document
      for (const documentId of vehicleIds) {
        await trackSlugHistory(documentId, mutations)
      }
      
      // Log the content update for debugging
      console.log('Content updated:', {
        type: body.type,
        documentId: body.documentId,
        mutations: mutations.length,
        timestamp: new Date().toISOString()
      })
    }

    const response = Response.json({ 
      success: true,
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    })

    return addCorsHeaders(response)

  } catch (error) {
    console.error('Webhook processing failed:', error)
    const response = Response.json({ 
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
    
    return addCorsHeaders(response)
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  const response = new Response(null, { status: 200 })
  return addCorsHeaders(response)
}
