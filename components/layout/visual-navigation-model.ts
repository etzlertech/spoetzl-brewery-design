import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  FileSignature,
  HelpCircle,
  Image,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  Map,
  MapPinned,
  MessageSquare,
  Sparkles,
  Video,
  type LucideIcon,
} from 'lucide-react';

export type VisualNavTone =
  | 'emerald'
  | 'blue'
  | 'amber'
  | 'slate'
  | 'violet'
  | 'rose';

export interface VisualLinkNavItem {
  type: 'link';
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  tone: VisualNavTone;
  match?: string[];
}

export interface VisualActionNavItem {
  type: 'action';
  action: 'capture';
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  tone: VisualNavTone;
}

export type VisualNavItem = VisualLinkNavItem | VisualActionNavItem;

export const primaryMobileNavItems: VisualLinkNavItem[] = [
  {
    type: 'link',
    href: '/',
    label: 'Today',
    shortLabel: 'Today',
    description: 'Return to the Clarity Board',
    icon: CalendarDays,
    tone: 'emerald',
  },
  {
    type: 'link',
    href: '/maps',
    label: 'Map',
    shortLabel: 'Map',
    description: 'Zone board and property context',
    icon: Map,
    tone: 'blue',
    match: ['/maps', '/mapping'],
  },
  {
    type: 'link',
    href: '/proposals',
    label: 'Proposals',
    shortLabel: 'Proposal',
    description: 'Proposal packets and approvals',
    icon: FileSignature,
    tone: 'amber',
  },
  {
    type: 'link',
    href: '/work',
    label: 'Work',
    shortLabel: 'Work',
    description: 'Daily work and field activity',
    icon: BriefcaseBusiness,
    tone: 'slate',
  },
];

export const visualDockItems: VisualNavItem[] = [
  {
    type: 'link',
    href: '/',
    label: 'Home / Today',
    shortLabel: 'Today',
    description: 'Return to the main Clarity Board',
    icon: CalendarDays,
    tone: 'emerald',
  },
  {
    type: 'link',
    href: '/maps',
    label: 'Zone Board',
    shortLabel: 'Zones',
    description: 'Review brewery zones and spatial scope',
    icon: Map,
    tone: 'blue',
    match: ['/maps'],
  },
  {
    type: 'link',
    href: '/research',
    label: 'Inspiration Library',
    shortLabel: 'Inspire',
    description: 'Busch Gardens articles, references, and image gallery',
    icon: Landmark,
    tone: 'emerald',
    match: ['/research', '/busch-gardens'],
  },
  {
    type: 'action',
    action: 'capture',
    label: 'Capture Media',
    shortLabel: 'Proof',
    description: 'Attach field photos, videos, and proof',
    icon: Camera,
    tone: 'amber',
  },
  {
    type: 'link',
    href: '/clarity',
    label: 'Clarity Questions',
    shortLabel: 'Clarity',
    description: 'Answer open questions before work moves',
    icon: HelpCircle,
    tone: 'rose',
  },
  {
    type: 'link',
    href: '/proposals',
    label: 'Proposal Packet',
    shortLabel: 'Packet',
    description: 'Open proposal scope and signoff context',
    icon: FileSignature,
    tone: 'violet',
  },
];

