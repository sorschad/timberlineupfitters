'use client'

import { Orbitron, Lato } from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
})

type TeamMember = {
  name: string
  title: string
  location: string
  imageUrl?: string
}

type TimberlineTeamProps = {
  heading?: string
  teamMembers?: TeamMember[]
}

const defaultTeamMembers: TeamMember[] = [
  {
    name: 'Don Richmond',
    title: 'Founder & CEO',
    location: 'Georgia, USA',
    imageUrl: '/images/team-don-richmond.jpg'
  },
  {
    name: 'Adam Richmond',
    title: 'Managing Partner',
    location: 'Georgia, USA',
    imageUrl: '/images/team-adam-richmond.jpg'
  },
  {
    name: 'Mike Cormack',
    title: 'Sales Representative',
    location: 'North Carolina, USA',
    imageUrl: '/images/team-mike-cormack.jpg'
  },
  {
    name: 'Brandon Hardaman',
    title: 'Sales Representative',
    location: 'Georgia, USA',
    imageUrl: '/images/team-brandon-hardaman.jpg'
  },
  {
    name: 'Randy Shrewsbury',
    title: 'Sales Director',
    location: 'Georgia, USA',
    imageUrl: '/images/team-randy-shrewsbury.jpg'
  },
  {
    name: 'Ross Guilbeau',
    title: 'Sales Director',
    location: 'Georgia, USA',
    imageUrl: '/images/team-ross-guilbeau.jpg'
  }
]

export default function TimberlineTeam({ 
  heading = 'THE TIMBERLINE TEAM', 
  teamMembers = defaultTeamMembers 
}: TimberlineTeamProps) {
  return (
    <section className="relative py-16 lg:py-24 bg-gray-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className={`${orbitron.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-[#ff8c42] uppercase tracking-wide mb-4`}>
            {heading}
          </h2>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
          {teamMembers.map((member, index) => (
            <div 
              key={member.name}
              className="flex flex-col items-center text-center group"
            >
              {/* Profile Image */}
              <div className="relative mb-4">
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#ff8c42] to-[#d4852b] p-0.5 group-hover:scale-105 transition-transform duration-300">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-1">
                <h3 className={`${lato.className} text-base md:text-lg lg:text-sm font-bold text-gray-900 group-hover:text-[#ff8c42] transition-colors duration-300`}>
                  {member.name}
                </h3>
                <p className={`${lato.className} text-sm md:text-sm lg:text-xs font-medium text-gray-700`}>
                  {member.title}
                </p>
                <p className={`${lato.className} text-xs lg:text-xs text-gray-500`}>
                  {member.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Description */}
        <div className="text-center mt-12 lg:mt-16">
          <p className={`${lato.className} text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed`}>
            Our dedicated team brings decades of combined experience in automotive engineering, 
            design, and customer service to deliver exceptional upfitting solutions.
          </p>
        </div>
      </div>
    </section>
  )
}
