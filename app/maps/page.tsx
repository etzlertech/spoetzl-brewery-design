'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Layers, User, Calendar, TrendingUp, Plus } from 'lucide-react';
import { StorageService } from '@/services/StorageService';
import type { Zone, Layer } from '@/models/mapping/types';

interface ZoneWithLayer extends Zone {
  layerName: string;
  layerColor: string;
}

export default function MapsPage() {
  const [zones, setZones] = useState<ZoneWithLayer[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property] = useState<'spoetzl' | 'busch'>('spoetzl');

  useEffect(() => {
    loadZones();
  }, []);

  async function loadZones() {
    try {
      setLoading(true);
      setError(null);

      // Initialize StorageService
      const initResult = await StorageService.initialize();
      if (!initResult.success) {
        throw new Error(initResult.error);
      }

      // Load state for property
      const stateResult = await StorageService.loadState(property);

      if (stateResult.success) {
        const { zones: loadedZones, layers: loadedLayers } = stateResult.data;

        // Combine zones with layer info
        const zonesWithLayers: ZoneWithLayer[] = loadedZones.map(zone => {
          const layer = loadedLayers.find(l => l.id === zone.layerId);
          return {
            ...zone,
            layerName: layer?.name || 'Unknown Layer',
            layerColor: layer?.color || '#808080',
          };
        });

        setZones(zonesWithLayers);
        setLayers(loadedLayers);
      } else {
        // No zones yet
        setZones([]);
        setLayers([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load zones');
      console.error('Error loading zones:', err);
    } finally {
      setLoading(false);
    }
  }

  // Format area for display
  function formatArea(areaM2: number): string {
    if (areaM2 < 1000) {
      return `${Math.round(areaM2)} m²`;
    } else {
      return `${(areaM2 / 10000).toFixed(2)} hectares`;
    }
  }

  // Format date
  function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-amber-800 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold hover:text-amber-200 transition">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Saved Maps & Zones
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-4">
            Mapping Projects & Zones
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            View all zones and mapping regions created for the Spoetzl Brewery property.
            Each zone represents a defined landscape area with specific design intent.
          </p>
        </div>

        {/* Stats Cards */}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">Total Zones</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{zones.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Layers className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-bold text-gray-800">Layers</h3>
              </div>
              <p className="text-3xl font-bold text-amber-600">{layers.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Total Area</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {formatArea(zones.reduce((sum, z) => sum + z.areaM2, 0))}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading zones...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold mb-2">Error loading zones</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={loadZones}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && zones.length === 0 && (
          <div className="bg-gradient-to-br from-green-50 to-amber-50 border border-green-200 rounded-xl p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <p className="text-gray-800 font-semibold mb-2">No zones created yet</p>
            <p className="text-gray-600 text-sm mb-6">
              Start creating zones on the mapping page to see them here
            </p>
            <Link
              href="/mapping"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Go to Mapping
            </Link>
          </div>
        )}

        {/* Zones Grid */}
        {!loading && !error && zones.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-900">All Zones</h2>
              <Link
                href="/mapping"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Create New Zone
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-green-300"
                >
                  {/* Zone Color Bar */}
                  <div
                    className="w-full h-2 rounded-full mb-4"
                    style={{ backgroundColor: zone.fillColor }}
                  />

                  {/* Zone Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {zone.name}
                  </h3>

                  {/* Short Description */}
                  {zone.shortDescription && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {zone.shortDescription}
                    </p>
                  )}

                  {/* Zone Details */}
                  <div className="space-y-2 text-sm">
                    {/* Layer */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Layers className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Layer:</span>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                        style={{ backgroundColor: zone.layerColor }}
                      >
                        {zone.layerName}
                      </span>
                    </div>

                    {/* Area */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Area:</span>
                      <span>{formatArea(zone.areaM2)}</span>
                    </div>

                    {/* Created By */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Created by:</span>
                      <span>{zone.createdBy}</span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Created:</span>
                      <span>{formatDate(zone.createdDate)}</span>
                    </div>
                  </div>

                  {/* Warnings */}
                  {zone.warnings && zone.warnings.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-amber-600 font-semibold mb-1">
                        ⚠️ {zone.warnings.length} Warning{zone.warnings.length > 1 ? 's' : ''}
                      </p>
                      <ul className="text-xs text-amber-700 space-y-1">
                        {zone.warnings.map((warning, idx) => (
                          <li key={idx}>• {warning.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* View in Map Link */}
                  <Link
                    href="/mapping"
                    className="mt-4 block text-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                  >
                    View in Map
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-green-700 to-amber-700 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Create More Zones?</h3>
          <p className="mb-6 text-lg">
            Use the interactive mapping tool to define new landscape areas and design zones
          </p>
          <Link
            href="/mapping"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-800 font-semibold rounded-lg hover:bg-amber-50 transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Open Mapping Tool
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-900 to-amber-800 py-8 text-white mt-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm">
            &copy; 2024 Evergold Landscaping. All rights reserved. | Spoetzl Brewery Landscape
            Design System
          </p>
        </div>
      </footer>
    </div>
  );
}
