import {defineArrayMember, defineField, defineType} from 'sanity'

export const homepageSettings = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Hero Slides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'text'}),
            defineField({
              name: 'image',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({name: 'alt', title: 'Alt text', type: 'string'}),
              ],
            }),
          ],
          preview: {
            select: {title: 'title', media: 'image'},
          },
        }),
      ],
    }),
  ],
})


