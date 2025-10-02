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
    { key: 'exteriorFeatures' as const, label: 'Exterior Features', items: features.exteriorFeatures || [] },
    { key: 'interiorFeatures' as const, label: 'Interior Features', items: features.interiorFeatures || [] },
    { key: 'safetyFeatures' as const, label: 'Safety Features', items: features.safetyFeatures || [] },
    { key: 'technologyFeatures' as const, label: 'Technology Features', items: features.technologyFeatures || [] },
    { key: 'performanceFeatures' as const, label: 'Performance Features', items: features.performanceFeatures || [] },
  ]

  return (
    <section className="max-w-4xl mx-auto mt-8 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold mb-4">Features & Options</h2>
        <div className="w-full max-w-4xl mx-auto">
          {categories.map(cat => cat.items.length > 0 && (
            <div key={cat.key} className="mb-4 border rounded">
              <button
                type="button"
                className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                onClick={() => toggleCategory(cat.key)}
              >
                <span className="font-semibold text-lg">{cat.label}</span>
                <span className="text-xl">{open[cat.key] ? '-' : '+'}</span>
              </button>
              {open[cat.key] && (
                <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="px-3 py-2 border rounded text-sm">
                      {item}
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

