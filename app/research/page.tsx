"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"

interface Article {
  id: string
  title: string
  file: string
  summary: string
  readTime: string
  topics: string[]
}

interface Category {
  id: string
  title: string
  description: string
  icon: string
  color: string
  articles: Article[]
}

interface ResearchIndex {
  categories: Category[]
  featured?: {
    id: string
    category: string
  }
}

export default function ResearchCenterPage() {
  const [researchData, setResearchData] = useState<ResearchIndex | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTOC, setShowTOC] = useState(false)

  useEffect(() => {
    async function loadResearchIndex() {
      try {
        const response = await fetch("/research/index.json")
        const data = await response.json()
        setResearchData(data)
      } catch (error) {
        console.error("Failed to load research index:", error)
      } finally {
        setLoading(false)
      }
    }
    loadResearchIndex()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="space-y-3 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mx-auto"></div>
            <p className="text-gray-600 text-sm font-medium">Loading articles...</p>
          </div>
        </div>
      </div>
    )
  }

  const totalArticles = researchData?.categories.reduce((sum, cat) => sum + cat.articles.length, 0) || 0

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header - Mobile Optimized */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Research</h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                {totalArticles} expert articles on landscape design
              </p>
            </div>
            <button
              onClick={() => setShowTOC(!showTOC)}
              className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">Contents</span>
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/busch-gardens"
              className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-900 transition hover:border-green-300 hover:bg-green-100"
            >
              Busch Gardens image gallery
            </Link>
            <Link
              href="/images"
              className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950 transition hover:border-amber-300 hover:bg-amber-100"
            >
              All visual references
            </Link>
          </div>
        </div>
      </header>

      {/* Table of Contents Drawer */}
      {showTOC && (
        <div className="fixed inset-0 z-30 bg-black/20" onClick={() => setShowTOC(false)}>
          <div
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Table of Contents</h2>
              <button
                onClick={() => setShowTOC(false)}
                className="rounded-full p-2 hover:bg-gray-100 transition"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4 space-y-6">
              {researchData?.categories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{category.icon}</span>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {category.articles.map((article, index) => (
                      <li key={article.id}>
                        <Link
                          href={`/research/${category.id}/${article.id}`}
                          onClick={() => setShowTOC(false)}
                          className="block py-2 text-sm text-gray-700 hover:text-green-700 font-medium transition"
                        >
                          <span className="text-gray-400 font-mono text-xs mr-2">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Categories as Sections */}
        {researchData?.categories.map((category, categoryIndex) => (
          <section key={category.id} id={category.id} className={categoryIndex > 0 ? "mt-10" : ""}>
            {/* Section Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                  <p className="text-xs text-gray-600 mt-0.5">{category.description}</p>
                </div>
              </div>
            </div>

            {/* Article Grid - Mobile First */}
            <div className="space-y-4">
              {category.articles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/research/${category.id}/${article.id}`}
                  className="block group"
                >
                  <article className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-green-500 hover:shadow-md transition-all active:scale-[0.98]">
                    {/* Article Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                        {article.summary}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="font-medium">{article.readTime}</span>
                        {article.topics && article.topics.length > 0 && (
                          <>
                            <span>·</span>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                              {article.topics.slice(0, 2).map((topic, i) => (
                                <span key={i} className="whitespace-nowrap px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Index Number (subtle) */}
                    <div className="flex-shrink-0 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold group-hover:bg-green-100 group-hover:text-green-700 transition">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Bottom Padding */}
        <div className="h-8"></div>
      </main>
    </div>
  )
}
