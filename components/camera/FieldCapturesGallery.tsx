'use client';

import MediaContextGallery from '@/components/media/MediaContextGallery';

/**
 * FieldCapturesGallery - Backward-compatible wrapper around the unified media gallery.
 * Shows project-wide field photos, including legacy camera-captures files.
 */
export default function FieldCapturesGallery() {
  return (
    <MediaContextGallery
      kind="image"
      title="Field photos"
      emptyMessage="No field photos have been captured yet."
      showFilters
    />
  );
}
