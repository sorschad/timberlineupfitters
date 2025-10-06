# Sales Representatives Feature

This document describes the new Sales Representatives feature that has been added to the Timberline Upfitters website.

## Overview

The Sales Representatives feature allows users to find and contact sales representatives in their area. It includes:

- A new homepage section with an alternative design for finding dealers/representatives
- A searchable database of sales representatives with contact information
- A responsive modal/popup for search results
- Integration with Sanity CMS for content management

## Components Added

### 1. Sanity Schema (`studio/src/schemaTypes/documents/salesRepresentative.ts`)

A new Sanity document type for managing sales representatives with the following fields:

- **Basic Information**: name, territory region, territory zip codes
- **Contact Details**: email, phone (with country code and extension), mobile, fax
- **Profile**: profile image, bio, specialties
- **Management**: active status, sort order

### 2. Find Dealer Section (`frontend/app/components/FindDealerSection.tsx`)

A new homepage section that replaces the original "Find a Dealer" functionality with:

- **Modern Design**: Dark gradient background with brand colors
- **Interactive Search**: Click-to-search interface
- **Feature Highlights**: Three key benefits displayed
- **Responsive Layout**: Works on all device sizes
- **Brand Consistency**: Uses Timberline Upfitters color scheme

### 3. Search Modal (`frontend/app/components/SearchModal.tsx`)

A shareable modal component for searching and displaying sales representatives:

- **Search Interface**: Location-based search with debouncing
- **Results Display**: Card-based layout with contact information
- **Contact Actions**: Direct email and phone links
- **Responsive Design**: Mobile-optimized layout
- **Accessibility**: Keyboard navigation and screen reader support

### 4. API Endpoint (`frontend/app/api/sales-representatives/route.ts`)

REST API endpoint for searching sales representatives:

- **Search Logic**: Searches by territory region, zip codes, and name
- **Filtering**: Only returns active representatives
- **Sorting**: Ordered by sort order and name
- **Error Handling**: Proper error responses

### 5. Seed Script (`scripts/seedSalesRepresentatives.ts`)

Sample data script for populating the database with representative information.

## Design Features

### Visual Design
- **Color Scheme**: Uses Timberline Upfitters brand colors (#d4852b, #f36f21, #2f3f24, #1e3a2b)
- **Typography**: Consistent with site-wide font choices
- **Gradients**: Modern gradient backgrounds and buttons
- **Icons**: Custom SVG icons for visual hierarchy
- **Shadows**: Layered shadows for depth

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Layout**: Two-column layouts for medium screens
- **Desktop**: Full-width layouts with proper spacing
- **Touch Friendly**: Large touch targets for mobile

### User Experience
- **Progressive Disclosure**: Search interface reveals results in modal
- **Loading States**: Visual feedback during search
- **Error Handling**: Graceful handling of no results
- **Keyboard Navigation**: Full keyboard support
- **Accessibility**: ARIA labels and semantic HTML

## Integration

### Homepage Integration
The new section is integrated into the homepage (`frontend/app/page.tsx`) above the footer CTA section:

```tsx
{/* Find Dealer Section */}
<FindDealerSection />

{/* Homepage CTA above footer */}
<HomepageCta />
```

### Sanity Studio Integration
The new schema is automatically available in Sanity Studio for content management.

## Usage

### For Content Managers
1. Access Sanity Studio
2. Navigate to "Sales Representatives"
3. Create new representatives with required information
4. Set territory regions and zip codes
5. Add contact information and specialties
6. Set sort order for display priority

### For Developers
1. The search modal is reusable across the site
2. API endpoint can be extended for additional functionality
3. Components are fully typed with TypeScript
4. Styling uses Tailwind CSS with custom brand colors

## Technical Details

### Dependencies
- Next.js 14+ with App Router
- Sanity CMS integration
- Tailwind CSS for styling
- TypeScript for type safety

### Performance
- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Lazy Loading**: Modal only loads when opened
- **Optimized Queries**: Efficient Sanity queries
- **Caching**: Browser caching for static assets

### Security
- **Input Validation**: Sanitized search queries
- **Error Handling**: No sensitive data in error messages
- **CSRF Protection**: Built-in Next.js protection

## Future Enhancements

### Potential Improvements
1. **Map Integration**: Display representatives on a map
2. **Advanced Filtering**: Filter by specialties or vehicle types
3. **Appointment Booking**: Direct calendar integration
4. **Analytics**: Track search patterns and popular representatives
5. **Multi-language**: Support for multiple languages
6. **Geolocation**: Automatic location detection

### Scalability
- **Database Optimization**: Indexed fields for faster searches
- **Caching Strategy**: Redis caching for frequently searched areas
- **CDN Integration**: Global content delivery
- **Load Balancing**: Handle high traffic volumes

## Maintenance

### Regular Tasks
1. **Content Updates**: Keep representative information current
2. **Performance Monitoring**: Track search performance
3. **User Feedback**: Monitor user experience metrics
4. **Security Updates**: Keep dependencies current

### Monitoring
- **Search Analytics**: Track popular search terms
- **Error Logging**: Monitor API errors
- **Performance Metrics**: Page load times and search response times
- **User Behavior**: Track modal usage and conversion rates

## Support

For technical support or questions about this feature, please refer to:
- Component documentation in the codebase
- Sanity Studio documentation for content management
- Next.js documentation for API development
- Tailwind CSS documentation for styling
