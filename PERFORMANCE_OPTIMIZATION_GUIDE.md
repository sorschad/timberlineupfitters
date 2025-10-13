# Performance Optimization Guide

This guide outlines the responsive image optimizations and performance improvements implemented in the Timberline Upfitters application.

## 🚀 Image Optimization Features

### 1. Responsive Image Utilities (`/sanity/lib/imageUtils.ts`)

#### Predefined Size Configurations
- **Hero Images**: Full-width hero sections
- **Gallery Images**: Masonry and grid layouts
- **Card Images**: 3-column card layouts
- **Content Images**: Single-column content areas
- **Thumbnail Images**: Small preview images
- **Logo Images**: Brand logos and icons
- **Two Column**: Side-by-side layouts

#### Responsive Breakpoints
```typescript
const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  large: 1280,
  xlarge: 1536,
}
```

### 2. Enhanced Image Components

#### LazyImage Component
- ✅ Intersection Observer for lazy loading
- ✅ Responsive `sizes` attribute
- ✅ Priority loading support
- ✅ Smooth loading transitions
- ✅ Error handling

#### ResponsiveImage Component
- ✅ Layout-specific size presets
- ✅ Automatic optimal dimension calculation
- ✅ Device pixel ratio awareness
- ✅ Error state handling
- ✅ Convenience components for common layouts

#### CoverImage Component
- ✅ Sanity CMS integration
- ✅ Responsive sizing
- ✅ Priority loading support

### 3. Updated Components with Optimizations

#### VehicleGallery
- ✅ Added `sizes` attribute for responsive images
- ✅ Optimized for masonry layout

#### VehicleFeaturesGallery
- ✅ Two-column layout optimization
- ✅ Interactive hotspot images

#### Brands Component
- ✅ Card layout optimization
- ✅ Logo image optimization

## 🎨 Tailwind CSS Optimizations

### Enhanced Responsive Breakpoints
```typescript
screens: {
  'xs': '475px',   // Extra small devices
  'sm': '640px',   // Small devices
  'md': '768px',   // Medium devices
  'lg': '1024px',  // Large devices
  'xl': '1280px',  // Extra large devices
  '2xl': '1536px', // 2X large devices
}
```

### Performance Features
- ✅ Optimized container queries
- ✅ Enhanced spacing scale
- ✅ Aspect ratio utilities
- ✅ Core plugin optimization
- ✅ Future-ready hover support

## ⚡ Next.js Configuration

### Image Optimization Settings
```typescript
images: {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
}
```

## 📱 Responsive Image Implementation

### Using the Enhanced Components

#### Basic Responsive Image
```tsx
import ResponsiveImage from '@/app/components/ResponsiveImage'

<ResponsiveImage
  src="/path/to/image.jpg"
  alt="Description"
  layout="gallery"
  width={800}
  height={600}
/>
```

#### Layout-Specific Components
```tsx
import { HeroImage, GalleryImage, CardImage } from '@/app/components/ResponsiveImage'

<HeroImage src="/hero.jpg" alt="Hero" priority />
<GalleryImage src="/gallery.jpg" alt="Gallery" />
<CardImage src="/card.jpg" alt="Card" />
```

#### LazyImage with Custom Sizes
```tsx
import LazyImage from '@/app/components/LazyImage'

<LazyImage
  src="/image.jpg"
  alt="Description"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isAboveFold}
/>
```

### Size Attribute Examples

#### Gallery Layout
```tsx
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
```

#### Hero Layout
```tsx
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
```

#### Card Layout
```tsx
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

## 🔧 Best Practices

### 1. Image Sizing
- Use appropriate `sizes` attributes for each layout
- Consider device pixel ratio for crisp images
- Implement lazy loading for below-the-fold images
- Use priority loading for above-the-fold images

### 2. Performance
- Leverage WebP and AVIF formats
- Implement proper caching strategies
- Use intersection observers for lazy loading
- Optimize image dimensions based on container size

### 3. Accessibility
- Always provide meaningful alt text
- Use proper semantic HTML
- Ensure images are keyboard accessible
- Test with screen readers

### 4. SEO
- Use descriptive alt attributes
- Implement structured data for images
- Optimize image file names
- Consider image sitemaps

## 📊 Performance Benefits

### Before Optimization
- ❌ No responsive image sizing
- ❌ Missing `sizes` attributes
- ❌ Inefficient image loading
- ❌ No lazy loading optimization

### After Optimization
- ✅ Responsive images with proper sizing
- ✅ Optimized loading based on viewport
- ✅ Lazy loading with intersection observer
- ✅ Priority loading for critical images
- ✅ Error handling and fallbacks
- ✅ Device pixel ratio awareness

## 🚀 Usage Examples

### Gallery Section
```tsx
<div className="columns-1 md:columns-2 lg:columns-3 gap-6">
  {images.map((image) => (
    <LazyImage
      key={image.id}
      src={image.src}
      alt={image.alt}
      fill
      sizes={IMAGE_SIZES.gallery}
      aspectClass="aspect-[4/3]"
    />
  ))}
</div>
```

### Hero Section
```tsx
<HeroImage
  src={heroImage.src}
  alt={heroImage.alt}
  fill
  priority
  className="object-cover"
/>
```

### Card Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {cards.map((card) => (
    <CardImage
      key={card.id}
      src={card.image}
      alt={card.title}
      width={400}
      height={300}
    />
  ))}
</div>
```

## 🔍 Monitoring and Testing

### Performance Testing
- Use Lighthouse for performance audits
- Test on various devices and network conditions
- Monitor Core Web Vitals
- Check image loading performance

### Tools
- Chrome DevTools Network tab
- Lighthouse Performance audit
- WebPageTest for detailed analysis
- GTmetrix for performance insights

This optimization ensures that your site loads the most appropriate image size for each user's device and screen size, significantly improving performance and user experience.
