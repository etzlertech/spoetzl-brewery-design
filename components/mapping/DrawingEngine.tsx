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
  }, [map, isActive, points]);

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

    // Check if clicking near first point (to close polygon)
    if (points.length >= 3) {
      const firstPoint = points[0];
      const distance = map.distance(
        L.latLng(firstPoint[1], firstPoint[0]),
        e.latlng
      );

      // If within 10 pixels of first point, complete polygon
      if (distance < 10 / map.getZoomScale(map.getZoom())) {
        completePolygon();
        return;
      }
    }

    // Add new point
    const newPoints = [...points, clickedPoint];
    setPoints(newPoints);

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
    if (e.originalEvent.key === 'Enter' && points.length >= 3) {
      completePolygon();
    } else if (e.originalEvent.key === 'Escape') {
      cancel();
    } else if (e.originalEvent.key === 'Backspace' && points.length > 0) {
      // Remove last point
      const newPoints = points.slice(0, -1);
      setPoints(newPoints);

      // Remove last marker
      const lastMarker = pointMarkersRef.current.pop();
      if (lastMarker) {
        map.removeLayer(lastMarker);
      }
    }
  }

  /**
   * Complete polygon and validate
   */
  function completePolygon() {
    if (points.length < 3) {
      ErrorService.showToast('A polygon requires at least 3 points', 'error');
      return;
    }

    // Close the polygon (add first point at end)
    const closedCoordinates = [...points, points[0]];

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
  if (!isActive || points.length === 0) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="text-sm text-gray-700">First point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-sm text-gray-700">{points.length} points</span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-xs">Enter</kbd>
          <span>Complete</span>
          <span className="text-gray-400">•</span>
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-xs">Backspace</kbd>
          <span>Undo</span>
          <span className="text-gray-400">•</span>
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-xs">Esc</kbd>
          <span>Cancel</span>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <button
          onClick={cancel}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
