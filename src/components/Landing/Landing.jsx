// src/components/Landing/Landing.jsx
import React, { useState, useEffect } from "react";
import { getFeaturedVillas } from "../../firebase/villaService";
import VillaCard from "../Villas/VillaCard";
import TrendingVillas from "../Trending/TrendingVillas";
import Loading from "../Common/Loading";
import Home from "../Home/Home";
import GoogleReviewsCarousel from "../Reviews/ReviewCarousel";
import MetaTags from "../Common/MetaTags";
import { CONCIERGE_INFO } from "../../utils/constants";

const Landing = ({ onVillaClick, onNavigate }) => {
  const [featuredVillas, setFeaturedVillas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick filter state for hero bar
  const [heroLocation, setHeroLocation] = useState('all');
  const [heroBedrooms, setHeroBedrooms] = useState('all');

  useEffect(() => {
    loadFeaturedVillas();
  }, []);

  const loadFeaturedVillas = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedVillas();
      setFeaturedVillas(data);
    } catch (error) {
      console.error("Error loading featured villas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = () => {
    onNavigate('properties', {
      location: heroLocation,
      bedrooms: heroBedrooms
    });
  };

  return (
    <div className="min-h-screen">
      <MetaTags />

      {/* Hero Section with Glass Search Bar */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-neutral-950">
        {/* Hero Background Image with Blur Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80"
            alt="Luxury Villa"
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center flex flex-col items-center">
          {/* Luxury Villas Tag */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Verified Luxury Estates • Lonavala & Mahabaleshwar</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 font-serif">
            Luxury Living, <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              Elevated by Nature.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mb-10 leading-relaxed font-normal">
            Handcrafted luxury villas, infinity pool estates, and intimate homestays in Lonavala & Mahabaleshwar. 
            Direct owner pricing & verified host assurance.
          </p>

          {/* Floating Glass Search & Quick Action Bar */}
          <div className="w-full max-w-3xl glass-card bg-white/90 dark:bg-neutral-950/85 p-3.5 sm:p-4 rounded-3xl border border-neutral-200/90 dark:border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center">
            <div className="flex-1 w-full text-left px-3.5 py-2.5 sm:py-0 rounded-2xl sm:rounded-none bg-neutral-100/70 sm:bg-transparent dark:bg-white/5 sm:dark:bg-transparent border border-neutral-200/60 sm:border-none dark:border-white/5">
              <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5 flex items-center gap-1">
                <span>📍</span>
                <span>Destination</span>
              </span>
              <select 
                value={heroLocation} 
                onChange={(e) => setHeroLocation(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">All Locations (Lonavala / Mahabaleshwar)</option>
                <option value="Lonavala" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">Lonavala</option>
                <option value="Mahabaleshwar" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">Mahabaleshwar</option>
              </select>
            </div>

            <div className="hidden sm:block w-[1px] h-10 bg-neutral-200 dark:bg-white/20" />

            <div className="flex-1 w-full text-left px-3.5 py-2.5 sm:py-0 rounded-2xl sm:rounded-none bg-neutral-100/70 sm:bg-transparent dark:bg-white/5 sm:dark:bg-transparent border border-neutral-200/60 sm:border-none dark:border-white/5">
              <span className="block text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-0.5 flex items-center gap-1">
                <span>🛏️</span>
                <span>Bedrooms / Space</span>
              </span>
              <select 
                value={heroBedrooms} 
                onChange={(e) => setHeroBedrooms(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">Any Size (1 to 6+ BHK)</option>
                <option value="2" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">2 BHK Cozy Retreat</option>
                <option value="3" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">3 BHK Luxury</option>
                <option value="4" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">4 BHK Pool Villa</option>
                <option value="5" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">5+ BHK Grand Estate</option>
              </select>
            </div>

            <button
              onClick={handleHeroSearch}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2"
            >
              <span>Explore Villas</span>
              <span>→</span>
            </button>
          </div>

          {/* Quick Concierge Help below Hero */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-neutral-400">
            <span>Direct Concierge Desk:</span>
            <a href={`tel:${CONCIERGE_INFO.phoneClean}`} className="text-emerald-400 hover:underline">
              📞 {CONCIERGE_INFO.phone}
            </a>
            <span>•</span>
            <a href={`https://wa.me/${CONCIERGE_INFO.phoneClean}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              💬 Chat on WhatsApp ↗
            </a>
          </div>
        </div>
      </section>

      {/* Featured / Hot Deals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3">
                🔥 Exclusive Offers
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Featured Luxury Villas
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Handpicked private pool getaways with seasonal direct discounts
              </p>
            </div>

            <button
              onClick={() => onNavigate("properties")}
              className="mt-4 md:mt-0 text-sm font-bold text-neutral-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <span>View All Villas</span>
              <span>→</span>
            </button>
          </div>

          {loading ? (
            <Loading text="Loading featured villas..." />
          ) : featuredVillas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVillas.map((villa) => (
                <VillaCard
                  key={villa.id}
                  villa={villa}
                  onClick={onVillaClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card rounded-3xl border border-neutral-200 dark:border-white/10">
              <p className="text-neutral-600 dark:text-neutral-400">
                No featured villas listed at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Villas Section */}
      <TrendingVillas onVillaClick={onVillaClick} />

      {/* About Section */}
      <Home onNavigate={onNavigate} />

      {/* Google Reviews Section */}
      <GoogleReviewsCarousel />

      {/* High-End Glass CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-8 sm:p-14 text-center border border-neutral-200/80 dark:border-white/15 shadow-2xl relative">
          <span className="text-4xl block mb-4">🌟</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4 font-serif">
            Ready for Your Unforgettable Stay?
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Connect directly with our 24/7 concierge for customized packages, corporate retreats, and wedding villa rentals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("properties")}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:scale-105"
            >
              Explore Properties
            </button>
            <a
              href={`tel:${CONCIERGE_INFO.phoneClean}`}
              className="px-8 py-3.5 rounded-2xl glass-panel border border-neutral-300 dark:border-white/20 font-bold text-sm text-neutral-800 dark:text-white hover:bg-white/10 transition-all"
            >
              Call Concierge: {CONCIERGE_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
