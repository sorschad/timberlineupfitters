# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

## Features

- **Unsplash Integration**: Browse and import images directly from Unsplash
- **Google Drive Integration**: Browse and import files directly from Google Drive
- **Visual Editing**: Real-time preview with presentation tool
- **AI Assistant**: Content assistance with Sanity Assist

## Google Drive Setup

To use Google Drive as an asset source, you need to set up a Google API key:

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API

### 2. Create API Key
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy the API Key
4. (Optional) Restrict the API key to Google Drive API for security

### 3. Configure Environment Variables
Create a `.env.local` file in the studio directory with:

```bash
SANITY_STUDIO_GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Restart Sanity Studio
After adding the environment variable, restart your Sanity Studio to load the Google Drive integration.

### Important Notes

**API Key Limitations:**
- API key authentication only works with **public files** or files shared with "Anyone with the link"
- Private files in your personal Google Drive cannot be accessed with API key alone
- To access private files, you would need OAuth authentication (not currently implemented)

**How to Use:**
1. Share your Google Drive folder/file with "Anyone with the link" permission
2. Copy the folder ID or share link
3. In Sanity Studio, when using Google Drive asset source, paste the folder ID or link to browse that folder
4. Select files to import them into Sanity

## Getting Started

Now you can do the following things:

- [Read "getting started" in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the community Slack](https://slack.sanity.io/?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
