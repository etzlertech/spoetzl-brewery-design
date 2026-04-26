'use client';

/**
 * Toolbar - Mode switcher and map controls
 * Source: design-v2-spekster.md Section 2.2
 *
 * Features:
 * - Mode switcher (View, Draw, Align, Edit)
 * - Undo/Redo functionality
 * - Auto-save indicator
 * - Help button
 */

import { useState, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export type MapMode = 'view' | 'draw' | 'align' | 'edit';

export interface ToolbarProps {
  currentMode: MapMode;
  onModeChange: (mode: MapMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
}

// ============================================================================
// Toolbar Component
// ============================================================================

export default function Toolbar({
  currentMode,
  onModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isSaving,
  lastSaved
}: ToolbarProps) {
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // Show save indicator when saving completes
  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => setShowSaveIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  const modes = [
    {
      id: 'view' as MapMode,
      label: 'View',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      description: 'Pan and zoom map'
    },
    {
      id: 'draw' as MapMode,
      label: 'Draw',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      description: 'Draw zones on map'
    },
    {
      id: 'align' as MapMode,
      label: 'Align',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Position and scale images'
    },
    {
      id: 'edit' as MapMode,
      label: 'Edit',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      description: 'Edit zones and properties'
    }
  ];

  return (
    <>
      {/* Mobile Mode Switcher - Bottom Left FAB - Above bottom nav */}
      <div className="md:hidden fixed bottom-20 left-4 z-[900] flex flex-col gap-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              w-14 h-14 rounded-full shadow-lg transition-all flex items-center justify-center
              ${currentMode === mode.id
                ? 'bg-blue-600 text-white scale-110'
                : 'bg-white text-gray-700 active:scale-95'
              }
            `}
            title={mode.description}
            aria-label={mode.label}
          >
            {mode.icon}
          </button>
        ))}
      </div>

      {/* Desktop Toolbar */}
      <div className="hidden md:block absolute top-4 left-28 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 p-2">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md transition-all
                ${currentMode === mode.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
              title={mode.description}
            >
              {mode.icon}
              <span className="font-medium text-sm">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`
              p-2 rounded-md transition-colors
              ${canUndo
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
              }
            `}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`
              p-2 rounded-md transition-colors
              ${canRedo
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
              }
            `}
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>

        {/* Save Indicator */}
        <div className="flex items-center gap-2 pl-2">
          {isSaving ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span>Saving...</span>
            </div>
          ) : showSaveIndicator && lastSaved ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Saved</span>
            </div>
          ) : null}
        </div>
      </div>

        {/* Current Mode Description */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-xs text-gray-600">
            {modes.find(m => m.id === currentMode)?.description}
          </p>
        </div>
      </div>
    </>
  );
}
