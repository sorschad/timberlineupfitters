"use client";

import React, { useState } from 'react'

interface Props {
  features?: {
    baseFeatures?: string[]
    additionalOptions?: string[]
  } | null
}

const FeaturesAndOptionsSection: React.FC<Props> = ({ features }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({
    baseFeatures: true,
    additionalOptions: false,
  })

  const toggleCategory = (key: keyof NonNullable<Props['features']>) => {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Early return if no features are available
  if (!features) {
    return null
  }

  const categories = [
    // { key: 'baseFeatures' as const, label: 'BASE FEATURES', items: features.baseFeatures || [] },
    { key: 'additionalOptions' as const, label: 'ADDITIONAL OPTIONS', items: features.additionalOptions || [] },
  ]

  // Check if any categories have items
  const hasAnyFeatures = categories.some(cat => cat.items.length > 0)
  
  if (!hasAnyFeatures) {
    return null
  }

  return (
    <>
      <section id="features-options-section" className="max-w-5xl mx-auto mb-16">
        <div className="container w-full">
          <div className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-8">
              <h2 className="text-5xl tracking-tighter mb-12 uppercase">Additional Options</h2>
              {features.additionalOptions && features.additionalOptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {features.additionalOptions.map((option, index) => (
                    <div key={index} className="group">
                      <div className="border-4 border-black hover:border-orange-600 transition-colors">
                        <div className="aspect-square bg-neutral-100 overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <div className="text-center p-4">
                              <div className="w-16 h-16 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">Option Available</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <h3 className="text-sm tracking-tight mb-2 font-medium">{option}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.491M15 6.334A7.97 7.97 0 0012 5c-2.34 0-4.29 1.009-5.824 2.491" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Additional Options Available</h3>
                  <p className="text-gray-600">This vehicle comes with all standard features included.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FeaturesAndOptionsSection

 