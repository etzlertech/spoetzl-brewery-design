'use client';

/**
 * MobileNav - Persistent thumb-friendly bottom navigation for mobile
 *
 * Features:
 * - Fixed bottom bar with Home and Menu buttons
 * - Positioned for easy thumb access
 * - Slide-up menu overlay
 * - Only visible on mobile devices
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu, X, Map, Camera, Layers, Images } from 'lucide-react';

export function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/mapping', label: 'Mapping', icon: Map },
    { href: '/images', label: 'Images', icon: Images },
    { href: '/dashboard', label: 'Dashboard', icon: Layers },
  ];

  return (
    <>
      {/* Persistent Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[2000] bg-gradient-to-r from-green-800 to-amber-700 border-t border-green-900 shadow-2xl pb-safe">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Home Button - Left (Thumb-friendly) */}
          <Link
            href="/"
            className={`
              flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-all active:scale-95
              ${pathname === '/'
                ? 'bg-white/20 text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Quick Action Buttons - Center */}
          <div className="flex gap-2">
            <Link
              href="/mapping"
              className={`
                flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all active:scale-95
                ${pathname === '/mapping'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <Map className="w-6 h-6" />
              <span className="text-xs font-medium">Map</span>
            </Link>

            <Link
              href="/images"
              className={`
                flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all active:scale-95
                ${pathname === '/images'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs font-medium">Photos</span>
            </Link>
          </div>

          {/* Menu Button - Right (Thumb-friendly) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`
              flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-all active:scale-95
              ${menuOpen
                ? 'bg-white/20 text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Full-Screen Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[1999] bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div
            className="fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-800 to-amber-700 px-6 py-4 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">Navigation</h2>
              <p className="text-sm text-white/80 mt-1">Select a page</p>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all active:scale-98
                  ${pathname === '/'
                    ? 'bg-green-100 text-green-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/mapping"
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all active:scale-98
                  ${pathname === '/mapping'
                    ? 'bg-green-100 text-green-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <Map className="w-5 h-5" />
                <span>Property Mapping</span>
              </Link>

              <Link
                href="/images"
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all active:scale-98
                  ${pathname === '/images'
                    ? 'bg-green-100 text-green-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <Images className="w-5 h-5" />
                <span>Images</span>
              </Link>

              <Link
                href="/videos"
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all active:scale-98
                  ${pathname === '/videos'
                    ? 'bg-green-100 text-green-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <Camera className="w-5 h-5" />
                <span>Videos</span>
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all active:scale-98
                  ${pathname === '/dashboard'
                    ? 'bg-green-100 text-green-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <Layers className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/enhancements"
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all active:scale-98
                  ${pathname === '/enhancements'
                    ? 'bg-green-100 text-green-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Enhancements</span>
              </Link>

              <Link
                href="/busch-gardens"
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all active:scale-98
                  ${pathname === '/busch-gardens'
                    ? 'bg-green-100 text-green-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Busch Gardens</span>
              </Link>

              <Link
                href="/skills"
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all active:scale-98
                  ${pathname === '/skills'
                    ? 'bg-green-100 text-green-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Skills</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
