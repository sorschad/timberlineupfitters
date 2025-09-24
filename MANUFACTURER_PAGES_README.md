# Manufacturer Detail Pages

This document describes the new manufacturer detail page structure implemented for the Timberline Upfitters website.

## Overview

The manufacturer detail pages provide an immersive, visually stunning experience for showcasing vehicles from different manufacturers (Ford, Ram, Jeep) with their associated packages and specifications.

## Page Structure

### URL Pattern
- **Manufacturer Index**: `/manufacturers`
- **Manufacturer Detail**: `/manufacturers/{MANUFACTURER_SLUG}`

### Example URLs
- `/manufacturers/ford`
- `/manufacturers/ram` 
- `/manufacturers/jeep`

## Components

### 1. Breadcrumb Navigation (`Breadcrumb.tsx`)
- Hierarchical navigation showing: Home > Manufacturers > [Manufacturer Name]
- Sticky positioning below main header
- Clean, minimal design with hover effects

### 2. Manufacturer Hero (`ManufacturerHero.tsx`)
- **Full-screen immersive hero section**
- **Parallax background** with manufacturer-specific imagery
- **Animated content** with floating bounce effects
- **Scroll indicator** with smooth scroll to content
- **Dynamic content** showing vehicle count and available models
- **Call-to-action button** that smoothly scrolls to first vehicle section

### 3. Vehicle Showcase (`VehicleShowcase.tsx`)
- **Alternating layout** (left/right content panels)
- **Parallax backgrounds** for each vehicle group
- **Frosted glass overlay panels** with backdrop blur
- **Package badges** and upfitter information
- **Interactive hover effects** and animations
- **Smooth scroll animations** triggered by viewport visibility

### 4. Interactive Specs Table (`SpecsTable.tsx`)
- **Filterable specifications** by category (Performance, Features, Dimensions)
- **Clickable rows** for highlighting specific specs across all vehicles
- **Responsive design** with horizontal scroll on mobile
- **Mock data integration** ready for real specification data
- **Export functionality** for downloading full specs

### 5. Gallery Section (`GallerySection.tsx`)
- **Masonry-style layout** for "In the Wild" photos
- **Category filtering** (Adventure, Work, Lifestyle)
- **Modal lightbox** for full-size image viewing
- **Hover effects** with overlay captions
- **User-generated content** integration ready

### 6. Call-to-Action Section (`CtaSection.tsx`)
- **Gradient background** with decorative elements
- **Statistics display** (vehicle count, customization, support)
- **Multiple CTA buttons** (Locate Dealer, Browse Inventory)
- **Additional links** (Financing, Warranty, Service, Accessories)

## Design Features

### Visual Effects
- **Parallax scrolling** on background images
- **Smooth animations** and transitions
- **Hover effects** with scale transforms
- **Backdrop blur** and glass morphism effects
- **Gradient overlays** for text readability

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly interactions** for mobile devices
- **Optimized images** with Next.js Image component

### Performance Optimizations
- **Client-side animations** with CSS transforms
- **Lazy loading** for images and content
- **Efficient scroll listeners** with cleanup
- **Static generation** for SEO and performance

## Data Structure

### Manufacturer Query
```groq
*[_type == "manufacturer" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  logo,
  description,
  "vehicles": *[_type == "vehicle" && references(^._id)] {
    _id,
    title,
    slug,
    model,
    vehicleType,
    modelYear,
    upfitter,
    package,
    "manufacturer": manufacturer->name
  } | order(model asc, upfitter asc, package asc)
}
```

### Vehicle Grouping
Vehicles are automatically grouped by:
1. **Model** (F-150, SuperDuty, Bronco, etc.)
2. **Upfitter** (TSport, Timberline, Alpine, etc.)
3. **Package** (Sportsman, Valor, Anthem, etc.)

## Navigation Integration

### Header Updates
- **Dropdown menu** for manufacturer navigation
- **Vehicle count display** for each manufacturer
- **Hover effects** with smooth transitions
- **Responsive design** that works on all devices

### Breadcrumb System
- **Hierarchical navigation** with proper linking
- **Current page highlighting**
- **Smooth transitions** between pages

## Image Requirements

### Hero Images
- **High-resolution backgrounds** (1920x1080 minimum)
- **Manufacturer-specific imagery** (e.g., `manufacturer-hero-ford.jpg`)
- **Cinematic quality** with good contrast for text overlay

### Vehicle Showcase Images
- **Lifestyle photography** showing vehicles in action
- **High-quality images** (1600x900 minimum)
- **Consistent aspect ratios** for grid layouts

### Gallery Images
- **User-generated content** ready
- **Multiple categories** (Adventure, Work, Lifestyle)
- **Optimized file sizes** for web performance

## Future Enhancements

### Planned Features
1. **Real specification data** integration
2. **User photo upload** functionality
3. **Advanced filtering** and search
4. **Comparison tools** between vehicles
5. **3D model integration** for vehicle visualization
6. **AR/VR experiences** for vehicle customization

### Performance Improvements
1. **Image optimization** with WebP format
2. **Lazy loading** for all images
3. **CDN integration** for faster loading
4. **Caching strategies** for better performance

## Usage

### Adding New Manufacturers
1. Create manufacturer record in Sanity Studio
2. Add vehicles with proper manufacturer references
3. Upload manufacturer logo and hero images
4. Page will automatically generate with new content

### Customizing Content
1. **Hero sections** can be customized per manufacturer
2. **Vehicle grouping** is automatic based on data structure
3. **Specifications** can be extended with new fields
4. **Gallery content** can be managed through CMS

## Technical Notes

### Dependencies
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **Sanity** for content management
- **Heroicons** for iconography
- **Framer Motion** (optional) for advanced animations

### Browser Support
- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile browsers** (iOS Safari, Chrome Mobile)
- **Progressive enhancement** for older browsers

This implementation provides a solid foundation for showcasing manufacturer vehicles with an engaging, modern user experience that can be easily extended and customized.
