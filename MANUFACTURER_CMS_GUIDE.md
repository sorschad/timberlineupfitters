# Manufacturer CMS Management Guide

This guide explains how to manage all images and content for manufacturer detail pages through the Sanity Studio.

## Overview

The manufacturer schema has been enhanced with comprehensive fields to manage all aspects of the manufacturer detail pages, including hero sections, vehicle showcases, galleries, and call-to-action sections.

## Schema Fields

### Basic Information
- **Manufacturer Name**: The official manufacturer name (e.g., "Ford", "Ram", "Jeep")
- **Slug**: URL-friendly version of the name (auto-generated)
- **Logo**: Manufacturer logo image
- **Description**: General description of the manufacturer

### Hero Section Fields

#### Hero Background Image
- **Field**: `heroImage`
- **Type**: Image
- **Required**: Yes
- **Description**: Full-screen background image for the hero section
- **Recommended Size**: 1920x1080px or higher
- **Usage**: This image appears as the parallax background in the hero section

#### Hero Content
- **Hero Title** (`heroTitle`): Custom title for the hero section
  - If empty, defaults to manufacturer name
  - Example: "Ford: Built for Every Adventure"
  
- **Hero Subtitle** (`heroSubtitle`): Subtitle text displayed in hero
  - If empty, falls back to description
  - Example: "Explore our range of vehicles designed for every adventure."
  
- **Hero CTA Button Text** (`heroCtaText`): Text for the main call-to-action button
  - Default: "Explore Vehicles"

### Vehicle Showcase Images

#### Showcase Images Array (`showcaseImages`)
- **Type**: Array of objects
- **Purpose**: Background images for each vehicle model showcase section
- **Fields per item**:
  - **Vehicle Model** (`model`): The vehicle model name (e.g., "F-150", "SuperDuty", "Bronco")
  - **Background Image** (`image`): High-quality lifestyle image for this model
  - **Alt Text** (`altText`): Accessibility description

**Usage Example**:
```
Model: F-150
Image: [High-res image of F-150 in action]
Alt Text: "Ford F-150 truck in rugged terrain"

Model: SuperDuty  
Image: [High-res image of SuperDuty at worksite]
Alt Text: "Ford SuperDuty truck at construction site"
```

### Gallery Section

#### Gallery Images Array (`galleryImages`)
- **Type**: Array of objects
- **Purpose**: Images for the "In the Wild" gallery section
- **Fields per item**:
  - **Image** (`image`): Gallery image
  - **Caption** (`caption`): Text displayed on hover
  - **Category** (`category`): One of: "adventure", "work", "lifestyle"
  - **Alt Text** (`altText`): Accessibility description

**Category Guidelines**:
- **Adventure**: Off-road, outdoor activities, recreational use
- **Work**: Construction sites, commercial use, professional applications
- **Lifestyle**: Family use, daily driving, personal transportation

### Call-to-Action Section

#### CTA Content
- **CTA Title** (`ctaTitle`): Main title for CTA section
  - Default: "Ready to Find Your [Manufacturer]?"
  
- **CTA Description** (`ctaDescription`): Description text for CTA section
  - If empty, uses default description with vehicle count

#### CTA Statistics (`ctaStats`)
- **Type**: Array of objects
- **Purpose**: Statistics displayed in the CTA section
- **Fields per item**:
  - **Value** (`value`): The statistic value (e.g., "15", "100%", "24/7")
  - **Label** (`label`): The statistic label (e.g., "Available Packages", "Custom Built", "Support")

**Default Statistics**:
```
Value: "15" | Label: "Available Packages"
Value: "100%" | Label: "Custom Built"  
Value: "24/7" | Label: "Support"
```

#### Additional Links (`additionalLinks`)
- **Type**: Array of objects
- **Purpose**: Links displayed in CTA section footer
- **Fields per item**:
  - **Link Text** (`text`): Display text for the link
  - **URL** (`url`): Destination URL

**Default Links**:
```
Text: "Financing Options" | URL: "/financing"
Text: "Warranty Info" | URL: "/warranty"
Text: "Service & Support" | URL: "/service"
Text: "Accessories" | URL: "/accessories"
```

