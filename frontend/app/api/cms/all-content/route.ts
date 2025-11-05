import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

// Comprehensive query for all content types with nested relationships
// This mirrors the vehicle by-slug endpoint structure but fetches all records
// Using GROQ object literal syntax to return multiple document types in one query
const comprehensiveAllContentQuery = `
{
  "vehicles": *[_type == "vehicle" && defined(slug.current)] | order(modelYear desc, title asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    slug,
    model,
    vehicleType,
    modelYear,
    brand,
    trim,
    "manufacturer": manufacturer->{
      _id,
      name,
      logo{
        asset->{
          _id,
          url
        },
        alt
      }
    },
    coverImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    vehicleDetailsPageHeaderBackgroundImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    headerVehicleImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    gallery[]{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt,
      caption,
      isBuildCoverImage,
      isBuildTextSummaryBlock,
      isBuildTextSummaryContent,
      view,
      tags,
      gridSpan
    },
    videoTour{
      url,
      title,
      description
    },
    specifications{
      engine[]{
        type,
        horsepower,
        torque,
        fuelType,
        transmission
      },
      drivetrain,
      bedLength,
      cabStyle,
      towingCapacity,
      payloadCapacity,
      fuelEconomy{
        city,
        highway,
        combined
      }
    },
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
        image{
          asset->{
            _id,
            url
          },
          alt,
          caption
        },
        price,
        availability,
        features,
        tags
      }
    },
    "associatedVehicles": associatedVehicles[0...3]->{
      _id,
      title,
      slug,
      model,
      modelYear,
      brand,
      "manufacturer": manufacturer->{
        _id,
        name
      },
      coverImage{
        asset->{
          _id,
          url
        },
        alt
      },
      excerpt
    },
    customizationOptions[]{
      name,
      description,
      price,
      category,
      isStandard,
      isAvailable
    },
    inventory{
      availability,
      stockNumber,
      vin,
      msrp,
      salePrice,
      location
    },
    description,
    excerpt,
    tags,
    sidebarSortOrder,
    seo{
      title,
      description,
      keywords
    }
  },
  "brands": *[_type == "brand" && defined(slug.current)] | order(name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    "status": select(_originalId in path("drafts.**") => "draft", "published"),
    "name": coalesce(name, "Untitled"),
    "slug": slug.current,
    slogan,
    excerpt,
    description[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          "page": page->slug.current,
          "brand": brand->slug.current
        }
      }
    },
    coverImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    sectionImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    primaryLogo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    secondaryLogo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    website,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    features,
    "launchDate": coalesce(launchDate, _updatedAt),
    sidebarMenuSortOrder,
    "manufacturers": manufacturers[]->{
      _id,
      name,
      "slug": slug.current,
      logo{
        asset->{
          _id,
          url
        },
        alt
      }
    },
    "vehicles": *[_type == "vehicle" && brand == ^.name && defined(slug.current)] | order(modelYear desc, title asc) {
      _id,
      title,
      slug,
      model,
      vehicleType,
      modelYear,
      trim,
      "manufacturer": manufacturer->{
        _id,
        name
      },
      coverImage{
        asset->{
          _id,
          url
        },
        alt
      },
      excerpt
    }
  },
  "manufacturers": *[_type == "manufacturer" && defined(slug.current)] | order(name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    slug,
    logo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    description,
    heroImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    heroTitle,
    heroSubtitle,
    heroCtaText,
    showcaseImages[] {
      model,
      image {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      altText
    },
    galleryImages[] {
      image {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      caption,
      category,
      altText
    },
    ctaTitle,
    ctaDescription,
    ctaStats[] {
      value,
      label
    },
    additionalLinks[] {
      text,
      url
    },
    seoTitle,
    seoDescription,
    seoImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    "vehicles": *[_type == "vehicle" && references(^._id)] {
      _id,
      title,
      slug,
      model,
      vehicleType,
      modelYear,
      upfitter,
      package,
      "manufacturer": manufacturer->{
        _id,
        name
      },
      coverImage{
        asset->{
          _id,
          url
        },
        alt
      }
    } | order(model asc, upfitter asc, package asc)
  },
  "additionalOptions": *[_type == "additionalOption" && defined(slug.current)] | order(sortOrder asc, name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    slug,
    description,
    "manufacturer": manufacturer->{
      _id,
      name,
      logo{
        asset->{
          _id,
          url
        },
        alt
      }
    },
    "brand": brand->{
      _id,
      name,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor
    },
    package,
    image{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt,
      caption
    },
    price{
      amount,
      currency,
      isEstimate
    },
    availability,
    "compatibleVehicles": compatibleVehicles[]->{
      _id,
      title,
      slug,
      model,
      vehicleType,
      modelYear,
      "manufacturer": manufacturer->{
        _id,
        name
      }
    },
    features,
    installation{
      time,
      difficulty,
      notes
    },
    warranty{
      duration,
      coverage,
      notes
    },
    tags,
    isActive,
    sortOrder
  },
  "pages": *[_type == "page"] | order(name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    slug,
    heading,
    subheading,
    heroBackgroundImages[]{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt,
      title,
      subtitle
    },
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        link {
          ...,
          _type == "link" => {
            "page": page->slug.current,
            "brand": brand->slug.current
          }
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "brand": brand->slug.current
            }
          }
        }
      }
    },
    seo{
      title,
      description,
      keywords
    }
  },
  "settings": *[_type == "settings"][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    ...,
    appLogo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    }
  },
  "salesRepresentatives": *[_type == "salesRepresentative"] | order(name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    email,
    phone,
    title,
    photo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    bio,
    territory,
    specialties,
    isActive
  }
}
`

export async function GET(request: NextRequest) {
  try {
    // Fetch all content with comprehensive nested relationships
    const allContent = await client.fetch(comprehensiveAllContentQuery)

    if (!allContent) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch content',
          message: 'No content could be retrieved from Sanity',
          data: null
        },
        { status: 500 }
      )
    }

    // Calculate counts for metadata
    const counts = {
      vehicles: allContent.vehicles?.length || 0,
      brands: allContent.brands?.length || 0,
      manufacturers: allContent.manufacturers?.length || 0,
      additionalOptions: allContent.additionalOptions?.length || 0,
      pages: allContent.pages?.length || 0,
      salesRepresentatives: allContent.salesRepresentatives?.length || 0,
      hasSettings: !!allContent.settings
    }

    return NextResponse.json({
      success: true,
      data: allContent,
      meta: {
        counts,
        timestamp: new Date().toISOString(),
        fetched: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching all content:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch all content',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}

