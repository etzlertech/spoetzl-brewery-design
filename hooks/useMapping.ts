'use client';

/**
 * useMapping - State management hook for mapping feature
 * Source: design-v2-spekster.md Section 3
 *
 * Manages:
 * - Map mode (view, draw, align, edit)
 * - Layers (create, update, delete)
 * - Zones (create, update, delete)
 * - Images (upload, position, transform)
 * - Undo/redo history
 * - Auto-save with localStorage
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MapMode } from '@/components/mapping/Toolbar';
import type { Layer, Zone, DroneImage, AppState, LonLatTuple } from '@/models/mapping/types';
import { StorageService } from '@/services/StorageService';
import { ZoneService } from '@/services/ZoneService';
import { ErrorService } from '@/services/ErrorService';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types
// ============================================================================

interface MappingState {
  layers: Layer[];
  zones: Zone[];
  images: DroneImage[];
  activeLayerId: string | null;
  selectedZoneId: string | null;
  selectedImageId: string | null;
}

interface HistoryState {
  past: MappingState[];
  present: MappingState;
  future: MappingState[];
}

// ============================================================================
// useMapping Hook
// ============================================================================

export function useMapping(property: 'spoetzl' | 'busch', userId: string) {
  // Map mode
  const [mode, setMode] = useState<MapMode>('view');

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: {
      layers: [],
      zones: [],
      images: [],
      activeLayerId: null,
      selectedZoneId: null,
      selectedImageId: null
    },
    future: []
  });

  // Auto-save state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial state from storage
  useEffect(() => {
    if (userId) {
      loadState();
    }
  }, [property, userId]);

  // Auto-save when state changes
  useEffect(() => {
    if (!userId) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule save after 2 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      saveState();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [history.present, userId]);

  /**
   * Load state from localStorage
   */
  async function loadState() {
    const result = await StorageService.loadState(property);
    if (result.success) {
      setHistory({
        past: [],
        present: {
          layers: result.data.layers,
          zones: result.data.zones,
          images: result.data.images,
          activeLayerId: result.data.layers[0]?.id || null,
          selectedZoneId: null,
          selectedImageId: null
        },
        future: []
      });
    } else {
      // Initialize with default layer
      const defaultLayer: Layer = {
        id: uuidv4(),
        name: 'Main Layer',
        visible: true,
        locked: false,
        opacity: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setHistory({
        past: [],
        present: {
          layers: [defaultLayer],
          zones: [],
          images: [],
          activeLayerId: defaultLayer.id,
          selectedZoneId: null,
          selectedImageId: null
        },
        future: []
      });
    }
  }

  /**
   * Save state to localStorage
   */
  async function saveState() {
    setIsSaving(true);

    const appState: AppState = {
      property,
      layers: history.present.layers,
      zones: history.present.zones,
      images: history.present.images,
      version: '2.0',
      lastModified: new Date().toISOString()
    };

    const result = await StorageService.saveState(appState);

    if (result.success) {
      setLastSaved(new Date());
    } else {
      ErrorService.showErrorToast(result.error);
    }

    setIsSaving(false);
  }

  /**
   * Update state with history tracking
   */
  function updateState(updates: Partial<MappingState>) {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: { ...prev.present, ...updates },
      future: [] // Clear future when new action is taken
    }));
  }

  /**
   * Undo last action
   */
  function undo() {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const newPast = [...prev.past];
      const newPresent = newPast.pop()!;

      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future]
      };
    });
  }

  /**
   * Redo last undone action
   */
  function redo() {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const newFuture = [...prev.future];
      const newPresent = newFuture.shift()!;

      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture
      };
    });
  }

  // ============================================================================
  // Layer Operations
  // ============================================================================

  function createLayer(name: string) {
    const newLayer: Layer = {
      id: uuidv4(),
      name,
      visible: true,
      locked: false,
      opacity: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updateState({
      layers: [...history.present.layers, newLayer],
      activeLayerId: newLayer.id
    });

    ErrorService.showToast(`Layer "${name}" created`, 'success', 2000);
  }

  function renameLayer(layerId: string, newName: string) {
    updateState({
      layers: history.present.layers.map(layer =>
        layer.id === layerId
          ? { ...layer, name: newName, updatedAt: new Date().toISOString() }
          : layer
      )
    });

    ErrorService.showToast(`Layer renamed to "${newName}"`, 'success', 2000);
  }

  function deleteLayer(layerId: string) {
    // Delete all zones in this layer
    const newZones = history.present.zones.filter(zone => zone.layerId !== layerId);
    const newLayers = history.present.layers.filter(layer => layer.id !== layerId);

    // Select first remaining layer
    const newActiveLayerId = newLayers[0]?.id || null;

    updateState({
      layers: newLayers,
      zones: newZones,
      activeLayerId: newActiveLayerId
    });

    ErrorService.showToast('Layer deleted', 'success', 2000);
  }

  function toggleLayerVisibility(layerId: string) {
    updateState({
      layers: history.present.layers.map(layer =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible, updatedAt: new Date().toISOString() }
          : layer
      )
    });
  }

  // ============================================================================
  // Zone Operations
  // ============================================================================

  function createZone(
    name: string,
    coordinates: LonLatTuple[],
    fillColor: string,
    opacity: number,
    description?: string
  ) {
    if (!history.present.activeLayerId) {
      ErrorService.showToast('Please select a layer first', 'error');
      return null;
    }

    const result = ZoneService.createZone(
      name,
      coordinates,
      fillColor,
      opacity,
      history.present.activeLayerId,
      userId
    );

    if (result.success) {
      const newZone = {
        ...result.data,
        description: description || ''
      };

      updateState({
        zones: [...history.present.zones, newZone]
      });

      ErrorService.showToast(`Zone "${name}" created`, 'success', 2000);
      return newZone;
    } else {
      ErrorService.showErrorToast(result.error);
      return null;
    }
  }

  function updateZone(zoneId: string, updates: Partial<Zone>) {
    updateState({
      zones: history.present.zones.map(zone =>
        zone.id === zoneId
          ? { ...zone, ...updates, updatedAt: new Date().toISOString() }
          : zone
      )
    });

    ErrorService.showToast('Zone updated', 'success', 2000);
  }

  function deleteZone(zoneId: string) {
    updateState({
      zones: history.present.zones.filter(zone => zone.id !== zoneId),
      selectedZoneId: null
    });

    ErrorService.showToast('Zone deleted', 'success', 2000);
  }

  function selectZone(zoneId: string | null) {
    updateState({ selectedZoneId: zoneId });
  }

  // ============================================================================
  // Image Operations
  // ============================================================================

  function addImage(image: DroneImage) {
    updateState({
      images: [...history.present.images, image],
      selectedImageId: image.id
    });
  }

  function updateImage(imageId: string, updates: Partial<DroneImage>) {
    updateState({
      images: history.present.images.map(img =>
        img.id === imageId
          ? { ...img, ...updates, updatedAt: new Date().toISOString() }
          : img
      )
    });
  }

  function deleteImage(imageId: string) {
    updateState({
      images: history.present.images.filter(img => img.id !== imageId),
      selectedImageId: null
    });
  }

  function selectImage(imageId: string | null) {
    updateState({ selectedImageId: imageId });
  }

  // ============================================================================
  // Computed Values
  // ============================================================================

  const zoneCountByLayer = history.present.layers.reduce((acc, layer) => {
    acc[layer.id] = history.present.zones.filter(zone => zone.layerId === layer.id).length;
    return acc;
  }, {} as Record<string, number>);

  const activeLayer = history.present.layers.find(l => l.id === history.present.activeLayerId);
  const selectedZone = history.present.zones.find(z => z.id === history.present.selectedZoneId);

  return {
    // State
    mode,
    layers: history.present.layers,
    zones: history.present.zones,
    images: history.present.images,
    activeLayerId: history.present.activeLayerId,
    selectedZoneId: history.present.selectedZoneId,
    selectedImageId: history.present.selectedImageId,

    // Computed
    activeLayer,
    selectedZone,
    zoneCountByLayer,

    // Mode
    setMode,

    // History
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undo,
    redo,

    // Save
    isSaving,
    lastSaved,

    // Layer operations
    createLayer,
    renameLayer,
    deleteLayer,
    toggleLayerVisibility,
    selectLayer: (layerId: string) => updateState({ activeLayerId: layerId }),

    // Zone operations
    createZone,
    updateZone,
    deleteZone,
    selectZone,

    // Image operations
    addImage,
    updateImage,
    deleteImage,
    selectImage
  };
}
