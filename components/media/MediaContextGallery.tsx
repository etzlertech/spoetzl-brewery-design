'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Camera,
  Clapperboard,
  FileVideo,
  ImageIcon,
  RefreshCw,
} from 'lucide-react';
import type {
  MediaAsset,
  MediaContextType,
  MediaKind,
  MediaStage,
} from '@/lib/media-assets';
import { formatMediaSize, mediaStageOptions } from '@/lib/media-assets';

interface MediaContextGalleryProps {
  contextType?: MediaContextType;
  contextId?: string;
  zoneId?: string;
  kind?: MediaKind | 'all';
  stage?: MediaStage | 'all';
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
  limit?: number;
  showFilters?: boolean;
}

export default function MediaContextGallery({
  contextType,
  contextId,
  zoneId,
  kind = 'all',
  stage = 'all',
  title = 'Attached media',
  emptyMessage = 'No media has been attached here yet.',
  compact = false,
  limit = 100,
  showFilters = false,
}: MediaContextGalleryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kindFilter, setKindFilter] = useState<MediaKind | 'all'>(kind);
  const [stageFilter, setStageFilter] = useState<MediaStage | 'all'>(stage);

  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (contextType) params.set('contextType', contextType);
    if (contextId) params.set('contextId', contextId);
    if (zoneId) params.set('zoneId', zoneId);
    if (kindFilter !== 'all') params.set('kind', kindFilter);
    if (stageFilter !== 'all') params.set('stage', stageFilter);
    params.set('limit', String(limit));

    return params.toString();
  }, [contextId, contextType, kindFilter, limit, stageFilter, zoneId]);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/media-assets?${query}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load media');
      }

      setAssets(payload.assets ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    const refresh = () => fetchAssets();
    window.addEventListener('media-assets-updated', refresh);
    return () => window.removeEventListener('media-assets-updated', refresh);
  }, [fetchAssets]);

  const imageCount = assets.filter((asset) => asset.kind === 'image').length;
  const videoCount = assets.filter((asset) => asset.kind === 'video').length;

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading media...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-900">Media could not load</p>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={fetchAssets}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-5'}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileVideo className="h-5 w-5 text-green-700" />
            <h3 className={compact ? 'text-base font-bold text-green-950' : 'text-xl font-bold text-green-950'}>
              {title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {assets.length} assets - {imageCount} photos - {videoCount} videos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showFilters ? (
            <>
              <select
                value={kindFilter}
                onChange={(event) => setKindFilter(event.target.value as MediaKind | 'all')}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800"
                aria-label="Filter media kind"
              >
                <option value="all">All media</option>
                <option value="image">Photos</option>
                <option value="video">Videos</option>
              </select>
              <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value as MediaStage | 'all')}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800"
                aria-label="Filter media stage"
              >
                <option value="all">All stages</option>
                {mediaStageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          ) : null}
          <button
            type="button"
            onClick={fetchAssets}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-green-200 bg-green-50/60 p-5 text-center">
          <Camera className="mx-auto h-8 w-8 text-green-700" />
          <p className="mt-2 text-sm font-semibold text-green-950">{emptyMessage}</p>
          <p className="mt-1 text-xs text-green-800">
            Use Capture media, then choose this context before saving.
          </p>
        </div>
      ) : (
        <div
          className={
            compact
              ? 'grid gap-3 sm:grid-cols-2'
              : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
          }
        >
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                {asset.kind === 'image' ? (
                  <Image
                    src={asset.publicUrl}
                    alt={asset.title}
                    fill
                    className="object-cover"
                    sizes={compact ? '(max-width: 768px) 100vw, 340px' : '(max-width: 768px) 100vw, 33vw'}
                  />
                ) : (
                  <video
                    src={asset.publicUrl}
                    controls
                    preload="metadata"
                    className="h-full w-full bg-black object-contain"
                  />
                )}
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  {asset.kind === 'image' ? (
                    <ImageIcon className="h-3.5 w-3.5" />
                  ) : (
                    <Clapperboard className="h-3.5 w-3.5" />
                  )}
                  {asset.stage}
                </div>
              </div>

              <div className={compact ? 'p-3' : 'p-4'}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="line-clamp-2 text-sm font-bold text-slate-950">
                      {asset.title}
                    </h4>
                    <p className="mt-1 text-xs font-semibold text-green-800">
                      {asset.contextLabel}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                    {formatMediaSize(asset.size)}
                  </span>
                </div>

                {asset.note ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-5 text-slate-700">
                    {asset.note}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  {asset.zoneName ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-900">
                      {asset.zoneName}
                    </span>
                  ) : null}
                  {asset.legacy ? (
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-900">
                      Legacy
                    </span>
                  ) : null}
                  <span>{new Date(asset.capturedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
