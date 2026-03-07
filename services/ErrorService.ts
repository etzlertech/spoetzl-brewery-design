/**
 * ErrorService - Centralized error handling and user messaging
 * Source: design-v2-spekster.md Sections 4.6 and 8
 *
 * Responsibilities:
 * - Display toast notifications (transient errors)
 * - Display inline errors (validation, recoverable errors)
 * - Display modals (critical errors, blocking)
 * - Log errors for debugging
 * - Provide recovery actions
 */

import mitt, { Emitter } from 'mitt';
import type {
  AppError,
  ErrorContext,
  ToastType,
  RecoveryAction,
} from '@/models/mapping/types';
import {
  ZoneError,
  ImageError,
  StorageError,
  UserError,
  NetworkError
} from '@/models/mapping/types';

// ============================================================================
// Error Event Types
// ============================================================================

type ErrorEvents = {
  'toast:show': ToastMessage;
  'toast:hide': string;
  'inline:show': InlineMessage;
  'inline:hide': string;
  'modal:show': ModalMessage;
  'modal:hide': void;
};

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // Auto-dismiss time in ms (default: 5000)
}

export interface InlineMessage {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  context: string; // Component/field identifier
  recoveryActions?: RecoveryAction[];
}

export interface ModalMessage {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  blocking: boolean; // If true, user must dismiss before continuing
  recoveryActions?: RecoveryAction[];
}

// ============================================================================
// Error Message Templates (design-v2 Section 8.4)
// ============================================================================

const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  // Zone Errors
  [ZoneError.INVALID_COORDINATES]: {
    title: 'Invalid Coordinates',
    message: 'The zone coordinates are invalid. Please check latitude/longitude values are within valid ranges.'
  },
  [ZoneError.SELF_INTERSECTING]: {
    title: 'Self-Intersecting Polygon',
    message: 'The polygon lines cannot cross each other. Please adjust the points to eliminate the intersection.'
  },
  [ZoneError.TOO_FEW_POINTS]: {
    title: 'Insufficient Points',
    message: 'A zone must have at least 3 points to form a polygon.'
  },
  [ZoneError.TOO_MANY_POINTS]: {
    title: 'Too Many Points',
    message: 'Maximum 100 points reached. Close the polygon or simplify the shape.'
  },
  [ZoneError.ZONE_NOT_FOUND]: {
    title: 'Zone Not Found',
    message: 'The requested zone could not be found. It may have been deleted.'
  },
  [ZoneError.STORAGE_FAILED]: {
    title: 'Storage Failed',
    message: 'Failed to save the zone. Please try again.'
  },

  // Image Errors
  [ImageError.INVALID_FILE_TYPE]: {
    title: 'Invalid File Type',
    message: 'Only JPEG, PNG, and WebP images are supported.'
  },
  [ImageError.FILE_TOO_LARGE]: {
    title: 'File Too Large',
    message: 'Image file size must be 10MB or less. Please compress or resize the image.'
  },
  [ImageError.COMPRESSION_FAILED]: {
    title: 'Compression Failed',
    message: 'Failed to compress the image. Please try a different image.'
  },
  [ImageError.EXIF_PARSE_FAILED]: {
    title: 'EXIF Data Unavailable',
    message: 'Could not read GPS metadata from image. Manual alignment will be required.'
  },
  [ImageError.STORAGE_QUOTA_EXCEEDED]: {
    title: 'Storage Limit Reached',
    message: 'Storage quota exceeded. Please delete unused images to free up space.'
  },

  // Storage Errors
  [StorageError.QUOTA_EXCEEDED]: {
    title: 'Storage Full',
    message: 'Storage limit reached. Current usage exceeds available quota. Please delete unused zones or images.'
  },
  [StorageError.STORAGE_UNAVAILABLE]: {
    title: 'Storage Unavailable',
    message: 'Browser storage is unavailable. This may occur in private browsing mode.'
  },
  [StorageError.CORRUPTED_DATA]: {
    title: 'Data Corrupted',
    message: 'Stored data appears to be corrupted. Would you like to restore from backup or start fresh?'
  },
  [StorageError.SERIALIZATION_FAILED]: {
    title: 'Save Failed',
    message: 'Failed to serialize data for storage. Please try again.'
  },

  // User Errors
  [UserError.INVALID_USERNAME]: {
    title: 'Invalid Username',
    message: 'Please enter a valid username.'
  },
  [UserError.USERNAME_TOO_SHORT]: {
    title: 'Username Too Short',
    message: 'Username must be at least 2 characters long.'
  },
  [UserError.USERNAME_TOO_LONG]: {
    title: 'Username Too Long',
    message: 'Username must be 50 characters or less.'
  },

  // Network Errors
  [NetworkError.TILE_LOAD_FAILED]: {
    title: 'Map Tiles Failed to Load',
    message: 'Unable to load satellite imagery. Retrying...'
  },
  [NetworkError.TIMEOUT]: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.'
  }
};

// ============================================================================
// ErrorService Class
// ============================================================================

class ErrorServiceClass {
  private emitter: Emitter<ErrorEvents>;
  private logEnabled: boolean = true;

  constructor() {
    this.emitter = mitt<ErrorEvents>();
  }

  // ==========================================================================
  // Event Emitter (for React components to subscribe)
  // ==========================================================================

  /**
   * Subscribe to error events
   */
  on<T extends keyof ErrorEvents>(
    event: T,
    handler: (data: ErrorEvents[T]) => void
  ): void {
    this.emitter.on(event, handler);
  }

  /**
   * Unsubscribe from error events
   */
  off<T extends keyof ErrorEvents>(
    event: T,
    handler: (data: ErrorEvents[T]) => void
  ): void {
    this.emitter.off(event, handler);
  }

