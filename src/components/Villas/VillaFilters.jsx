// src/components/Villas/VillaFilters.jsx
import React, { useState, useEffect } from 'react';
import { LOCATIONS, BEDROOM_OPTIONS, PRICE_RANGE } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const VillaFilters = ({ initialFilters, onFilterChange, onReset }) => {
  const [filters, setFilters] = useState(() => ({
    location: initialFilters?.location || 'all',
    bedrooms: initialFilters?.bedrooms || 'all',
    minPrice: initialFilters?.minPrice ?? PRICE_RANGE.min,
    maxPrice: initialFilters?.maxPrice ?? PRICE_RANGE.max,
    checkInDate: initialFilters?.checkInDate || '',
    checkOutDate: initialFilters?.checkOutDate || ''
  }));

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        location: initialFilters.location || 'all',
        bedrooms: initialFilters.bedrooms || 'all',
        minPrice: initialFilters.minPrice ?? prev.minPrice,
        maxPrice: initialFilters.maxPrice ?? prev.maxPrice
      }));
    }
  }, [initialFilters]);

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
  };

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
    <div className="mb-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card border border-neutral-200/90 dark:border-white/10 text-xs font-bold text-neutral-800 dark:text-neutral-200 shadow-md active:scale-95 transition-all"
        >
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filter Collection {activeFilterCount() > 0 && `(${activeFilterCount()})`}</span>
          <span className="text-[10px] text-neutral-400">{showMobileFilters ? '▲' : '▼'}</span>
        </button>

        {activeFilterCount() > 0 && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-rose-500 hover:underline"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Filter Surface (Desktop & Expandable Mobile) */}
      <div className={`glass-panel rounded-3xl p-6 border border-neutral-200/80 dark:border-white/10 shadow-lg ${
        showMobileFilters ? 'block' : 'hidden lg:block'
      }`}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Location */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
              Destination
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold bg-neutral-100 dark:bg-neutral-900"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold bg-neutral-100 dark:bg-neutral-900"
            >
              {BEDROOM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Max Budget Slider */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Max Nightly Budget
              </label>
              <span className="text-xs font-bold text-emerald-500">
                {formatCurrency(filters.maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={PRICE_RANGE.min}
              max={PRICE_RANGE.max}
              step={PRICE_RANGE.step}
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
            />
          </div>

          {/* Reset Action */}
          <div className="flex items-end pt-2 lg:pt-4">
            <button
              onClick={handleReset}
              className="w-full lg:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-200/80 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaFilters;
