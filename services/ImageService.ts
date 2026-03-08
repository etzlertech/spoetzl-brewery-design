/**
 * ImageService - Image upload, compression, EXIF extraction, and storage
 * Source: design-v2-spekster.md Section 4.3
 *
 * Responsibilities:
 * - Validate file type and size
 * - Compress images (browser-image-compression)
 * - Extract EXIF metadata (exifr)
 * - Generate thumbnails (200px max dimension)
 * - Store in IndexedDB via StorageService
 */

import imageCompression from 'browser-image-compression';
import exifr from 'exifr';
import type {
  DroneImage,
  EXIFData,
  ImageRecord,
  ThumbnailRecord,
  Result,
  LonLatTuple
} from '@/models/mapping/types';
import { ImageError } from '@/models/mapping/types';
import { StorageService } from './StorageService';

// ============================================================================
// Constants (from design-v2 Section 4.3)
// ============================================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const COMPRESSION_MAX_SIZE_MB = 2; // Target max size after compression
const THUMBNAIL_MAX_DIMENSION = 200; // pixels

// ============================================================================
// ImageService Class
// ============================================================================

class ImageServiceClass {
  // ==========================================================================
  // Image Upload Pipeline
  // ==========================================================================

  /**
   * Upload image with full pipeline: validate, compress, extract EXIF, generate thumbnail
   */
  async uploadImage(
    file: File,
    layerId: string,
    zoneIds: string[] = []
  ): Promise<Result<DroneImage, ImageError>> {
    // Step 1: Validate file type
    const typeValidation = this.validateFileType(file);
    if (!typeValidation.success) {
      return typeValidation;
    }

    // Step 2: Validate file size
    const sizeValidation = this.validateFileSize(file);
    if (!sizeValidation.success) {
      return sizeValidation;
    }

    // Step 3: Extract EXIF metadata
    const exifResult = await this.extractEXIF(file);
    const exifData = exifResult.success ? exifResult.data : null;

    // Step 4: Compress image
    const compressionResult = await this.compressImage(file);
    if (!compressionResult.success) {
      return compressionResult;
    }

    const compressedBlob = compressionResult.data;

    // Step 5: Generate thumbnail
    const thumbnailResult = await this.generateThumbnail(file);
    if (!thumbnailResult.success) {
      return {
        success: false,
        error: thumbnailResult.error
      };
    }

    const thumbnailBlob = thumbnailResult.data;

    // Step 6: Create object URLs for the blobs
    const imageUrl = URL.createObjectURL(compressedBlob);
    const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

    // Extract GPS coordinates from EXIF
    const gpsCoordinates: LonLatTuple | null = exifData?.gps
      ? [exifData.gps.longitude, exifData.gps.latitude]
      : null;

    // Step 7: Create DroneImage record
    const droneImage: DroneImage = {
      id: crypto.randomUUID(),
      filename: file.name,
      uploadDate: new Date().toISOString(),
      exif: exifData,
      zoneIds,
      size: compressedBlob.size,
      layerId,
      url: imageUrl,
      thumbnailUrl,
      gpsCoordinates,
      position: gpsCoordinates, // Initially set to GPS coordinates
      rotation: 0,
      opacity: 0.7,
      updatedAt: new Date().toISOString()
    };

    // Step 8: Store image in IndexedDB
    const imageRecord: ImageRecord = {
      id: droneImage.id,
      blob: compressedBlob,
      filename: file.name,
      uploadDate: droneImage.uploadDate,
      zoneIds
    };

    const storageResult = await StorageService.saveImage(imageRecord);
    if (!storageResult.success) {
      return {
        success: false,
        error: ImageError.STORAGE_QUOTA_EXCEEDED
      };
    }

    // Step 9: Store thumbnail
    const thumbnailRecord: ThumbnailRecord = {
      id: droneImage.id,
      blob: thumbnailBlob
    };

    await StorageService.saveThumbnail(thumbnailRecord);

    return { success: true, data: droneImage };
  }

  // ==========================================================================
  // Validation
  // ==========================================================================

