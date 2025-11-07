import { defineType, defineField } from 'sanity'

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
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      description: 'Profile photo for the team member. Supports responsive images with width, height, format, and srcset via Sanity CDN.',
      options: { 
        hotspot: true 
      },
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

