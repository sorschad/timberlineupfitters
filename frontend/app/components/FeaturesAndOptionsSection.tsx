"use client";

import React, { useState } from 'react'

interface Props {
  features: {
    exteriorFeatures?: string[]
    interiorFeatures?: string[]
    safetyFeatures?: string[]
    technologyFeatures?: string[]
    performanceFeatures?: string[]
  }
}

const FeaturesAndOptionsSection: React.FC<Props> = ({ features }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({
    exteriorFeatures: false,
    interiorFeatures: false,
    safetyFeatures: false,
    technologyFeatures: false,
    performanceFeatures: false,
  })

  const toggleCategory = (key: keyof Props['features']) => {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const categories = [
    { key: 'exteriorFeatures' as const, label: 'EXTERIOR FEATURES', items: features.exteriorFeatures || [] },
    { key: 'interiorFeatures' as const, label: 'INTERIOR FEATURES', items: features.interiorFeatures || [] },
    { key: 'safetyFeatures' as const, label: 'SAFETY FEATURES', items: features.safetyFeatures || [] },
    { key: 'technologyFeatures' as const, label: 'TECHNOLOGY FEATURES', items: features.technologyFeatures || [] },
    { key: 'performanceFeatures' as const, label: 'PERFORMANCE FEATURES', items: features.performanceFeatures || [] },
  ]

  return (
    <section className="max-w-4xl mx-auto mt-8 px-4 md:px-8 lg:px-16">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">FEATURES & OPTIONS</h2>
      <div className="w-full max-w-4xl mx-auto">
        {categories.map(cat => cat.items.length > 0 && (
          <div key={cat.key} className="mb-1.5">
            {/* Collapsible Header */}
            <div
              className={`w-full flex justify-between items-center p-4 font-bold text-md cursor-pointer hover:text-timberline-orange hover:bg-stone-gray-700 focus:outline-none transition-colors ${
                open[cat.key] ? 'bg-forest-black/80 text-white' : 'bg-stone-gray/20 text-forest-black'
              }`} 
              onClick={() => toggleCategory(cat.key)}
            >
              <span className="hover:text-white transition-colors">{cat.label}</span>
              <span className="text-xl font-light">
                {open[cat.key] ? '−' : '+'}
              </span>
            </div>
            
            {/* Collapsible Content */}
            {open[cat.key] && (
              <div className="bg-white border border-gray-200">
                {cat.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 ${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex text-xs font-light justify-between items-center">
                      <span className="text-gray-900">{item}</span>
                      <span className="text-gray-600">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesAndOptionsSection

