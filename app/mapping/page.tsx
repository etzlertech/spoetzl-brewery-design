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

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { UserService } from '@/services/UserService';
import { StorageService } from '@/services/StorageService';
import { ZoneService } from '@/services/ZoneService';
import { ErrorService } from '@/services/ErrorService';
import type { User } from '@/models/mapping/types';

// Dynamic import MapCanvas to avoid SSR issues with Leaflet
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

          <button
            onClick={() => {
              // TODO: Add export functionality
              ErrorService.showToast('Export functionality coming soon!', 'info');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export
          </button>
        </div>
      </header>

      {/* Map Canvas */}
      <main className="flex-1">
        <MapCanvas
          property={property}
          onMapReady={(map) => {
            console.log('Map initialized:', map);
            ErrorService.showToast('Map loaded successfully!', 'success', 3000);
          }}
        />
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
