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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header - Mobile Optimized */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Research</h1>
          <p className="mt-1 text-sm text-gray-600">
            Expert insights on landscape design
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Categories as Sections */}
        {researchData?.categories.map((category, categoryIndex) => (
          <section key={category.id} className={categoryIndex > 0 ? "mt-10" : ""}>
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
