'use client';

/**
 * LayerPanel - Layer management sidebar
 * Source: design-v2-spekster.md Section 2.3
 *
 * Features:
 * - Create/rename/delete layers
 * - Toggle layer visibility
 * - Reorder layers (drag-drop)
 * - Show zone count per layer
 */

import { useState } from 'react';
import type { Layer } from '@/models/mapping/types';

// ============================================================================
// Types
// ============================================================================

export interface LayerPanelProps {
  layers: Layer[];
  activeLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerCreate: (name: string) => void;
  onLayerRename: (layerId: string, newName: string) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  zoneCountByLayer: Record<string, number>;
}

// ============================================================================
// LayerPanel Component
// ============================================================================

export default function LayerPanel({
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerCreate,
  onLayerRename,
  onLayerDelete,
  onLayerToggleVisibility,
  zoneCountByLayer
}: LayerPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingLayer, setIsCreatingLayer] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState('');

  function handleCreateLayer(e: React.FormEvent) {
    e.preventDefault();
    if (newLayerName.trim()) {
      onLayerCreate(newLayerName.trim());
      setNewLayerName('');
      setIsCreatingLayer(false);
    }
  }

  function handleRenameLayer(layerId: string, e: React.FormEvent) {
    e.preventDefault();
    if (editingLayerName.trim()) {
      onLayerRename(layerId, editingLayerName.trim());
      setEditingLayerId(null);
      setEditingLayerName('');
    }
  }

  function startEditingLayer(layer: Layer) {
    setEditingLayerId(layer.id);
    setEditingLayerName(layer.name);
  }

  return (
    <>
      {/* Toggle Button (Mobile & Desktop) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[1000] md:bottom-auto md:top-4 md:right-4 bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
        title="Layers"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {layers.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {layers.length}
          </span>
        )}
      </button>

      {/* Layer Panel Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black bg-opacity-50 md:bg-transparent md:pointer-events-none"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-auto md:top-4 md:right-4 md:left-auto z-[1000] w-full md:w-80 bg-white rounded-t-2xl md:rounded-lg shadow-lg border border-gray-200 max-h-[80vh] md:max-h-[calc(100vh-120px)] flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">Layers</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCreatingLayer(true)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Create new layer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors md:hidden"
                    title="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Organize zones into layers for better management
              </p>
            </div>

      {/* New Layer Form */}
      {isCreatingLayer && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <form onSubmit={handleCreateLayer}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Layer Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                placeholder="e.g., Main Areas"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingLayer(false);
                  setNewLayerName('');
                }}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {layers.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm text-gray-600 mb-2">No layers yet</p>
            <p className="text-xs text-gray-500">
              Click the + button to create your first layer
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`
                  p-4 cursor-pointer transition-colors
                  ${activeLayerId === layer.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                `}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Visibility Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggleVisibility(layer.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title={layer.visible ? 'Hide layer' : 'Show layer'}
                    >
                      {layer.visible ? (
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>

                    {/* Layer Name */}
                    {editingLayerId === layer.id ? (
                      <form onSubmit={(e) => handleRenameLayer(layer.id, e)} className="flex-1">
                        <input
                          type="text"
                          value={editingLayerName}
                          onChange={(e) => setEditingLayerName(e.target.value)}
                          className="w-full px-2 py-1 border border-blue-500 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          autoFocus
                          onBlur={() => handleRenameLayer(layer.id, { preventDefault: () => {} } as any)}
                          required
                        />
                      </form>
                    ) : (
                      <span className="font-medium text-gray-900 text-sm flex-1">
                        {layer.name}
                      </span>
                    )}

                    {/* Zone Count */}
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {zoneCountByLayer[layer.id] || 0} zones
                    </span>
                  </div>

                  {/* Actions Menu */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingLayer(layer);
                      }}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                      title="Rename layer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete layer "${layer.name}"? This will also delete all zones in this layer.`)) {
                          onLayerDelete(layer.id);
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete layer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
          </div>
        </div>
      )}
    </>
  );
}
