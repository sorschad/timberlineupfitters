import 'server-only'

export const token = process.env.SANITY_API_READ_TOKEN

// Only require the token in production if the dataset is private
// For public datasets, the token is optional
if (!token && process.env.NODE_ENV === 'production' && process.env.SANITY_DATASET_PRIVATE === 'true') {
  throw new Error('Missing SANITY_API_READ_TOKEN for private dataset')
}
