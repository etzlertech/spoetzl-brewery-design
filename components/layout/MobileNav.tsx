'use client';

/**
 * MobileNav - Persistent thumb-friendly bottom navigation for mobile
 *
 * Features:
 * - Fixed bottom bar with day-one IA shortcuts
 * - Positioned for easy thumb access
 * - Slide-up menu overlay
 * - Only visible on mobile devices
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Camera,
  MoreHorizontal,
  X,
} from 'lucide-react';
import {
  isActiveRoute,
  moreMobileNavItems,
  primaryMobileNavItems,
  toneClasses,
  type VisualLinkNavItem,
} from '@/components/layout/visual-navigation-model';

function getPrimaryItemClass(isActive: boolean): string {
  return `
    min-w-0 flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 transition-all active:scale-95
    ${isActive
      ? 'bg-white/20 text-white'
      : 'text-white/80 hover:bg-white/10 hover:text-white'
    }
  `;
}

function getMenuItemClass(item: VisualLinkNavItem, isActive: boolean): string {
  const tone = toneClasses(item.tone);

  return `
    flex min-h-[6.4rem] flex-col justify-between rounded-lg border p-3 text-left shadow-sm transition-all active:scale-95
    ${isActive ? tone.active : `${tone.tile} hover:-translate-y-0.5 hover:shadow-md`}
  `;
}

export function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const primaryActive = primaryMobileNavItems.some((item) => isActiveRoute(pathname, item));
  const moreActive = menuOpen || !primaryActive;
  const openCamera = () => {
    window.dispatchEvent(new Event('open-camera-capture'));
    setMenuOpen(false);
  };

  return (
    <>
      {/* Persistent Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[2000] bg-gradient-to-r from-green-800 to-amber-700 border-t border-green-900 shadow-2xl pb-safe">
        <div className="grid h-16 grid-cols-5 items-center gap-1 px-2">
          {primaryMobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(pathname, item);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={getPrimaryItemClass(isActive)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span className="max-w-full truncate text-[11px] font-medium leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className={getPrimaryItemClass(moreActive)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
            <span className="max-w-full truncate text-[11px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* Full-Screen Menu Overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[1999] bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="bottom-mobile-nav-sheet fixed left-0 right-0 flex max-h-[80vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl pb-safe"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="sticky top-0 rounded-t-2xl bg-gradient-to-r from-green-800 to-amber-700 px-6 py-3">
              <h2 className="text-lg font-bold text-white">More</h2>
              <p className="mt-1 text-sm text-white/80">Project resources and archives</p>
            </div>

            {/* Menu Items */}
            <div className="grid flex-1 grid-cols-2 gap-2.5 overflow-y-auto p-3">
              {moreMobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(pathname, item);
                const iconTone = toneClasses(item.tone).icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={getMenuItemClass(item, isActive)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-md ${isActive ? 'bg-white/15 text-white' : iconTone}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-black leading-tight">{item.label}</span>
                      <span className={`mt-1 line-clamp-2 block text-[11px] leading-4 ${isActive ? 'text-white/75' : 'text-slate-600'}`}>
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-gray-100 bg-white p-3 shadow-[0_-8px_20px_rgba(15,23,42,0.08)]">
              <button
                type="button"
                onClick={openCamera}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-95"
              >
                <Camera className="h-5 w-5" />
                <span>Capture media</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
