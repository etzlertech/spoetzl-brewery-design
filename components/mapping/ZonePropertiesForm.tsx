'use client';

/**
 * ZonePropertiesForm - Modal form for creating/editing zones
 * Source: design-v2-spekster.md Section 2.5
 *
 * Features:
 * - Zone name and description inputs
 * - Color picker with presets
 * - Opacity slider
 * - Layer selection
 * - Form validation
 */

import { useState } from 'react';
import type { LonLatTuple, Layer } from '@/models/mapping/types';

// ============================================================================
// Types
// ============================================================================

export interface ZonePropertiesFormProps {
  isOpen: boolean;
  coordinates: LonLatTuple[];
  layers: Layer[];
  activeLayerId: string | null;
  onSubmit: (data: ZoneFormData) => void;
  onCancel: () => void;
}

export interface ZoneFormData {
  name: string;
  description: string;
  fillColor: string;
  opacity: number;
  layerId: string;
}

// ============================================================================
// Color Presets
// ============================================================================

const COLOR_PRESETS = [
  { name: 'Green', value: '#10B981' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' }
];

// ============================================================================
// ZonePropertiesForm Component
// ============================================================================

export default function ZonePropertiesForm({
  isOpen,
  coordinates,
  layers,
  activeLayerId,
  onSubmit,
  onCancel
}: ZonePropertiesFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fillColor, setFillColor] = useState('#10B981');
  const [opacity, setOpacity] = useState(0.5);
  const [layerId, setLayerId] = useState(activeLayerId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Zone name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Zone name must be at least 2 characters';
    } else if (name.length > 100) {
      newErrors.name = 'Zone name must be 100 characters or less';
    }

    if (!layerId) {
      newErrors.layerId = 'Please select a layer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      fillColor,
      opacity,
      layerId
    });

    // Reset form
    setName('');
    setDescription('');
    setFillColor('#10B981');
    setOpacity(0.5);
    setErrors({});
  }

  function handleCancel() {
    setName('');
    setDescription('');
    setFillColor('#10B981');
    setOpacity(0.5);
    setErrors({});
    onCancel();
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-black bg-opacity-50 flex items-end md:items-center md:justify-center">
      {/* Mobile: Bottom Sheet | Desktop: Centered Modal */}
      <div className="bg-white w-full md:max-w-md md:mx-4 rounded-t-2xl md:rounded-lg shadow-xl h-[100dvh] md:h-auto md:max-h-[90vh] flex flex-col">
        {/* Header - Compact */}
        <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Create Zone ({coordinates.length - 1} pts)</h2>
            {/* Close button */}
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form - No scroll on mobile */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto md:overflow-visible">
            {/* Zone Name */}
            <div>
              <label htmlFor="zone-name" className="block text-xs font-semibold text-gray-700 mb-1">
                Zone Name *
              </label>
              <input
                type="text"
                id="zone-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Main Entrance"
                className={`
                  w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.name ? 'border-red-500' : 'border-gray-300'}
                `}
                required
              />
              {errors.name && (
                <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Layer Selection */}
            <div>
              <label htmlFor="zone-layer" className="block text-xs font-semibold text-gray-700 mb-1">
                Layer *
              </label>
              <select
                id="zone-layer"
                value={layerId}
                onChange={(e) => setLayerId(e.target.value)}
                className={`
                  w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.layerId ? 'border-red-500' : 'border-gray-300'}
                `}
                required
              >
                <option value="">Select layer...</option>
                {layers.map(layer => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
              {errors.layerId && (
                <p className="mt-0.5 text-xs text-red-600">{errors.layerId}</p>
              )}
            </div>

            {/* Description - Compact single line */}
            <div>
              <label htmlFor="zone-description" className="block text-xs font-semibold text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                id="zone-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief notes..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Color Picker - Compact */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center gap-2">
                {/* Quick color presets - only 4 most common */}
                {COLOR_PRESETS.slice(0, 4).map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFillColor(preset.value)}
                    className={`
                      h-10 w-10 rounded-lg border-2 transition-all active:scale-95
                      ${fillColor === preset.value
                        ? 'border-gray-900 ring-2 ring-blue-400'
                        : 'border-gray-300'
                      }
                    `}
                    style={{ backgroundColor: preset.value }}
                    aria-label={`${preset.name} color`}
                  />
                ))}
                {/* Color picker */}
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="h-10 w-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                  aria-label="Custom color"
                />
                {/* Preview with opacity */}
                <div
                  className="flex-1 h-10 rounded-lg border-2 border-gray-300"
                  style={{
                    backgroundColor: fillColor,
                    opacity: opacity
                  }}
                />
              </div>
            </div>

            {/* Opacity Slider - Compact */}
            <div>
              <label htmlFor="zone-opacity" className="block text-xs font-semibold text-gray-700 mb-1">
                Opacity: {Math.round(opacity * 100)}%
              </label>
              <input
                type="range"
                id="zone-opacity"
                min="0"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Actions - Fixed at bottom, compact */}
          <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50 pb-safe">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-lg active:scale-95"
              >
                Create Zone
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
