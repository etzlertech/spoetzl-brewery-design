"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"

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
  stats: {
    totalDocuments: number
    totalWords: number
    totalImages: number
    categories: number
    researchHours: number
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-900">Research Center</h1>
          <p className="mt-2 text-lg text-gray-700">
            Comprehensive landscape design research for Spoetzl Brewery
          </p>
        </div>

        {/* Stats Overview */}
        {researchData && (
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{researchData.stats.totalDocuments}</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-gray-600">Total Words</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {(researchData.stats.totalWords / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{researchData.stats.totalImages}</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{researchData.stats.categories}</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="text-sm font-medium text-gray-600">Research Hours</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{researchData.stats.researchHours}</p>
            </div>
          </div>
        )}

        {/* Research Categories */}
        {researchData?.categories.map((category) => (
          <div key={category.id} className="mb-8 rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-green-900">{category.title}</h2>
                  <p className="mt-2 text-gray-700">{category.description}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.documents.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/research/${category.id}/${doc.id}`}
                  className="group rounded-lg border-2 border-gray-200 p-4 transition hover:border-green-500 hover:shadow-md"
                >
                  <h3 className="font-semibold text-green-900 group-hover:text-green-600">
                    {doc.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{doc.description}</p>
                  <div className="mt-3 flex items-center text-sm font-medium text-green-600">
                    View Document
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white shadow-lg">
          <h3 className="mb-4 text-2xl font-bold">Ready to Apply This Research?</h3>
          <p className="mb-6 text-lg text-green-50">
            Use these insights to create enhancement proposals and project plans
          </p>
          <div className="flex gap-4">
            <Link
              href="/enhancements"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-green-800 transition hover:bg-green-50"
            >
              Create Enhancement
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
