type TeamMember = {
  name: string
  title: string
  photoUrl: string
}

type TeamSectionProps = {
  heading?: string
  description?: string
  seeMoreHref?: string
  members?: TeamMember[]
}

const defaultMembers: TeamMember[] = [
  {name: 'Eduard Franz', title: 'Founder & CEO', photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop'},
  {name: 'Isobel Fuller', title: 'Co‑Founder & COO', photoUrl: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop'},
  {name: 'Ashwin Santiago', title: 'CTO', photoUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop'},
  {name: 'Drew Cano', title: 'Lead Product Designer', photoUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?q=80&w=800&auto=format&fit=crop'},
  {name: 'Jonathan Kelly', title: 'Lead Product Engineer', photoUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800&auto=format&fit=crop'},
  {name: 'Nic Fassbender', title: 'Product Engineer', photoUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop'},
  {name: 'Genevieve Mclean', title: 'Product Engineer', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop'},
  {name: 'Harry Bender', title: 'Product Engineer', photoUrl: 'https://images.unsplash.com/photo-1544005316-04ae1f6c9d34?q=80&w=800&auto=format&fit=crop'},
  {name: 'Nicolas Trevino', title: 'Product Designer', photoUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop'},
  {name: 'Bailey Richards', title: 'Community Manager', photoUrl: 'https://images.unsplash.com/photo-1544005316-04ae1f6c9d34?q=80&w=800&auto=format&fit=crop'},
  {name: 'Zaid Schwartz', title: 'Marketing', photoUrl: 'https://images.unsplash.com/photo-1546456073-6712f79251bb?q=80&w=800&auto=format&fit=crop'},
]

export default function TeamSection({
  heading = 'Meet the Team',
  description = "We're a world‑class team of product builders passionate about creating innovative experiences.",
  seeMoreHref,
  members = defaultMembers,
}: TeamSectionProps) {
  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{heading}</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">{description}</p>
          </div>
          {seeMoreHref ? (
            <a href={seeMoreHref} className="hidden sm:inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition">
              See more
              <span aria-hidden>→</span>
            </a>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m, idx) => (
            <figure key={`${m.name}-${idx}`} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100">
                <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
              </div>
              <figcaption className="mt-3">
                <div className="font-semibold text-gray-900">{m.name}</div>
                <div className="text-xs text-gray-500">{m.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}


