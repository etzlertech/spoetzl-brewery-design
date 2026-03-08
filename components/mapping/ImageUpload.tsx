'use client';

/**
 * ImageUpload - Drag-and-drop image upload component
 * Source: design-v2-spekster.md Section 2.7
 *
 * Features:
 * - Drag-and-drop file upload
 * - Click to browse files
 * - Image preview with thumbnails
 * - Upload progress indicator
 * - EXIF extraction and GPS auto-positioning
 * - Integration with ImageService
 */

import { useState, useRef, useCallback } from 'react';
import { ImageService } from '@/services/ImageService';
import { ErrorService } from '@/services/ErrorService';
import type { DroneImage, Layer } from '@/models/mapping/types';

// ============================================================================
// Types
// ============================================================================

export interface ImageUploadProps {
  layers: Layer[];
  activeLayerId: string | null;
  onImageUploaded: (image: DroneImage) => void;
}

interface UploadingImage {
  file: File;
  progress: number;
  preview: string;
}

// ============================================================================
// ImageUpload Component
// ============================================================================

export default function ImageUpload({
  layers,
  activeLayerId,
  onImageUploaded
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection
   */
  const handleFiles = useCallback(async (files: FileList) => {
    if (!activeLayerId) {
      ErrorService.showToast('Please select a layer first', 'error');
      return;
    }

    const validFiles: File[] = [];

    // Validate files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file type
      if (!file.type.startsWith('image/')) {
        ErrorService.showToast(`${file.name} is not an image file`, 'error');
        continue;
      }

      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        ErrorService.showToast(`${file.name} is too large (max 50MB)`, 'error');
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Create previews
    const newUploading: UploadingImage[] = validFiles.map(file => ({
      file,
      progress: 0,
      preview: URL.createObjectURL(file)
    }));

    setUploadingImages(prev => [...prev, ...newUploading]);

    // Upload each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];

      try {
        // Upload with ImageService
        const result = await ImageService.uploadImage(
          file,
          activeLayerId,
          [] // No zones selected yet
        );

        if (result.success) {
          // Update progress to 100%
          setUploadingImages(prev =>
            prev.map(img =>
              img.file === file ? { ...img, progress: 100 } : img
            )
          );

          // Notify parent
          onImageUploaded(result.data);

          // Remove from uploading list after delay
          setTimeout(() => {
            setUploadingImages(prev =>
              prev.filter(img => img.file !== file)
            );
          }, 2000);

          ErrorService.showToast(`${file.name} uploaded successfully`, 'success', 2000);
        } else {
          ErrorService.showErrorToast(result.error);

          // Remove failed upload
          setUploadingImages(prev =>
            prev.filter(img => img.file !== file)
          );
        }
      } catch (error) {
        console.error('Upload error:', error);
        ErrorService.showToast(`Failed to upload ${file.name}`, 'error');

        setUploadingImages(prev =>
          prev.filter(img => img.file !== file)
        );
      }
    }
  }, [activeLayerId, onImageUploaded]);

  /**
   * Handle drag events
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    e.target.value = '';
  }, [handleFiles]);

  /**
   * Open file picker
   */
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      {/* Drag-and-drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <svg
          className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragging ? 'Drop images here' : 'Drag & drop drone images'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse (max 50MB per image)
        </p>
        <p className="text-xs text-gray-400">
          Supports JPG, PNG, TIFF with GPS EXIF data
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Uploading images */}
      {uploadingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading...</h4>
          {uploadingImages.map((img, index) => (
            <div
              key={`${img.file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {/* Preview thumbnail */}
              <img
                src={img.preview}
                alt={img.file.name}
                className="w-16 h-16 object-cover rounded"
              />

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {img.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(img.file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {/* Progress bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${img.progress}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              {img.progress === 100 && (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {!activeLayerId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">Select a layer first</p>
              <p className="text-xs text-yellow-700 mt-1">
                Images must be associated with a layer before upload
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
