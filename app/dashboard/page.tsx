import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-900">Dashboard</h1>
          <p className="mt-2 text-gray-700">
            Welcome to the Spoetzl Brewery Landscape Design System
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Videos</p>
                <p className="mt-2 text-3xl font-bold text-red-600">0</p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enhancements</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">0</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Project Plans</p>
                <p className="mt-2 text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Media Library */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Media Library</h2>
            <div className="space-y-3">
              <Link
                href="/images"
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white transition hover:from-blue-600 hover:to-blue-700"
              >
                <span className="font-semibold">Image Gallery</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/videos"
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-4 text-white transition hover:from-red-600 hover:to-red-700"
              >
                <span className="font-semibold">Video Library</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/maps"
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-4 text-white transition hover:from-green-600 hover:to-green-700"
              >
                <span className="font-semibold">Maps & Layouts</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Project Management */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Project Management</h2>
            <div className="space-y-3">
              <Link
                href="/enhancements"
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white transition hover:from-purple-600 hover:to-purple-700"
              >
                <span className="font-semibold">Enhancement Proposals</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/specifications"
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white transition hover:from-amber-600 hover:to-amber-700"
              >
                <span className="font-semibold">Design Specifications</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/plans"
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white transition hover:from-teal-600 hover:to-teal-700"
              >
                <span className="font-semibold">Project Plans</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Busch Gardens Inspiration */}
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white shadow-lg lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">Busch Gardens Williamsburg Inspiration</h2>
            <p className="mb-6 text-purple-100">
              Explore world-class theme park design elements to inspire Spoetzl Brewery enhancements
            </p>
            <Link
              href="/busch-gardens"
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 transition hover:bg-purple-50"
            >
              Explore Inspiration Section
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
