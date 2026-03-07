import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="space-y-8">
          {/* 404 Icon */}
          <div className="text-8xl font-bold text-green-700">
            404
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Navigation Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mt-12">
            <Link
              href="/"
              className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Go Home
            </Link>

            <Link
              href="/mapping"
              className="px-6 py-3 bg-white border-2 border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Property Mapping
            </Link>
          </div>

          {/* Additional Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/busch-gardens" className="text-green-700 hover:underline">
                Busch Gardens Inspiration
              </Link>
              <Link href="/dashboard" className="text-green-700 hover:underline">
                Dashboard
              </Link>
              <Link href="/research" className="text-green-700 hover:underline">
                Research
              </Link>
              <Link href="/skills" className="text-green-700 hover:underline">
                Skills
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
