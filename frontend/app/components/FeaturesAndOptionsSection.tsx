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
              <div className="grid grid-cols-4 gap-6">
                <div className="group">
                  <div className="border-4 border-black hover:border-orange-600 transition-colors">
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1594279905698-830467b8ea5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mJTIwcmFjayUyMHRydWNrJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYxMDUxOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                        alt="Premium Roof Rack" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="text-sm tracking-tight mb-2">Premium Roof Rack</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">$1,290</span>
                        <button className="text-xs tracking-widest hover:text-orange-600 transition-colors">ADD</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="border-4 border-black hover:border-orange-600 transition-colors">
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1541659065302-78ac59dc1365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGJ1bXBlciUyMGd1YXJkJTIwc3RlZWx8ZW58MXx8fHwxNzYxMDUxOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                        alt="Steel Bull Bar" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="text-sm tracking-tight mb-2">Steel Bull Bar</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">$1,680</span>
                        <button className="text-xs tracking-widest hover:text-orange-600 transition-colors">ADD</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="border-4 border-black hover:border-orange-600 transition-colors">
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1604364477640-2866132697ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWQlMjBsaWdodCUyMGJhciUyMHRydWNrfGVufDF8fHx8MTc2MDk5NTczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                        alt="LED Light Array" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="text-sm tracking-tight mb-2">LED Light Array</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">$890</span>
                        <button className="text-xs tracking-widest hover:text-orange-600 transition-colors">ADD</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="border-4 border-black hover:border-orange-600 transition-colors">
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1591117728047-2dc00780492c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aGVlbHMlMjBhbGxveXxlbnwxfHx8fDE3NjA5NzcxMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                        alt="Forged Wheels" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="text-sm tracking-tight mb-2">Forged Wheels</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">$3,200</span>
                        <button className="text-xs tracking-widest hover:text-orange-600 transition-colors">ADD</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {categories.map(cat => cat.items.length > 0 && (
            <div key={cat.key} data-category={cat.key} className="mb-1.5">
              {/* Collapsible Header */}
              <div
                className={`w-full flex justify-between items-center p-4 font-bold text-md cursor-pointer hover:text-timberline-orange hover:bg-stone-gray-700 focus:outline-none transition-all duration-300 ease-in-out ${
                  open[cat.key] ? 'bg-forest-black/80 text-white' : 'bg-stone-gray/20 text-forest-black'
                }`} 
                onClick={() => toggleCategory(cat.key)}
              >
                <span className={`transition-colors duration-200 ${
                  open[cat.key] ? 'text-timberline-orange' : 'hover:text-white'
                }`}>{cat.label}</span>
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
    </>
  )
}

export default FeaturesAndOptionsSection

