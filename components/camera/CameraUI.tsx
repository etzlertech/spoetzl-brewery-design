'use client';

import { useState } from 'react';
import FloatingCameraButton from '@/components/ui/FloatingCameraButton';
import CameraCapture from '@/components/camera/CameraCapture';

/**
 * CameraUI - Client component wrapper for camera functionality
 * Manages modal state and renders floating button + modal
 */
export default function CameraUI() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <FloatingCameraButton onClick={() => setIsModalOpen(true)} />
      <CameraCapture
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
