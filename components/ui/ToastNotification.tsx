'use client';

import { useEffect, useState } from 'react';
import { ErrorService, type ToastMessage } from '@/services/ErrorService';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * ToastNotification - Global toast notification system
 * Subscribes to ErrorService events and displays toast messages
 * in the top-right corner of the screen.
 */
export default function ToastNotification() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Subscribe to toast events
    const handleShow = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);
    };

    const handleHide = (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    ErrorService.on('toast:show', handleShow);
    ErrorService.on('toast:hide', handleHide);

    // Cleanup on unmount
    return () => {
      ErrorService.off('toast:show', handleShow);
      ErrorService.off('toast:hide', handleHide);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

/**
 * Individual Toast component
 */
function Toast({ toast }: { toast: ToastMessage }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      ErrorService.hideToast(toast.id);
    }, 300); // Match animation duration
  };

  // Auto-dismiss
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  // Color schemes for each toast type
  const styles = {
    success: {
      bg: 'bg-green-50 border-green-500',
      text: 'text-green-900',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: 'bg-red-50 border-red-500',
      text: 'text-red-900',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-500',
      text: 'text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-500',
      text: 'text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  };

  const style = styles[toast.type];

  return (
    <div
      className={`
        ${style.bg} ${style.text}
        border-l-4 rounded-lg shadow-lg
        px-4 py-3 pr-10
        max-w-sm w-full
        pointer-events-auto
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
        <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
        <button
          onClick={handleDismiss}
          className={`
            absolute top-3 right-3
            ${style.text} opacity-50 hover:opacity-100
            transition-opacity
            focus:outline-none focus:ring-2 focus:ring-offset-1
            rounded
          `}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
