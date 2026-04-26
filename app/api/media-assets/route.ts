import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type {
  MediaAsset,
  MediaContextType,
  MediaKind,
  MediaStage,
} from '@/lib/media-assets';
import { findMediaContextOption } from '@/lib/media-assets';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://armklbqsjcmrhqljmacz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const IMAGE_BUCKET = 'images';
const VIDEO_BUCKET = 'videos';
const METADATA_BUCKET = 'documents';
const MEDIA_PREFIX = 'field-media';
const METADATA_PREFIX = 'media-assets';
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const contextTypes: MediaContextType[] = [
  'general',
  'zone',
  'walkthrough',
  'work-log',
  'proposal',
  'approval',
];

const stages: MediaStage[] = [
  'before',
  'concept',
  'progress',
  'after',
  'walkthrough',
  'issue',
  'approval',
  'reference',
];

function getAdminClient() {
  if (!supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

type SupabaseAdminClient = NonNullable<ReturnType<typeof getAdminClient>>;

function getString(formData: FormData, key: string, fallback = '') {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : fallback;
}

function normalizeContextType(value: string): MediaContextType {
  return contextTypes.includes(value as MediaContextType)
    ? (value as MediaContextType)
    : 'general';
}

function normalizeStage(value: string, kind: MediaKind): MediaStage {
  if (stages.includes(value as MediaStage)) {
    return value as MediaStage;
  }

  return kind === 'video' ? 'walkthrough' : 'reference';
}

function cleanPathSegment(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return cleaned || 'general';
}

function getExtension(file: File, kind: MediaKind) {
  const fromName = file.name.split('.').pop()?.toLowerCase();

  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  const fromType = file.type.split('/')[1]?.split(';')[0];

  if (fromType) {
    return fromType === 'jpeg' ? 'jpg' : fromType;
  }

  return kind === 'video' ? 'mp4' : 'jpg';
}

function getPublicUrl(bucket: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

function applyFilters(assets: MediaAsset[], searchParams: URLSearchParams) {
  const contextType = searchParams.get('contextType');
  const contextId = searchParams.get('contextId');
  const zoneId = searchParams.get('zoneId');
  const kind = searchParams.get('kind');
  const stage = searchParams.get('stage');

  return assets.filter((asset) => {
    if (contextType && asset.contextType !== contextType) return false;
    if (contextId && asset.contextId !== contextId) return false;
    if (zoneId && asset.zoneId !== zoneId) return false;
    if (kind && kind !== 'all' && asset.kind !== kind) return false;
    if (stage && stage !== 'all' && asset.stage !== stage) return false;
    return true;
  });
}

async function readMetadataAssets(supabase: SupabaseAdminClient) {
  const { data, error } = await supabase.storage.from(METADATA_BUCKET).list(METADATA_PREFIX, {
    limit: 500,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    throw new Error(`Could not list media metadata: ${error.message}`);
  }

  const files = (data ?? []).filter((file) => file.name.endsWith('.json'));
  const assets = await Promise.all(
    files.map(async (file) => {
      const path = `${METADATA_PREFIX}/${file.name}`;
      const { data: blob, error: downloadError } = await supabase.storage
        .from(METADATA_BUCKET)
        .download(path);

      if (downloadError || !blob) {
        return null;
      }

      try {
        return JSON.parse(await blob.text()) as MediaAsset;
      } catch {
        return null;
      }
    }),
  );

  return assets.filter((asset): asset is MediaAsset => Boolean(asset));
}

async function readLegacyFieldCaptures(supabase: SupabaseAdminClient) {
  const { data, error } = await supabase.storage.from(IMAGE_BUCKET).list('camera-captures', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    return [];
  }

  return (data ?? [])
    .filter((file) => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
    .map((file): MediaAsset => ({
      id: `legacy-${file.name}`,
      kind: 'image',
      title: 'Legacy field capture',
      note: 'Captured before contextual media metadata was added.',
      originalName: file.name,
      contentType: 'image/*',
      size: file.metadata?.size ?? 0,
      bucket: IMAGE_BUCKET,
      path: `camera-captures/${file.name}`,
      publicUrl: getPublicUrl(IMAGE_BUCKET, `camera-captures/${file.name}`),
      createdAt: file.created_at ?? new Date().toISOString(),
      capturedAt: file.created_at ?? new Date().toISOString(),
      capturedBy: 'Evergold field team',
      side: 'evergold',
      stage: 'reference',
      contextType: 'general',
      contextId: 'project',
      contextLabel: 'Project-wide clarity board',
      zoneId: '',
      zoneName: '',
      tags: ['legacy'],
      legacy: true,
    }));
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient();

    if (!supabase) {
      return NextResponse.json({ assets: [], storageConfigured: false }, { status: 200 });
    }

    const { searchParams } = new URL(request.url);
    const includeLegacy = searchParams.get('includeLegacy') !== 'false';
    const limit = Number(searchParams.get('limit') ?? '100');
    const hasContextFilter = Boolean(
      searchParams.get('contextType') ||
      searchParams.get('contextId') ||
      searchParams.get('zoneId') ||
      searchParams.get('stage'),
    );

    const metadataAssets = await readMetadataAssets(supabase);
    const legacyAssets = includeLegacy && !hasContextFilter
      ? await readLegacyFieldCaptures(supabase)
      : [];
    const assets = applyFilters([...metadataAssets, ...legacyAssets], searchParams)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, Number.isFinite(limit) ? limit : 100);

    return NextResponse.json({ assets }, { status: 200 });
  } catch (error) {
    console.error('Media asset list error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load media assets' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Media upload is not configured. Missing SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 503 },
      );
    }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'Invalid upload request. Please submit media form data.' },
        { status: 400 },
      );
    }

    const file = (formData.get('file') ?? formData.get('image')) as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No media file provided' }, { status: 400 });
    }

    const kind: MediaKind = file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('image/')
        ? 'image'
        : ('' as MediaKind);

    if (!kind) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image or video file.' },
        { status: 400 },
      );
    }

    const maxSize = kind === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `${kind === 'video' ? 'Video' : 'Image'} too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB.`,
        },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const contextType = normalizeContextType(getString(formData, 'contextType', 'general'));
    const contextId = cleanPathSegment(getString(formData, 'contextId', 'project'));
    const contextOption = findMediaContextOption(contextType, contextId);
    const contextLabel =
      getString(formData, 'contextLabel') ||
      contextOption?.label ||
      (contextType === 'general' ? 'Project-wide clarity board' : contextId);
    const zoneId = getString(formData, 'zoneId') || contextOption?.zoneId || '';
    const zoneName = getString(formData, 'zoneName') || contextOption?.zoneName || '';
    const stage = normalizeStage(getString(formData, 'stage'), kind);
    const originalName = file.name || `${kind}-${id}`;
    const title = getString(formData, 'title') || originalName.replace(/\.[^.]+$/, '');
    const extension = getExtension(file, kind);
    const bucket = kind === 'video' ? VIDEO_BUCKET : IMAGE_BUCKET;
    const storagePath = `${MEDIA_PREFIX}/${contextType}/${contextId}/${id}.${extension}`;
    const metadataPath = `${METADATA_PREFIX}/${id}.json`;
    const buffer = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
        metadata: {
          contextType,
          contextId,
          stage,
          zoneId,
        },
      });

    if (uploadError) {
      console.error('Supabase media upload error:', uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 },
      );
    }

    const now = new Date().toISOString();
    const asset: MediaAsset = {
      id,
      kind,
      title,
      note: getString(formData, 'note'),
      originalName,
      contentType: file.type,
      size: file.size,
      bucket,
      path: storagePath,
      publicUrl: getPublicUrl(bucket, storagePath),
      createdAt: now,
      capturedAt: getString(formData, 'capturedAt') || now,
      capturedBy: getString(formData, 'capturedBy') || 'Evergold field team',
      side: 'evergold',
      stage,
      contextType,
      contextId,
      contextLabel,
      zoneId,
      zoneName,
      tags: getString(formData, 'tags')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const metadataBlob = JSON.stringify(asset, null, 2);
    const { error: metadataError } = await supabase.storage
      .from(METADATA_BUCKET)
      .upload(metadataPath, metadataBlob, {
        contentType: 'application/json',
        cacheControl: '60',
        upsert: false,
      });

    if (metadataError) {
      console.error('Supabase media metadata error:', metadataError);
      return NextResponse.json(
        { error: `Media uploaded, but metadata failed: ${metadataError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error('Media asset upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
