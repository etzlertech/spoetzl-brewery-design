/**
 * ZoneService - Zone CRUD operations and geospatial validation
 * Source: design-v2-spekster.md Section 4.2
 *
 * Responsibilities:
 * - Create, read, update, delete zones
 * - Validate polygon geometry (self-intersection, area, etc.)
 * - Calculate area using Turf.js
 * - Enforce WGS84 coordinate precision
 * - Generate warnings for edge cases
 */

import * as turf from '@turf/turf';
import type {
  Zone,
  Result,
  LonLatTuple,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ZoneWarning
} from '@/models/mapping/types';
import { ZoneError } from '@/models/mapping/types';
import { StorageService } from './StorageService';

// ============================================================================
// Constants (from design-v2 Section 4.2)
// ============================================================================

const MIN_POINTS = 3;
const MAX_POINTS = 100;
const COORDINATE_PRECISION = 6; // Decimal places (~0.11m accuracy)
const MIN_AREA_M2 = 1; // Small area warning threshold
const MAX_AREA_PERCENTAGE = 90; // Large area warning threshold

// ============================================================================
// ZoneService Class
// ============================================================================

class ZoneServiceClass {
  private zones: Zone[] = [];

  /**
   * Initialize service by loading zones from storage
   */
  async initialize(property: 'spoetzl' | 'busch'): Promise<Result<void, ZoneError>> {
    const stateResult = await StorageService.loadState(property);

    if (stateResult.success) {
      this.zones = stateResult.data.zones;
      return { success: true, data: undefined };
    }

    // No existing state - initialize empty
    this.zones = [];
    return { success: true, data: undefined };
  }

  // ==========================================================================
  // CRUD Operations
  // ==========================================================================

  /**
   * Create new zone with validation
   */
  createZone(
    name: string,
    coordinates: LonLatTuple[],
    fillColor: string,
    opacity: number,
    layerId: string,
    createdBy: string,
    shortDescription: string = '',
    detailedDescription: string = ''
  ): Result<Zone, ZoneError> {
    // Normalize coordinates (6 decimal precision)
    const normalizedCoords = this.normalizeCoordinates(coordinates);

    // Validate polygon
    const validation = this.validatePolygon(normalizedCoords);
    if (!validation.isValid) {
      return {
        success: false,
        error: this.getErrorFromValidation(validation)
      };
    }

    // Calculate area
    const areaM2 = this.calculateArea(normalizedCoords);

    // Generate warnings
    const warnings = this.generateWarnings(normalizedCoords, areaM2);

    // Create zone object
    const zone: Zone = {
      id: crypto.randomUUID(),
      name,
      shortDescription,
      detailedDescription,
      coordinates: normalizedCoords,
      fillColor,
      opacity,
      layerId,
      createdBy,
      createdDate: new Date().toISOString(),
      modifiedBy: null,
      modifiedDate: null,
      primaryImageId: null,
      imageIds: [],
      customAttributes: {},
      areaM2,
      warnings
    };

    // Add to zones array
    this.zones.push(zone);

    return { success: true, data: zone };
  }

  /**
   * Update existing zone
   */
  updateZone(
    id: string,
    updates: Partial<Zone>,
    modifiedBy: string
  ): Result<Zone, ZoneError> {
    const index = this.zones.findIndex(z => z.id === id);

    if (index === -1) {
      return {
        success: false,
        error: ZoneError.ZONE_NOT_FOUND
      };
    }

    // If coordinates changed, revalidate
    if (updates.coordinates) {
      const normalizedCoords = this.normalizeCoordinates(updates.coordinates);
      const validation = this.validatePolygon(normalizedCoords);

      if (!validation.isValid) {
        return {
          success: false,
          error: this.getErrorFromValidation(validation)
        };
      }

      // Recalculate area
      updates.areaM2 = this.calculateArea(normalizedCoords);
      updates.coordinates = normalizedCoords;
      updates.warnings = this.generateWarnings(normalizedCoords, updates.areaM2);
    }

    // Update zone
    const updatedZone = {
      ...this.zones[index],
      ...updates,
      modifiedBy,
      modifiedDate: new Date().toISOString()
    };

    this.zones[index] = updatedZone;

    return { success: true, data: updatedZone };
  }

  /**
   * Delete zone
   */
  deleteZone(id: string): Result<void, ZoneError> {
    const index = this.zones.findIndex(z => z.id === id);

    if (index === -1) {
      return {
        success: false,
        error: ZoneError.ZONE_NOT_FOUND
      };
    }

    this.zones.splice(index, 1);
    return { success: true, data: undefined };
  }

  /**
   * Get zone by ID
   */
  getZone(id: string): Result<Zone, ZoneError> {
    const zone = this.zones.find(z => z.id === id);

    if (!zone) {
      return {
        success: false,
        error: ZoneError.ZONE_NOT_FOUND
      };
    }

    return { success: true, data: zone };
  }

  /**
   * Get all zones
   */
  getAllZones(): Zone[] {
    return [...this.zones];
  }

  /**
   * Get zones by layer
   */
  getZonesByLayer(layerId: string): Zone[] {
    return this.zones.filter(z => z.layerId === layerId);
  }

  // ==========================================================================
  // Validation (Turf.js)
  // ==========================================================================

