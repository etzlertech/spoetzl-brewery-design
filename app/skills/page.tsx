import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { getSkillsByCategory } from '@/lib/skills'

export const metadata = {
  title: 'FlowStar Skills System | Spoetzl Brewery Design',
  description: 'Project workflow and management skills for landscape design projects',
}

export default async function SkillsPage() {
  const categories = await getSkillsByCategory()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-900">Project Workflow System</h1>
          <p className="mt-2 text-lg text-gray-700">
            FlowStar-inspired skills for managing landscape design projects
          </p>
          <p className="mt-2 text-gray-600">
            These skills guide workflow through 9 phases across 5 arcs: Discover → Define → Deliver → Land → Learn
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Start</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/skills/dual-system-guide"
              className="rounded-lg border-2 border-green-200 bg-green-50 p-4 transition hover:border-green-400 hover:bg-green-100"
            >
              <h3 className="font-semibold text-green-900">📘 Dual System Guide</h3>
              <p className="mt-1 text-sm text-gray-700">
                Understand SOFTWARE vs PHYSICAL projects
              </p>
            </Link>
            <Link
              href="/skills/quick-start"
              className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 transition hover:border-blue-400 hover:bg-blue-100"
            >
              <h3 className="font-semibold text-blue-900">⚡ Quick Start</h3>
              <p className="mt-1 text-sm text-gray-700">
                Fast reference for common workflows
              </p>
            </Link>
            <Link
              href="/skills/readme"
              className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 transition hover:border-purple-400 hover:bg-purple-100"
            >
              <h3 className="font-semibold text-purple-900">📖 Full Documentation</h3>
              <p className="mt-1 text-sm text-gray-700">
                Complete system overview and philosophy
              </p>
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category.id} className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                <p className="mt-1 text-gray-600">{category.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.skills.map((skill) => (
                  <Link
                    key={skill.slug}
                    href={`/skills/${skill.slug}`}
                    className="group rounded-lg border border-gray-200 p-4 transition hover:border-green-500 hover:bg-green-50"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                      {skill.metadata.title || skill.slug}
                    </h3>
                    {skill.metadata.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {skill.metadata.description}
                      </p>
                    )}
                    {skill.metadata.tags && skill.metadata.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {skill.metadata.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* About FlowStar */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-purple-900">About FlowStar</h2>
          <p className="mt-2 text-gray-700">
            FlowStar is a project management framework that guides work through 9 phases across 5 arcs.
            Every decision is held up to the "north star" - the outcome that matters - preventing scope
            creep, drift, and misalignment.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <div className="rounded-lg bg-white p-3">
              <div className="text-sm font-semibold text-purple-700">Discover</div>
              <div className="text-xs text-gray-600">Sense → Validate</div>
            </div>
            <div className="rounded-lg bg-white p-3">
              <div className="text-sm font-semibold text-blue-700">Define</div>
              <div className="text-xs text-gray-600">Specify → Scope</div>
            </div>
            <div className="rounded-lg bg-white p-3">
              <div className="text-sm font-semibold text-green-700">Deliver</div>
              <div className="text-xs text-gray-600">Build → Verify</div>
            </div>
            <div className="rounded-lg bg-white p-3">
              <div className="text-sm font-semibold text-orange-700">Land</div>
              <div className="text-xs text-gray-600">Ship → Adopt</div>
            </div>
            <div className="rounded-lg bg-white p-3">
              <div className="text-sm font-semibold text-red-700">Learn</div>
              <div className="text-xs text-gray-600">Measure</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
