"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { MarkdownLoader } from "@/components/research/markdown-viewer"

interface Document {
  id: string
  title: string
  file: string
  description: string
}

interface Category {
  id: string
  title: string
  description: string
  icon: string
  color: string
  documents: Document[]
}

interface ResearchIndex {
  categories: Category[]
}

export default function ResearchDocumentPage() {
  const params = useParams()
  const [researchData, setResearchData] = useState<ResearchIndex | null>(null)
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null)
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
          const doc = category.documents.find((d: Document) => d.id === params.document)
          if (doc) {
            setCurrentDoc(doc)
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

  if (!currentDoc || !currentCategory) {
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

  const otherDocs = currentCategory.documents.filter(doc => doc.id !== currentDoc.id)

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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {currentDoc.title}
          </h1>

          {/* Article Description */}
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            {currentDoc.description}
          </p>

          {/* Metadata */}
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <time>March 2026</time>
            <span>·</span>
            <span>Research Article</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <MarkdownLoader filePath={currentDoc.file} />
      </main>

      {/* Related Articles Section */}
      {otherDocs.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              More in {currentCategory.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {otherDocs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/research/${currentCategory.id}/${doc.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-green-500 hover:shadow-lg"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition">
                    {doc.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{doc.description}</p>
                  <div className="mt-4 flex items-center text-green-700 font-semibold text-sm">
                    Read article
                    <svg className="ml-2 h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 py-8">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 flex gap-4">
          <Link
            href="/research"
            className="flex-1 rounded-full border-2 border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
          >
            ← Research Center
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 rounded-full bg-green-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-green-800"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
