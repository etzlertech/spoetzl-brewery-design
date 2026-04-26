'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, Images, RefreshCw } from 'lucide-react';
import type { MediaAsset } from '@/lib/media-assets';
import type { VisualProofAsset, VisualProofQuery } from '@/lib/visual-proof';
import VisualAssetThumbnail from '@/components/media/VisualAssetThumbnail';
import type {
  VisualAsset,
  VisualAssetThumbnailProps,
} from '@/components/media/VisualAssetThumbnail';

export interface VisualAssetStripProps {
  assets?: Array<VisualAsset | VisualProofAsset>;
  fallbackAssets?: VisualProofAsset[];
  query?: VisualProofQuery;
  title?: string;
  eyebrow?: string;
  description?: string;
  href?: string;
  actionLabel?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  maxVisible?: number;
  limit?: number;
  thumbnailSize?: VisualAssetThumbnailProps['size'];
  size?: VisualAssetThumbnailProps['size'];
  thumbnailAspect?: VisualAssetThumbnailProps['aspect'];
  variant?: 'light' | 'dark';
  showTitles?: boolean;
  showMeta?: boolean;
  showHeader?: boolean;
  showSourceLabel?: boolean;
  compact?: boolean;
  interactiveAssets?: boolean;
  className?: string;
}

