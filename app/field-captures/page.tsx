import Link from 'next/link';
import MediaContextGallery from '@/components/media/MediaContextGallery';
import { Camera, Lightbulb, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Field Captures | Spoetzl Brewery Landscape Design',
  description: 'View all field captures, videos, and on-site media captured during landscape design moments',
};

export default function FieldCapturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-amber-800 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold hover:text-amber-200 transition">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Camera className="w-6 h-6" />
              Field Captures
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-4">
            Capture Inspiration On-Site
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Document landscape ideas, walkthrough clips, plant combinations, hardscape details,
            and design inspiration as they come up in the field. Captured media is stored with
            context so it can support decisions later.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Camera className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-green-800">Quick Capture</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Use Capture media to save photos or walkthrough clips from your mobile device
              and attach them to the right project context
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-bold text-amber-800">Intent Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Captures carry stage, notes, and context so Hermes can later identify clarity gaps
              and expectation mismatches
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-800">Field Notes</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Document ideas, sketches, zone evidence, and visual notes while on-site at
              Spoetzl Brewery or during research visits
            </p>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <MediaContextGallery
            title="All field media"
            emptyMessage="No field media has been captured yet."
            showFilters
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-green-700 to-amber-700 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Start Capturing</h3>
          <p className="mb-6 text-lg">
            Look for Capture media on desktop or under More on mobile to save the next useful
            field observation
          </p>
          <div className="flex items-center justify-center gap-2">
            <Camera className="w-8 h-8" />
            <p className="text-sm opacity-90">Photos • Videos • Context notes • Shared gallery</p>
          </div>
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
