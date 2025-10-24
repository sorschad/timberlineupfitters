# Sanity Headless CMS API Implementation

This implementation transforms your existing Sanity setup into a headless CMS that can be immediately used with Figma Make websites.

## 🚀 What's Been Added

### API Endpoints
- **`/api/cms/content`** - Flexible content queries with pagination
- **`/api/cms/simple`** - Simplified content access for Figma Make
- **`/api/cms/webhook`** - Real-time content updates
- **`/api/cms/cors`** - CORS configuration and usage guide

### JavaScript Integration
- **`/public/sanity-cms-integration.js`** - Ready-to-use JavaScript library for Figma Make

### Configuration
- **`vercel.json`** - Updated with CORS headers and function configuration

## 📡 API Usage

### Get All Content Types
```bash
GET /api/cms/simple?content=all
```

### Get Specific Content Types
```bash
# Get brands only
GET /api/cms/simple?content=brands

# Get vehicles only  
GET /api/cms/simple?content=vehicles

# Get manufacturers only
GET /api/cms/simple?content=manufacturers

# Get homepage content
GET /api/cms/simple?content=homepage

# Get settings
GET /api/cms/simple?content=settings
```

### Get Specific Items
```bash
# Get specific brand
GET /api/cms/content?type=brand&slug=brand-name

# Get specific vehicle
GET /api/cms/content?type=vehicle&slug=vehicle-name

# Get specific manufacturer
GET /api/cms/content?type=manufacturer&slug=manufacturer-name
```

### Pagination
```bash
# Get first 10 brands
GET /api/cms/content?type=brands&limit=10&offset=0

# Get next 10 brands
GET /api/cms/content?type=brands&limit=10&offset=10
```

## 🔧 JavaScript Integration for Figma Make

### Basic Usage
```html
<!-- Include the integration script -->
<script src="/sanity-cms-integration.js"></script>

<script>
// Get all brands
sanityCMS.getBrands().then(data => {
  console.log('Brands:', data.content.brands)
})

// Get all vehicles
sanityCMS.getVehicles().then(data => {
  console.log('Vehicles:', data.content.vehicles)
})

// Get specific brand
sanityCMS.getBrand('brand-slug').then(data => {
  console.log('Brand details:', data.data)
})
</script>
```

### Advanced Usage
```javascript
// Custom base URL
const cms = new SanityCMS('https://your-domain.com/api/cms')

// Get all content
cms.getContent('all').then(data => {
  console.log('All content:', data.content)
})

// Search content
cms.searchContent('truck').then(data => {
  console.log('Search results:', data.content)
})

// Get paginated content
cms.getPaginatedContent('vehicles', 5, 0).then(data => {
  console.log('First 5 vehicles:', data.data)
})
```

## 🌐 CORS Configuration

The API endpoints are configured with CORS headers to allow cross-origin requests from Figma Make websites:

- **Access-Control-Allow-Origin**: `*`
- **Access-Control-Allow-Methods**: `GET, POST, OPTIONS`
- **Access-Control-Allow-Headers**: `Content-Type, Authorization`

## 🔄 Real-time Updates

### Webhook Setup
Configure Sanity webhooks to point to:
```
https://your-domain.com/api/cms/webhook
```

The webhook will:
- Log content updates
- Provide hooks for cache invalidation
- Support external service notifications

### Webhook Payload Example
```json
{
  "type": "mutation",
  "documentId": "brand-123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "content": {
    "brands": [...],
    "vehicles": [...],
    "manufacturers": [...],
    "homepage": {...},
    "settings": {...}
  },
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Failed to fetch content",
  "message": "Specific error details"
}
```

## 🚀 Deployment

### Safe Deployment
This implementation is **100% safe** to deploy because:
- ✅ Only adds new API routes
- ✅ No changes to existing functionality
- ✅ Uses existing Sanity configuration
- ✅ Zero impact on current website

### Deploy Commands
```bash
# Add and commit changes
git add app/api/cms/ public/sanity-cms-integration.js vercel.json
git commit -m "Add headless CMS API endpoints for Figma Make integration"
git push origin main
```

### Environment Variables
No new environment variables needed - uses existing Sanity configuration:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`

## 🧪 Testing

### Local Testing
```bash
# Start development server
npm run dev

# Test endpoints
curl "http://localhost:3000/api/cms/cors"
curl "http://localhost:3000/api/cms/simple?content=brands"
curl "http://localhost:3000/api/cms/simple?content=vehicles"
```

### Production Testing
```bash
# Test production endpoints
curl "https://your-domain.com/api/cms/simple?content=all"
curl "https://your-domain.com/api/cms/content?type=brands"
```

## 📝 Content Types Available

### Brands
- Basic info (name, slug, excerpt)
- Images (cover, logos)
- Colors (primary, secondary, accent)
- Features and launch date
- Associated manufacturers

### Vehicles
- Basic info (title, model, year, type)
- Images (cover, gallery)
- Specifications and features
- Inventory status
- Associated manufacturer

### Manufacturers
- Basic info (name, description)
- Logo and branding
- Vehicle count
- Associated content

### Homepage
- Hero section content
- Background images
- Headings and subheadings

### Settings
- Site-wide configuration
- App logo
- Global settings

## 🔧 Customization

### Adding New Content Types
1. Add new queries to `/sanity/lib/queries.ts`
2. Update API routes to handle new types
3. Update JavaScript integration

### Modifying Response Format
Edit the API route files to customize the response structure:
- `/app/api/cms/content/route.ts`
- `/app/api/cms/simple/route.ts`

### Adding Authentication
Add authentication middleware to API routes if needed for private content.

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Ensure CORS headers are properly set
2. **Authentication errors**: Check Sanity API token
3. **Content not loading**: Verify Sanity dataset and project ID

### Debug Mode
Enable debug logging by uncommenting the logger in `/sanity/lib/client.ts`:
```typescript
stega: {
  studioUrl,
  logger: console, // Uncomment this line
  filter: (props) => {
    // ... existing filter logic
  },
}
```

## 📞 Support

For issues or questions:
1. Check the API responses for error messages
2. Verify Sanity configuration
3. Test endpoints individually
4. Check browser console for JavaScript errors

---

**Ready to use!** Your Sanity setup is now a fully functional headless CMS for Figma Make websites.
