'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { X, Camera, Upload, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { ErrorService } from '@/services/ErrorService';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CameraCapture - Modal for capturing/uploading images
 * Supports mobile camera capture and file upload with compression
 */
export default function CameraCapture({ isOpen, onClose }: CameraCaptureProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - accept all image formats
    if (!file.type.startsWith('image/')) {
      ErrorService.showToast('Please select a valid image file', 'error', 5000);
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      ErrorService.showToast('Image too large (max 10MB)', 'error', 5000);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Compress and upload
    await compressAndUpload(file);
  };

  const compressAndUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(20);

      // Compression options
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 2048,
        useWebWorker: true,
        fileType: file.type,
      };

      // Compress image
      const compressedFile = await imageCompression(file, options);
      setUploadProgress(50);

      console.log(`Original: ${(file.size / 1024).toFixed(1)}KB, Compressed: ${(compressedFile.size / 1024).toFixed(1)}KB`);

      // Upload to API
      const formData = new FormData();
      formData.append('image', compressedFile);

      setUploadProgress(70);

      const response = await fetch('/api/camera-capture', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);

      // Success!
      ErrorService.showToast('Photo captured successfully!', 'success', 3000);

      // Close modal after brief delay
      setTimeout(() => {
        handleClose();
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      ErrorService.showToast(
        error instanceof Error ? error.message : 'Upload failed. Please try again.',
        'error',
        5000
      );
      setSelectedImage(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isUploading) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[900] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-amber-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Capture Field Photo
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedImage ? (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-600 to-amber-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6">
                Capture a photo or select from your gallery
              </p>

              {/* File Input Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="camera-input"
              />
              <label
                htmlFor="camera-input"
                className={`
                  inline-flex items-center gap-2 px-6 py-3
                  bg-gradient-to-r from-green-600 to-amber-600
                  text-white font-semibold rounded-lg
                  shadow-lg hover:shadow-xl
                  transition-all cursor-pointer
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                `}
              >
                <Upload className="w-5 h-5" />
                Select Image
              </label>

              <p className="text-xs text-gray-500 mt-4">
                All image formats supported • Max 10MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
