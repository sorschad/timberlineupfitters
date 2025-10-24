# Additional Options Schema Documentation

## Overview

The `AdditionalOption` schema has been created to manage optional add-ons, accessories, and upgrades that can be added to vehicles. This schema provides comprehensive fields for managing additional options with full integration into the headless CMS API.

## Schema Fields

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Name of the additional option or accessory |
| `slug` | slug | ✅ | URL-friendly identifier |
| `description` | text | ❌ | Detailed description of the option |
| `manufacturer` | reference | ✅ | Reference to manufacturer |
| `brand` | reference | ❌ | Optional reference to associated brand |
| `package` | string | ❌ | Package category (performance, luxury, offroad, etc.) |
| `image` | image | ❌ | Image showing the additional option |

### Pricing & Availability

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `price` | object | ❌ | Pricing information |
| `price.amount` | number | ❌ | Price in dollars |
| `price.currency` | string | ❌ | Currency (USD, CAD) |
| `price.isEstimate` | boolean | ❌ | Whether price is estimated |
| `availability` | string | ❌ | Availability status |

### Technical Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `compatibleVehicles` | array | ❌ | List of compatible vehicles |
| `features` | array | ❌ | Key features or benefits |
| `installation` | object | ❌ | Installation information |
| `warranty` | object | ❌ | Warranty details |
| `tags` | array | ❌ | Tags for categorization |

### Management Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `isActive` | boolean | ❌ | Whether option is currently available |
| `sortOrder` | number | ❌ | Order in lists (default: 0) |

## Package Categories

The `package` field supports the following predefined categories:

- **Performance** - Engine upgrades, suspension, etc.
- **Luxury** - Premium interior features, comfort items
- **Off-Road** - 4WD accessories, recovery gear
- **Interior** - Seats, dash components, storage
- **Exterior** - Body panels, lighting, protection
- **Technology** - Electronics, navigation, entertainment
- **Safety** - Safety equipment, monitoring systems
- **Comfort** - Climate control, seating comfort
- **Utility** - Storage, cargo management
- **Custom** - Custom modifications

## Availability Status

- **In Stock** - Currently available
- **Available Soon** - Coming soon
- **Special Order** - Requires ordering
- **Discontinued** - No longer available

## API Integration

### Simple API Endpoints

```javascript
// Get all additional options
GET /api/cms/simple?content=additionalOptions

// Get all content including additional options
GET /api/cms/simple?content=all
```

### Content API Endpoints

```javascript
// Get all additional options
GET /api/cms/content?type=additionalOptions

// Get specific additional option
GET /api/cms/content?type=additionalOption&slug=option-name

// Get options by package
GET /api/cms/content?type=additionalOptionsByPackage&package=performance

// Get options by manufacturer
GET /api/cms/content?type=additionalOptionsByManufacturer&manufacturerId=manufacturer-id
```

### JavaScript Integration

```javascript
// Initialize the CMS integration
const cms = new SanityCMS('https://timberlineupfitters-frontend.vercel.app/api/cms');

// Get all additional options
cms.getAdditionalOptions().then(data => {
  console.log('Additional Options:', data.content.additionalOptions);
});

// Get specific option
cms.getAdditionalOption('option-slug').then(data => {
  console.log('Option Details:', data.data);
});

// Get options by package
cms.getAdditionalOptionsByPackage('performance').then(data => {
  console.log('Performance Options:', data.data);
});

// Get options by manufacturer
cms.getAdditionalOptionsByManufacturer('manufacturer-id').then(data => {
  console.log('Manufacturer Options:', data.data);
});
```

## Studio Features

### Preview Configuration

The schema includes a preview configuration that shows:
- **Title**: Option name
- **Subtitle**: Manufacturer name
- **Media**: Option image

### Ordering Options

The schema supports multiple ordering options:
- Name A-Z
- Name Z-A
- By Manufacturer
- By Sort Order

### Validation

- `name` field is required and limited to 255 characters
- `slug` field is required and must be unique
- `manufacturer` reference is required
- All other fields are optional

## Usage Examples

### Creating an Additional Option

1. **Basic Option**:
   - Name: "Premium Leather Seats"
   - Manufacturer: Select from existing manufacturers
   - Package: "Luxury"
   - Price: $2,500 USD

2. **Performance Option**:
   - Name: "Cold Air Intake System"
   - Manufacturer: Select manufacturer
   - Package: "Performance"
   - Compatible Vehicles: Select applicable vehicles
   - Installation: Professional installation required

3. **Off-Road Option**:
   - Name: "Winch Kit"
   - Manufacturer: Select manufacturer
   - Package: "Off-Road"
   - Features: ["12,000 lb capacity", "Waterproof", "Remote control"]

## Integration with Figma Make

The AdditionalOption schema is fully integrated with the Figma Make headless CMS:

1. **CORS Configuration**: All endpoints support the Figma Make domain
2. **JavaScript Library**: Includes methods for fetching additional options
3. **API Endpoints**: Full REST API support with filtering and pagination
4. **Real-time Updates**: Webhook support for content changes

## Best Practices

1. **Naming**: Use clear, descriptive names for options
2. **Images**: Include high-quality images showing the option
3. **Pricing**: Keep pricing information up-to-date
4. **Compatibility**: Maintain accurate vehicle compatibility lists
5. **Categorization**: Use appropriate package categories and tags
6. **Sort Order**: Set meaningful sort orders for better organization

## Related Schemas

- **Manufacturer**: Referenced by `manufacturer` field
- **Brand**: Referenced by `brand` field (optional)
- **Vehicle**: Referenced in `compatibleVehicles` array

This schema provides a comprehensive solution for managing additional options and accessories in your vehicle customization system.
