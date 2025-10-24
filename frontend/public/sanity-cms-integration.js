/**
 * Sanity CMS Integration for Figma Make
 * This JavaScript file provides easy integration with your Sanity headless CMS
 * for use in Figma Make websites.
 */

class SanityCMS {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || window.location.origin + '/api/cms'
  }

  /**
   * Get content from Sanity CMS
   * @param {string} type - Content type (all, brands, vehicles, manufacturers, homepage, settings)
   * @returns {Promise<Object>} Content data
   */
  async getContent(type = 'all') {
    try {
      const response = await fetch(`${this.baseUrl}/simple?content=${type}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch content:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get all brands
   * @returns {Promise<Object>} Brands data
   */
  async getBrands() {
    return this.getContent('brands')
  }

  /**
   * Get all vehicles
   * @returns {Promise<Object>} Vehicles data
   */
  async getVehicles() {
    return this.getContent('vehicles')
  }

  /**
   * Get all manufacturers
   * @returns {Promise<Object>} Manufacturers data
   */
  async getManufacturers() {
    return this.getContent('manufacturers')
  }

  /**
   * Get homepage content
   * @returns {Promise<Object>} Homepage data
   */
  async getHomepage() {
    return this.getContent('homepage')
  }

  /**
   * Get settings
   * @returns {Promise<Object>} Settings data
   */
  async getSettings() {
    return this.getContent('settings')
  }

  /**
   * Get specific item by type and slug
   * @param {string} type - Item type (brand, vehicle, manufacturer)
   * @param {string} slug - Item slug
   * @returns {Promise<Object>} Item data
   */
  async getItem(type, slug) {
    try {
      const response = await fetch(`${this.baseUrl}/content?type=${type}&slug=${slug}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch item:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get specific brand by slug
   * @param {string} slug - Brand slug
   * @returns {Promise<Object>} Brand data
   */
  async getBrand(slug) {
    return this.getItem('brand', slug)
  }

  /**
   * Get specific vehicle by slug
   * @param {string} slug - Vehicle slug
   * @returns {Promise<Object>} Vehicle data
   */
  async getVehicle(slug) {
    return this.getItem('vehicle', slug)
  }

  /**
   * Get specific manufacturer by slug
   * @param {string} slug - Manufacturer slug
   * @returns {Promise<Object>} Manufacturer data
   */
  async getManufacturer(slug) {
    return this.getItem('manufacturer', slug)
  }

  /**
   * Get paginated content
   * @param {string} type - Content type
   * @param {number} limit - Number of items per page
   * @param {number} offset - Number of items to skip
   * @returns {Promise<Object>} Paginated content data
   */
  async getPaginatedContent(type, limit = 10, offset = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/content?type=${type}&limit=${limit}&offset=${offset}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch paginated content:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Search content by query
   * @param {string} query - Search query
   * @param {string} type - Content type to search in
   * @returns {Promise<Object>} Search results
   */
  async searchContent(query, type = 'all') {
    try {
      // This would require a search endpoint to be implemented
      // For now, we'll filter client-side
      const allContent = await this.getContent(type)
      if (!allContent.success) return allContent

      const searchResults = {}
      const searchTerm = query.toLowerCase()

      Object.keys(allContent.content).forEach(key => {
        if (Array.isArray(allContent.content[key])) {
          searchResults[key] = allContent.content[key].filter(item => {
            return Object.values(item).some(value => 
              typeof value === 'string' && value.toLowerCase().includes(searchTerm)
            )
          })
        }
      })

      return {
        success: true,
        content: searchResults,
        query,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to search content:', error)
      return { success: false, error: error.message }
    }
  }
}

// Create global instance
window.SanityCMS = SanityCMS

// Auto-initialize with default settings
window.sanityCMS = new SanityCMS()

// Usage examples (commented out to avoid execution)
/*
// Get all content
sanityCMS.getContent('all').then(data => {
  console.log('All content:', data)
})

// Get brands only
sanityCMS.getBrands().then(data => {
  console.log('Brands:', data.content.brands)
})

// Get specific brand
sanityCMS.getBrand('brand-slug').then(data => {
  console.log('Brand details:', data.data)
})

// Search content
sanityCMS.searchContent('truck').then(data => {
  console.log('Search results:', data)
})
*/

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SanityCMS
}
