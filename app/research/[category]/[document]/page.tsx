"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
  const router = useRouter()
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

        // Find the current category and document
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  if (!currentDoc || !currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Document Not Found</h1>
          <p className="text-gray-700 mb-8">
            The research document you're looking for could not be found.
          </p>
          <Link
            href="/research"
            className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Back to Research Center
          </Link>
        </div>
      </div>
    )
  }

  // Get other documents in the same category
  const otherDocs = currentCategory.documents.filter(doc => doc.id !== currentDoc.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/research" className="text-green-600 hover:text-green-700 font-medium">
            Research Center
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href="/research"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            {currentCategory.title}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">{currentDoc.title}</span>
        </nav>

        {/* Document Header */}
        <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-4xl">{currentCategory.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-600">{currentCategory.title}</p>
              <h1 className="text-3xl font-bold text-green-900">{currentDoc.title}</h1>
            </div>
          </div>
          <p className="text-gray-700">{currentDoc.description}</p>
        </div>

        {/* Document Content */}
        <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
          <MarkdownLoader filePath={currentDoc.file} />
        </div>

        {/* Related Documents */}
        {otherDocs.length > 0 && (
          <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-green-900">
              More in {currentCategory.title}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {otherDocs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/research/${currentCategory.id}/${doc.id}`}
                  className="group rounded-lg border-2 border-gray-200 p-4 transition hover:border-green-500 hover:shadow-md"
                >
                  <h3 className="font-semibold text-green-900 group-hover:text-green-600">
                    {doc.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{doc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Link
            href="/research"
            className="flex-1 rounded-lg border-2 border-green-600 px-6 py-3 text-center font-semibold text-green-600 transition hover:bg-green-50"
          >
            ← Back to Research Center
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-green-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
