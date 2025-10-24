'use client'

import Image from 'next/image'

interface Vehicle {
  _id: string
  title: string
}

interface WarrantyDetailsComponentProps {
  vehicle: Vehicle
}

export default function WarrantyDetailsComponent({ vehicle }: WarrantyDetailsComponentProps) {
  const warrantyFeatures = [
    {
      icon: "shield-check",
      title: "Comprehensive Coverage",
      description: "Full protection for all vehicle components and modifications",
      details: "Covers engine, transmission, suspension, and all custom modifications"
    },
    {
      icon: "clock",
      title: "Extended Warranty",
      description: "Extended coverage beyond standard manufacturer warranty",
      details: "Up to 5 years or 100,000 miles of comprehensive protection"
    },
    {
      icon: "wrench",
      title: "Service Network",
      description: "Nationwide service network with certified technicians",
      details: "Over 500 authorized service centers across the United States"
    },
    {
      icon: "truck",
      title: "Roadside Assistance",
      description: "24/7 roadside assistance and towing coverage",
      details: "Unlimited towing, jump starts, tire changes, and emergency fuel delivery"
    }
  ]

  const coverageItems = [
    "Engine & Transmission",
    "Suspension & Steering",
    "Electrical Systems",
    "Custom Modifications",
    "Paint & Body Work",
    "Interior Components",
    "Audio & Navigation",
    "Safety Systems"
  ]

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-timberline-orange/10 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-timberline-orange rounded-full"></div>
            <span className="text-timberline-orange text-sm font-medium tracking-wider uppercase">Warranty</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Comprehensive Coverage
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your {vehicle.title} is backed by our industry-leading warranty program, 
            ensuring peace of mind for every mile of your journey.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="grid gap-6">
              {warrantyFeatures.map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-timberline-orange/20">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-timberline-orange/10 rounded-xl flex items-center justify-center group-hover:bg-timberline-orange group-hover:scale-110 transition-all duration-300">
                        <svg 
                          className="w-7 h-7 text-timberline-orange group-hover:text-white transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          {feature.icon === "shield-check" && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          )}
                          {feature.icon === "clock" && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                          {feature.icon === "wrench" && (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </>
                          )}
                          {feature.icon === "truck" && (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1a1 1 0 001-1v-3a1 1 0 00-1-1h-1a1 1 0 00-1 1v3z" />
                            </>
                          )}
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-timberline-orange transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {feature.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {feature.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Coverage Details */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-timberline-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-timberline-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">What&apos;s Covered</h3>
              <p className="text-gray-600">Complete protection for your investment</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {coverageItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-timberline-orange/5 transition-colors">
                  <div className="w-2 h-2 bg-timberline-orange rounded-full flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-timberline-orange/10 to-orange-100 rounded-2xl p-6">
              <div className="text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Warranty Terms</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-gray-900 ml-2">5 Years</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold text-gray-900 ml-2">100,000 Miles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-timberline-orange to-orange-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Contact our warranty specialists to learn more about comprehensive coverage options for your {vehicle.title}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-timberline-orange px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg">
              Get Warranty Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-timberline-orange transition-colors">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
