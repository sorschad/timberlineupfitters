// schemas/vehicle.ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { BulkImageUploadAction } from '../../components/BulkImageUploadAction'

export const vehicle = defineType({
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    // Visibility Control
    defineField({
      name: 'hideOnWebsite',
      title: 'Hide on Website',
      type: 'boolean',
      description: 'When checked, this vehicle will be hidden from the public website. Uncheck to make it visible.',
      initialValue: false
    }),

    // Basic Vehicle Information
    defineField({
      name: 'title',
      title: 'Vehicle Title',
      type: 'string',
      description: 'Description of the build + vehicle model',
      validation: (Rule) => Rule.required().max(255)
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 255
      },
      validation: (Rule) => Rule.required()
    }),

    // Historical Slug Tracking
    defineField({
      name: 'slugHistory',
      title: 'Slug History (Auto-managed)',
      description: 'Automatically tracks previous slugs when the slug changes. This field is managed by the system and should not be edited manually.',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'slug',
              title: 'Previous Slug',
              type: 'string',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'activeFrom',
              title: 'Active From',
              type: 'datetime',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'activeTo',
              title: 'Active To',
              type: 'datetime',
              validation: (Rule: any) => Rule.required()
            }
          ],
          preview: {
            select: {
              slug: 'slug',
              activeFrom: 'activeFrom',
              activeTo: 'activeTo'
            },
            prepare({ slug, activeFrom, activeTo }: { slug?: string; activeFrom?: string; activeTo?: string }) {
              let subtitle = 'No dates'
              if (activeFrom && activeTo) {
                try {
                  const fromDate = new Date(activeFrom)
                  const toDate = new Date(activeTo)
                  if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
                    subtitle = `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
                  }
                } catch (e) {
                  // Ignore date parsing errors
                }
              }
              return {
                title: slug || 'Previous Slug',
                subtitle
              }
            }
          }
        })
      ]
    }),

    // Manual Slug Aliases
    defineField({
      name: 'slugAliases',
      title: 'Slug Aliases (Manual)',
      description: 'Additional slugs that should redirect to this vehicle. Useful for marketing campaigns or legacy URLs. Each alias must be unique across all vehicles and cannot conflict with current slugs or slug history.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      validation: (Rule) => Rule.custom(async (aliases, context) => {
        if (!aliases || aliases.length === 0) {
          return true // Empty is fine
        }

        // Ensure aliases is an array of strings
        if (!Array.isArray(aliases)) {
          return 'Slug aliases must be an array'
        }

        // Check for duplicates within the same document
        const uniqueAliases = new Set(aliases)
        if (uniqueAliases.size !== aliases.length) {
          return 'Duplicate aliases are not allowed within the same vehicle'
        }

        // Get the current document ID and slug
        const currentDocId = (context.document as any)?._id
        const currentSlug = (context.document as any)?.slug?.current

        // Get client for cross-document validation
        const client = context.getClient({ apiVersion: '2024-01-01' })

        // Validate each alias
        for (const alias of aliases) {
          // Ensure alias is a string and trim it
          if (typeof alias !== 'string') {
            return 'All aliases must be strings'
          }

          const trimmedAlias = alias.trim()
          if (!trimmedAlias) {
            return 'Empty aliases are not allowed'
          }

          // Check if alias conflicts with current slug of this vehicle
          if (currentSlug && trimmedAlias === currentSlug) {
            return `Alias "${trimmedAlias}" cannot be the same as the current slug`
          }

          // Check if alias conflicts with slug history of this vehicle
          const slugHistory = (context.document as any)?.slugHistory || []
          if (Array.isArray(slugHistory)) {
            const inHistory = slugHistory.some((entry: any) => entry?.slug === trimmedAlias)
            if (inHistory) {
              return `Alias "${trimmedAlias}" is already in this vehicle's slug history`
            }
          }

          // Check for uniqueness across all vehicles (current slugs)
          const vehiclesWithSlug = await client.fetch(
            `*[_type == "vehicle" && slug.current == $alias && _id != $currentId] {
              _id,
              title
            }`,
            { alias: trimmedAlias, currentId: currentDocId || '' }
          )

          if (vehiclesWithSlug && vehiclesWithSlug.length > 0) {
            return `Alias "${trimmedAlias}" conflicts with current slug of vehicle: ${vehiclesWithSlug[0].title}`
          }

          // Check for uniqueness across all vehicles (slug aliases)
          const vehiclesWithAlias = await client.fetch(
            `*[_type == "vehicle" && $alias in slugAliases && _id != $currentId] {
              _id,
              title
            }`,
            { alias: trimmedAlias, currentId: currentDocId || '' }
          )

          if (vehiclesWithAlias && vehiclesWithAlias.length > 0) {
            return `Alias "${trimmedAlias}" is already used by vehicle: ${vehiclesWithAlias[0].title}`
          }

          // Check for conflicts with slug history of other vehicles
          const vehiclesWithHistoryMatch = await client.fetch(
            `*[_type == "vehicle" && _id != $currentId && defined(slugHistory)] {
              _id,
              title,
              slugHistory[] {
                slug
              }
            }`,
            { currentId: currentDocId || '' }
          )

          if (vehiclesWithHistoryMatch) {
            for (const vehicle of vehiclesWithHistoryMatch) {
              const hasMatchingHistory = vehicle.slugHistory?.some(
                (entry: any) => entry?.slug === trimmedAlias
              )
              if (hasMatchingHistory) {
                return `Alias "${trimmedAlias}" conflicts with slug history of vehicle: ${vehicle.title}`
              }
            }
          }
        }

        return true
      })
    }),

    // Manufacturer & Model Details
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'reference',
      to: [{ type: 'manufacturer' }],
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      description: 'e.g., F-150, F-250, Ranger',
      validation: (Rule) => Rule.required()
    }),
    
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      description: 'e.g., Timberline, TSport, Alpine, ...',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'package',
      title: 'Package',
      type: 'reference',
      to: [{ type: 'package' }],
      description: 'Select the vehicle package/trim package'
    }),

     // Additional Content
     defineField({
      name: 'description',
      title: 'Detailed Description',
      type: 'array',
      of: [
        defineArrayMember({
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
        })
      ]
    }),

    defineField({
      name: 'excerpt',
      title: 'Vehicle Excerpt',
      type: 'text',
      description: 'Short 1-2 sentence summary describing the vehicle build for customers and dealerships',
      validation: (Rule) => Rule.max(500)
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),

    defineField({
      name: 'sidebarSortOrder',
      title: 'Sidebar Sort Order',
      type: 'number',
      description: 'Custom sort order for vehicles in the sidebar mega menu. Lower numbers appear first.',
      validation: (Rule) => Rule.integer().min(0),
      initialValue: 0
    }),

    // Vehicle Specifications
    defineField({
      name: 'specifications',
      title: 'Technical Specifications',
      type: 'object',
      fields: [
        defineField({
          name: 'vehicle_length',
          title: 'Vehicle Length (ft)',
          type: 'number',
          description: 'Vehicle length in feet with up to 2 decimal places (e.g., 19.50)',
          validation: (Rule) => Rule.positive().custom((value) => {
            if (value === undefined || value === null) {
              return true // Optional field
            }
            // Check if the number has more than 2 decimal places
            const decimalPlaces = (value.toString().split('.')[1] || '').length
            if (decimalPlaces > 2) {
              return 'Vehicle length must have no more than 2 decimal places'
            }
            return true
          })
        }),
        defineField({
          name: 'vehicle_width',
          title: 'Vehicle Width (ft)',
          type: 'number',
          description: 'Vehicle width in feet with up to 2 decimal places (e.g., 6.75)',
          validation: (Rule) => Rule.positive().custom((value) => {
            if (value === undefined || value === null) {
              return true // Optional field
            }
            // Check if the number has more than 2 decimal places
            const decimalPlaces = (value.toString().split('.')[1] || '').length
            if (decimalPlaces > 2) {
              return 'Vehicle width must have no more than 2 decimal places'
            }
            return true
          })
        }),
        defineField({
          name: 'vehicle_height',
          title: 'Vehicle Height (ft)',
          type: 'number',
          description: 'Vehicle height in feet with up to 2 decimal places (e.g., 6.25)',
          validation: (Rule) => Rule.positive().custom((value) => {
            if (value === undefined || value === null) {
              return true // Optional field
            }
            // Check if the number has more than 2 decimal places
            const decimalPlaces = (value.toString().split('.')[1] || '').length
            if (decimalPlaces > 2) {
              return 'Vehicle height must have no more than 2 decimal places'
            }
            return true
          })
        })
      ]
    }),

    // Features & Amenities
    defineField({
      name: 'features',
      title: 'Features & Amenities',
      type: 'object',
      fields: [
        defineField({
          name: 'baseFeatures',
          title: 'Base Features',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'additionalOptions',
          title: 'Additional Options',
          type: 'array',
          description: 'Reference to Additional Option documents for this vehicle',
          of: [
            {
              type: 'reference',
              to: [{ type: 'additionalOption' }],
              options: {
                filter: 'isActive == true'
              }
            }
          ]
        })
      ]
    }),

    // Associated Vehicles
    defineField({
      name: 'associatedVehicles',
      title: 'Associated Vehicles',
      type: 'array',
      description: 'Select up to 3 related vehicles to display together',
      of: [
        {
          type: 'reference',
          to: [{ type: 'vehicle' }],
          options: {
            filter: ({ document }) => {
              // Prevent self-reference by filtering out the current document's ID
              return {
                filter: `_id != "${document._id}"`,
                params: {}
              }
            }
          }
        }
      ],
      validation: (Rule) => Rule.max(3).custom((vehicles, context) => {
        if (vehicles && vehicles.length > 3) {
          return 'Maximum 3 associated vehicles allowed'
        }
        return true
      })
    }),

    // Media Assets
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' })
      ]
    }),

    defineField({
      name: 'vehicleDetailsPageHeaderBackgroundImage',
      title: 'Vehicle Details Page Header Background Image',
      type: 'image',
      description: 'Optional background image specifically for the vehicle details page hero/header section. Falls back to Cover Image if not set.',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' })
      ]
    }),

    // Bulk Upload Helper Field
    defineField({
      name: 'bulkUploadHelper',
      title: 'Bulk Upload Images',
      type: 'object',
      description: 'Click the button below to upload multiple images at once. They will be added to the gallery below.',
      fields: [
        {
          name: 'placeholder',
          type: 'string',
          hidden: true
        }
      ],
      components: {
        input: BulkImageUploadAction
      },
      hidden: ({ document }) => !document?.gallery
    }),

    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [defineArrayMember({
        type: 'image',
        preview: {
          select: {
            asset: 'asset',
            alt: 'alt',
            caption: 'caption',
            isBuildCoverImage: 'isBuildCoverImage',
            isBuildTextSummaryBlock: 'isBuildTextSummaryBlock'
          },
          prepare(selection) {
            const { asset, alt, caption, isBuildCoverImage, isBuildTextSummaryBlock } = selection
            let subtitle = 'Gallery Image'
            if (isBuildCoverImage && isBuildTextSummaryBlock) {
              subtitle = 'Cover Image + Text Summary'
            } else if (isBuildCoverImage) {
              subtitle = 'Cover Image'
            } else if (isBuildTextSummaryBlock) {
              subtitle = 'Text Summary Block'
            }
            return {
              title: caption || alt || 'Gallery Image',
              subtitle: subtitle,
              media: asset
            }
          }
        },
        fields: [
          defineField({
            name: 'isBuildCoverImage',
            title: 'Is Cover Image for Build',
            type: 'boolean',
            description: 'Whether this image will be used for the build cover image to open the build gallery. When true, image will be shown on vehicle details page and clicking the image will open the build gallery.',
            initialValue: false
          }),
          defineField({
            name: 'isBuildTextSummaryBlock',
            title: 'Is Text Summary Block for Build',
            type: 'boolean',
            description: 'Whether this block will be used to display the text summary block on the build gallery expandable section.',
            initialValue: false
          }),
          defineField({
            name: 'isBuildTextSummaryContent',
            title: 'Text Summary Content',
            type: 'array',
            of: [
              defineArrayMember({
                type: 'block',
                styles: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'H1', value: 'h1' },
                  { title: 'H2', value: 'h2' },
                  { title: 'H3', value: 'h3' },
                  { title: 'Quote', value: 'blockquote' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Small', value: 'small' },
                  { title: 'Extra Small', value: 'extra-small' },
                  { title: 'Tiny', value: 'tiny' }
                ],
                lists: [
                  { title: 'Bullet', value: 'bullet' },
                  { title: 'Numbered', value: 'number' }
                ]
              })
            ],
            description: 'Rich text content displayed with the build text summary block.',
            hidden: ({ parent }) => !parent?.isBuildTextSummaryBlock,
            validation: (Rule) => Rule.custom((value, context) => {
              const isSummary = (context as any)?.parent?.isBuildTextSummaryBlock
              if (isSummary) {
                return value && value.length > 0 ? true : 'Text summary content is required when marked as a Text Summary Block'
              }
              return true
            })
          }),
          defineField({
            name: 'coverImageOverlayText',
            title: 'Cover Image Overlay Text',
            type: 'array',
            of: [
              defineArrayMember({
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
              }),
              defineArrayMember({
                type: 'image',
                fields: [
                  defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                    description: 'Important for SEO and accessibility.'
                  })
                ]
              })
            ],
            description: 'Optional WYSIWYG text field for overlay text on the cover image.'
          }),
          defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
          defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          defineField({ 
            name: 'view', 
            type: 'string', 
            title: 'Image View',
            options: {
              list: [
                'Exterior Front', 'Exterior Rear', 'Exterior Side', 'Interior Dashboard',
                'Interior Seats', 'Interior Back', 'Engine', 'Bed', 'Technology'
              ]
            }
          }),
          defineField({
            name: 'tags',
            title: 'Filter Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
              list: [
                { title: 'Exterior', value: 'exterior' },
                { title: 'Audio', value: 'audio' },
                { title: 'Interior', value: 'interior' },
                { title: 'Accessories: Exterior', value: 'accessories:exterior' },
                { title: 'Accessories: Interior', value: 'accessories:interior' },
                { title: 'Performance', value: 'performance' }
              ]
            },
            description: 'Select tags to filter this image by category'
          }),

          defineField({
            name: 'gridSpan',
            title: 'Grid Layout',
            type: 'object',
            description: 'Control how this image spans the grid layout',
            fields: [
              defineField({
                name: 'mobile',
                title: 'Mobile (1 column)',
                type: 'object',
                fields: [
                  defineField({ name: 'col', type: 'number', title: 'Columns', initialValue: 1, validation: Rule => Rule.min(1) }),
                  defineField({ name: 'row', type: 'number', title: 'Rows', initialValue: 1, validation: Rule => Rule.min(1) })
                ]
              }),
              defineField({
                name: 'tablet',
                title: 'Tablet (2 columns)',
                type: 'object',
                fields: [
                  defineField({ name: 'col', type: 'number', title: 'Columns', initialValue: 1, validation: Rule => Rule.min(1) }),
                  defineField({ name: 'row', type: 'number', title: 'Rows', initialValue: 1, validation: Rule => Rule.min(1) })
                ]
              }),
              defineField({
                name: 'desktop',
                title: 'Desktop (3+ columns)',
                type: 'object',
                fields: [
                  defineField({ name: 'col', type: 'number', title: 'Columns', initialValue: 1, validation: Rule => Rule.min(1) }),
                  defineField({ name: 'row', type: 'number', title: 'Rows', initialValue: 1, validation: Rule => Rule.min(1) })
                ]
              })
            ]
          })
        ]
      })]
    }),

    // SEO & Metadata
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60)
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          validation: (Rule) => Rule.max(160)
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image',
          type: 'image'
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }]
        })
      ]
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })

  ],

  preview: {
    select: {
      title: 'title',
      manufacturer: 'manufacturer.name',
      model: 'model',
      brand: 'brand',
      packageName: 'package.name',
      media: 'coverImage'
    },
    prepare(selection) {
      const { title, manufacturer, model, brand, packageName, media } = selection
      const parts = []
      if (manufacturer) parts.push(manufacturer)
      if (model) parts.push(model)
      if (brand) parts.push(brand)
      if (packageName) parts.push(packageName)
      return {
        title: title,
        subtitle: parts.length > 0 ? parts.join(' • ') : 'No manufacturer',
        media: media
      }
    }
  }
})