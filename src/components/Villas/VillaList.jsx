import React, { useState, useEffect } from 'react';
import { filterVillas } from '../../firebase/villaService';
import VillaCard from './VillaCard';
import VillaFilters from './VillaFilters';
import Loading from '../Common/Loading';

const VillaList = ({ onVillaClick }) => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({
    location: 'all',
    bedrooms: 'all',
    minPrice: 0,
    maxPrice: 50000
  });

  useEffect(() => {
    loadVillas();
  }, []);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadVillas()}
            className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="properties" className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Explore Our <span className="text-neutral-600">Villas</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find your perfect getaway from our handpicked collection of luxury villas and homestays
          </p>
        </div>

        {/* Content */}
        <div className="lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <VillaFilters 
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Villa Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loading text="Loading villas..." />
            ) : villas.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-24 h-24 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">No villas found</h3>
                <p className="text-neutral-600 mb-4">Try adjusting your filters to see more results</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-neutral-600">
                    Found <span className="font-semibold text-neutral-800">{villas.length}</span> villa{villas.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
};

export default VillaList;