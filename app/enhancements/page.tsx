import { Navbar } from '@/components/layout/navbar';
import { Zap } from 'lucide-react';

export default function EnhancementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-green-700" />
            <h1 className="text-4xl font-bold text-green-900">Landscape Enhancements</h1>
          </div>
          <p className="text-lg text-gray-700">
            Proposed improvements and enhancement opportunities for Spoetzl Brewery
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">
            Enhancement tracking and proposal management will be available here.
          </p>
        </div>
      </main>
    </div>
  );
}
