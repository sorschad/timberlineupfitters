import {defineField, defineType} from 'sanity'

/**
 * Package schema. Defines vehicle packages/trim packages.
 */
export const packageDocument = defineType({
  name: 'package',
  title: 'Package',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Package Name',
      type: 'string',
      validation: (rule) => 
        rule
          .required()
          .custom(async (value, context) => {
            if (!value) return true // Required validation handles empty values
            
            const {document, getClient} = context
            const client = getClient({apiVersion: '2024-10-28'})
            
            // Normalize the value for case-insensitive comparison
            const normalizedValue = value.toLowerCase().trim()
            
            // Query for existing packages with the same name (case-insensitive)
            // Include both published and draft documents
            const query = `*[_type == "package" && lower(name) == $normalizedValue]`
            const params = {normalizedValue}
            const existingPackages = await client.fetch(query, params)
            
            // Filter out the current document if it exists (handle both draft and published IDs)
            const currentId = document?._id
            const conflictingPackages = existingPackages.filter(
              (pkg: any) => {
                // Compare both draft and published versions
                const pkgId = pkg._id
                const pkgIdWithoutDraft = pkgId?.replace(/^drafts\./, '')
                const currentIdWithoutDraft = currentId?.replace(/^drafts\./, '')
                return pkgId !== currentId && pkgIdWithoutDraft !== currentIdWithoutDraft
              }
            )
            
            if (conflictingPackages.length > 0) {
              return `Package name "${value}" already exists (case-insensitive). Please use a different name.`
            }
            
            return true
          }),
      description: 'Name of the vehicle package (e.g., "Sport Package", "Luxury Package"). Must be unique (case-insensitive).'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 255,
        isUnique: async (value, context) => {
          if (!value) return true
          
          const {document, getClient} = context
          const client = getClient({apiVersion: '2024-10-28'})
          
          // Normalize the slug for case-insensitive comparison
          const normalizedSlug = value.toLowerCase().trim()
          
          // Query for existing packages with the same slug (case-insensitive)
          // Include both published and draft documents
          const query = `*[_type == "package" && defined(slug.current) && lower(slug.current) == $normalizedSlug]`
          const params = {normalizedSlug}
          const existingPackages = await client.fetch(query, params)
          
          // Filter out the current document if it exists (handle both draft and published IDs)
          const currentId = document?._id
          const conflictingPackages = existingPackages.filter(
            (pkg: any) => {
              // Compare both draft and published versions
              const pkgId = pkg._id
              const pkgIdWithoutDraft = pkgId?.replace(/^drafts\./, '')
              const currentIdWithoutDraft = currentId?.replace(/^drafts\./, '')
              return pkgId !== currentId && pkgIdWithoutDraft !== currentIdWithoutDraft
            }
          )
          
          return conflictingPackages.length === 0
        },
      },
      validation: (rule) => rule.required(),
      description: 'URL-friendly identifier. Must be unique (case-insensitive).'
    }),
    defineField({
      name: 'logo',
      title: 'Package Logo',
      type: 'image',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' })
      ],
      description: 'Optional logo for the package'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' }
          ]
        }
      ],
      description: 'Rich text description of the package features and details'
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo'
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title: title || 'Untitled Package',
        media: media
      }
    }
  }
})

