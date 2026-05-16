import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  FileVideo,
  Image,
  MapPin,
  PlayCircle,
  Video,
} from 'lucide-react';
import {
  projectOverview,
  projectZones,
  walkthoughs as misspelledWalkthroughs,
} from '@/lib/project-data';

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-8 h-8 text-green-700" />
            <h1 className="text-4xl font-bold text-green-900">Videos</h1>
          </div>
          <p className="text-lg text-gray-700">
            Field videos and documentation for Spoetzl Brewery landscape design
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">
            Video capture and management functionality will be available here.
          </p>
        </div>
      </main>
    </div>
  );
}
