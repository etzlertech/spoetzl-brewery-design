"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface ImageItem {
  name: string
  url: string
}

export function ImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true)

        // List all files in the inspiration folder
        const { data, error } = await supabase.storage
          .from('images')
          .list('inspiration', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          })

        if (error) {
          throw error
        }

        if (data) {
          // Generate public URLs for each image
          const imageUrls = data
            .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
            .map(file => ({
              name: file.name,
              url: `https://armklbqsjcmrhqljmacz.supabase.co/storage/v1/object/public/images/inspiration/${file.name}`
            }))

          setImages(imageUrls)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load images')
        console.error('Error fetching images:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inspiration images...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold mb-2">Error loading images</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No images found in the gallery</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div
          key={image.name}
          className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
        >
          <Image
            src={image.url}
            alt={image.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/[-_]/g, ' ')}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm font-medium">
                {image.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/[-_]/g, ' ')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
