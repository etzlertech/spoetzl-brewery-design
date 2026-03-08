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
      <div className="bg-white w-full md:max-w-md md:mx-4 rounded-t-2xl md:rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Create Zone</h2>
              <p className="text-sm text-gray-600 mt-1">
                {coordinates.length - 1} points
              </p>
            </div>
            {/* Close button for mobile */}
            <button
              type="button"
              onClick={handleCancel}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-5">
            {/* Zone Name */}
            <div>
              <label htmlFor="zone-name" className="block text-sm font-semibold text-gray-700 mb-2">
                Zone Name *
              </label>
              <input
                type="text"
                id="zone-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Main Entrance, Parking Lot A"
                className={`
                  w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.name ? 'border-red-500' : 'border-gray-300'}
                `}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="zone-description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="zone-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about this zone..."
                rows={3}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Layer Selection */}
            <div>
              <label htmlFor="zone-layer" className="block text-sm font-semibold text-gray-700 mb-2">
                Layer *
              </label>
              <select
                id="zone-layer"
                value={layerId}
                onChange={(e) => setLayerId(e.target.value)}
                className={`
                  w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.layerId ? 'border-red-500' : 'border-gray-300'}
                `}
                required
              >
                <option value="">Select a layer...</option>
                {layers.map(layer => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
              {errors.layerId && (
                <p className="mt-1 text-sm text-red-600">{errors.layerId}</p>
              )}
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Fill Color
              </label>
              {/* Color presets - larger touch targets */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFillColor(preset.value)}
                    className={`
                      h-14 rounded-xl border-3 transition-all active:scale-95
                      ${fillColor === preset.value
                        ? 'border-gray-900 ring-2 ring-blue-500 ring-offset-2 scale-105'
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                    aria-label={`Select ${preset.name} color`}
                  />
                ))}
              </div>

              {/* Custom color input */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="h-12 w-24 rounded-lg border border-gray-300 cursor-pointer"
                  aria-label="Pick custom color"
                />
                <input
                  type="text"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  aria-label="Color hex value"
                />
              </div>
            </div>

            {/* Opacity Slider */}
            <div>
              <label htmlFor="zone-opacity" className="block text-sm font-semibold text-gray-700 mb-3">
                Opacity: {Math.round(opacity * 100)}%
              </label>
              <input
                type="range"
                id="zone-opacity"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                style={{ WebkitAppearance: 'none' }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Transparent</span>
                <span>Solid</span>
              </div>
            </div>

            {/* Preview */}
            <div className="border-2 border-gray-300 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Preview</p>
              <div
                className="h-20 rounded-lg border-2 border-gray-300"
                style={{
                  backgroundColor: fillColor,
                  opacity: opacity
                }}
              />
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 md:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-base active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-base shadow-lg active:scale-95"
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
