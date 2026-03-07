import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Navbar } from '@/components/layout/navbar'
import { getSkill, getAllSkillSlugs } from '@/lib/skills'

// Static generation: Generate pages for all skills at build time
export async function generateStaticParams() {
  const slugs = await getAllSkillSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// Generate metadata for each skill
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const skill = await getSkill(params.slug)

  if (!skill) {
    return {
      title: 'Skill Not Found',
    }
  }

  return {
    title: `${skill.metadata.title || skill.slug} | Skills`,
    description: skill.metadata.description || 'FlowStar workflow skill',
  }
}

export default async function SkillPage({ params }: { params: { slug: string } }) {
  // Security: getSkill() handles slug sanitization and path traversal prevention
  const skill = await getSkill(params.slug)

  // 404 if skill not found
  if (!skill) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-green-700">
            Dashboard
          </Link>
          <span className="mx-2">→</span>
          <Link href="/skills" className="hover:text-green-700">
            Skills
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-900">{skill.metadata.title || skill.slug}</span>
        </nav>

        {/* Skill Header */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-bold text-green-900">
            {skill.metadata.title || skill.slug}
          </h1>
          {skill.metadata.description && (
            <p className="mt-2 text-lg text-gray-700">{skill.metadata.description}</p>
          )}

          {/* Metadata */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            {skill.metadata.category && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                Category: {skill.metadata.category}
              </span>
            )}
            {skill.metadata.version && (
              <span className="rounded-full bg-gray-100 px-3 py-1">
                v{skill.metadata.version}
              </span>
            )}
            {skill.metadata.status && (
              <span
                className={`rounded-full px-3 py-1 ${
                  skill.metadata.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {skill.metadata.status}
              </span>
            )}
          </div>

          {/* Tags */}
          {skill.metadata.tags && skill.metadata.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skill.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Phases */}
          {skill.metadata.phases && skill.metadata.phases.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">Applicable Phases:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {skill.metadata.phases.map((phase) => (
                  <span
                    key={phase}
                    className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700"
                  >
                    {phase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project Types */}
          {skill.metadata.project_types && skill.metadata.project_types.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">Project Types:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {skill.metadata.project_types.map((type) => (
                  <span
                    key={type}
                    className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-700"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skill Content */}
        <div className="prose prose-lg max-w-none rounded-xl bg-white p-8 shadow-lg prose-headings:text-green-900 prose-a:text-green-600 prose-code:text-green-700 prose-pre:bg-gray-900 prose-pre:text-gray-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{skill.content}</ReactMarkdown>
        </div>

        {/* Back to Skills */}
        <div className="mt-8 text-center">
          <Link
            href="/skills"
            className="inline-block rounded-lg bg-green-700 px-6 py-3 text-white shadow-lg transition hover:bg-green-800"
          >
            ← Back to All Skills
          </Link>
        </div>
      </main>
    </div>
  )
}
