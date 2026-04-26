'use client';

import { usePathname } from 'next/navigation';
import VisualNavigationDock from '@/components/layout/VisualNavigationDock';

function usesDesktopRail(pathname: string) {
  return pathname !== '/' && !pathname.startsWith('/mapping');
}

function usesMapDock(pathname: string) {
  return pathname.startsWith('/mapping');
}

export default function NavigationScaffold({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showRail = usesDesktopRail(pathname);
  const showMapDock = usesMapDock(pathname);

  return (
    <div className={showRail ? 'min-h-screen md:pl-24' : undefined}>
      {children}
      {showRail && <VisualNavigationDock variant="rail" />}
      {showMapDock && <VisualNavigationDock variant="map" />}
    </div>
  );
}
