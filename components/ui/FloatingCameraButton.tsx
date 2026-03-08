'use client';

import { Camera } from 'lucide-react';

interface FloatingCameraButtonProps {
  onClick: () => void;
}

/**
 * FloatingCameraButton - Persistent bottom-left camera button
 * Visible on all pages, opens camera capture modal
 */
export default function FloatingCameraButton({ onClick }: FloatingCameraButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-4 left-4 sm:bottom-6 sm:left-6
        w-14 h-14 sm:w-16 sm:h-16
        bg-gradient-to-br from-green-600 to-amber-600
        text-white
        rounded-full
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        hover:scale-110
        active:scale-95
        z-50
        flex items-center justify-center
        group
      "
      aria-label="Capture field photo"
      title="Capture field photo"
    >
      <Camera className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
    </button>
  );
}
