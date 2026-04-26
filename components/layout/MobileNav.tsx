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
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  CalendarDays,
  FileSignature,
  HelpCircle,
  Image,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  type LucideIcon,
  Map,
  MapPinned,
  MoreHorizontal,
  Sparkles,
  Video,
  X,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: string[];
}

const primaryNavItems: NavItem[] = [
  { href: '/', label: 'Today', icon: CalendarDays },
  { href: '/maps', label: 'Map', icon: Map, match: ['/maps', '/mapping'] },
  { href: '/proposals', label: 'Proposals', icon: FileSignature },
  { href: '/work', label: 'Work', icon: BriefcaseBusiness },
];

const moreNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/approvals', label: 'Approvals', icon: BadgeCheck },
  { href: '/clarity', label: 'Clarity Gaps', icon: HelpCircle },
  { href: '/hermes', label: 'Hermes', icon: Sparkles },
  { href: '/vision', label: 'Vision', icon: Lightbulb },
  { href: '/walkthroughs', label: 'Walkthroughs', icon: MessageSquare },
  { href: '/images', label: 'Photos', icon: Image },
  { href: '/videos', label: 'Media', icon: Video },
  { href: '/mapping', label: 'Interactive Mapper', icon: MapPinned },
  { href: '/research', label: 'Research', icon: BookOpen },
  { href: '/busch-gardens', label: 'Busch Gardens', icon: Landmark },
];

function isActiveRoute(pathname: string, item: NavItem): boolean {
  const routes = item.match ?? [item.href];

  return routes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

function getPrimaryItemClass(isActive: boolean): string {
  return `
    min-w-0 flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 transition-all active:scale-95
    ${isActive
      ? 'bg-white/20 text-white'
      : 'text-white/80 hover:bg-white/10 hover:text-white'
    }
  `;
}

function getMenuItemClass(isActive: boolean): string {
  return `
    flex min-h-11 items-center gap-3.5 rounded-lg px-4 py-2 transition-all active:scale-95
    ${isActive
      ? 'bg-green-100 font-semibold text-green-900'
      : 'text-gray-700 hover:bg-gray-100'
    }
  `;
}

export function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const primaryActive = primaryNavItems.some((item) => isActiveRoute(pathname, item));
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
          {primaryNavItems.map((item) => {
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
            <div className="flex-1 space-y-1 overflow-y-auto p-3">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(pathname, item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={getMenuItemClass(isActive)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
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
