'use client';

/**
 * Interactive Property Mapping Feature - Main Page
 * Source: design-v2-spekster.md
 *
 * This page orchestrates the mapping feature with:
 * - User initialization (username prompt)
 * - Storage initialization
 * - Map rendering with Leaflet
 * - Error handling
 */

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { UserService } from '@/services/UserService';
import { StorageService } from '@/services/StorageService';
import { ZoneService } from '@/services/ZoneService';
import { ErrorService } from '@/services/ErrorService';
import { ExportService } from '@/services/ExportService';
import { useMapping } from '@/hooks/useMapping';
import type { User, LonLatTuple, DroneImage } from '@/models/mapping/types';
import type { ZoneFormData } from '@/components/mapping/ZonePropertiesForm';
import type L from 'leaflet';

// Dynamic import components to avoid SSR issues with Leaflet
const MapCanvas = dynamic(
  () => import('@/components/mapping/MapCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }
);

const Toolbar = dynamic(
  () => import('@/components/mapping/Toolbar'),
  { ssr: false }
);

const LayerPanel = dynamic(
  () => import('@/components/mapping/LayerPanel'),
  { ssr: false }
);

const DrawingEngine = dynamic(
  () => import('@/components/mapping/DrawingEngine'),
  { ssr: false }
);

const ZonePropertiesForm = dynamic(
  () => import('@/components/mapping/ZonePropertiesForm'),
  { ssr: false }
);

const ZoneRenderer = dynamic(
  () => import('@/components/mapping/ZoneRenderer'),
  { ssr: false }
);

const ImageUpload = dynamic(
  () => import('@/components/mapping/ImageUpload'),
  { ssr: false }
);

const ImageAlignmentEngine = dynamic(
  () => import('@/components/mapping/ImageAlignmentEngine'),
  { ssr: false }
);

// ============================================================================
// Mapping Page Component
// ============================================================================

export default function MappingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [property] = useState<'spoetzl' | 'busch'>('spoetzl'); // Default property
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [drawingCoordinates, setDrawingCoordinates] = useState<LonLatTuple[] | null>(null);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [selectedImageForAlignment, setSelectedImageForAlignment] = useState<string | null>(null);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Initialize mapping state (always call hook, handle null user inside)
  const mapping = useMapping(property, user?.id || '');

  // Initialize on mount
  useEffect(() => {
    initializeApp();
  }, []);

  /**
   * Initialize application
   */
  async function initializeApp() {
    try {
      // Step 1: Initialize StorageService (IndexedDB)
      const storageResult = await StorageService.initialize();
      if (!storageResult.success) {
        ErrorService.showErrorModal(storageResult.error, true);
        setIsInitializing(false);
        return;
      }

      // Step 2: Check for existing user
      const userResult = UserService.getCurrentUser();

      if (userResult.success) {
        // User exists - proceed to app
        setUser(userResult.data);
        await initializeZoneService();
        setIsInitializing(false);
      } else {
        // No user - show username prompt (blocking)
        setShowUsernamePrompt(true);
        setIsInitializing(false);
      }
    } catch (error) {
      console.error('App initialization failed:', error);
      ErrorService.showToast('Failed to initialize application', 'error');
      setIsInitializing(false);
    }
  }

  /**
   * Initialize ZoneService with property data
   */
  async function initializeZoneService() {
    const result = await ZoneService.initialize(property);
    if (!result.success) {
      ErrorService.showErrorToast(result.error);
    }
  }

  /**
   * Handle drawing completion
   */
  function handleDrawingComplete(coordinates: LonLatTuple[]) {
    setDrawingCoordinates(coordinates);
    setShowZoneForm(true);
  }

  /**
   * Handle drawing cancel
   */
  function handleDrawingCancel() {
    if (mapping) {
      mapping.setMode('view');
    }
  }

  /**
   * Handle zone form submit
   */
  function handleZoneFormSubmit(data: ZoneFormData) {
    if (mapping && drawingCoordinates) {
      mapping.createZone(
        data.name,
        drawingCoordinates,
        data.fillColor,
        data.opacity,
        data.description
      );

      setShowZoneForm(false);
      setDrawingCoordinates(null);
      mapping.setMode('view');
    }
  }

  /**
   * Handle zone form cancel
   */
  function handleZoneFormCancel() {
    setShowZoneForm(false);
    setDrawingCoordinates(null);
    if (mapping) {
      mapping.setMode('view');
    }
  }

  /**
   * Handle map ready
   */
  const handleMapReady = useCallback((map: L.Map) => {
    setMapInstance(map);
    console.log('Map initialized:', map);
    ErrorService.showToast('Map loaded successfully!', 'success', 3000);
  }, []);

  /**
   * Handle image uploaded
   */
  function handleImageUploaded(image: DroneImage) {
    if (mapping) {
      // Add image to mapping state
      mapping.addImage(image);
      // Select it for alignment
      setSelectedImageForAlignment(image.id);
      mapping.setMode('align');
      // Close upload panel
      setShowImagePanel(false);
      ErrorService.showToast('Image uploaded! Now position it on the map.', 'success', 3000);
    }
  }

  /**
   * Handle image alignment update
   */
  function handleImageUpdate(imageId: string, updates: any) {
    if (mapping) {
      mapping.updateImage(imageId, updates);
    }
  }

  /**
   * Handle image alignment complete
   */
  function handleImageAlignmentComplete() {
    setSelectedImageForAlignment(null);
    if (mapping) {
      mapping.setMode('view');
    }
    ErrorService.showToast('Image positioned successfully!', 'success', 2000);
  }

  /**
   * Handle GeoJSON export
   */
  function handleExportGeoJSON() {
    if (!mapping) return;

    const result = ExportService.exportZonesAsGeoJSON(
      mapping.zones,
      mapping.layers,
      property
    );

    if (result.success) {
      const filename = ExportService.generateFilename(property, 'geojson');
      const downloadResult = ExportService.downloadGeoJSON(result.data, filename);

      if (downloadResult.success) {
        ErrorService.showToast('GeoJSON exported successfully!', 'success', 3000);
        setShowExportModal(false);
      } else {
        ErrorService.showToast('Failed to download GeoJSON', 'error');
      }
    } else {
      if (result.error === 'NO_ZONES') {
        ErrorService.showToast('No zones to export. Draw some zones first!', 'warning', 3000);
      } else {
        ErrorService.showToast('Export failed', 'error');
      }
    }
  }

  /**
   * Handle full app state export
   */
  function handleExportAppState() {
    if (!mapping) return;

    const appState = {
      version: '2.0',
      property,
      zones: mapping.zones,
      layers: mapping.layers,
      images: mapping.images,
      lastModified: new Date().toISOString()
    };

    const result = ExportService.exportAppState(appState);

    if (result.success) {
      ErrorService.showToast('App state exported successfully!', 'success', 3000);
      setShowExportModal(false);
    } else {
      ErrorService.showToast('Export failed', 'error');
    }
  }

  /**
   * Handle username submission
   */
  function handleUsernameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUsernameError(null);

    const result = UserService.setUsername(usernameInput);

    if (result.success) {
      setUser(result.data);
      setShowUsernamePrompt(false);
      initializeZoneService();
      ErrorService.showToast(`Welcome, ${result.data.username}!`, 'success');
    } else {
      // Show error message
      const errorMessages = {
        INVALID_USERNAME: 'Please enter a valid username.',
        USERNAME_TOO_SHORT: 'Username must be at least 2 characters long.',
        USERNAME_TOO_LONG: 'Username must be 50 characters or less.'
      };

      setUsernameError(
        errorMessages[result.error] || 'Invalid username'
      );
    }
  }

  // Show loading state
  if (isInitializing) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Show username prompt (blocking modal)
  if (showUsernamePrompt) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Property Mapping
          </h1>
          <p className="text-gray-600 mb-6">
            Please enter your name to get started. This will be used to track your contributions.
          </p>

          <form onSubmit={handleUsernameSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                autoFocus
                required
              />
              {usernameError && (
                <p className="mt-2 text-sm text-red-600">{usernameError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show main application
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Property Mapping - {property === 'spoetzl' ? 'Spoetzl Brewery' : 'Busch Gardens'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Logged in as: <span className="font-medium">{user?.username}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImagePanel(!showImagePanel)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Images
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Map Canvas */}
      <main className="flex-1 relative">
        <MapCanvas
          property={property}
          onMapReady={handleMapReady}
        />

        {/* Toolbar */}
        {mapping && (
          <Toolbar
            currentMode={mapping.mode}
            onModeChange={mapping.setMode}
            canUndo={mapping.canUndo}
            canRedo={mapping.canRedo}
            onUndo={mapping.undo}
            onRedo={mapping.redo}
            isSaving={mapping.isSaving}
            lastSaved={mapping.lastSaved}
          />
        )}

        {/* Layer Panel */}
        {mapping && (
          <LayerPanel
            layers={mapping.layers}
            activeLayerId={mapping.activeLayerId}
            onLayerSelect={mapping.selectLayer}
            onLayerCreate={mapping.createLayer}
            onLayerRename={mapping.renameLayer}
            onLayerDelete={mapping.deleteLayer}
            onLayerToggleVisibility={mapping.toggleLayerVisibility}
            zoneCountByLayer={mapping.zoneCountByLayer}
          />
        )}

        {/* Zone Renderer */}
        {mapping && mapInstance && (
          <ZoneRenderer
            map={mapInstance}
            zones={mapping.zones}
            layers={mapping.layers}
            selectedZoneId={mapping.selectedZoneId}
            onZoneClick={mapping.selectZone}
            onZoneHover={(zoneId) => {
              // Optional: Show zone info in status bar
            }}
          />
        )}

        {/* Drawing Engine */}
        {mapping && mapInstance && (
          <DrawingEngine
            map={mapInstance}
            isActive={mapping.mode === 'draw'}
            onDrawingComplete={handleDrawingComplete}
            onCancel={handleDrawingCancel}
          />
        )}

        {/* Zone Properties Form */}
        {mapping && (
          <ZonePropertiesForm
            isOpen={showZoneForm}
            coordinates={drawingCoordinates || []}
            layers={mapping.layers}
            activeLayerId={mapping.activeLayerId}
            onSubmit={handleZoneFormSubmit}
            onCancel={handleZoneFormCancel}
          />
        )}

        {/* Image Upload Panel */}
        {showImagePanel && mapping && (
          <div className="absolute top-20 right-6 z-[1000] bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Drone Images</h3>
              <button
                onClick={() => setShowImagePanel(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ImageUpload
              layers={mapping.layers}
              activeLayerId={mapping.activeLayerId}
              onImageUploaded={handleImageUploaded}
            />
          </div>
        )}

        {/* Image Alignment Engine */}
        {mapping && mapInstance && selectedImageForAlignment && (
          <ImageAlignmentEngine
            map={mapInstance}
            image={mapping.images.find(img => img.id === selectedImageForAlignment) || null}
            isActive={mapping.mode === 'align'}
            onUpdate={handleImageUpdate}
            onComplete={handleImageAlignmentComplete}
          />
        )}

        {/* Export Modal */}
        {showExportModal && mapping && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Export Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Choose an export format for your mapping data.
              </p>

              <div className="space-y-3">
                {/* GeoJSON Export */}
                <button
                  onClick={handleExportGeoJSON}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <div>
                      <div className="font-semibold">GeoJSON</div>
                      <div className="text-sm text-blue-100">
                        Export zones as GeoJSON ({mapping.zones.length} zones)
                      </div>
                    </div>
                  </div>
                </button>

                {/* Full State Export */}
                <button
                  onClick={handleExportAppState}
                  className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    <div>
                      <div className="font-semibold">Full Project Data (JSON)</div>
                      <div className="text-sm text-gray-300">
                        Export all zones, layers, and images ({mapping.zones.length} zones, {mapping.layers.length} layers, {mapping.images.length} images)
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="mt-6 w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info Bar */}
      <footer className="bg-gray-800 text-white px-6 py-2 text-sm">
        <p>
          Interactive Property Mapping Feature • Design System v2.0 •
          WGS84 Coordinate System
        </p>
      </footer>
    </div>
  );
}
