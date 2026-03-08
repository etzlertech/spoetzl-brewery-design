'use client';

/**
 * ZoneRenderer - Displays zones on the map as Leaflet polygons
 * Source: design-v2-spekster.md Section 2.6
 *
 * Features:
 * - Render zones as colored polygons
 * - Layer visibility control
 * - Zone selection (click)
 * - Hover effects and tooltips
 * - Highlight selected zone
 */

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Zone, Layer } from '@/models/mapping/types';

// ============================================================================
// Types
// ============================================================================

export interface ZoneRendererProps {
  map: L.Map;
  zones: Zone[];
  layers: Layer[];
  selectedZoneId: string | null;
  onZoneClick: (zoneId: string) => void;
  onZoneHover: (zoneId: string | null) => void;
}

// ============================================================================
// ZoneRenderer Component
// ============================================================================

export default function ZoneRenderer({
  map,
  zones,
  layers,
  selectedZoneId,
  onZoneClick,
  onZoneHover
}: ZoneRendererProps) {
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const tooltipsRef = useRef<Map<string, L.Tooltip>>(new Map());

  // Render zones on map
  useEffect(() => {
    if (!map) return;

    console.log('ZoneRenderer: Rendering', zones.length, 'zones');

    // Create layer lookup for visibility
    const layerVisibilityMap = layers.reduce((acc, layer) => {
      acc[layer.id] = layer.visible;
      return acc;
    }, {} as Record<string, boolean>);

    console.log('Layer visibility map:', layerVisibilityMap);

    // Clear existing polygons
    polygonsRef.current.forEach(polygon => {
      map.removeLayer(polygon);
    });
    tooltipsRef.current.forEach(tooltip => {
      tooltip.remove();
    });
    polygonsRef.current.clear();
    tooltipsRef.current.clear();

    // Render each zone
    zones.forEach(zone => {
      console.log('Rendering zone:', zone.name, 'on layer:', zone.layerId, 'visible:', layerVisibilityMap[zone.layerId]);
      // Check if zone's layer is visible
      if (!layerVisibilityMap[zone.layerId]) {
        return;
      }

      // Convert coordinates to Leaflet format [lat, lon]
      const latLngs = zone.coordinates.map(coord => L.latLng(coord[1], coord[0]));

      // Determine if zone is selected
      const isSelected = zone.id === selectedZoneId;

      // Create polygon
      const polygon = L.polygon(latLngs, {
        fillColor: zone.fillColor,
        fillOpacity: isSelected ? zone.opacity * 1.3 : zone.opacity,
        color: isSelected ? '#1F2937' : '#4B5563',
        weight: isSelected ? 3 : 2,
        opacity: isSelected ? 1 : 0.8
      });

      // Add click handler
      polygon.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onZoneClick(zone.id);
      });

      // Add hover handlers
      polygon.on('mouseover', () => {
        onZoneHover(zone.id);
        polygon.setStyle({
          fillOpacity: zone.opacity * 1.5,
          weight: 3
        });

        // Show tooltip
        const tooltip = L.tooltip({
          permanent: false,
          direction: 'top',
          className: 'zone-tooltip'
        })
          .setLatLng(polygon.getBounds().getCenter())
          .setContent(`
            <div class="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-sm">
              <div class="font-semibold">${zone.name}</div>
              ${zone.shortDescription ? `<div class="text-xs text-gray-300 mt-1">${zone.shortDescription}</div>` : ''}
              <div class="text-xs text-gray-400 mt-1">${zone.areaM2?.toFixed(0) || 0} m²</div>
            </div>
          `)
          .addTo(map);

        tooltipsRef.current.set(zone.id, tooltip);
      });

      polygon.on('mouseout', () => {
        onZoneHover(null);
        if (!isSelected) {
          polygon.setStyle({
            fillOpacity: zone.opacity,
            weight: 2
          });
        }

        // Remove tooltip
        const tooltip = tooltipsRef.current.get(zone.id);
        if (tooltip) {
          tooltip.remove();
          tooltipsRef.current.delete(zone.id);
        }
      });

      // Add to map
      polygon.addTo(map);

      // Store reference
      polygonsRef.current.set(zone.id, polygon);
    });

    // Cleanup on unmount
    return () => {
      polygonsRef.current.forEach(polygon => {
        map.removeLayer(polygon);
      });
      tooltipsRef.current.forEach(tooltip => {
        tooltip.remove();
      });
      polygonsRef.current.clear();
      tooltipsRef.current.clear();
    };
  }, [map, zones, layers, selectedZoneId]);

  return null; // This component only manages map layers
}
