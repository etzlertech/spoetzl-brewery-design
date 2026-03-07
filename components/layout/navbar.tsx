"use client"

import Link from "next/link"
import { useState } from "react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-800 to-amber-700 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">
                Spoetzl Brewery Design
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/images"
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Images
              </Link>
              <Link
                href="/videos"
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Videos
              </Link>
              <Link
                href="/maps"
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Maps
              </Link>
              <Link
                href="/enhancements"
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Enhancements
              </Link>
              <Link
                href="/busch-gardens"
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Busch Gardens
              </Link>
              <Link
                href="/skills"
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Skills
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-green-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/images"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Images
            </Link>
            <Link
              href="/videos"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Videos
            </Link>
            <Link
              href="/maps"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Maps
            </Link>
            <Link
              href="/enhancements"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Enhancements
            </Link>
            <Link
              href="/busch-gardens"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Busch Gardens
            </Link>
            <Link
              href="/skills"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Skills
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
