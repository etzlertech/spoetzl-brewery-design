import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/20 to-amber-700/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-green-900 sm:text-6xl md:text-7xl">
              Spoetzl Brewery
              <span className="block text-amber-700">Landscape Design System</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-700">
              A collaborative platform for innovative landscape design ideas, project planning,
              and multimedia resources managed by <span className="font-semibold text-amber-800">Evergold Landscaping</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/research"
                className="rounded-lg bg-gradient-to-r from-green-700 to-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:from-green-800 hover:to-green-700"
              >
                Busch Gardens Research
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-green-800">Media Library</h3>
            <p className="text-gray-600">
              Organize images, videos, maps, and project plans in one centralized location
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <svg className="h-6 w-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-amber-800">Busch Gardens Inspiration</h3>
            <p className="text-gray-600">
              Draw from world-class theme park design to inspire brewery enhancements
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-blue-800">Team Collaboration</h3>
            <p className="text-gray-600">
              Work together on design ideas, specifications, and project planning
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-green-900">Explore Sections</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/images" className="group rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition hover:shadow-2xl">
            <h3 className="mb-2 text-xl font-bold">Images</h3>
            <p className="text-sm text-blue-100">Browse design inspiration photos</p>
          </Link>
          <Link href="/videos" className="group rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white shadow-lg transition hover:shadow-2xl">
            <h3 className="mb-2 text-xl font-bold">Videos</h3>
            <p className="text-sm text-red-100">Watch walkthroughs and demos</p>
          </Link>
          <Link href="/maps" className="group rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg transition hover:shadow-2xl">
            <h3 className="mb-2 text-xl font-bold">Maps</h3>
            <p className="text-sm text-green-100">Study layouts and site plans</p>
          </Link>
          <Link href="/enhancements" className="group rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg transition hover:shadow-2xl">
            <h3 className="mb-2 text-xl font-bold">Enhancements</h3>
            <p className="text-sm text-purple-100">Proposed brewery improvements</p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-900 to-amber-800 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm">&copy; 2024 Evergold Landscaping. All rights reserved. | Spoetzl Brewery Landscape Design System</p>
        </div>
      </footer>
    </div>
  );
}
