/**
 * ExportService - Export zones and data to various formats
 *
 * Features:
 * - Export zones as GeoJSON (RFC 7946 compliant)
 * - Include zone metadata and properties
 * - Download as .geojson file
 */

import type { Zone, Layer, AppState, Result } from '@/models/mapping/types';
import type { Feature, FeatureCollection, Polygon } from 'geojson';

// ============================================================================
// Types
// ============================================================================

export enum ExportError {
  NO_ZONES = 'NO_ZONES',
  EXPORT_FAILED = 'EXPORT_FAILED'
}

interface ZoneProperties {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  fillColor: string;
  opacity: number;
  layerId: string;
  layerName: string;
  areaM2: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
}

// ============================================================================
// ExportService Class
// ============================================================================

class ExportServiceClass {
  /**
   * Export zones as GeoJSON FeatureCollection
   */
  exportZonesAsGeoJSON(
    zones: Zone[],
    layers: Layer[],
    property: 'spoetzl' | 'busch'
  ): Result<FeatureCollection, ExportError> {
    if (zones.length === 0) {
      return {
        success: false,
        error: ExportError.NO_ZONES
      };
    }

    // Create layer lookup map
    const layerMap = new Map(layers.map(layer => [layer.id, layer]));

    // Convert zones to GeoJSON features
    const features: Feature<Polygon, ZoneProperties>[] = zones.map(zone => {
      const layer = layerMap.get(zone.layerId);

      return {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [zone.coordinates] // GeoJSON Polygon requires array of rings
        },
        properties: {
          id: zone.id,
          name: zone.name,
          shortDescription: zone.shortDescription,
          detailedDescription: zone.detailedDescription,
          fillColor: zone.fillColor,
          opacity: zone.opacity,
          layerId: zone.layerId,
          layerName: layer?.name || 'Unknown Layer',
          areaM2: zone.areaM2,
          createdBy: zone.createdBy,
          createdDate: zone.createdDate,
          modifiedBy: zone.modifiedBy,
          modifiedDate: zone.modifiedDate
        }
      };
    });

    // Create FeatureCollection
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features,
      // Add metadata
      bbox: this.calculateBoundingBox(zones),
      // @ts-ignore - Custom properties for metadata
      metadata: {
        property,
        exportDate: new Date().toISOString(),
        totalZones: zones.length,
        totalLayers: layers.length,
        crs: 'WGS84 (EPSG:4326)'
      }
    };

    return {
      success: true,
      data: featureCollection
    };
  }

  /**
   * Download GeoJSON as file
   */
  downloadGeoJSON(
    featureCollection: FeatureCollection,
    filename: string = 'zones-export.geojson'
  ): Result<void, ExportError> {
    try {
      const jsonString = JSON.stringify(featureCollection, null, 2);
      const blob = new Blob([jsonString], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, data: undefined };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: ExportError.EXPORT_FAILED
      };
    }
  }

  /**
   * Export complete app state as JSON
   */
  exportAppState(appState: AppState): Result<void, ExportError> {
    try {
      const jsonString = JSON.stringify(appState, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${appState.property}-mapping-${timestamp}.json`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, data: undefined };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: ExportError.EXPORT_FAILED
      };
    }
  }

  /**
   * Calculate bounding box for all zones
   */
  private calculateBoundingBox(zones: Zone[]): [number, number, number, number] {
    let minLon = Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let maxLat = -Infinity;

    zones.forEach(zone => {
      zone.coordinates.forEach(([lon, lat]) => {
        minLon = Math.min(minLon, lon);
        minLat = Math.min(minLat, lat);
        maxLon = Math.max(maxLon, lon);
        maxLat = Math.max(maxLat, lat);
      });
    });

    return [minLon, minLat, maxLon, maxLat];
  }

  /**
   * Generate filename with timestamp
   */
  generateFilename(property: 'spoetzl' | 'busch', format: 'geojson' | 'json'): string {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${property}-zones-${timestamp}.${format}`;
  }
}

// Export singleton instance
export const ExportService = new ExportServiceClass();
