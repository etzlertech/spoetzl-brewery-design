import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-green-900 text-center mb-12">
        Spoetzl Brewery
        <span className="block text-amber-700 mt-2">Landscape Design</span>
      </h1>

      {/* 2x2 Grid of Square Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <Link
          href="/research"
          className="aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white font-bold text-lg shadow-lg active:scale-95 transition"
        >
          <span className="text-center px-2">Busch<br />Research</span>
        </Link>

        <Link
          href="/images"
          className="aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg active:scale-95 transition"
        >
          Images
        </Link>

        <Link
          href="/maps"
          className="aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-white font-bold text-lg shadow-lg active:scale-95 transition"
        >
          Maps
        </Link>

        <Link
          href="/plans"
          className="aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold text-lg shadow-lg active:scale-95 transition"
        >
          Plans
        </Link>
      </div>
    </div>
  );
}
