/**
 * TypeScript Type Definitions for Interactive Property Mapping Feature
 * Source: design-v2-spekster.md Section 5
 *
 * All coordinates use WGS84 (EPSG:4326) coordinate reference system
 * Coordinate precision: 6 decimal places (~0.11m accuracy)
 */

// ============================================================================
// Core Geospatial Types
// ============================================================================

/**
 * WGS84 coordinate tuple: [longitude, latitude]
 * Per RFC 7946 GeoJSON specification
 */
export type LonLatTuple = [number, number];

// ============================================================================
// Zone Models
// ============================================================================

export interface Zone {
  id: string;                          // UUID v4
  name: string;                        // User-defined, max 100 chars
  shortDescription: string;            // Max 200 chars, for tooltip
  detailedDescription: string;         // Max 2000 chars, for modal
  coordinates: LonLatTuple[];          // WGS84, 6 decimal precision
  fillColor: string;                   // Hex color, e.g., "#00FF00"
  opacity: number;                     // 0.0 - 1.0
  layerId: string;                     // Reference to Layer.id
  createdBy: string;                   // User.id
  createdDate: string;                 // ISO 8601
  modifiedBy: string | null;           // User.id
  modifiedDate: string | null;         // ISO 8601
  primaryImageId: string | null;       // Featured image for tooltip
  imageIds: string[];                  // Associated images
  customAttributes: Record<string, string>; // User-defined key-value pairs
  areaM2: number;                      // Calculated area in square meters
  warnings: ZoneWarning[];             // Validation warnings
}

