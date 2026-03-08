import Link from 'next/link';
import FieldCapturesGallery from '@/components/camera/FieldCapturesGallery';
import { Camera, Lightbulb, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Field Captures | Spoetzl Brewery Landscape Design',
  description: 'View all field captures and on-site photos captured during landscape design inspiration moments',
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
            Document landscape ideas, interesting plant combinations, hardscape details, and design
            inspiration as you encounter them in the field. All photos captured via the camera
            button are stored here for reference and intent analysis.
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
              Use the floating camera button (bottom-left) to instantly capture photos from your
              mobile device or upload from your gallery
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-bold text-amber-800">Intent Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm">
              All captures are analyzed for design intent, helping identify patterns and
              preferences in landscape inspiration
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-800">Field Notes</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Document ideas, sketches, and visual notes while on-site at Spoetzl Brewery or
              during research visits
            </p>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-6">All Captures</h2>
          <FieldCapturesGallery />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-green-700 to-amber-700 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Start Capturing</h3>
          <p className="mb-6 text-lg">
            Look for the camera button in the bottom-left corner of any page to capture your next
            inspiration moment
          </p>
          <div className="flex items-center justify-center gap-2">
            <Camera className="w-8 h-8" />
            <p className="text-sm opacity-90">Always available • Instant upload • Auto-compressed</p>
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
