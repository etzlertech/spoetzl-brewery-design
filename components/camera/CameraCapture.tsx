'use client';

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Camera,
  CheckCircle2,
  FileImage,
  Loader2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { ErrorService } from '@/services/ErrorService';
import {
  getMediaContextOptions,
  inferMediaContextKey,
  mediaStageOptions,
  type MediaContextOption,
  type MediaStage,
} from '@/lib/media-assets';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

function fileKind(file: File) {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('image/')) return 'image';
  return null;
}

function getStageDefault(file: File | null): MediaStage {
  return file?.type.startsWith('video/') ? 'walkthrough' : 'progress';
}

/**
 * CameraCapture - Modal for capturing/uploading field photos and videos
 * with contextual metadata for zones, walkthroughs, work logs, and proposals.
 */
export default function CameraCapture({ isOpen, onClose }: CameraCaptureProps) {
  const pathname = usePathname();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const contextOptions = useMemo(() => getMediaContextOptions(), []);
  const inferredContextKey = useMemo(() => inferMediaContextKey(pathname), [pathname]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [contextKey, setContextKey] = useState(inferredContextKey);
  const [stage, setStage] = useState<MediaStage>('progress');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const selectedContext = useMemo<MediaContextOption>(() => {
    return (
      contextOptions.find((option) => option.key === contextKey) ??
      contextOptions[0]
    );
  }, [contextKey, contextOptions]);

  useEffect(() => {
    if (isOpen) {
      setContextKey(inferredContextKey);
    }
  }, [inferredContextKey, isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const resetFileInputs = () => {
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const kind = fileKind(file);

    if (!kind) {
      ErrorService.showToast('Please select a valid photo or video file', 'error', 5000);
      return;
    }

    const maxSize = kind === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      ErrorService.showToast(
        `${kind === 'video' ? 'Video' : 'Image'} too large. Max ${(maxSize / 1024 / 1024).toFixed(0)}MB.`,
        'error',
        5000,
      );
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStage(getStageDefault(file));
    setTitle(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
  };

  const buildUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      return file;
    }

    try {
      setUploadProgress(25);
      return await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 2048,
        useWebWorker: true,
        fileType: file.type,
      });
    } catch (error) {
      console.warn('Image compression failed, uploading original file:', error);
      return file;
    }
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const uploadFile = await buildUploadFile(selectedFile);
      setUploadProgress(45);

      const formData = new FormData();
      formData.append('file', uploadFile, selectedFile.name);
      formData.append('title', title || selectedFile.name);
      formData.append('note', note);
      formData.append('stage', stage);
      formData.append('contextType', selectedContext.type);
      formData.append('contextId', selectedContext.id);
      formData.append('contextLabel', selectedContext.label);
      formData.append('zoneId', selectedContext.zoneId ?? '');
      formData.append('zoneName', selectedContext.zoneName ?? '');
      formData.append('capturedAt', new Date().toISOString());

      setUploadProgress(65);

      const response = await fetch('/api/media-assets', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90);

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Upload failed');
      }

      setUploadProgress(100);
      ErrorService.showToast(`Media saved to ${selectedContext.label}`, 'success', 3500);
      window.dispatchEvent(new Event('media-assets-updated'));

      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (error) {
      console.error('Media upload error:', error);
      ErrorService.showToast(
        error instanceof Error ? error.message : 'Upload failed. Please try again.',
        'error',
        6000,
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    setUploadProgress(0);
    setTitle('');
    setNote('');
    setStage('progress');
    resetFileInputs();
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isUploading) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-h-[92dvh] w-full max-w-xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-green-700 to-amber-700 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
            <Camera className="h-6 w-6" />
            Capture Media
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92dvh-64px)] overflow-y-auto p-5 sm:max-h-[calc(92vh-64px)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">Attach to</span>
              <select
                value={contextKey}
                onChange={(event) => setContextKey(event.target.value)}
                disabled={isUploading}
                className="mt-1 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                {contextOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs text-slate-500">
                {selectedContext.description}
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">Media stage</span>
              <select
                value={stage}
                onChange={(event) => setStage(event.target.value as MediaStage)}
                disabled={isUploading}
                className="mt-1 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                {mediaStageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs text-slate-500">
                {mediaStageOptions.find((option) => option.value === stage)?.description}
              </span>
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
              id="field-photo-input"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
              id="field-video-input"
            />

            <label
              htmlFor="field-photo-input"
              className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 p-4 text-center transition hover:border-green-400 hover:bg-green-100"
            >
              <FileImage className="h-7 w-7 text-green-800" />
              <span className="mt-2 text-sm font-bold text-green-950">Photo</span>
              <span className="mt-1 text-xs text-green-800">Camera or gallery</span>
            </label>

            <label
              htmlFor="field-video-input"
              className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-4 text-center transition hover:border-amber-400 hover:bg-amber-100"
            >
              <Video className="h-7 w-7 text-amber-800" />
              <span className="mt-2 text-sm font-bold text-amber-950">Video</span>
              <span className="mt-1 text-xs text-amber-800">Walkthrough clip</span>
            </label>
          </div>

          {selectedFile && previewUrl ? (
            <div className="mt-5 space-y-4">
              <div className="overflow-hidden rounded-xl bg-slate-100">
                {selectedFile.type.startsWith('video/') ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-80 w-full bg-black object-contain"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Selected media preview"
                    className="max-h-80 w-full object-contain"
                  />
                )}
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-800">Title</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isUploading}
                  className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder="Short label for this media"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-800">Note</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  disabled={isUploading}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder="What should Spoetzl and Evergold understand from this?"
                />
              </label>

              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving media...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-green-700 to-amber-700 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : null}

              <div className="sticky bottom-0 -mx-5 -mb-5 mt-4 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-5 py-3 shadow-[0_-8px_20px_rgba(15,23,42,0.08)] sm:static sm:m-0 sm:flex-row sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                <button
                  type="button"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    resetFileInputs();
                  }}
                  disabled={isUploading}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Choose another
                </button>
                <button
                  type="button"
                  onClick={uploadSelectedFile}
                  disabled={isUploading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save to context
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Choose photo or video, then add a short note before saving.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Photos are compressed automatically. Videos are stored as captured.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
