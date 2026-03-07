'use client';

/**
 * MapCanvas - Main map component with Leaflet integration
 * Source: design-v2-spekster.md Section 2.1
 *
 * Responsibilities:
 * - Initialize Leaflet map with Mapbox satellite tiles
 * - Manage map modes (view, draw, align, edit)
 * - Coordinate all sub-components (DrawingEngine, ZoneRenderer, etc.)
 * - Handle auto-save
 */

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PropertyConfig } from '@/models/mapping/types';
import { PROPERTY_CONFIGS } from '@/models/mapping/types';
import { ErrorService } from '@/services/ErrorService';

// ============================================================================
// MapCanvas Props
// ============================================================================

interface MapCanvasProps {
  property: 'spoetzl' | 'busch';
  onMapReady?: (map: L.Map) => void;
}

// ============================================================================
// MapCanvas Component
// ============================================================================

export default function MapCanvas({ property, onMapReady }: MapCanvasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get property configuration
  const config: PropertyConfig = PROPERTY_CONFIGS[property];

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    try {
      const map = L.map(mapRef.current, {
        center: [config.center[1], config.center[0]], // Leaflet uses [lat, lon]
        zoom: config.defaultZoom,
        zoomControl: true,
        attributionControl: true
      });

      // Add Esri World Imagery satellite tiles (FREE - no API key needed!)
      const tileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19
        }
      );

      tileLayer.addTo(map);

      // Handle tile loading errors
      tileLayer.on('tileerror', (error) => {
        console.error('Tile loading error:', error);
        ErrorService.handleTileLoadFailure(() => {
          // Retry by removing and re-adding tile layer
          tileLayer.remove();
          tileLayer.addTo(map);
        }, 1);
      });

      // Save map instance
      mapInstanceRef.current = map;
      setIsLoading(false);

      // Notify parent component
      if (onMapReady) {
        onMapReady(map);
      }

      // Cleanup on unmount
      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError('Failed to initialize map. Please refresh the page.');
      setIsLoading(false);
    }
  }, [config, onMapReady]);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
            <p className="text-gray-700">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-red-50 border border-red-200 px-6 py-4 rounded-lg shadow-lg max-w-md">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
