import 'server-only'

export const token = process.env.SANITY_API_READ_TOKEN

// Only require the token in production. Allow local development without it.
if (!token && process.env.NODE_ENV === 'production') {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}
