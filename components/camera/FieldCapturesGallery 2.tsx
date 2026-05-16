'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Camera, RefreshCw } from 'lucide-react';

interface ImageItem {
  name: string;
  url: string;
  created_at: string;
}

/**
 * FieldCapturesGallery - Displays all images uploaded via camera capture
 * Fetches from Supabase storage 'images/camera-captures/' folder
 */
export default function FieldCapturesGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // List all files in the camera-captures folder
      const { data, error: listError } = await supabase.storage
        .from('images')
        .list('camera-captures', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }, // Newest first
        });

      if (listError) {
        throw listError;
      }

      if (data) {
        // Generate public URLs for each image
        const imageUrls = data
          .filter((file) => file.name.match(/\.(jpg|jpeg|png|webp)$/i))
          .map((file) => ({
            name: file.name,
            url: `https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/images/camera-captures/${file.name}`,
            created_at: file.created_at ?? new Date().toISOString(),
          }));

        setImages(imageUrls);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
      console.error('Error fetching field captures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading field captures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold mb-2">Error loading images</p>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={fetchImages}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-amber-50 border border-green-200 rounded-xl p-12 text-center">
        <Camera className="w-16 h-16 mx-auto text-green-600 mb-4" />
        <p className="text-gray-800 font-semibold mb-2">No field captures yet</p>
        <p className="text-gray-600 text-sm">
          Use the camera button in the bottom-left to capture your first photo
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with count and refresh */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-800">{images.length}</span>{' '}
          {images.length === 1 ? 'capture' : 'captures'}
        </p>
        <button
          onClick={fetchImages}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.name}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={image.url}
              alt={`Field capture ${image.name}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-xs font-medium">
                  {new Date(image.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
