// src/components/Villas/VillaFilters.jsx

import React, { useState } from 'react';
import { LOCATIONS, BEDROOM_OPTIONS, PRICE_RANGE } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const VillaFilters = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    location: 'all',
    bedrooms: 'all',
    minPrice: PRICE_RANGE.min,
    maxPrice: PRICE_RANGE.max,
    checkInDate: '',
    checkOutDate: ''
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: 'all',
      bedrooms: 'all',
      minPrice: PRICE_RANGE.min,
      maxPrice: PRICE_RANGE.max,
      checkInDate: '',
      checkOutDate: ''
    };
    setFilters(resetFilters);
    onReset();
    setShowPriceDropdown(false);
  };

  // Count active filters (excluding price if at defaults)
  const activeFilterCount = () => {
    let count = 0;
    if (filters.location !== 'all') count++;
    if (filters.bedrooms !== 'all') count++;
    if (filters.minPrice !== PRICE_RANGE.min || filters.maxPrice !== PRICE_RANGE.max) count++;
    if (filters.checkInDate) count++;
    if (filters.checkOutDate) count++;
    return count;
  };

  return (
    <>
      {/* DESKTOP: Horizontal Filter Bar */}
      <div className="hidden lg:block bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Location Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm bg-white"
              >
                {LOCATIONS.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm bg-white"
              >
                {BEDROOM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Check-in Date */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Check-in
              </label>
              <input
                type="date"
                value={filters.checkInDate}
                onChange={(e) => handleChange('checkInDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm"
              />
            </div>

            {/* Check-out Date */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Check-out
              </label>
              <input
                type="date"
                value={filters.checkOutDate}
                onChange={(e) => handleChange('checkOutDate', e.target.value)}
                min={filters.checkInDate || new Date().toISOString().split('T')[0]}
                disabled={!filters.checkInDate}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Price Filter - Dropdown */}
            <div className="relative flex-1 min-w-0">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Price Range
              </label>
              <button
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm bg-white text-left flex items-center justify-between"
              >
                <span className="truncate">
                  {formatCurrency(filters.minPrice)} - {formatCurrency(filters.maxPrice)}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${showPriceDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Price Dropdown */}
              {showPriceDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg p-4 z-50">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-neutral-600 mb-2">
                        Min: {formatCurrency(filters.minPrice)}
                      </label>
                      <input
                        type="range"
                        min={PRICE_RANGE.min}
                        max={PRICE_RANGE.max}
                        step={PRICE_RANGE.step}
                        value={filters.minPrice}
                        onChange={(e) => handleChange('minPrice', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-600 mb-2">
                        Max: {formatCurrency(filters.maxPrice)}
                      </label>
                      <input
                        type="range"
                        min={PRICE_RANGE.min}
                        max={PRICE_RANGE.max}
                        step={PRICE_RANGE.step}
                        value={filters.maxPrice}
                        onChange={(e) => handleChange('maxPrice', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <button
                      onClick={() => setShowPriceDropdown(false)}
                      className="w-full px-3 py-2 bg-neutral-800 text-white rounded-lg text-sm hover:bg-neutral-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            {activeFilterCount() > 0 && (
              <div className="flex-shrink-0">
                <label className="block text-xs font-semibold text-transparent mb-1">
                  Reset
                </label>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear {activeFilterCount()}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLET & MOBILE: Filter Button + Modal */}
      <div className="lg:hidden bg-white border-b border-neutral-200 sticky top-[57px] z-30">
        <div className="px-4 py-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full px-4 py-3 bg-neutral-800 text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {activeFilterCount() > 0 && (
              <span className="px-2 py-0.5 bg-white text-neutral-800 rounded-full text-xs font-bold">
                {activeFilterCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full max-h-[85vh] rounded-t-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-800">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                >
                  {LOCATIONS.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleChange('bedrooms', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                >
                  {BEDROOM_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={filters.checkInDate}
                    onChange={(e) => handleChange('checkInDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={filters.checkOutDate}
                    onChange={(e) => handleChange('checkOutDate', e.target.value)}
                    min={filters.checkInDate || new Date().toISOString().split('T')[0]}
                    disabled={!filters.checkInDate}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 disabled:bg-neutral-100"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">
                      Min: {formatCurrency(filters.minPrice)}
                    </label>
                    <input
                      type="range"
                      min={PRICE_RANGE.min}
                      max={PRICE_RANGE.max}
                      step={PRICE_RANGE.step}
                      value={filters.minPrice}
                      onChange={(e) => handleChange('minPrice', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">
                      Max: {formatCurrency(filters.maxPrice)}
                    </label>
                    <input
                      type="range"
                      min={PRICE_RANGE.min}
                      max={PRICE_RANGE.max}
                      step={PRICE_RANGE.step}
                      value={filters.maxPrice}
                      onChange={(e) => handleChange('maxPrice', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 px-4 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VillaFilters;