import Link from 'next/link';
import { ImageGallery } from '@/components/inspiration/image-gallery';
import FieldCapturesGallery from '@/components/camera/FieldCapturesGallery';
import { Camera, Lightbulb } from 'lucide-react';

export const metadata = {
  title: 'Images | Spoetzl Brewery Landscape Design',
  description: 'View all inspiration images and field captures for landscape design',
};

export default function ImagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-amber-800 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold hover:text-amber-200 transition">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold">All Images</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-4">
            Design Images & Inspiration
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore all landscape design inspiration from Busch Gardens research
            and field captures taken on-site at Spoetzl Brewery.
          </p>
        </div>

        {/* Field Captures Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Camera className="w-7 h-7 text-green-600" />
            <h2 className="text-2xl font-bold text-green-900">
              Field Captures
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Photos captured on-site using Capture media for real-time inspiration and documentation
          </p>
          <FieldCapturesGallery />
        </div>

        {/* Inspiration Gallery Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-7 h-7 text-amber-600" />
            <h2 className="text-2xl font-bold text-green-900">
              Busch Gardens Inspiration
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Design elements from Busch Gardens Williamsburg - world-class landscapes and architecture
          </p>
          <ImageGallery />
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/field-captures"
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-6 h-6" />
              <h3 className="text-xl font-bold">View Field Captures</h3>
            </div>
            <p className="text-green-100 text-sm">
              See all on-site photos captured during field visits
            </p>
          </Link>

          <Link
            href="/busch-gardens"
            className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-6 h-6" />
              <h3 className="text-xl font-bold">View Busch Gardens</h3>
            </div>
            <p className="text-amber-100 text-sm">
              Explore the full Busch Gardens inspiration collection
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-900 to-amber-800 py-8 text-white mt-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm">
            &copy; 2024 Evergold Landscaping. All rights reserved. | Spoetzl Brewery Landscape
            Design System
          </p>
        </div>
      </footer>
    </div>
  );
}
