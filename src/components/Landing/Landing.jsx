// src/components/Landing/Landing.jsx
import React, { useState, useEffect } from 'react';
import { getFeaturedVillas } from '../../firebase/villaService';
import Home from '../Home/home';
import VillaCard from '../Villas/VillaCard';
import TrendingVillas from '../Trending/TrendingVillas';
import Loading from '../Common/Loading';

const Landing = ({ onVillaClick, onNavigate }) => {
  const [featuredVillas, setFeaturedVillas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedVillas();
  }, []);

  const loadFeaturedVillas = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedVillas();
      setFeaturedVillas(data);
    } catch (error) {
      console.error('Error loading featured villas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920"
          alt="Luxury Villa"
          className="absolute w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-left animate-slide-up">
              Find Your Dream <br />
              <span className="text-neutral-300">Villa Getaway</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 mb-8 text-left max-w-2xl">
              Discover exclusive villas and homestays in the most beautiful locations. 
              Perfect for holidays, weddings, and memorable stays.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('properties')}
                className="px-8 py-4 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-all hover:scale-105 text-lg"
              >
                Explore All Villas
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all text-lg"
              >
                Track My Enquiries
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <Home onNavigate={onNavigate} />

      {/* Featured/Hot Deals Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              🔥 Hot <span className="text-neutral-600">Deals</span>
            </h2>
            <p className="text-neutral-600 text-lg">
              Limited time offers on our premium villas
            </p>
          </div>

          {loading ? (
            <Loading text="Loading featured villas..." />
          ) : featuredVillas.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVillas.map((villa) => (
                  <VillaCard 
                    key={villa.id} 
                    villa={villa} 
                    onClick={onVillaClick}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => onNavigate('properties')}
                  className="inline-block px-8 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700 transition-colors"
                >
                  View All Properties
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">No featured villas available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Villas Section */}
      <TrendingVillas onVillaClick={onVillaClick} />

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Perfect Villa?
          </h2>
          <p className="text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">
            Get in touch with us today and let's make your dream vacation a reality
          </p>
          <button
            onClick={() => onNavigate('properties')}
            className="px-10 py-4 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-all hover:scale-105 text-lg"
          >
            Start Exploring
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;