### SEO Fields

#### SEO Optimization
- **SEO Title** (`seoTitle`): Custom page title for search engines
  - If empty, uses "Manufacturer Name Vehicles"
  
- **SEO Description** (`seoDescription`): Meta description for search engines
  - If empty, uses manufacturer description
  
- **SEO Image** (`seoImage`): Image for social media sharing
  - Used for Open Graph and Twitter cards

## Content Management Workflow

### 1. Setting Up a New Manufacturer

1. **Create Manufacturer Record**:
   - Add manufacturer name and description
   - Upload logo image
   - Set slug (auto-generated)

2. **Configure Hero Section**:
   - Upload high-quality hero background image
   - Set custom hero title and subtitle
   - Customize CTA button text

3. **Add Vehicle Showcase Images**:
   - For each vehicle model, add a showcase image entry
   - Use high-resolution lifestyle images
   - Ensure images match the vehicle models in your data

4. **Populate Gallery**:
   - Add gallery images with captions and categories
   - Use a mix of adventure, work, and lifestyle images
   - Ensure high image quality for best presentation

5. **Configure CTA Section**:
   - Set custom CTA title and description
   - Add or modify statistics
   - Update additional links as needed

6. **Optimize for SEO**:
   - Set custom SEO title and description
   - Upload SEO image for social sharing

### 2. Image Requirements

#### Hero Background Image
- **Dimensions**: 1920x1080px minimum
- **Format**: JPG or PNG
- **Content**: High-quality lifestyle image showing manufacturer vehicles
- **Style**: Cinematic, professional photography

#### Vehicle Showcase Images
- **Dimensions**: 1600x900px minimum
- **Format**: JPG or PNG
- **Content**: Model-specific lifestyle images
- **Style**: Action shots, professional photography

#### Gallery Images
- **Dimensions**: 800x600px minimum (will be displayed in masonry layout)
- **Format**: JPG or PNG
- **Content**: Real-world usage scenarios
- **Style**: User-generated or professional lifestyle photography

#### SEO Image
- **Dimensions**: 1200x630px (Open Graph standard)
- **Format**: JPG or PNG
- **Content**: Brand-appropriate image for social sharing

### 3. Content Guidelines

#### Hero Section
- **Title**: Keep under 60 characters for best display
- **Subtitle**: 1-2 sentences, focus on value proposition
- **CTA Text**: Action-oriented, 2-4 words

#### Gallery Captions
- **Length**: 3-8 words
- **Tone**: Inspiring, action-oriented
- **Examples**: "Conquering mountain trails", "Built for the toughest jobs"

#### CTA Statistics
- **Values**: Use numbers, percentages, or time references
- **Labels**: Keep under 20 characters
- **Focus**: Highlight key selling points

## Technical Implementation

### Automatic Fallbacks
The system includes intelligent fallbacks:
- If hero title is empty → uses manufacturer name
- If hero subtitle is empty → uses description
- If showcase images are missing → uses default image paths
- If gallery images are missing → shows placeholder content
- If CTA content is missing → uses default content

### Image Optimization
- All images are automatically optimized by Next.js
- Responsive images with multiple sizes
- Lazy loading for better performance
- WebP format when supported

### Content Updates
- Changes in Sanity Studio are reflected immediately
- No code changes required for content updates
- Preview mode available for draft content

## Best Practices

### Image Selection
1. **High Quality**: Use professional photography when possible
2. **Consistent Style**: Maintain visual consistency across all images
3. **Relevant Content**: Ensure images match the manufacturer's brand
4. **Diverse Scenarios**: Show various use cases and environments

### Content Writing
1. **Concise**: Keep text brief and impactful
2. **Action-Oriented**: Use active voice and compelling language
3. **Brand Consistent**: Match manufacturer's tone and style
4. **SEO Friendly**: Include relevant keywords naturally

### Performance
1. **Optimize Images**: Compress images before uploading
2. **Appropriate Sizes**: Use recommended dimensions
3. **Alt Text**: Always provide descriptive alt text for accessibility
4. **Categories**: Use consistent categorization for gallery images

This comprehensive CMS setup allows complete control over manufacturer detail pages without requiring any code changes for content updates.
