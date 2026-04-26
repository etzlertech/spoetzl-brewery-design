'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  isActiveRoute,
  toneClasses,
  visualDockItems,
  type VisualNavItem,
} from '@/components/layout/visual-navigation-model';

interface VisualNavigationDockProps {
  variant?: 'rail' | 'map';
}

function openCapture() {
  window.dispatchEvent(new Event('open-camera-capture'));
}

function itemIsActive(pathname: string, item: VisualNavItem) {
  return item.type === 'link' ? isActiveRoute(pathname, item) : false;
}

function getItemClass(item: VisualNavItem, isActive: boolean, variant: 'rail' | 'map') {
  const tone = toneClasses(item.tone);
  const base =
    'group relative flex w-[4.25rem] flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-center shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2';
  const size = variant === 'map' ? 'min-h-[4rem]' : 'min-h-[4.35rem]';
  const state = isActive ? tone.active : tone.idle;

  return `${base} ${size} ${state} hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95`;
}

function DockButton({ item, variant }: { item: VisualNavItem; variant: 'rail' | 'map' }) {
  const pathname = usePathname();
  const Icon = item.icon;
  const isActive = itemIsActive(pathname, item);
  const iconTone = toneClasses(item.tone).icon;
  const className = getItemClass(item, isActive, variant);
  const iconClassName = isActive
    ? 'bg-white/15 text-white'
    : iconTone;
  const content = (
    <>
      <span className={`flex h-8 w-8 items-center justify-center rounded-md ${iconClassName}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="max-w-full truncate text-[10px] font-black leading-tight">
        {item.shortLabel}
      </span>
      <span className="pointer-events-none absolute left-[calc(100%+0.55rem)] top-1/2 z-10 hidden min-w-44 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 shadow-xl group-hover:block">
        <span className="block font-black text-slate-950">{item.label}</span>
        <span className="mt-0.5 block leading-4">{item.description}</span>
      </span>
    </>
  );

  if (item.type === 'action') {
    return (
      <button
        type="button"
        onClick={openCapture}
        className={className}
        aria-label={item.label}
        title={item.label}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      aria-current={isActive ? 'page' : undefined}
      aria-label={item.label}
      title={item.label}
    >
      {content}
    </Link>
  );
}

export default function VisualNavigationDock({ variant = 'rail' }: VisualNavigationDockProps) {
  const positionClass =
    variant === 'map'
      ? 'fixed left-4 top-[6.5rem] z-[1400]'
      : 'fixed left-3 top-1/2 z-[1400] -translate-y-1/2';

  return (
    <nav
      className={`hidden md:flex ${positionClass} flex-col items-center gap-2 rounded-xl border border-white/70 bg-white/90 p-2 shadow-2xl shadow-slate-950/15 backdrop-blur`}
      aria-label="Visual navigation dock"
    >
      {visualDockItems.map((item) => (
        <DockButton
          key={item.type === 'link' ? item.href : item.action}
          item={item}
          variant={variant}
        />
      ))}
    </nav>
  );
}