export const moreMobileNavItems: VisualLinkNavItem[] = [
  {
    type: 'link',
    href: '/mapping',
    label: 'Interactive Mapper',
    shortLabel: 'Mapper',
    description: 'Draw and edit satellite zones',
    icon: MapPinned,
    tone: 'blue',
  },
  {
    type: 'link',
    href: '/dashboard',
    label: 'Dashboard',
    shortLabel: 'Dash',
    description: 'Project metrics and signal board',
    icon: LayoutDashboard,
    tone: 'emerald',
  },
  {
    type: 'link',
    href: '/approvals',
    label: 'Approvals',
    shortLabel: 'Approve',
    description: 'Decision and signoff queue',
    icon: BadgeCheck,
    tone: 'violet',
  },
  {
    type: 'link',
    href: '/clarity',
    label: 'Clarity Gaps',
    shortLabel: 'Clarity',
    description: 'Questions blocking alignment',
    icon: HelpCircle,
    tone: 'rose',
  },
  {
    type: 'link',
    href: '/hermes',
    label: 'Hermes',
    shortLabel: 'Hermes',
    description: 'Source-cited project intelligence',
    icon: Sparkles,
    tone: 'slate',
  },
  {
    type: 'link',
    href: '/vision',
    label: 'Vision',
    shortLabel: 'Vision',
    description: 'Design principles and reference cues',
    icon: Lightbulb,
    tone: 'amber',
  },
  {
    type: 'link',
    href: '/walkthroughs',
    label: 'Walkthroughs',
    shortLabel: 'Walk',
    description: 'Video walkthroughs and responses',
    icon: MessageSquare,
    tone: 'emerald',
  },
  {
    type: 'link',
    href: '/images',
    label: 'Photos',
    shortLabel: 'Photos',
    description: 'Field proof and inspiration library',
    icon: Image,
    tone: 'amber',
  },
  {
    type: 'link',
    href: '/videos',
    label: 'Media',
    shortLabel: 'Media',
    description: 'Video proof and visual packets',
    icon: Video,
    tone: 'blue',
  },
  {
    type: 'link',
    href: '/research',
    label: 'Inspiration Articles',
    shortLabel: 'Articles',
    description: 'Busch research and Texas adaptation',
    icon: BookOpen,
    tone: 'slate',
  },
  {
    type: 'link',
    href: '/busch-gardens',
    label: 'Inspiration Gallery',
    shortLabel: 'Gallery',
    description: 'Busch Gardens image archive',
    icon: Landmark,
    tone: 'emerald',
  },
];

export function isActiveRoute(pathname: string, item: VisualLinkNavItem): boolean {
  const routes = item.match ?? [item.href];

  return routes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function toneClasses(tone: VisualNavTone) {
  const classes: Record<VisualNavTone, { icon: string; active: string; idle: string; tile: string }> = {
    emerald: {
      icon: 'bg-emerald-100 text-emerald-900',
      active: 'border-emerald-400 bg-emerald-900 text-white shadow-emerald-950/25',
      idle: 'border-emerald-100 bg-white text-emerald-950 hover:border-emerald-300 hover:bg-emerald-50',
      tile: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    },
    blue: {
      icon: 'bg-blue-100 text-blue-900',
      active: 'border-blue-400 bg-blue-900 text-white shadow-blue-950/25',
      idle: 'border-blue-100 bg-white text-blue-950 hover:border-blue-300 hover:bg-blue-50',
      tile: 'border-blue-200 bg-blue-50 text-blue-950',
    },
    amber: {
      icon: 'bg-amber-100 text-amber-950',
      active: 'border-amber-400 bg-amber-700 text-white shadow-amber-950/25',
      idle: 'border-amber-100 bg-white text-amber-950 hover:border-amber-300 hover:bg-amber-50',
      tile: 'border-amber-200 bg-amber-50 text-amber-950',
    },
    slate: {
      icon: 'bg-slate-100 text-slate-900',
      active: 'border-slate-400 bg-slate-950 text-white shadow-slate-950/25',
      idle: 'border-slate-100 bg-white text-slate-950 hover:border-slate-300 hover:bg-slate-50',
      tile: 'border-slate-200 bg-slate-50 text-slate-950',
    },
    violet: {
      icon: 'bg-violet-100 text-violet-950',
      active: 'border-violet-400 bg-violet-900 text-white shadow-violet-950/25',
      idle: 'border-violet-100 bg-white text-violet-950 hover:border-violet-300 hover:bg-violet-50',
      tile: 'border-violet-200 bg-violet-50 text-violet-950',
    },
    rose: {
      icon: 'bg-rose-100 text-rose-950',
      active: 'border-rose-400 bg-rose-900 text-white shadow-rose-950/25',
      idle: 'border-rose-100 bg-white text-rose-950 hover:border-rose-300 hover:bg-rose-50',
      tile: 'border-rose-200 bg-rose-50 text-rose-950',
    },
  };

  return classes[tone];
}
