// src/components/Villas/VillaCard.jsx
import React, { useEffect, useState } from "react";
import { formatCurrency, scrollToTop } from "../../utils/helpers";
import { AMENITIES_ICONS } from "../../utils/constants";
import { getBlockedDates } from "../../firebase/bookingService";

const VillaCard = ({ villa, onClick }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBlockedDates = async () => {
      if (villa?.id && bookedDates.length === 0 && !loading) {
        try {
          const dates = await getBlockedDates(villa.id);
          if (isMounted) setBookedDates(dates);
        } catch (error) {
          console.error("Error loading booking dates:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };
    fetchBlockedDates();
    return () => { isMounted = false; };
  }, [villa?.id]);

  const discountedPrice =
    villa.discountPercentage > 0
      ? villa.pricePerNight * (1 - villa.discountPercentage / 100)
      : villa.pricePerNight;

  return (
    <div
      onClick={() => {
        scrollToTop(true);
        onClick(villa);
      }}
      onMouseEnter={() => setShowBookingInfo(true)}
      onMouseLeave={() => setShowBookingInfo(false)}
      className="glass-card rounded-3xl overflow-hidden cursor-pointer group relative flex flex-col justify-between"
    >
      {/* Villa Image Stage */}
      <div className="relative h-64 overflow-hidden bg-neutral-950">
        <img
          src={
            villa.images?.[0] || "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800"
          }
          alt={villa.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Gradient Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Badges Overlay */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {villa.isFeatured && (
            <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg backdrop-blur-sm">
              ⭐ Featured
            </span>
          )}
          {villa.isTrending && (
            <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg backdrop-blur-sm">
              🔥 Trending Deal
            </span>
          )}
        </div>

        {/* Bookings Count Pill */}
        {bookedDates.length > 0 && (
          <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-950/70 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            📅 {bookedDates.length} Booked
          </div>
        )}

        {/* Discount Pill */}
        {villa.discountPercentage > 0 && (
          <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500 text-neutral-950 shadow-lg">
            {villa.discountPercentage}% OFF
          </div>
        )}

        {/* Location Tag */}
        <div className="absolute bottom-3.5 left-3.5 text-white flex items-center gap-1 text-xs font-semibold drop-shadow-md">
          <span>📍</span>
          <span>{villa.location}</span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1.5">
            {villa.name}
          </h3>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
            {villa.description}
          </p>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 py-2 px-3 rounded-2xl bg-neutral-100/80 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5 text-xs text-neutral-700 dark:text-neutral-300 mb-4 font-semibold">
            <span>🛏️ {villa.bedrooms} Beds</span>
            <span className="text-neutral-400">•</span>
            <span>🚿 {villa.bathrooms} Baths</span>
            <span className="text-neutral-400">•</span>
            <span>👥 Up to {villa.maxGuests}</span>
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {villa.amenities?.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-neutral-200/60 dark:bg-white/10 text-neutral-700 dark:text-neutral-300"
              >
                {AMENITIES_ICONS[amenity]} {amenity}
              </span>
            ))}
            {villa.amenities?.length > 3 && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-neutral-200/80 dark:bg-white/15 text-neutral-600 dark:text-neutral-300">
                +{villa.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3.5 border-t border-neutral-200/60 dark:border-white/10 flex items-center justify-between">
          <div>
            {villa.discountPercentage > 0 ? (
              <div>
                <span className="text-xs text-neutral-400 line-through mr-1.5">
                  {formatCurrency(villa.pricePerNight)}
                </span>
                <span className="text-lg font-black text-neutral-900 dark:text-white">
                  {formatCurrency(discountedPrice)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-black text-neutral-900 dark:text-white">
                {formatCurrency(villa.pricePerNight)}
              </span>
            )}
            <span className="text-[11px] text-neutral-500 block -mt-0.5">per night</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollToTop(true);
              onClick(villa);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 transition-all shadow-md group-hover:shadow-lg group-hover:scale-105"
          >
            Explore
          </button>
        </div>
      </div>

      {/* Hover Availability Overlay */}
      {showBookingInfo && (
        <div className="absolute inset-0 bg-neutral-950/95 dark:bg-black/95 backdrop-blur-md p-6 flex flex-col justify-between z-20 text-white animate-fade-in">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h4 className="text-sm font-bold flex items-center gap-1.5 text-emerald-400">
                <span>📅 Availability Snapshot</span>
              </h4>
              <span className="text-[10px] text-neutral-400 font-mono">Live Calendar</span>
            </div>

            {bookedDates.filter(b => b.checkOutDate && new Date(b.checkOutDate) >= new Date().setHours(0,0,0,0)).length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <p className="text-[11px] text-neutral-400 mb-2">Upcoming Reserved Dates:</p>
                {bookedDates
                  .filter(b => b.checkOutDate && new Date(b.checkOutDate) >= new Date().setHours(0,0,0,0))
                  .slice(0, 3)
                  .map((booking, index) => (
                  <div
                    key={index}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs flex justify-between items-center"
                  >
                    <span className="font-semibold text-neutral-200">
                      {new Date(booking.checkInDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(booking.checkOutDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      Booked
                    </span>
                  </div>
                ))}
                {bookedDates.filter(b => b.checkOutDate && new Date(b.checkOutDate) >= new Date().setHours(0,0,0,0)).length > 3 && (
                  <p className="text-[10px] text-neutral-500 text-center pt-1">
                    +{bookedDates.filter(b => b.checkOutDate && new Date(b.checkOutDate) >= new Date().setHours(0,0,0,0)).length - 3} more reserved periods
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <span className="text-2xl mb-1 block">✨</span>
                <p className="text-xs font-semibold text-emerald-400">
                  Open for Bookings!
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  All upcoming dates currently available.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollToTop(true);
              onClick(villa);
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-bold transition-all shadow-lg"
          >
            Check Dates & Enquire
          </button>
        </div>
      )}
    </div>
  );
};

export default VillaCard;
