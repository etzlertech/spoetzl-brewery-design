import Image from 'next/image';
import Link from 'next/link';
import {
  Camera,
  Clapperboard,
  FileText,
  ImageIcon,
  Layers,
  MapPinned,
  MonitorUp,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type VisualAssetKind =
  | 'image'
  | 'photo'
  | 'video'
  | 'camera-video'
  | 'screen-recording'
  | 'screenshot'
  | 'concept'
  | 'map'
  | 'document'
  | 'note';

export type VisualAssetTone =
  | 'before'
  | 'concept'
  | 'progress'
  | 'after'
  | 'walkthrough'
  | 'issue'
  | 'approval'
  | 'reference'
  | 'neutral';

export interface VisualAsset {
  id: string;
  title: string;
  src?: string;
  posterSrc?: string;
  alt?: string;
  href?: string;
  kind?: VisualAssetKind;
  tone?: VisualAssetTone;
  label?: string;
  stage?: string;
  status?: string;
  contextLabel?: string;
  zoneName?: string;
  capturedAt?: string;
  durationLabel?: string;
  badge?: string;
  description?: string;
}

export interface VisualAssetThumbnailProps {
  asset: VisualAsset;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  variant?: 'light' | 'dark';
  aspect?: 'square' | 'landscape';
  showTitle?: boolean;
  showMeta?: boolean;
  overflowCount?: number;
  priority?: boolean;
  interactive?: boolean;
  className?: string;
}

const kindIcons: Record<VisualAssetKind, ComponentType<{ className?: string }>> = {
  image: ImageIcon,
  photo: Camera,
  video: Clapperboard,
  'camera-video': Clapperboard,
  'screen-recording': MonitorUp,
  screenshot: MonitorUp,
  concept: Sparkles,
  map: MapPinned,
  document: FileText,
  note: Layers,
};

const toneClasses: Record<VisualAssetTone, string> = {
  before: 'border-amber-200 bg-amber-50 text-amber-950',
  concept: 'border-violet-200 bg-violet-50 text-violet-950',
  progress: 'border-blue-200 bg-blue-50 text-blue-950',
  after: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  walkthrough: 'border-sky-200 bg-sky-50 text-sky-950',
  issue: 'border-red-200 bg-red-50 text-red-950',
  approval: 'border-green-200 bg-green-50 text-green-900',
  reference: 'border-slate-200 bg-slate-50 text-slate-800',
  neutral: 'border-slate-200 bg-slate-50 text-slate-800',
};

const sizeClasses: Record<NonNullable<VisualAssetThumbnailProps['size']>, string> = {
  xs: 'w-16',
  sm: 'w-24',
  md: 'w-32',
  lg: 'w-44',
  full: 'w-full',
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function toLabel(value?: string) {
  if (!value) return undefined;

  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDateLabel(value?: string) {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function mediaLabel(asset: VisualAsset) {
  return (
    asset.badge ??
    asset.label ??
    asset.stage ??
    asset.status ??
    toLabel(asset.kind) ??
    'Visual'
  );
}

function metaLabel(asset: VisualAsset) {
  return (
    asset.contextLabel ??
    asset.zoneName ??
    formatDateLabel(asset.capturedAt) ??
    asset.durationLabel
  );
}

function isVideoKind(kind?: VisualAssetKind) {
  return kind === 'video' || kind === 'camera-video' || kind === 'screen-recording';
}

function isVisualAssetTone(value?: string): value is VisualAssetTone {
  return Boolean(value && value in toneClasses);
}

function toneForAsset(asset: VisualAsset) {
  if (asset.tone) return asset.tone;
  if (isVisualAssetTone(asset.stage)) return asset.stage;
  return 'neutral';
}

function ThumbnailFrame({
  asset,
  aspect,
  priority,
  overflowCount,
}: Pick<VisualAssetThumbnailProps, 'asset' | 'aspect' | 'priority' | 'overflowCount'>) {
  const kind = asset.kind ?? 'image';
  const Icon = kindIcons[kind];
  const imageSrc = asset.posterSrc ?? (!isVideoKind(kind) ? asset.src : undefined);
  const label = mediaLabel(asset);

  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-lg bg-slate-100',
        aspect === 'landscape' ? 'aspect-[4/3]' : 'aspect-square'
      )}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={asset.alt ?? asset.title}
          fill
          priority={priority}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 38vw, (max-width: 1024px) 18vw, 180px"
        />
      ) : isVideoKind(kind) && asset.src ? (
        <video
          src={asset.src}
          poster={asset.posterSrc}
          preload="metadata"
          muted
          playsInline
          className="h-full w-full bg-slate-950 object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-emerald-50">
          <Icon className="h-7 w-7 text-emerald-800" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      <span
        className={cx(
          'absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black leading-none shadow-sm',
          toneClasses[toneForAsset(asset)]
        )}
      >
        <Icon className="h-3 w-3 shrink-0" />
        <span className="truncate">{label}</span>
      </span>

      {asset.durationLabel ? (
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-[10px] font-black leading-none text-white">
          <PlayCircle className="h-3 w-3" />
          {asset.durationLabel}
        </span>
      ) : null}

      {overflowCount && overflowCount > 0 ? (
        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/65 text-xl font-black text-white">
          +{overflowCount}
        </span>
      ) : null}
    </div>
  );
}

export default function VisualAssetThumbnail({
  asset,
  size = 'md',
  variant = 'light',
  aspect = 'square',
  showTitle = true,
  showMeta = true,
  overflowCount,
  priority = false,
  interactive = true,
  className,
}: VisualAssetThumbnailProps) {
  const content = (
    <>
      <ThumbnailFrame
        asset={asset}
        aspect={aspect}
        priority={priority}
        overflowCount={overflowCount}
      />
      {showTitle || showMeta ? (
        <div className="min-w-0 pt-2">
          {showTitle ? (
            <p
              className={cx(
                'line-clamp-2 text-xs font-black leading-4',
                variant === 'dark' ? 'text-white' : 'text-slate-950'
              )}
            >
              {asset.title}
            </p>
          ) : null}
          {showMeta ? (
            <p
              className={cx(
                'mt-0.5 line-clamp-1 text-[11px] font-semibold leading-4',
                variant === 'dark' ? 'text-white/60' : 'text-slate-500'
              )}
            >
              {metaLabel(asset) ?? mediaLabel(asset)}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );

  const shellClassName = cx(
    'group block min-w-0 rounded-lg border p-2 text-left transition',
    sizeClasses[size],
    variant === 'dark'
      ? 'border-white/15 bg-white/10 hover:border-emerald-300/50 hover:bg-white/15'
      : 'border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md',
    className
  );

  if (interactive && asset.href) {
    return (
      <Link href={asset.href} className={shellClassName} aria-label={asset.title}>
        {content}
      </Link>
    );
  }

  return <div className={shellClassName}>{content}</div>;
}
