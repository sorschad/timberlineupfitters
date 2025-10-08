"use client";

import React, { useState } from 'react'

interface Props {
  features?: {
    exteriorFeatures?: string[]
    interiorFeatures?: string[]
    safetyFeatures?: string[]
    technologyFeatures?: string[]
    performanceFeatures?: string[]
  } | null
}

const FeaturesAndOptionsSection: React.FC<Props> = ({ features }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({
    exteriorFeatures: true,
    interiorFeatures: false,
    safetyFeatures: false,
    technologyFeatures: false,
    performanceFeatures: false,
  })

  const toggleCategory = (key: keyof NonNullable<Props['features']>) => {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Early return if no features are available
  if (!features) {
    return null
  }

  const categories = [
    { key: 'exteriorFeatures' as const, label: 'EXTERIOR FEATURES', items: features.exteriorFeatures || [] },
    { key: 'interiorFeatures' as const, label: 'INTERIOR FEATURES', items: features.interiorFeatures || [] },
    { key: 'safetyFeatures' as const, label: 'SAFETY FEATURES', items: features.safetyFeatures || [] },
    { key: 'technologyFeatures' as const, label: 'TECHNOLOGY FEATURES', items: features.technologyFeatures || [] },
    { key: 'performanceFeatures' as const, label: 'PERFORMANCE FEATURES', items: features.performanceFeatures || [] },
  ]

  // Check if any categories have items
  const hasAnyFeatures = categories.some(cat => cat.items.length > 0)
  
  if (!hasAnyFeatures) {
    return null
  }

  return (
    <section id="features-options-section" className="max-w-5xl mx-auto mb-16">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">
        FEATURES & OPTIONS
      </h2>
      <div className="w-full max-w-4xl mx-auto">
        {categories.map(cat => cat.items.length > 0 && (
          <div key={cat.key} className="mb-1.5">
            {/* Collapsible Header */}
            <div
              className={`w-full flex justify-between items-center p-4 font-bold text-md cursor-pointer hover:text-timberline-orange hover:bg-stone-gray-700 focus:outline-none transition-all duration-300 ease-in-out ${
                open[cat.key] ? 'bg-forest-black/80 text-white' : 'bg-stone-gray/20 text-forest-black'
              }`} 
              onClick={() => toggleCategory(cat.key)}
            >
              <span className="hover:text-white transition-colors duration-200">{cat.label}</span>
              <span className={`text-xl font-light transition-transform duration-300 ease-in-out ${
                open[cat.key] ? 'rotate-180' : 'rotate-0'
              }`}>
                {open[cat.key] ? '−' : '+'}
              </span>
            </div>
            
            {/* Collapsible Content */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                open[cat.key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-white border border-gray-200">
                {cat.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-gray-100 ${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                    style={{
                      animationDelay: open[cat.key] ? `${idx * 50}ms` : '0ms',
                      animation: open[cat.key] ? 'fadeInUp 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    <div className="flex text-xs font-light justify-between items-center">
                      <span className="text-gray-900">{item}</span>
                      <span className="text-gray-600">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesAndOptionsSection

