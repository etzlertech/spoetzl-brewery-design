"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { MarkdownLoader } from "@/components/research/markdown-viewer"

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
}

export default function ResearchDocumentPage() {
  const params = useParams()
  const [researchData, setResearchData] = useState<ResearchIndex | null>(null)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResearchData() {
      try {
        const response = await fetch("/research/index.json")
        const data = await response.json()
        setResearchData(data)

        const category = data.categories.find((cat: Category) => cat.id === params.category)
        if (category) {
          setCurrentCategory(category)
          const article = category.articles.find((a: Article) => a.id === params.document)
          if (article) {
            setCurrentArticle(article)
          }
        }
      } catch (error) {
        console.error("Failed to load research data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadResearchData()
  }, [params.category, params.document])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="space-y-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading article...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentArticle || !currentCategory) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Article Not Found</h1>
          <p className="text-xl text-gray-600 mb-10">
            The article you're looking for could not be found.
          </p>
          <Link
            href="/research"
            className="inline-block rounded-full bg-green-700 px-8 py-4 font-semibold text-white hover:bg-green-800 transition"
          >
            Back to Research Center
          </Link>
        </div>
      </div>
    )
  }

  const otherArticles = currentCategory.articles.filter(article => article.id !== currentArticle.id)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Article Header Section */}
      <header className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link href="/research" className="text-green-700 hover:text-green-800 font-medium transition">
              Research
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/research" className="text-green-700 hover:text-green-800 font-medium transition">
              {currentCategory.title}
            </Link>
          </nav>

          {/* Category Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
            <span className="text-2xl">{currentCategory.icon}</span>
            <span className="text-sm font-semibold text-green-800 uppercase tracking-wide">
              {currentCategory.title}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {currentArticle.title}
          </h1>

          {/* Article Summary */}
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
            {currentArticle.summary}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="font-medium">{currentArticle.readTime}</span>
            <span>·</span>
            <time>March 2026</time>
            {currentArticle.topics && currentArticle.topics.length > 0 && (
              <>
                <span>·</span>
                <div className="flex gap-2">
                  {currentArticle.topics.map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <MarkdownLoader filePath={currentArticle.file} />
      </main>

      {/* Related Articles Section */}
      {otherArticles.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More in {currentCategory.title}
            </h2>
            <div className="space-y-4">
              {otherArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/research/${currentCategory.id}/${article.id}`}
                  className="group block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-green-500 hover:shadow-md active:scale-[0.98]"
                >
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-green-700 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">{article.readTime}</span>
                    <span className="text-green-700 font-semibold group-hover:translate-x-1 transition">
                      Read →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex gap-3">
          <Link
            href="/research"
            className="flex-1 rounded-full border-2 border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700 active:scale-95"
          >
            ← All Articles
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 rounded-full bg-green-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-800 active:scale-95"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
