'use client';

/**
 * DrawingEngine - Polygon drawing functionality
 * Source: design-v2-spekster.md Section 2.4
 *
 * Features:
 * - Click map to place points
 * - Show polygon preview with dashed blue line
 * - Complete polygon by clicking first point or pressing Enter
 * - Validate polygon geometry with Turf.js
 * - Show ZonePropertiesForm on completion
 */

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { LonLatTuple } from '@/models/mapping/types';
import { ZoneService } from '@/services/ZoneService';
import { ErrorService } from '@/services/ErrorService';

// ============================================================================
// Types
// ============================================================================

export interface DrawingEngineProps {
  map: L.Map;
  isActive: boolean;
  onDrawingComplete: (coordinates: LonLatTuple[]) => void;
  onCancel: () => void;
}

// ============================================================================
// DrawingEngine Component
// ============================================================================

export default function DrawingEngine({
  map,
  isActive,
  onDrawingComplete,
  onCancel
}: DrawingEngineProps) {
  const [points, setPoints] = useState<LonLatTuple[]>([]);
  const [mousePosition, setMousePosition] = useState<LonLatTuple | null>(null);

  const pointMarkersRef = useRef<L.CircleMarker[]>([]);
  const previewLineRef = useRef<L.Polyline | null>(null);
  const mouseLineRef = useRef<L.Polyline | null>(null);
  const pointsRef = useRef<LonLatTuple[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  // Setup map event listeners when active
  useEffect(() => {
    if (!map || !isActive) {
      cleanup();
      return;
    }

    // Disable default map interactions during drawing
    map.dragging.disable();
    map.doubleClickZoom.disable();

    // Add event listeners
    map.on('click', handleMapClick);
    map.on('mousemove', handleMouseMove);
    map.on('keydown', handleKeyPress);

    // Change cursor
    map.getContainer().style.cursor = 'crosshair';

    return () => {
      // Re-enable map interactions
      map.dragging.enable();
      map.doubleClickZoom.enable();

      // Remove event listeners
      map.off('click', handleMapClick);
      map.off('mousemove', handleMouseMove);
      map.off('keydown', handleKeyPress);

      // Reset cursor
      map.getContainer().style.cursor = '';

      cleanup();
    };
  }, [map, isActive]);

  // Render preview lines
  useEffect(() => {
    if (!map || !isActive) return;

    // Clear existing previews
    if (previewLineRef.current) {
      map.removeLayer(previewLineRef.current);
    }
    if (mouseLineRef.current) {
      map.removeLayer(mouseLineRef.current);
    }

    // Draw preview line connecting all points
    if (points.length > 1) {
      const latLngs = points.map(p => L.latLng(p[1], p[0]));
      previewLineRef.current = L.polyline(latLngs, {
        color: '#3B82F6',
        weight: 2,
        dashArray: '5, 10',
        opacity: 0.8
      }).addTo(map);
    }

    // Draw line from last point to mouse cursor
    if (points.length > 0 && mousePosition) {
      const lastPoint = points[points.length - 1];
      const latLngs = [
        L.latLng(lastPoint[1], lastPoint[0]),
        L.latLng(mousePosition[1], mousePosition[0])
      ];
      mouseLineRef.current = L.polyline(latLngs, {
        color: '#3B82F6',
        weight: 2,
        dashArray: '5, 10',
        opacity: 0.5
      }).addTo(map);
    }
  }, [map, points, mousePosition, isActive]);

  /**
   * Handle map click - add point or complete polygon
   */
  function handleMapClick(e: L.LeafletMouseEvent) {
    const clickedPoint: LonLatTuple = [e.latlng.lng, e.latlng.lat];

    setPoints(currentPoints => {
      // Check if clicking near first point (to close polygon)
      if (currentPoints.length >= 3) {
        const firstPoint = currentPoints[0];
        const distance = map.distance(
          L.latLng(firstPoint[1], firstPoint[0]),
          e.latlng
        );

        // If within 10 pixels of first point, complete polygon
        if (distance < 10 / map.getZoomScale(map.getZoom())) {
          completePolygon();
          return currentPoints; // Don't add new point
        }
      }

      // Add new point
      const newPoints = [...currentPoints, clickedPoint];

      // Add marker for this point
      const marker = L.circleMarker(e.latlng, {
        radius: 6,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        color: '#FFFFFF',
        weight: 2
      }).addTo(map);

      // First point gets special styling (green)
      if (newPoints.length === 1) {
        marker.setStyle({
          fillColor: '#10B981',
          radius: 8
        });
      }

      pointMarkersRef.current.push(marker);

      // Show hint after first point
      if (newPoints.length === 1) {
        ErrorService.showToast('Click to add more points. Click the first point or press Enter to complete.', 'info', 5000);
      }

      return newPoints;
    });
  }

  /**
   * Handle mouse move - update preview line
   */
  function handleMouseMove(e: L.LeafletMouseEvent) {
    setMousePosition([e.latlng.lng, e.latlng.lat]);
  }

  /**
   * Handle keyboard shortcuts
   */
  function handleKeyPress(e: L.LeafletKeyboardEvent) {
    setPoints(currentPoints => {
      if (e.originalEvent.key === 'Enter' && currentPoints.length >= 3) {
        completePolygon();
        return currentPoints;
      } else if (e.originalEvent.key === 'Escape') {
        cancel();
        return currentPoints;
      } else if (e.originalEvent.key === 'Backspace' && currentPoints.length > 0) {
        // Remove last point
        const newPoints = currentPoints.slice(0, -1);

        // Remove last marker
        const lastMarker = pointMarkersRef.current.pop();
        if (lastMarker) {
          map.removeLayer(lastMarker);
        }

        return newPoints;
      }

      return currentPoints;
    });
  }

  /**
   * Complete polygon and validate
   */
  function completePolygon() {
    // Use ref to get current points value
    const currentPoints = pointsRef.current;

    if (currentPoints.length < 3) {
      ErrorService.showToast('A polygon requires at least 3 points', 'error');
      return;
    }

    // Close the polygon (add first point at end)
    const closedCoordinates = [...currentPoints, currentPoints[0]];

    // Validate with ZoneService
    const validation = ZoneService.validatePolygon(closedCoordinates);

    if (!validation.isValid) {
      ErrorService.showToast(
        `Invalid polygon: ${validation.errors.join(', ')}`,
        'error',
        5000
      );
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        ErrorService.showToast(warning.message, 'warning', 3000);
      });
    }

    // Success - pass coordinates to parent
    cleanup();
    onDrawingComplete(closedCoordinates);
  }

  /**
   * Cancel drawing
   */
  function cancel() {
    cleanup();
    onCancel();
  }

  /**
   * Clean up markers and lines
   */
  function cleanup() {
    // Remove point markers
    pointMarkersRef.current.forEach(marker => {
      if (map) map.removeLayer(marker);
    });
    pointMarkersRef.current = [];

    // Remove preview lines
    if (previewLineRef.current && map) {
      map.removeLayer(previewLineRef.current);
      previewLineRef.current = null;
    }
    if (mouseLineRef.current && map) {
      map.removeLayer(mouseLineRef.current);
      mouseLineRef.current = null;
    }

    // Only update state if component is still mounted (isActive)
    if (isActive) {
      setPoints([]);
      setMousePosition(null);
    }
  }

  // Drawing instruction panel
  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:right-auto z-[1000] bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Mobile-first controls */}
      <div className="p-4">
        {/* Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
              <span className="text-sm font-medium text-gray-700">{points.length === 0 ? 'Tap map to start' : `${points.length} points`}</span>
            </div>
          </div>
          {points.length >= 3 && (
            <span className="text-xs text-gray-500">Tap first point to close</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Undo Last Point */}
          {points.length > 0 && (
            <button
              onClick={() => {
                setPoints(currentPoints => {
                  const newPoints = currentPoints.slice(0, -1);
                  const lastMarker = pointMarkersRef.current.pop();
                  if (lastMarker) {
                    map.removeLayer(lastMarker);
                  }
                  return newPoints;
                });
              }}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
              Undo
            </button>
          )}

          {/* Complete Zone */}
          {points.length >= 3 && (
            <button
              onClick={completePolygon}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete Zone
            </button>
          )}

          {/* Cancel */}
          <button
            onClick={cancel}
            className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>

        {/* Hint */}
        {points.length === 0 && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Tap anywhere on the map to place your first point
          </p>
        )}
        {points.length > 0 && points.length < 3 && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Need at least 3 points to create a zone
          </p>
        )}
      </div>
    </div>
  );
}