export interface ZoneWarning {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

// ============================================================================
// Layer Models
// ============================================================================

export interface Layer {
  id: string;                          // UUID v4
  name: string;                        // "Main Plan", "Alternative A", etc.
  visible: boolean;                    // Toggle visibility
  locked: boolean;                     // Prevent edits
  opacity: number;                     // 0.0 - 1.0
  createdAt: string;                   // ISO 8601
  updatedAt: string;                   // ISO 8601
}

// ============================================================================
// Image Models
// ============================================================================

export interface DroneImage {
  id: string;                          // UUID v4, references IndexedDB
  filename: string;                    // Original filename
  uploadDate: string;                  // ISO 8601
  exif: EXIFData | null;               // Extracted metadata
  zoneIds: string[];                   // Associated zones
  size: number;                        // Blob size in bytes
  layerId: string;                     // Reference to Layer.id
  url: string;                         // Object URL for the image blob
  thumbnailUrl: string;                // Object URL for the thumbnail
  gpsCoordinates: LonLatTuple | null;  // GPS coordinates from EXIF
  position: LonLatTuple | null;        // Current position on map (can differ from GPS)
  rotation: number;                    // Rotation in degrees (0-360)
  opacity: number;                     // Opacity (0-1)
  updatedAt: string;                   // ISO 8601
}

export interface DroneAlignment {
  layerId: string;                     // Reference to Layer.id
  imageId: string;                     // Reference to DroneImage.id
  rotation: number;                    // Degrees, 0-360
  scale: number;                       // Percentage, 10-500
  offset: {
    x: number;                         // Pixels from GPS position
    y: number;
  };
  bounds: {                            // Calculated bounds after transform
    north: number;
    south: number;
    east: number;
    west: number;
  };
  createdBy: string;                   // User.id
  createdDate: string;                 // ISO 8601
  modifiedDate: string | null;
}

export interface ImageRecord {
  id: string;                          // UUID v4
  blob: Blob;                          // Image data
  filename: string;
  uploadDate: string;
  zoneIds: string[];
}

export interface ThumbnailRecord {
  id: string;                          // Same as ImageRecord.id
  blob: Blob;                          // 200px max dimension
}

export interface EXIFData {
  gps: {
    latitude: number;                  // Decimal degrees
    longitude: number;
    altitude: number | null;           // Meters
  } | null;
  timestamp: string | null;            // ISO 8601
  camera: {
    make: string | null;
    model: string | null;
  };
}

// ============================================================================
// User & Comment Models
// ============================================================================

export interface User {
  id: string;                          // UUID v4
  username: string;                    // Display name, 2-50 chars
  createdDate: string;                 // ISO 8601
}

export interface Comment {
  id: string;                          // UUID v4
  zoneId: string;                      // Reference to Zone.id
  author: string;                      // User.id
  text: string;                        // Max 1000 chars
  createdDate: string;                 // ISO 8601
  modifiedDate: string | null;
}

// ============================================================================
// Application State Models
// ============================================================================

export interface AppState {
  version: string;                     // Schema version, e.g., "1.0.0"
  property: 'spoetzl' | 'busch';       // Property identifier
  user?: User;
  zones: Zone[];
  layers: Layer[];
  images: DroneImage[];
  droneAlignments?: Record<string, DroneAlignment>; // Keyed by layerId
  comments?: Comment[];
  settings?: AppSettings;
  lastModified: string;                // ISO 8601
}

export interface AppSettings {
  defaultZoneColor: string;            // Hex color
  defaultZoneOpacity: number;          // 0.0 - 1.0
  autoSaveInterval: number;            // Seconds, 30 default
  tooltipAttributes: string[];         // Attribute keys to show in tooltip
  propertyBounds: {                    // Property boundary polygon
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// ============================================================================
// Result Pattern (Functional Error Handling)
// ============================================================================

export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

// ============================================================================
// Error Types
// ============================================================================

export enum ZoneError {
  INVALID_COORDINATES = 'INVALID_COORDINATES',
  SELF_INTERSECTING = 'SELF_INTERSECTING',
  TOO_FEW_POINTS = 'TOO_FEW_POINTS',
  TOO_MANY_POINTS = 'TOO_MANY_POINTS',
  ZONE_NOT_FOUND = 'ZONE_NOT_FOUND',
  STORAGE_FAILED = 'STORAGE_FAILED',
  USER_CANCELLED = 'USER_CANCELLED'
}

export enum ImageError {
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  COMPRESSION_FAILED = 'COMPRESSION_FAILED',
  EXIF_PARSE_FAILED = 'EXIF_PARSE_FAILED',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  IMAGE_NOT_FOUND = 'IMAGE_NOT_FOUND'
}

export enum StorageError {
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  STORAGE_UNAVAILABLE = 'STORAGE_UNAVAILABLE',
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  SERIALIZATION_FAILED = 'SERIALIZATION_FAILED'
}

export enum UserError {
  INVALID_USERNAME = 'INVALID_USERNAME',
  USERNAME_TOO_SHORT = 'USERNAME_TOO_SHORT',
  USERNAME_TOO_LONG = 'USERNAME_TOO_LONG'
}

export enum NetworkError {
  TILE_LOAD_FAILED = 'TILE_LOAD_FAILED',
  TIMEOUT = 'TIMEOUT'
}

export type AppError =
  | ZoneError
  | ImageError
  | StorageError
  | UserError
  | NetworkError;

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  coordinates?: LonLatTuple[];
}

export interface ValidationWarning {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

// ============================================================================
// Error Service Types
// ============================================================================

export interface ErrorContext {
  component: string;
  method: string;
  userAction: string;
  timestamp: string;
}

export type ToastType = 'error' | 'warning' | 'info' | 'success';

export interface RecoveryAction {
  label: string;
  handler: () => void;
  primary?: boolean;
}

// ============================================================================
// Storage Types
// ============================================================================

export interface QuotaInfo {
  localStorage: {
    used: number;
    limit: number;
    percentage: number;
  };
  indexedDB: {
    used: number;
    limit: number;
    percentage: number;
  };
}

// ============================================================================
// Component Event Types
// ============================================================================

export type MapCanvasEvent =
  | 'zone:created'
  | 'zone:updated'
  | 'zone:deleted'
  | 'zone:selected'
  | 'layer:toggled'
  | 'image:uploaded'
  | 'mode:changed'
  | 'error:occurred';

export type MapMode = 'view' | 'draw' | 'align' | 'edit';

// ============================================================================
// Property Configuration
// ============================================================================

export interface PropertyConfig {
  id: 'spoetzl' | 'busch';
  name: string;
  center: LonLatTuple;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  defaultZoom: number;
}

export const PROPERTY_CONFIGS: Record<'spoetzl' | 'busch', PropertyConfig> = {
  spoetzl: {
    id: 'spoetzl',
    name: 'Spoetzl Brewery',
    center: [-97.1671258, 29.434258], // Spoetzl Brewery campus, Shiner, TX
    bounds: {
      north: 29.4365,
      south: 29.4310,
      east: -97.1640,
      west: -97.1710
    },
    defaultZoom: 18
  },
  busch: {
    id: 'busch',
    name: 'Busch Gardens Williamsburg',
    center: [-76.6417, 37.2333],  // Williamsburg, VA
    bounds: {
      north: 37.2400,
      south: 37.2260,
      east: -76.6340,
      west: -76.6500
    },
    defaultZoom: 16
  }
};