type MediaPayload = {
  assets?: MediaAsset[];
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function buildQueryString(query: VisualProofQuery | undefined, limit: number) {
  const params = new URLSearchParams();

  if (query?.contextType) params.set('contextType', query.contextType);
  if (query?.contextId) params.set('contextId', query.contextId);
  if (query?.zoneId) params.set('zoneId', query.zoneId);
  if (query?.kind && query.kind !== 'all') params.set('kind', query.kind);
  if (query?.stage && query.stage !== 'all' && !Array.isArray(query.stage)) {
    params.set('stage', query.stage);
  }

  params.set('limit', String(limit));

  return params.toString();
}

function proofToVisualAsset(asset: VisualProofAsset): VisualAsset {
  return {
    id: asset.id,
    title: asset.title,
    src: asset.src,
    alt: asset.alt,
    href: asset.href,
    kind: asset.kind,
    tone: asset.stage ?? 'reference',
    stage: asset.label,
    contextLabel: asset.contextLabel,
    capturedAt: asset.capturedAt,
    badge: asset.source === 'media' ? asset.label : asset.label,
  };
}

function mediaToVisualAsset(asset: MediaAsset): VisualAsset {
  return {
    id: asset.id,
    title: asset.title || asset.originalName || 'Field media',
    src: asset.publicUrl,
    alt: asset.title || asset.originalName || 'Field media',
    href:
      asset.contextType === 'proposal'
        ? `/proposals/${asset.contextId}`
        : asset.contextType === 'zone'
          ? '/maps'
          : asset.contextType === 'walkthrough'
            ? '/walkthroughs'
            : undefined,
    kind: asset.kind,
    tone: asset.stage,
    stage: asset.stage,
    contextLabel: asset.contextLabel || asset.zoneName,
    capturedAt: asset.capturedAt,
    badge: asset.stage,
  };
}

function toVisualAsset(asset: VisualAsset | VisualProofAsset): VisualAsset {
  if ('source' in asset && 'label' in asset) {
    return proofToVisualAsset(asset);
  }

  return asset;
}

function mergeAssets(
  liveAssets: VisualAsset[],
  staticAssets: VisualAsset[],
  limit: number,
  interactiveAssets: boolean,
) {
  const seen = new Set<string>();

  return [...liveAssets, ...staticAssets]
    .filter((asset) => {
      const key = `${asset.src ?? asset.id}:${asset.title}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((asset) => (interactiveAssets ? asset : { ...asset, href: undefined }));
}

export default function VisualAssetStrip({
  assets = [],
  fallbackAssets = [],
  query,
  title = 'Visual proof',
  eyebrow,
  description,
  href,
  actionLabel = 'Open packet',
  emptyTitle = 'No visual proof yet',
  emptyMessage = 'Attach photos, screenshots, concepts, or walkthrough clips to build this packet.',
  maxVisible,
  limit,
  thumbnailSize,
  size,
  thumbnailAspect = 'square',
  variant = 'light',
  showTitles = false,
  showMeta = false,
  showHeader = true,
  showSourceLabel = showHeader,
  compact = false,
  interactiveAssets = true,
  className,
}: VisualAssetStripProps) {
  const effectiveLimit = limit ?? maxVisible ?? 6;
  const effectiveSize = size ?? thumbnailSize ?? 'sm';
  const [liveAssets, setLiveAssets] = useState<VisualAsset[]>([]);
  const [loading, setLoading] = useState(Boolean(query || fallbackAssets.length > 0));
  const [hasLoadedLiveMedia, setHasLoadedLiveMedia] = useState(false);

  const queryString = useMemo(
    () => buildQueryString(query, Math.max(effectiveLimit, fallbackAssets.length, 1)),
    [effectiveLimit, fallbackAssets.length, query],
  );

  useEffect(() => {
    if (!query && fallbackAssets.length === 0) {
      setLoading(false);
      setLiveAssets([]);
      return;
    }

    let cancelled = false;

    async function loadAssets() {
      try {
        setLoading(true);
        const response = await fetch(`/api/media-assets?${queryString}`);
        const payload = (await response.json()) as MediaPayload;

        if (!cancelled && response.ok) {
          const nextAssets = (payload.assets ?? []).map(mediaToVisualAsset);
          setLiveAssets(nextAssets);
          setHasLoadedLiveMedia(nextAssets.length > 0);
        }
      } catch {
        if (!cancelled) {
          setLiveAssets([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAssets();

    return () => {
      cancelled = true;
    };
  }, [fallbackAssets.length, query, queryString]);

  const staticAssets = [...assets, ...fallbackAssets].map(toVisualAsset);
  const visibleAssets = mergeAssets(
    liveAssets,
    staticAssets,
    effectiveLimit,
    interactiveAssets,
  );
  const hiddenCount = Math.max(0, liveAssets.length + staticAssets.length - visibleAssets.length);

  return (
    <section
      className={cx(
        'w-full max-w-full min-w-0 overflow-hidden',
        showHeader && !compact
          ? 'rounded-lg border p-4'
          : 'min-w-0',
        showHeader && !compact && (variant === 'dark'
          ? 'border-white/15 bg-white/10 text-white'
          : 'border-slate-200 bg-white text-slate-950 shadow-sm'),
        className
      )}
    >
      {showHeader ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p
                className={cx(
                  'text-xs font-black uppercase tracking-wide',
                  variant === 'dark' ? 'text-emerald-200' : 'text-emerald-800'
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            <div className="flex items-center gap-2">
              <Images
                className={cx(
                  'h-5 w-5 shrink-0',
                  variant === 'dark' ? 'text-emerald-300' : 'text-emerald-700'
                )}
              />
              <h3 className={cx('line-clamp-1 font-black', compact ? 'text-base' : 'text-lg')}>
                {title}
              </h3>
            </div>
            {description ? (
              <p
                className={cx(
                  'mt-1 text-sm leading-6',
                  variant === 'dark' ? 'text-white/65' : 'text-slate-600'
                )}
              >
                {description}
              </p>
            ) : null}
          </div>

          {href ? (
            <Link
              href={href}
              className={cx(
                'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-black transition',
                variant === 'dark'
                  ? 'border border-white/15 bg-white/10 text-white hover:bg-white/15'
                  : 'border border-slate-200 bg-white text-emerald-900 hover:border-emerald-300 hover:bg-emerald-50'
              )}
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      ) : null}

      {visibleAssets.length > 0 ? (
        <>
          <div
            className={cx(
              showHeader ? 'mt-4' : '',
              'flex gap-2 overflow-x-auto pb-1 no-scrollbar',
              !compact && 'sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
            )}
          >
            {visibleAssets.map((asset, index) => {
              const isLastVisible = index === visibleAssets.length - 1;

              return (
                <VisualAssetThumbnail
                  key={asset.id}
                  asset={asset}
                  size={effectiveSize}
                  variant={variant}
                  aspect={thumbnailAspect}
                  showTitle={showTitles}
                  showMeta={showMeta}
                  overflowCount={isLastVisible ? hiddenCount : 0}
                  interactive={interactiveAssets}
                  className={compact ? 'shrink-0' : 'shrink-0 sm:w-full'}
                />
              );
            })}
            {loading ? (
              <div className="flex aspect-square w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/70 text-slate-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
            ) : null}
          </div>

          {showSourceLabel ? (
            <p
              className={cx(
                'mt-2 text-[11px] font-semibold uppercase tracking-wide',
                variant === 'dark' ? 'text-white/45' : 'text-slate-400'
              )}
            >
              {hasLoadedLiveMedia
                ? 'Live media plus curated backup'
                : 'Curated reference until field media is attached'}
            </p>
          ) : null}
        </>
      ) : (
        <div
          className={cx(
            showHeader ? 'mt-4' : '',
            'rounded-lg border border-dashed p-4 text-center',
            variant === 'dark'
              ? 'border-white/15 bg-white/5 text-white/75'
              : 'border-emerald-200 bg-emerald-50/60 text-emerald-950'
          )}
        >
          <Camera
            className={cx(
              'mx-auto h-7 w-7',
              variant === 'dark' ? 'text-emerald-300' : 'text-emerald-700'
            )}
          />
          <p className="mt-2 text-sm font-black">{emptyTitle}</p>
          <p
            className={cx(
              'mt-1 text-xs leading-5',
              variant === 'dark' ? 'text-white/60' : 'text-emerald-900/75'
            )}
          >
            {emptyMessage}
          </p>
        </div>
      )}
    </section>
  );
}
