# Additional Options Migration Guide

## Overview

This migration updates the Vehicle data model to use proper references to Additional Option documents instead of storing additional options as simple strings. This provides better data integrity, richer metadata, and improved querying capabilities.

## Changes Made

### 1. Vehicle Schema Updates (`studio/src/schemaTypes/documents/vehicle.ts`)

**Before:**
```typescript
features: {
  additionalOptions: string[]  // Simple array of strings
}
```

**After:**
```typescript
features: {
  additionalOptions: Reference[]  // References to AdditionalOption documents
  // Plus base features:
  baseFeatures: string[]
}
```

### 2. API Query Updates

All vehicle queries now properly dereference additional options to include full metadata:

```groq
features{
  baseFeatures,
  "additionalOptions": additionalOptions[]->{
    _id,
    name,
    slug,
    description,
    "manufacturer": manufacturer->{
      _id,
      name
    },
    "brand": brand->{
      _id,
      name
    },
    package,
    image,
    price,
    availability,
    features,
    tags
  }
}
```

### 3. Migration Script

Created `scripts/migrateAdditionalOptions.ts` to:
- Extract all unique additional option strings from existing vehicles
- Create Additional Option documents for each unique string
- Update vehicle references to point to the new documents
- Handle duplicates and maintain data integrity

## Running the Migration

### Prerequisites

1. Ensure you have the required environment variables:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Migration Steps

1. **Backup your data** (recommended):
   ```bash
   npm run backup
   ```

2. **Run the migration**:
   ```bash
   npm run migrate-additional-options
   ```

3. **Verify the migration**:
   - Check Sanity Studio for new Additional Option documents
   - Verify vehicles now have references instead of strings
   - Test API endpoints to ensure data is properly dereferenced

## Benefits of the New Structure

### 1. Rich Metadata
- Each additional option now has detailed information (description, price, availability, etc.)
- Proper categorization with package types
- Manufacturer and brand associations
- Image support for visual representation

### 2. Better Data Integrity
- No duplicate option names
- Consistent naming and descriptions
- Centralized management of options

### 3. Enhanced Querying
- Filter options by manufacturer, brand, package type
- Search by availability, price range, features
- Better performance with proper indexing

### 4. Improved User Experience
- Rich option details in the UI
- Better filtering and search capabilities
- Consistent option presentation across vehicles

## Data Structure Comparison

### Before Migration
```json
{
  "features": {
    "additionalOptions": [
      "Custom TSport Leather Package w/ Embossed Seats",
      "Digital Fit Floor Liners",
      "Center Console Security Vault"
    ]
  }
}
```

### After Migration
```json
{
  "features": {
    "additionalOptions": [
      {
        "_id": "additional-option-1",
        "name": "Custom TSport Leather Package w/ Embossed Seats",
        "slug": { "current": "custom-tsport-leather-package" },
        "description": "Premium leather seats with TSport embossing",
        "manufacturer": { "_id": "manufacturer-ford", "name": "Ford" },
        "brand": { "_id": "brand-tsport", "name": "TSport" },
        "package": "luxury",
        "price": { "amount": 2500, "currency": "USD" },
        "availability": "in-stock",
        "features": ["Premium leather", "Custom embossing", "Heated seats"],
        "tags": ["interior", "luxury", "custom"]
      }
    ]
  }
}
```

## Rollback Plan

If you need to rollback the migration:

1. **Restore from backup**:
   ```bash
   npm run restore
   ```

2. **Or manually revert**:
   - Change vehicle schema back to string arrays
   - Update API queries to remove dereferencing
   - Remove Additional Option documents if desired

## Post-Migration Tasks

1. **Update Additional Option documents**:
   - Add proper manufacturer references
   - Set appropriate package categories
   - Add pricing information
   - Upload images where available

2. **Test all vehicle-related functionality**:
   - Vehicle listing pages
   - Vehicle detail pages
   - Search and filtering
   - API endpoints

3. **Update frontend components**:
   - Ensure UI components handle the new data structure
   - Update any hardcoded string handling
   - Test option display and selection

## Troubleshooting

### Common Issues

1. **Migration fails with authentication error**:
   - Verify SANITY_API_TOKEN has write permissions
   - Check project ID and dataset names

2. **Some options not migrated**:
   - Check for special characters in option names
   - Verify slug generation is working correctly

3. **API queries return null for additionalOptions**:
   - Ensure the migration completed successfully
   - Check that references are properly set
   - Verify the query syntax is correct

### Support

If you encounter issues during migration:
1. Check the console output for specific error messages
2. Verify your Sanity project configuration
3. Ensure all dependencies are installed
4. Check the backup data if rollback is needed
