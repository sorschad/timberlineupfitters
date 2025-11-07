import {useEffect, useState, useRef} from 'react'
import {useClient} from 'sanity'
import {NumberInputProps, set, useFormValue} from 'sanity'

/**
 * Custom input component for sortOrder that automatically sets the initial value
 * to the next available integer + 5 (max sortOrder + 5)
 */
export function SortOrderInput(props: NumberInputProps) {
  const {onChange, renderDefault} = props
  const client = useClient({apiVersion: '2021-06-07'})
  const [isCalculating, setIsCalculating] = useState(false)
  const hasCalculated = useRef(false)
  const documentId = useFormValue(['_id']) as string | undefined
  const currentValue = useFormValue(['sortOrder']) as number | undefined

  useEffect(() => {
    // Only calculate initial value if:
    // 1. This is a new document (no _id or _id starts with 'drafts.')
    // 2. sortOrder is not already set
    // 3. We haven't already calculated it
    const isNewDocument = !documentId || documentId.startsWith('drafts.')
    const needsInitialValue = isNewDocument && currentValue === undefined && !hasCalculated.current

    if (needsInitialValue) {
      hasCalculated.current = true
      setIsCalculating(true)
      
      // Query for the maximum sortOrder value (excluding drafts)
      client
        .fetch<number>(
          `*[_type == "teamMember" && !(_id match "drafts.*") && defined(sortOrder)] | order(sortOrder desc) [0].sortOrder`
        )
        .then((maxSortOrder) => {
          // Calculate next value: max + 5, or 5 if no team members exist
          const nextValue = maxSortOrder !== null && maxSortOrder !== undefined ? maxSortOrder + 5 : 5
          
          // Set the initial value
          onChange(set(nextValue))
          setIsCalculating(false)
        })
        .catch((error) => {
          console.error('Error calculating sortOrder:', error)
          // Fallback to 5 if query fails
          onChange(set(5))
          setIsCalculating(false)
        })
    }
  }, [documentId, currentValue, client, onChange])

  // Render default number input (it will show the calculated value once set)
  return renderDefault(props)
}