  // ==========================================================================
  // Toast Notifications (Transient Errors)
  // ==========================================================================

  /**
   * Show toast notification (auto-dismiss)
   */
  showToast(
    message: string,
    type: ToastType = 'info',
    duration: number = 5000
  ): string {
    const id = crypto.randomUUID();

    const toast: ToastMessage = {
      id,
      type,
      message,
      duration
    };

    this.emitter.emit('toast:show', toast);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hideToast(id);
      }, duration);
    }

    return id;
  }

  /**
   * Hide toast notification
   */
  hideToast(id: string): void {
    this.emitter.emit('toast:hide', id);
  }

  /**
   * Show error toast with error code
   */
  showErrorToast(error: AppError, context?: ErrorContext): string {
    const template = ERROR_MESSAGES[error];
    const message = template ? template.message : 'An unexpected error occurred.';

    if (this.logEnabled && context) {
      this.logError(error, context);
    }

    return this.showToast(message, 'error');
  }

  // ==========================================================================
  // Inline Errors (Validation, Form Errors)
  // ==========================================================================

  /**
   * Show inline error with recovery actions
   */
  showInlineError(
    message: string,
    context: string,
    recoveryActions?: RecoveryAction[]
  ): string {
    const id = crypto.randomUUID();

    const inline: InlineMessage = {
      id,
      type: 'error',
      message,
      context,
      recoveryActions
    };

    this.emitter.emit('inline:show', inline);
    return id;
  }

  /**
   * Hide inline error
   */
  hideInlineError(id: string): void {
    this.emitter.emit('inline:hide', id);
  }

  /**
   * Show inline warning
   */
  showInlineWarning(
    message: string,
    context: string,
    recoveryActions?: RecoveryAction[]
  ): string {
    const id = crypto.randomUUID();

    const inline: InlineMessage = {
      id,
      type: 'warning',
      message,
      context,
      recoveryActions
    };

    this.emitter.emit('inline:show', inline);
    return id;
  }

  // ==========================================================================
  // Modal Errors (Critical, Blocking)
  // ==========================================================================

  /**
   * Show modal error (critical, blocking)
   */
  showModal(
    title: string,
    message: string,
    type: 'error' | 'warning' | 'info' = 'error',
    blocking: boolean = false,
    recoveryActions?: RecoveryAction[]
  ): string {
    const id = crypto.randomUUID();

    const modal: ModalMessage = {
      id,
      title,
      message,
      type,
      blocking,
      recoveryActions
    };

    this.emitter.emit('modal:show', modal);
    return id;
  }

  /**
   * Hide modal
   */
  hideModal(): void {
    this.emitter.emit('modal:hide');
  }

  /**
   * Show error modal with error code
   */
  showErrorModal(
    error: AppError,
    blocking: boolean = false,
    recoveryActions?: RecoveryAction[],
    context?: ErrorContext
  ): string {
    const template = ERROR_MESSAGES[error];

    if (!template) {
      return this.showModal(
        'Error',
        'An unexpected error occurred.',
        'error',
        blocking,
        recoveryActions
      );
    }

    if (this.logEnabled && context) {
      this.logError(error, context);
    }

    return this.showModal(
      template.title,
      template.message,
      'error',
      blocking,
      recoveryActions
    );
  }

  // ==========================================================================
  // Logging
  // ==========================================================================

  /**
   * Log error to console
   */
  private logError(error: AppError, context: ErrorContext): void {
    console.error('[ErrorService]', {
      error,
      context,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Enable/disable logging
   */
  setLoggingEnabled(enabled: boolean): void {
    this.logEnabled = enabled;
  }

  // ==========================================================================
  // Specific Error Scenarios (design-v2 Section 8)
  // ==========================================================================

  /**
   * Handle storage quota exceeded
   */
  handleStorageQuotaExceeded(
    currentUsageMB: number,
    limitMB: number,
    onManageStorage: () => void
  ): void {
    const message = `Storage limit reached. Current usage: ${currentUsageMB.toFixed(1)}MB / ${limitMB.toFixed(1)}MB. Please delete unused images or export data.`;

    this.showErrorModal(
      StorageError.QUOTA_EXCEEDED,
      true,
      [
        {
          label: 'Manage Storage',
          handler: onManageStorage,
          primary: true
        },
        {
          label: 'Cancel',
          handler: () => this.hideModal()
        }
      ]
    );
  }

  /**
   * Handle corrupted localStorage
   */
  handleCorruptedStorage(
    onClearStorage: () => void,
    onExportBackup?: () => void
  ): void {
    const actions: RecoveryAction[] = [
      {
        label: 'Start Fresh',
        handler: () => {
          onClearStorage();
          this.hideModal();
        },
        primary: false
      }
    ];

    if (onExportBackup) {
      actions.unshift({
        label: 'Export Last Valid State',
        handler: () => {
          onExportBackup();
          this.hideModal();
        },
        primary: true
      });
    }

    this.showErrorModal(StorageError.CORRUPTED_DATA, true, actions);
  }

  /**
   * Handle network tile loading failure with retry
   */
  handleTileLoadFailure(onRetry: () => void, attempt: number = 1): void {
    if (attempt <= 3) {
      this.showToast(
        `Map tiles failed to load. Retrying (attempt ${attempt}/3)...`,
        'warning',
        3000
      );

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      setTimeout(onRetry, delay);
    } else {
      this.showErrorModal(
        NetworkError.TILE_LOAD_FAILED,
        false,
        [
          {
            label: 'Retry',
            handler: onRetry,
            primary: true
          }
        ]
      );
    }
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const ErrorService = new ErrorServiceClass();
