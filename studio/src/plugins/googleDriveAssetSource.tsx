/**
 * Google Drive Asset Source Plugin
 * 
 * Allows users to browse and import files/images directly from Google Drive
 * into Sanity Studio.
 * 
 * Setup required:
 * 1. Create a Google Cloud Project
 * 2. Enable Google Drive API
 * 3. Create an API Key in GCP Console
 * 4. Set environment variable:
 *    - SANITY_STUDIO_GOOGLE_API_KEY
 * 
 * Note: API key authentication only works with:
 * - Public files (shared with "Anyone with the link")
 * - Files in shared folders with public access
 * - Service account files (if using service account)
 */

import {definePlugin} from 'sanity'
import {GoogleDriveBrowser} from './components/GoogleDriveBrowser'

const GoogleDriveIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.71 2L2 7.71L12 22.29L22.29 2H7.71Z"
      fill="#4285F4"
    />
    <path
      d="M12 22.29L2 7.71H7.71L12 14.29L16.29 7.71H22.29L12 22.29Z"
      fill="#34A853"
    />
    <path
      d="M7.71 2L2 7.71L7.71 14.29L12 7.71L7.71 2Z"
      fill="#FBBC04"
    />
    <path
      d="M22.29 2L12 16.29L7.71 9.71L16.29 2H22.29Z"
      fill="#EA4335"
    />
  </svg>
)

export const googleDriveAssetSource = definePlugin({
  name: 'google-drive-asset-source',
  form: {
    image: {
      assetSources: (prev) => [
        ...prev,
        {
          name: 'google-drive',
          title: 'Google Drive',
          icon: GoogleDriveIcon,
          component: GoogleDriveBrowser,
        },
      ],
    },
    file: {
      assetSources: (prev) => [
        ...prev,
        {
          name: 'google-drive',
          title: 'Google Drive',
          icon: GoogleDriveIcon,
          component: GoogleDriveBrowser,
        },
      ],
    },
  },
})