  /**
   * Validate polygon geometry
   */
  validatePolygon(coordinates: LonLatTuple[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check point count
    if (coordinates.length < MIN_POINTS) {
      errors.push({
        code: 'TOO_FEW_POINTS',
        message: `Polygon must have at least ${MIN_POINTS} points. Found: ${coordinates.length}`
      });
    }

    if (coordinates.length > MAX_POINTS) {
      errors.push({
        code: 'TOO_MANY_POINTS',
        message: `Polygon cannot have more than ${MAX_POINTS} points. Found: ${coordinates.length}`
      });
    }

    // Check coordinate validity (WGS84 bounds)
    for (let i = 0; i < coordinates.length; i++) {
      const [lon, lat] = coordinates[i];

      if (lat < -90 || lat > 90) {
        errors.push({
          code: 'INVALID_LATITUDE',
          message: `Latitude must be between -90 and 90. Point ${i}: ${lat}`,
          coordinates: [coordinates[i]]
        });
      }

      if (lon < -180 || lon > 180) {
        errors.push({
          code: 'INVALID_LONGITUDE',
          message: `Longitude must be between -180 and 180. Point ${i}: ${lon}`,
          coordinates: [coordinates[i]]
        });
      }
    }

    // Early return if basic validation fails
    if (errors.length > 0) {
      return { isValid: false, errors, warnings };
    }

    // Check for collinear points (all points in a line)
    if (this.arePointsCollinear(coordinates)) {
      errors.push({
        code: 'COLLINEAR_POINTS',
        message: 'All points are in a straight line. Cannot form a valid polygon.',
        coordinates
      });
      return { isValid: false, errors, warnings };
    }

    // Create Turf polygon (close the ring)
    const closedCoords = [...coordinates, coordinates[0]];

    try {
      const polygon = turf.polygon([closedCoords]);

      // Check for self-intersection using kinks
      const kinks = turf.kinks(polygon);

      if (kinks.features.length > 0) {
        const intersectionPoints = kinks.features.map(
          (f: any) => f.geometry.coordinates as LonLatTuple
        );

        errors.push({
          code: 'SELF_INTERSECTING',
          message: 'Polygon lines cannot cross each other.',
          coordinates: intersectionPoints
        });
      }

      // All validation passed
      return { isValid: errors.length === 0, errors, warnings };
    } catch (error) {
      errors.push({
        code: 'INVALID_GEOMETRY',
        message: 'Invalid polygon geometry: ' + (error as Error).message
      });
      return { isValid: false, errors, warnings };
    }
  }

  /**
   * Check if points are collinear (all in a straight line)
   */
  private arePointsCollinear(coordinates: LonLatTuple[]): boolean {
    if (coordinates.length < 3) return true;

    // Use cross product to check if points are collinear
    const [x1, y1] = coordinates[0];
    const [x2, y2] = coordinates[1];

    for (let i = 2; i < coordinates.length; i++) {
      const [x3, y3] = coordinates[i];

      // Cross product: (x2-x1)(y3-y1) - (y2-y1)(x3-x1)
      const crossProduct = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);

      // If any point gives non-zero cross product, points are not collinear
      if (Math.abs(crossProduct) > 1e-10) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check for self-intersection using Turf.js kinks
   */
  checkSelfIntersection(coordinates: LonLatTuple[]): Result<boolean, ZoneError> {
    try {
      const closedCoords = [...coordinates, coordinates[0]];
      const polygon = turf.polygon([closedCoords]);
      const kinks = turf.kinks(polygon);

      return {
        success: true,
        data: kinks.features.length > 0
      };
    } catch (error) {
      return {
        success: false,
        error: ZoneError.INVALID_COORDINATES
      };
    }
  }

  // ==========================================================================
  // Area Calculation
  // ==========================================================================

  /**
   * Calculate polygon area in square meters using Turf.js
   */
  calculateArea(coordinates: LonLatTuple[]): number {
    try {
      const closedCoords = [...coordinates, coordinates[0]];
      const polygon = turf.polygon([closedCoords]);
      const areaM2 = turf.area(polygon);

      return Math.round(areaM2 * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error('Failed to calculate area:', error);
      return 0;
    }
  }

  // ==========================================================================
  // Coordinate Normalization
  // ==========================================================================

  /**
   * Normalize coordinates to 6 decimal places (WGS84 precision)
   */
  normalizeCoordinates(coordinates: LonLatTuple[]): LonLatTuple[] {
    return coordinates.map(([lon, lat]) => {
      const normalizedLon = this.roundToPrecision(lon, COORDINATE_PRECISION);
      const normalizedLat = this.roundToPrecision(lat, COORDINATE_PRECISION);
      return [normalizedLon, normalizedLat];
    });
  }

  /**
   * Round number to specified decimal places
   */
  private roundToPrecision(value: number, precision: number): number {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }

  // ==========================================================================
  // Warning Generation (Edge Cases)
  // ==========================================================================

  /**
   * Generate warnings for edge cases
   */
  generateWarnings(coordinates: LonLatTuple[], areaM2: number): ZoneWarning[] {
    const warnings: ZoneWarning[] = [];

    // Small area warning
    if (areaM2 < MIN_AREA_M2) {
      warnings.push({
        code: 'SMALL_AREA',
        message: `Zone area is very small (${areaM2.toFixed(2)} m²). This may be a digitizing error.`,
        severity: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    // Large area warning (would need property bounds to calculate percentage)
    // TODO: Implement when property bounds are available

    return warnings;
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Convert validation result to error code
   */
  private getErrorFromValidation(validation: ValidationResult): ZoneError {
    if (validation.errors.length === 0) {
      return ZoneError.INVALID_COORDINATES;
    }

    const firstError = validation.errors[0];

    switch (firstError.code) {
      case 'TOO_FEW_POINTS':
        return ZoneError.TOO_FEW_POINTS;
      case 'TOO_MANY_POINTS':
        return ZoneError.TOO_MANY_POINTS;
      case 'SELF_INTERSECTING':
        return ZoneError.SELF_INTERSECTING;
      default:
        return ZoneError.INVALID_COORDINATES;
    }
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const ZoneService = new ZoneServiceClass();
