/**
 * StorageService - Unified interface for localStorage and IndexedDB
 * Source: design-v2-spekster.md Section 4.4
 *
 * Responsibilities:
 * - localStorage: AppState metadata (<50KB)
 * - IndexedDB: Image blobs (>1MB)
 * - Quota monitoring and error handling
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type {
  AppState,
  Result,
  ImageRecord,
  ThumbnailRecord,
  QuotaInfo
} from '@/models/mapping/types';
import { StorageError } from '@/models/mapping/types';

// ============================================================================
// IndexedDB Schema
// ============================================================================

interface MappingDB extends DBSchema {
  images: {
    key: string;
    value: ImageRecord;
    indexes: { 'by-zone': string };
  };
  thumbnails: {
    key: string;
    value: ThumbnailRecord;
  };
}

const DB_NAME = 'SpoetzlLandscapeDesign';
const DB_VERSION = 1;

// ============================================================================
// StorageService Class
// ============================================================================

class StorageServiceClass {
  private db: IDBPDatabase<MappingDB> | null = null;

  /**
   * Initialize IndexedDB
   */
  async initialize(): Promise<Result<void, StorageError>> {
    try {
      this.db = await openDB<MappingDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create images store
          if (!db.objectStoreNames.contains('images')) {
            const imageStore = db.createObjectStore('images', { keyPath: 'id' });
            imageStore.createIndex('by-zone', 'zoneIds', { multiEntry: true });
          }

          // Create thumbnails store
          if (!db.objectStoreNames.contains('thumbnails')) {
            db.createObjectStore('thumbnails', { keyPath: 'id' });
          }
        }
      });

      return { success: true, data: undefined };
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      return {
        success: false,
        error: StorageError.STORAGE_UNAVAILABLE
      };
    }
  }

  // ==========================================================================
  // AppState Management (localStorage)
  // ==========================================================================

  /**
   * Save AppState to localStorage
   */
  async saveState(state: AppState): Promise<Result<void, StorageError>> {
    try {
      // Validate state structure
      const validation = this.validateState(state);
      if (!validation.success) {
        return validation;
      }

      // Check quota before save
      const quotaResult = await this.getQuotaUsage();
      if (quotaResult.success) {
        const { localStorage: ls } = quotaResult.data;
        if (ls.percentage > 90) {
          return {
            success: false,
            error: StorageError.QUOTA_EXCEEDED
          };
        }
      }

      // Serialize to JSON
      const json = JSON.stringify(state);

      // Save to localStorage with property-specific key
      const key = `${state.property}_app_state_v1`;
      localStorage.setItem(key, json);

      return { success: true, data: undefined };
    } catch (error) {
      if ((error as Error).name === 'QuotaExceededError') {
        return {
          success: false,
          error: StorageError.QUOTA_EXCEEDED
        };
      }
      return {
        success: false,
        error: StorageError.SERIALIZATION_FAILED
      };
    }
  }

  /**
   * Load AppState from localStorage
   */
  async loadState(
    property: 'spoetzl' | 'busch'
  ): Promise<Result<AppState, StorageError>> {
    try {
      const key = `${property}_app_state_v1`;
      const json = localStorage.getItem(key);

      if (!json) {
        return {
          success: false,
          error: StorageError.CORRUPTED_DATA
        };
      }

      const state = JSON.parse(json) as AppState;

      // Validate parsed state
      const validation = this.validateState(state);
      if (!validation.success) {
        return {
          success: false,
          error: StorageError.CORRUPTED_DATA
        };
      }

      return { success: true, data: state };
    } catch (error) {
      console.error('Failed to load state:', error);
      return {
        success: false,
        error: StorageError.CORRUPTED_DATA
      };
    }
  }

  /**
   * Validate AppState structure
   */
  validateState(state: any): Result<boolean, StorageError> {
    // Required fields
    if (!state.version || !state.property || !state.zones || !state.layers) {
      return {
        success: false,
        error: StorageError.CORRUPTED_DATA
      };
    }

    // Validate zones array
    if (!Array.isArray(state.zones)) {
      return {
        success: false,
        error: StorageError.CORRUPTED_DATA
      };
    }

    // Validate each zone
    for (const zone of state.zones) {
      if (!this.isValidZone(zone)) {
        return {
          success: false,
          error: StorageError.CORRUPTED_DATA
        };
      }
    }

    return { success: true, data: true };
  }

  /**
   * Validate individual zone structure
   */
  private isValidZone(zone: any): boolean {
    return (
      typeof zone.id === 'string' &&
      typeof zone.name === 'string' &&
      Array.isArray(zone.coordinates) &&
      zone.coordinates.length >= 3 &&
      zone.coordinates.every(
        (coord: any) =>
          Array.isArray(coord) &&
          coord.length === 2 &&
          typeof coord[0] === 'number' &&
          typeof coord[1] === 'number'
      )
    );
  }

  // ==========================================================================
  // Image Management (IndexedDB)
  // ==========================================================================

  /**
   * Save image to IndexedDB
   */
  async saveImage(image: ImageRecord): Promise<Result<void, StorageError>> {
    if (!this.db) {
      const initResult = await this.initialize();
      if (!initResult.success) return initResult;
    }

    try {
      await this.db!.put('images', image);
      return { success: true, data: undefined };
    } catch (error) {
      if ((error as Error).name === 'QuotaExceededError') {
        return {
          success: false,
          error: StorageError.QUOTA_EXCEEDED
        };
      }
      return {
        success: false,
        error: StorageError.STORAGE_UNAVAILABLE
      };
    }
  }

  /**
   * Get image from IndexedDB
   */
  async getImage(id: string): Promise<Result<ImageRecord, StorageError>> {
    if (!this.db) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return {
          success: false,
          error: initResult.error
        };
      }
    }

    try {
      const image = await this.db!.get('images', id);
      if (!image) {
        return {
          success: false,
          error: StorageError.CORRUPTED_DATA
        };
      }
      return { success: true, data: image };
    } catch (error) {
      return {
        success: false,
        error: StorageError.STORAGE_UNAVAILABLE
      };
    }
  }

  /**
   * Delete image from IndexedDB
   */
  async deleteImage(id: string): Promise<Result<void, StorageError>> {
    if (!this.db) {
      const initResult = await this.initialize();
      if (!initResult.success) return initResult;
    }

    try {
      await this.db!.delete('images', id);
      await this.db!.delete('thumbnails', id);
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: StorageError.STORAGE_UNAVAILABLE
      };
    }
  }

  // ==========================================================================
  // Thumbnail Management (IndexedDB)
  // ==========================================================================

  /**
   * Save thumbnail to IndexedDB
   */
  async saveThumbnail(
    thumbnail: ThumbnailRecord
  ): Promise<Result<void, StorageError>> {
    if (!this.db) {
      const initResult = await this.initialize();
      if (!initResult.success) return initResult;
    }

    try {
      await this.db!.put('thumbnails', thumbnail);
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: StorageError.QUOTA_EXCEEDED
      };
    }
  }

  /**
   * Get thumbnail from IndexedDB
   */
  async getThumbnail(
    id: string
  ): Promise<Result<ThumbnailRecord, StorageError>> {
    if (!this.db) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return {
          success: false,
          error: initResult.error
        };
      }
    }

    try {
      const thumbnail = await this.db!.get('thumbnails', id);
      if (!thumbnail) {
        return {
          success: false,
          error: StorageError.CORRUPTED_DATA
        };
      }
      return { success: true, data: thumbnail };
    } catch (error) {
      return {
        success: false,
        error: StorageError.STORAGE_UNAVAILABLE
      };
    }
  }

  // ==========================================================================
  // Quota Management
  // ==========================================================================

  /**
   * Get current storage quota usage
   */
  async getQuotaUsage(): Promise<Result<QuotaInfo, StorageError>> {
    try {
      // Calculate localStorage usage
      let localStorageUsed = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            localStorageUsed += key.length + value.length;
          }
        }
      }
      localStorageUsed *= 2; // UTF-16 encoding (2 bytes per char)

      // Estimate localStorage limit (typically 5-10MB)
      const localStorageLimit = 10 * 1024 * 1024; // 10MB

      // Get IndexedDB usage (if navigator.storage.estimate is available)
      let indexedDBUsed = 0;
      let indexedDBLimit = 50 * 1024 * 1024; // Default estimate: 50MB

      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage) {
          indexedDBUsed = estimate.usage - localStorageUsed;
        }
        if (estimate.quota) {
          indexedDBLimit = estimate.quota;
        }
      }

      return {
        success: true,
        data: {
          localStorage: {
            used: localStorageUsed,
            limit: localStorageLimit,
            percentage: (localStorageUsed / localStorageLimit) * 100
          },
          indexedDB: {
            used: indexedDBUsed,
            limit: indexedDBLimit,
            percentage: (indexedDBUsed / indexedDBLimit) * 100
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: StorageError.STORAGE_UNAVAILABLE
      };
    }
  }

  /**
   * Clear old data before a specific date
   */
  async clearOldData(beforeDate: string): Promise<Result<number, StorageError>> {
    if (!this.db) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return {
          success: false,
          error: initResult.error
        };
      }
    }

    try {
      const cutoffDate = new Date(beforeDate);
      let deletedCount = 0;

      // Get all images
      const allImages = await this.db!.getAll('images');

      // Delete images older than cutoff date
      for (const image of allImages) {
        const uploadDate = new Date(image.uploadDate);
        if (uploadDate < cutoffDate) {
          await this.deleteImage(image.id);
          deletedCount++;
        }
      }

      return { success: true, data: deletedCount };
    } catch (error) {
      return {
        success: false,
        error: StorageError.STORAGE_UNAVAILABLE
      };
    }
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const StorageService = new StorageServiceClass();
