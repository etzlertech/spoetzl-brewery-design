import Link from "next/link"
import { ImageGallery } from "@/components/inspiration/image-gallery"

export default function BuschGardensPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-amber-800 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold hover:text-amber-200 transition">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Busch Gardens Inspiration</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-4">
            World-Class Theme Park Design Inspiration
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore design elements from Busch Gardens Williamsburg, Virginia -
            a masterpiece of European-themed landscapes, gardens, and architecture
            that can inspire enhancements to the Spoetzl Brewery grounds.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-green-800 mb-2">Seasonal Gardens</h3>
            <p className="text-gray-600 text-sm">
              Spring tulips, summer flowers, autumn foliage, and winter holiday displays
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-amber-800 mb-2">European Architecture</h3>
            <p className="text-gray-600 text-sm">
              German, Italian, French, and English themed buildings and streetscapes
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-blue-800 mb-2">Water Features</h3>
            <p className="text-gray-600 text-sm">
              Fountains, ponds, bridges, and river scenery integrated into landscapes
            </p>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-6">
            Inspiration Gallery
          </h2>
          <ImageGallery />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-green-700 to-amber-700 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Apply These Ideas?</h3>
          <p className="mb-6 text-lg">
            Use these inspiration images to plan landscape enhancements for Spoetzl Brewery
          </p>
          <Link
            href="/enhancements"
            className="inline-block bg-white text-green-800 font-semibold px-8 py-3 rounded-lg hover:bg-amber-50 transition shadow-lg"
          >
            View Enhancement Ideas
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-900 to-amber-800 py-8 text-white mt-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm">
            &copy; 2024 Evergold Landscaping. All rights reserved. | Spoetzl Brewery Landscape Design System
          </p>
        </div>
      </footer>
    </div>
  )
}
