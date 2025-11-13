import { client } from '@/sanity/lib/client'
import { projectId, dataset, apiVersion } from '@/sanity/lib/api'
import { token } from '@/sanity/lib/token'

// Get write token for webhook operations (needed for transactions API and document history)
const writeToken = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || token

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
    // First, check if the mutation actually changed the slug
    let slugChanged = false
    let previousSlugFromMutation: string | null = null

    // Check mutations for slug changes
    for (const mutation of mutations) {
      if (mutation.patch && mutation.patch.id === documentId) {
        // Check if slug field is being set
        if (mutation.patch.set && typeof mutation.patch.set === 'object') {
          // Check for slug.current in the set operation
          if (mutation.patch.set['slug.current']) {
            slugChanged = true
            console.log(`🔍 Detected slug change in mutation for ${documentId}`)
          }
        }
        // Check for nested slug updates
        if (mutation.patch.set && mutation.patch.set.slug && mutation.patch.set.slug.current) {
          slugChanged = true
          console.log(`🔍 Detected nested slug change in mutation for ${documentId}`)
        }
        // Check for unset operations (might indicate a slug change)
        if (mutation.patch.unset && Array.isArray(mutation.patch.unset)) {
          if (mutation.patch.unset.includes('slug') || mutation.patch.unset.includes('slug.current')) {
            slugChanged = true
            console.log(`🔍 Detected slug unset in mutation for ${documentId}`)
          }
        }
      }
    }

    // Fetch the current published document (after mutation)
    const currentDoc = await client.fetch(
      `*[_type == "vehicle" && _id == $id][0] {
        _id,
        _createdAt,
        _updatedAt,
        "currentSlug": slug.current,
        slugHistory
      }`,
      { id: documentId },
      { useCdn: false } // Always fetch fresh data
    )

    if (!currentDoc) {
      console.log(`⚠️  Vehicle document not found: ${documentId}`)
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

    // Get the previous published version using Sanity's transactions API
    let previousSlug: string | null = null
    let previousUpdatedAt: string | null = null

    try {
      // Use Sanity's Management API to get document transactions
      // This gives us access to the full document history
      if (writeToken && projectId) {
        // Try the transactions endpoint for the specific document
        const transactionsUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/history/${dataset}/transactions/${documentId}`
        
        try {
          const transactionsResponse = await fetch(transactionsUrl, {
            headers: {
              'Authorization': `Bearer ${writeToken}`,
              'Content-Type': 'application/json'
            }
          })

          if (transactionsResponse.ok) {
            const transactions = await transactionsResponse.json()
            
            if (Array.isArray(transactions) && transactions.length > 0) {
              // Transactions are ordered by most recent first
              // We need to find the most recent transaction that had a different slug
              // To do this, we'll need to reconstruct the document state at each transaction
              // For now, let's try a simpler approach: fetch the document at previous revisions
              
              // Get the second most recent transaction (first is current)
              if (transactions.length > 1) {
                const previousTransaction = transactions[1]
                const previousRev = previousTransaction.resultRev || previousTransaction.previousRev
                
                if (previousRev) {
                  // Fetch the document at the previous revision using HTTP API
                  // GROQ doesn't support querying by revision directly, so we use the HTTP API
                  try {
                    const docAtRevUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/doc/${dataset}/${documentId}?rev=${previousRev}`
                    const docResponse = await fetch(docAtRevUrl, {
                      headers: {
                        'Authorization': `Bearer ${writeToken}`,
                        'Content-Type': 'application/json'
                      }
                    })

                    if (docResponse.ok) {
                      const docAtRevision = await docResponse.json()
                      const prevSlug = docAtRevision.documents?.[0]?.slug?.current
                      
                      if (prevSlug && prevSlug !== currentDoc.currentSlug) {
                        previousSlug = prevSlug
                        previousUpdatedAt = docAtRevision.documents?.[0]?._updatedAt || previousTransaction.timestamp
                        console.log(`✅ Found previous slug from revision: ${previousSlug}`)
                      }
                    }
                  } catch (revError) {
                    console.error(`Error fetching document at revision ${previousRev}:`, revError)
                  }
                }
              }
            }
          }
        } catch (apiError) {
          console.error(`Error fetching transactions API for ${documentId}:`, apiError)
        }
      }
    } catch (transError) {
      console.error(`Error fetching document history for ${documentId}:`, transError)
    }

    // Fallback: Try a simpler approach - query for the document's revision history
    // by fetching it with different perspectives or using the document's _rev field
    if (!previousSlug && slugChanged) {
      try {
        // Get the current document's revision
        const currentDocWithRev = await client.fetch(
          `*[_id == $id][0] {
            _rev,
            _updatedAt
          }`,
          { id: documentId },
          { useCdn: false }
        )

        if (currentDocWithRev && currentDocWithRev._rev) {
          // Try to use Sanity's document at time feature
          // We'll query for the document just before the current update
          // by using a timestamp slightly before _updatedAt
          const currentUpdateTime = new Date(currentDocWithRev._updatedAt)
          const beforeUpdateTime = new Date(currentUpdateTime.getTime() - 1000) // 1 second before
          
          // Unfortunately, GROQ doesn't support querying documents at specific times directly
          // So we'll need to rely on the transactions API or use a different approach
          
          console.log(`⚠️  Slug change detected but could not determine previous slug from transactions for ${documentId}`)
          console.log(`   Current slug: ${currentDoc.currentSlug}`)
          console.log(`   This might be the first slug change, or transactions API access is limited`)
        }
      } catch (altError) {
        console.error(`Error with alternative history fetch for ${documentId}:`, altError)
      }
    }

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
          activeFrom: previousUpdatedAt || currentDoc._createdAt || now,
          activeTo: now
        }

        const updatedHistory = [...existingHistory, newHistoryEntry]

        // Update the document with new history
        await client
          .patch(documentId)
          .set({ slugHistory: updatedHistory })
          .commit()

        console.log(`✅ Slug history updated for vehicle ${documentId}: ${previousSlug} → ${currentDoc.currentSlug}`)
      } else {
        console.log(`ℹ️  Slug ${previousSlug} already in history for vehicle ${documentId}`)
      }
    } else if (!Array.isArray(currentDoc.slugHistory)) {
      // Initialize empty array if it doesn't exist (for new documents or documents without history)
      await client
        .patch(documentId)
        .set({ slugHistory: [] })
        .commit()
      
      console.log(`📝 Slug history initialized for vehicle: ${documentId}`)
    } else {
      console.log(`ℹ️  No slug change detected for vehicle ${documentId}. Current slug: ${currentDoc.currentSlug}, Previous: ${previousSlug || 'none'}`)
    }
  } catch (error) {
    console.error(`❌ Error tracking slug history for ${documentId}:`, error)
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
