import { defineType, defineField } from 'sanity'
import { SortOrderInput } from '../../components/SortOrderInput'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(255)
    }),

    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(255)
    }),

    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.email()
    }),

    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Phone number (e.g., +1-555-123-4567)'
    }),

    defineField({
      name: 'fax',
      title: 'Fax Number',
      type: 'string',
      description: 'Fax number (e.g., +1-555-123-4568)'
    }),

    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Numeric order for sorting team members. Lower numbers appear first. Automatically set to next available value + 5 for new members.',
      components: {
        input: SortOrderInput
      }
    }),

    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      description: 'Profile photo for the team member. Supported formats: JPEG, PNG, GIF, WebP. AVIF and other formats are not supported by Sanity.',
      fields: [
        defineField({ 
          name: 'alt', 
          type: 'string', 
          title: 'Alt Text',
          description: 'Alternative text for accessibility'
        })
      ]
    })
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'jobTitle',
      media: 'image'
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Untitled Team Member',
        subtitle: subtitle || 'No job title',
        media: media
      }
    }
  }
})

