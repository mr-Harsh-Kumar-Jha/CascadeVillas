// src/components/Trending/TrendingVillas.jsx
import React, { useState, useEffect } from 'react';
import { getTrendingVillas } from '../../firebase/villaService';
import VillaCard from '../Villas/VillaCard';
import Loading from '../common/Loading';

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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Loading text="Loading trending villas..." />
        </div>
      </section>
    );
  }

  if (villas.length === 0) {
    return null;
  }

  return (
    <section id="trending" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
              🔥 Trending <span className="text-neutral-600">Villas</span>
            </h2>
            <p className="text-neutral-600">Most popular villas this season</p>
          </div>
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