// src/components/Villas/VillaDetail.jsx

import React, { useState, useEffect } from 'react';
import { getVillaById } from '../../firebase/villaService';
import { getBlockedDates } from '../../firebase/bookingService';
import { formatCurrency } from '../../utils/helpers';
import { AMENITIES_ICONS, CONCIERGE_INFO } from '../../utils/constants';
import ImageCarousel from '../Common/ImageCarousel';
import Loading from '../Common/Loading';
import BookingCalendar from "../Booking/BookingCalender";
import WhatsAppButton from '../Common/WhatsAppButton';

const VillaDetail = ({ villaId, onEnquireClick, onBack }) => {
  const [villa, setVilla] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadVillaData();
  }, [villaId]);

  const loadVillaData = async () => {
    try {
      setLoading(true);
      setError(null);
      const villaData = await getVillaById(villaId);
      setVilla(villaData);
      
      const dates = await getBlockedDates(villaId);
      setBlockedDates(dates);
    } catch (err) {
      setError(err.message || 'Failed to load villa details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading villa details..." />;
  }

  if (error || !villa) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center border border-neutral-200 dark:border-white/10 shadow-xl">
          <span className="text-4xl block mb-3">⚠️</span>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            {error || 'Villa Not Found'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
            The property listing could not be found or has been updated.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs"
          >
            ← Back to Villas
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = villa.discountPercentage > 0
    ? villa.pricePerNight * (1 - villa.discountPercentage / 100)
    : villa.pricePerNight;

  const upcomingBookings = blockedDates
    .filter(booking => new Date(booking.checkInDate) >= new Date())
    .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate))
    .slice(0, 5);

  return (
    <div className="min-h-screen pb-16">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-20 glass-panel border-b border-neutral-200/80 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Villas</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Photo Gallery Showcase */}
        <div className="mb-10 rounded-3xl overflow-hidden glass-panel border border-neutral-200/80 dark:border-white/10 shadow-2xl">
          <ImageCarousel images={villa.images} alt={villa.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Villa Information */}
          <div className="lg:col-span-2 space-y-8 text-left">
            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                  📍 {villa.location}, Maharashtra
                </span>
                {villa.isFeatured && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    ⭐ Featured
                  </span>
                )}
                {villa.isTrending && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/15 text-rose-500 border border-rose-500/30">
                    🔥 Trending
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-serif mb-3">
                {villa.name}
              </h1>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-3 py-3 px-4 rounded-2xl glass-panel border border-neutral-200/60 dark:border-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>🛏️ {villa.bedrooms} Bedrooms</span>
                <span className="text-neutral-400">•</span>
                <span>🚿 {villa.bathrooms} Bathrooms</span>
                <span className="text-neutral-400">•</span>
                <span>👥 Up to {villa.maxGuests} Guests</span>
                <span className="text-neutral-400">•</span>
                <span>🏊 Private Pool / Lawn</span>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                About the Estate
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {villa.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                Amenities & Inclusions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {villa.amenities?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    <span className="text-lg">{AMENITIES_ICONS[amenity] || '✨'}</span>
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Availability & Calendar Section */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Live Availability Calendar
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {blockedDates.length > 0 
                      ? `${blockedDates.length} confirmed booking periods scheduled`
                      : 'All upcoming dates currently available'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 transition-all"
                >
                  {showCalendar ? 'Hide Calendar' : 'View Full Calendar'}
                </button>
              </div>

              {/* Upcoming Bookings Pill List */}
              {upcomingBookings.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Upcoming Booked Dates:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {upcomingBookings.map((booking, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-neutral-100/80 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-500">
                          Reserved
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showCalendar && (
                <div className="pt-4 border-t border-neutral-200 dark:border-white/10">
                  <BookingCalendar villaId={villaId} />
                </div>
              )}
            </div>

            {/* Concierge Guarantee Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-neutral-950 text-xl shadow-lg shrink-0">
                    🛎️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">
                        Cascade Concierge Desk
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 shrink-0">
                        24/7 Support
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Direct owner quotes • Instant assistance via Call & WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                  <a
                    href={`tel:${CONCIERGE_INFO.phoneClean}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow hover:scale-[1.02] whitespace-nowrap"
                  >
                    <span>📞</span>
                    <span>Call {CONCIERGE_INFO.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${CONCIERGE_INFO.phoneClean}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 transition-all shadow hover:scale-[1.02] whitespace-nowrap"
                  >
                    <span>WhatsApp</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-panel rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-white/15 shadow-2xl space-y-6">
              {/* Pricing Display */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Nightly Tariff
                </span>
                <div className="flex items-baseline gap-2">
                  {villa.discountPercentage > 0 ? (
                    <>
                      <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                        {formatCurrency(discountedPrice)}
                      </span>
                      <span className="text-sm text-neutral-400 line-through">
                        {formatCurrency(villa.pricePerNight)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                      {formatCurrency(villa.pricePerNight)}
                    </span>
                  )}
                  <span className="text-xs text-neutral-500">/ night</span>
                </div>

                {villa.discountPercentage > 0 && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    Special Seasonal Offer ({villa.discountPercentage}% OFF)
                  </span>
                )}
              </div>

              {/* Direct Booking CTA */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onEnquireClick(villa)}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-base transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-95"
                >
                  Enquire for Dates
                </button>

                <WhatsAppButton villaName={villa.name || villa.villaName} />

                <a
                  href={`tel:${CONCIERGE_INFO.phoneClean}`}
                  className="w-full py-3.5 px-6 rounded-2xl glass-panel border border-neutral-300 dark:border-white/15 text-neutral-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-all"
                >
                  <span>📞 Call Concierge: {CONCIERGE_INFO.phone}</span>
                </a>
              </div>

              <div className="pt-4 border-t border-neutral-200/60 dark:border-white/10 text-center text-xs text-neutral-500 space-y-1.5">
                <p>🔒 Zero advance required for inquiry submission</p>
                <p>✓ 100% verified property with host assurance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaDetail;
