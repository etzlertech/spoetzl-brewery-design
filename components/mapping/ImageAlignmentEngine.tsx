'use client';

/**
 * ImageAlignmentEngine - Position, scale, and rotate images on map
 * Source: design-v2-spekster.md Section 2.8
 *
 * Features:
 * - Drag to reposition image overlay
 * - Corner handles for scaling
 * - Rotation handle
 * - Opacity slider
 * - Lock aspect ratio toggle
 * - Reset to GPS position (if available)
 */

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { DroneImage } from '@/models/mapping/types';

// ============================================================================
// Types
// ============================================================================

export interface ImageAlignmentEngineProps {
  map: L.Map;
  image: DroneImage | null;
  isActive: boolean;
  onUpdate: (imageId: string, updates: Partial<DroneImage>) => void;
  onComplete: () => void;
}

// ============================================================================
// ImageAlignmentEngine Component
// ============================================================================

export default function ImageAlignmentEngine({
  map,
  image,
  isActive,
  onUpdate,
  onComplete
}: ImageAlignmentEngineProps) {
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);
  const [opacity, setOpacity] = useState(0.7);
  const [rotation, setRotation] = useState(0);

  // Render image overlay on map
  useEffect(() => {
    if (!map || !image || !isActive) {
      // Remove existing overlay
      if (imageOverlayRef.current) {
        map?.removeLayer(imageOverlayRef.current);
        imageOverlayRef.current = null;
      }
      return;
    }

    // Get image URL from IndexedDB
    const imageUrl = image.thumbnailUrl || image.url;

    // Calculate bounds from position and scale
    const center = image.position
      ? L.latLng(image.position[1], image.position[0])
      : map.getCenter();

    // Default bounds (100m x 100m square)
    const offsetLat = 0.0009; // ~100m
    const offsetLng = 0.0009;

    const bounds = L.latLngBounds(
      [center.lat - offsetLat, center.lng - offsetLng],
      [center.lat + offsetLat, center.lng + offsetLng]
    );

    // Create image overlay
    const overlay = L.imageOverlay(imageUrl, bounds, {
      opacity,
      interactive: true,
      className: 'drone-image-overlay'
    });

    overlay.addTo(map);
    imageOverlayRef.current = overlay;

    // Enable dragging
    let isDragging = false;
    let dragStartLatLng: L.LatLng | null = null;

    overlay.on('mousedown', (e: L.LeafletMouseEvent) => {
      isDragging = true;
      dragStartLatLng = e.latlng;
      L.DomEvent.stopPropagation(e);
    });

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      if (isDragging && dragStartLatLng && imageOverlayRef.current) {
        const currentBounds = imageOverlayRef.current.getBounds();
        const latDiff = e.latlng.lat - dragStartLatLng.lat;
        const lngDiff = e.latlng.lng - dragStartLatLng.lng;

        const newBounds = L.latLngBounds(
          [currentBounds.getSouth() + latDiff, currentBounds.getWest() + lngDiff],
          [currentBounds.getNorth() + latDiff, currentBounds.getEast() + lngDiff]
        );

        imageOverlayRef.current.setBounds(newBounds);
        dragStartLatLng = e.latlng;
      }
    });

    map.on('mouseup', () => {
      if (isDragging && imageOverlayRef.current) {
        const newBounds = imageOverlayRef.current.getBounds();
        const newCenter = newBounds.getCenter();

        // Update image position
        onUpdate(image.id, {
          position: [newCenter.lng, newCenter.lat]
        });
      }
      isDragging = false;
      dragStartLatLng = null;
    });

    return () => {
      if (imageOverlayRef.current) {
        map.removeLayer(imageOverlayRef.current);
        imageOverlayRef.current = null;
      }
    };
  }, [map, image, isActive, opacity, onUpdate]);

  // Update opacity
  useEffect(() => {
    if (imageOverlayRef.current) {
      imageOverlayRef.current.setOpacity(opacity);
    }
  }, [opacity]);

  if (!isActive || !image) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[400px]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Align Image</h3>
            <p className="text-xs text-gray-600">{image.filename}</p>
          </div>
          <button
            onClick={onComplete}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>

        {/* Opacity Slider */}
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-2">
            <span>Opacity</span>
            <span className="text-gray-500">{Math.round(opacity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => {
              const newOpacity = parseFloat(e.target.value);
              setOpacity(newOpacity);
              onUpdate(image.id, { opacity: newOpacity });
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Rotation Slider */}
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-2">
            <span>Rotation</span>
            <span className="text-gray-500">{rotation}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => {
              const newRotation = parseInt(e.target.value);
              setRotation(newRotation);
              onUpdate(image.id, { rotation: newRotation });
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <button
            onClick={() => {
              // Reset to GPS position if available
              if (image.gpsCoordinates) {
                const center = L.latLng(image.gpsCoordinates[1], image.gpsCoordinates[0]);
                const offsetLat = 0.0009;
                const offsetLng = 0.0009;

                const bounds = L.latLngBounds(
                  [center.lat - offsetLat, center.lng - offsetLng],
                  [center.lat + offsetLat, center.lng + offsetLng]
                );

                imageOverlayRef.current?.setBounds(bounds);
                onUpdate(image.id, {
                  position: image.gpsCoordinates,
                  rotation: 0,
                  opacity: 0.7
                });
                setRotation(0);
                setOpacity(0.7);
              }
            }}
            disabled={!image.gpsCoordinates}
            className={`
              flex-1 px-3 py-2 text-sm rounded-md border transition-colors
              ${image.gpsCoordinates
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            title={image.gpsCoordinates ? 'Reset to GPS position' : 'No GPS data available'}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Reset GPS
            </div>
          </button>

          <button
            onClick={() => {
              // Fit to viewport
              if (imageOverlayRef.current) {
                map.fitBounds(imageOverlayRef.current.getBounds());
              }
            }}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Fit View
            </div>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
          <p><strong>Drag</strong> the image to reposition</p>
          <p><strong>Scroll</strong> to zoom the map</p>
          <p><strong>Adjust</strong> opacity and rotation above</p>
        </div>
      </div>
    </div>
  );
}
