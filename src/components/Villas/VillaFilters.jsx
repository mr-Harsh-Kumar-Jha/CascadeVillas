// src/components/Villas/VillaFilters.jsx
import React, { useState } from 'react';
import { LOCATIONS, BEDROOM_OPTIONS, PRICE_RANGE } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const VillaFilters = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    location: 'all',
    bedrooms: 'all',
    minPrice: PRICE_RANGE.min,
    maxPrice: PRICE_RANGE.max
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      maxPrice: PRICE_RANGE.max
    };
    setFilters(resetFilters);
    onReset();
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Location Filter */}
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

      {/* Bedrooms Filter */}
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

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          Price Range
        </label>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-600 mb-1">
              Min Price: {formatCurrency(filters.minPrice)}
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
              Max Price: {formatCurrency(filters.maxPrice)}
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

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg border border-neutral-200/20 p-6 sticky top-24">
        <h3 className="text-lg font-bold text-neutral-800 mb-6">Filter Villas</h3>
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-neutral-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-neutral-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-800">Filter Villas</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 px-4 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VillaFilters;