  /**
   * Validate file type (JPEG, PNG, WebP only)
   */
  validateFileType(file: File): Result<boolean, ImageError> {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: ImageError.INVALID_FILE_TYPE
      };
    }

    return { success: true, data: true };
  }

  /**
   * Validate file size (max 10MB)
   */
  validateFileSize(file: File): Result<boolean, ImageError> {
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: ImageError.FILE_TOO_LARGE
      };
    }

    return { success: true, data: true };
  }

  // ==========================================================================
  // Image Compression (browser-image-compression)
  // ==========================================================================

  /**
   * Compress image to reduce file size
   */
  async compressImage(file: File): Promise<Result<Blob, ImageError>> {
    try {
      const options = {
        maxSizeMB: COMPRESSION_MAX_SIZE_MB,
        maxWidthOrHeight: 4096, // Max dimension
        useWebWorker: true,
        fileType: file.type
      };

      const compressedFile = await imageCompression(file, options);

      return { success: true, data: compressedFile };
    } catch (error) {
      console.error('Image compression failed:', error);
      return {
        success: false,
        error: ImageError.COMPRESSION_FAILED
      };
    }
  }

  /**
   * Generate thumbnail (200px max dimension)
   */
  async generateThumbnail(file: File): Promise<Result<Blob, ImageError>> {
    try {
      const options = {
        maxSizeMB: 0.1, // 100KB max
        maxWidthOrHeight: THUMBNAIL_MAX_DIMENSION,
        useWebWorker: true,
        fileType: file.type
      };

      const thumbnail = await imageCompression(file, options);

      return { success: true, data: thumbnail };
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      return {
        success: false,
        error: ImageError.COMPRESSION_FAILED
      };
    }
  }

  // ==========================================================================
  // EXIF Metadata Extraction (exifr)
  // ==========================================================================

  /**
   * Extract EXIF metadata from image
   */
  async extractEXIF(file: File): Promise<Result<EXIFData, ImageError>> {
    try {
      const exif = await exifr.parse(file, {
        gps: true,
        pick: ['GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'DateTime', 'Make', 'Model']
      });

      if (!exif) {
        return {
          success: false,
          error: ImageError.EXIF_PARSE_FAILED
        };
      }

      // Extract GPS data
      const gpsData = this.extractGPSData(exif);

      // Extract timestamp
      const timestamp = exif.DateTime
        ? new Date(exif.DateTime).toISOString()
        : null;

      // Extract camera info
      const camera = {
        make: exif.Make || null,
        model: exif.Model || null
      };

      const exifData: EXIFData = {
        gps: gpsData,
        timestamp,
        camera
      };

      return { success: true, data: exifData };
    } catch (error) {
      console.warn('EXIF extraction failed (may not contain GPS data):', error);
      return {
        success: false,
        error: ImageError.EXIF_PARSE_FAILED
      };
    }
  }

  /**
   * Extract GPS coordinates from EXIF data
   */
  private extractGPSData(exif: any): EXIFData['gps'] {
    if (!exif.GPSLatitude || !exif.GPSLongitude) {
      return null;
    }

    try {
      const latitude = this.parseGPSCoordinate(exif.GPSLatitude, exif.GPSLatitudeRef);
      const longitude = this.parseGPSCoordinate(exif.GPSLongitude, exif.GPSLongitudeRef);
      const altitude = exif.GPSAltitude || null;

      return {
        latitude,
        longitude,
        altitude
      };
    } catch (error) {
      console.error('Failed to parse GPS coordinates:', error);
      return null;
    }
  }

  /**
   * Parse GPS coordinate from EXIF format to decimal degrees
   */
  private parseGPSCoordinate(coord: number | number[], ref?: string): number {
    let decimal: number;

    if (typeof coord === 'number') {
      decimal = coord;
    } else if (Array.isArray(coord) && coord.length === 3) {
      // Convert degrees, minutes, seconds to decimal
      const [degrees, minutes, seconds] = coord;
      decimal = degrees + minutes / 60 + seconds / 3600;
    } else {
      throw new Error('Invalid GPS coordinate format');
    }

    // Apply hemisphere reference (S/W are negative)
    if (ref === 'S' || ref === 'W') {
      decimal = -decimal;
    }

    return decimal;
  }

  /**
   * Get GPS coordinates as LonLatTuple (for Leaflet)
   */
  getGPSCoordinates(exifData: EXIFData | null): LonLatTuple | null {
    if (!exifData || !exifData.gps) {
      return null;
    }

    return [exifData.gps.longitude, exifData.gps.latitude];
  }

  // ==========================================================================
  // Image Retrieval
  // ==========================================================================

  /**
   * Get image blob from IndexedDB
   */
  async getImage(id: string): Promise<Result<ImageRecord, ImageError>> {
    const result = await StorageService.getImage(id);

    if (!result.success) {
      return {
        success: false,
        error: ImageError.IMAGE_NOT_FOUND
      };
    }

    return result;
  }

  /**
   * Get thumbnail blob from IndexedDB
   */
  async getThumbnail(id: string): Promise<Result<ThumbnailRecord, ImageError>> {
    const result = await StorageService.getThumbnail(id);

    if (!result.success) {
      return {
        success: false,
        error: ImageError.IMAGE_NOT_FOUND
      };
    }

    return result;
  }

  /**
   * Create object URL for displaying image
   */
  createImageURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  /**
   * Revoke object URL to free memory
   */
  revokeImageURL(url: string): void {
    URL.revokeObjectURL(url);
  }

  // ==========================================================================
  // Image Management
  // ==========================================================================

  /**
   * Delete image from storage
   */
  async deleteImage(id: string): Promise<Result<void, ImageError>> {
    const result = await StorageService.deleteImage(id);

    if (!result.success) {
      return {
        success: false,
        error: ImageError.IMAGE_NOT_FOUND
      };
    }

    return { success: true, data: undefined };
  }

  /**
   * Associate image with zone
   */
  async associateWithZone(
    imageId: string,
    zoneId: string
  ): Promise<Result<void, ImageError>> {
    const imageResult = await StorageService.getImage(imageId);

    if (!imageResult.success) {
      return {
        success: false,
        error: ImageError.IMAGE_NOT_FOUND
      };
    }

    const image = imageResult.data;

    // Add zone ID if not already present
    if (!image.zoneIds.includes(zoneId)) {
      image.zoneIds.push(zoneId);
      await StorageService.saveImage(image);
    }

    return { success: true, data: undefined };
  }

  /**
   * Remove image from zone association
   */
  async removeFromZone(
    imageId: string,
    zoneId: string
  ): Promise<Result<void, ImageError>> {
    const imageResult = await StorageService.getImage(imageId);

    if (!imageResult.success) {
      return {
        success: false,
        error: ImageError.IMAGE_NOT_FOUND
      };
    }

    const image = imageResult.data;

    // Remove zone ID
    image.zoneIds = image.zoneIds.filter(id => id !== zoneId);
    await StorageService.saveImage(image);

    return { success: true, data: undefined };
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const ImageService = new ImageServiceClass();
