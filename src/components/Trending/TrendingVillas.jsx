// src/components/Trending/TrendingVillas.jsx
import React, { useState, useEffect } from 'react';
import { getTrendingVillas } from '../../firebase/villaService';
import VillaCard from '../Villas/VillaCard';
import Loading from '../Common/Loading';

const TrendingVillas = ({ onVillaClick }) => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingVillas();
  }, []);

  const loadTrendingVillas = async () => {
    try {
      setLoading(true);
      const data = await getTrendingVillas();
      setVillas(data);
    } catch (error) {
      console.error('Error loading trending villas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Loading text="Loading trending villas..." />
        </div>
      </section>
    );
  }

  if (villas.length === 0) {
    return null;
  }

  return (
    <section id="trending" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-100/50 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-2">
            🔥 Guest Favorites
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Trending Properties
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            The most sought-after villas for weekends & family celebrations
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
      </div>
    </section>
  );
};

export default TrendingVillas;
