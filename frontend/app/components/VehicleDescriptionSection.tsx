'use client'

interface Vehicle {
  _id: string
  title: string
  model: string
  brand?: string
  manufacturer: {
    _id: string
    name: string
  }
  features?: {
    baseFeatures?: string[]
  }
}

interface VehicleDescriptionSectionProps {
  vehicle: Vehicle
}

export default function VehicleDescriptionSection({ vehicle }: VehicleDescriptionSectionProps) {
  return (
    <section>
      <div className="bg-brown py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h2 className="text-6xl font-base tracking-tighter mb-6 leading-none uppercase text-timberline-orange">
                {vehicle.manufacturer.name} {vehicle.model} Built by {vehicle.brand}
              </h2>
              <p className="text-xl text-neutral-400 leading-relaxed mb-4">
                Explore our {vehicle.title} vehicle builds. Each build showcases unique configurations designed for specific adventures and work environments.
              </p>
            </div>
            <div>
              <div className="bg-neutral-100/95 p-8 border-l-4 border-timberline-orange">
                <h3 className="text-md tracking-widest mb-6 text-neutral-500">KEY FEATURES</h3>
                {vehicle.features?.baseFeatures && vehicle.features.baseFeatures.length > 0 ? (
                  <ul className="space-y-4">
                    {vehicle.features.baseFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-orange-600 mt-2 flex-shrink-0">
                        </div>
                        <span className="text-lg text-neutral-800">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-neutral-600 italic">
                    Key features will be displayed here once they are added to this vehicle.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
