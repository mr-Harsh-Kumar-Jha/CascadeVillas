// src/components/Villas/VillaList.jsx
import React, { useState, useEffect } from 'react';
import { filterVillas } from '../../firebase/villaService';
import VillaCard from './VillaCard';
import VillaFilters from './VillaFilters';
import Loading from '../Common/Loading';

const VillaList = ({ onVillaClick, initialFilters }) => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState(() => ({
    location: initialFilters?.location || 'all',
    bedrooms: initialFilters?.bedrooms || 'all',
    minPrice: initialFilters?.minPrice || 0,
    maxPrice: initialFilters?.maxPrice || 50000
  }));

  useEffect(() => {
    if (initialFilters) {
      const merged = {
        location: initialFilters.location || 'all',
        bedrooms: initialFilters.bedrooms || 'all',
        minPrice: initialFilters.minPrice || 0,
        maxPrice: initialFilters.maxPrice || 50000
      };
      setCurrentFilters(merged);
      loadVillas(merged);
    } else {
      loadVillas(currentFilters);
    }
  }, [initialFilters]);

  const loadVillas = async (filters = currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await filterVillas(filters);
      setVillas(data);
    } catch (err) {
      console.error('Error loading villas:', err);
      setError('Failed to load villas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    loadVillas(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: 'all',
      bedrooms: 'all',
      minPrice: 0,
      maxPrice: 50000
    };
    setCurrentFilters(resetFilters);
    loadVillas(resetFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center border border-neutral-200 dark:border-white/10 shadow-xl">
          <p className="text-sm font-semibold text-rose-500 mb-4">{error}</p>
          <button
            onClick={() => loadVillas()}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="properties" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-rose-300 border border-brand-500/20 mb-2">
              ✦ Handcrafted Getaways
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-serif">
              Explore Our Collection
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
              Verified villas and private homestays across Lonavala & Mahabaleshwar
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <VillaFilters 
          initialFilters={currentFilters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Villa Grid */}
        <div>
          {loading ? (
            <Loading text="Refreshing villa catalog..." />
          ) : villas.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border border-neutral-200 dark:border-white/10 p-8">
              <span className="text-4xl block mb-3">🏡</span>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                No matching villas found
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                Try widening your price range or switching the location filter.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <p>
                  Displaying <span className="text-neutral-900 dark:text-white font-bold">{villas.length}</span> curated properties
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {villas.map((villa) => (
                  <VillaCard 
                    key={villa.id} 
                    villa={villa} 
                    onClick={onVillaClick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VillaList;
