// src/components/Villas/VillaCard.jsx

import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import { AMENITIES_ICONS } from "../../utils/constants";
import { getBlockedDates } from "../../firebase/bookingService";

const VillaCard = ({ villa, onClick }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMouseEnter = async () => {
    setShowBookingInfo(true);
  };

  useEffect(() => {
    const fetchBlockedDates = async () => {
      if (bookedDates.length === 0 && !loading) {
        try {
          const dates = await getBlockedDates(villa.id);
          setBookedDates(dates);
        } catch (error) {
          console.error("Error loading booking dates:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBlockedDates();
  }, [villa.id]);

  const handleMouseLeave = () => {
    setShowBookingInfo(false);
  };

  const handleCardClick = () => {
    onClick(villa);
  };

  const discountedPrice =
    villa.discountPercentage > 0
      ? villa.pricePerNight * (1 - villa.discountPercentage / 100)
      : villa.pricePerNight;

  const upcomingBookings = bookedDates
    .filter((booking) => new Date(booking.checkInDate) >= new Date())
    .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate))
    .slice(0, 3);

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            villa.images?.[0] || "https://placehold.co/600x400?text=No+Image"
          }
          alt={villa.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {villa.isFeatured && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              ⭐ Featured
            </span>
          )}
          {villa.isTrending && (
            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              🔥 Trending
            </span>
          )}
        </div>

        {bookedDates.length > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-xs font-bold text-neutral-800">
              📅 {bookedDates.length} booking
              {bookedDates.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {villa.discountPercentage > 0 && (
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
            {villa.discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
            📍 {villa.location}
          </p>
          <h3 className="text-xl font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">
            {villa.name}
          </h3>
        </div>

        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
          {villa.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">{villa.bedrooms} BD</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="font-medium">{villa.maxGuests} Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-medium">{villa.bathrooms} BA</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {villa.amenities?.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
            >
              {AMENITIES_ICONS[amenity]} {amenity}
            </span>
          ))}
          {villa.amenities?.length > 3 && (
            <span className="px-2 py-1 bg-neutral-200 text-neutral-700 text-xs rounded-full font-medium">
              +{villa.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div>
            {villa.discountPercentage > 0 ? (
              <>
                <span className="text-sm text-neutral-500 line-through">
                  {formatCurrency(villa.pricePerNight)}
                </span>
                <span className="text-xl font-bold text-neutral-800 ml-2">
                  {formatCurrency(discountedPrice)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-neutral-800">
                {formatCurrency(villa.pricePerNight)}
              </span>
            )}
            <span className="text-sm text-neutral-600">/night</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium text-sm"
          >
            View Details
          </button>
        </div>
      </div>

      {showBookingInfo && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm p-5 flex flex-col justify-center z-10">
          <h4 className="text-lg font-bold text-neutral-800 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Booked Dates
          </h4>

          {bookedDates.length > 0 ? (
            <div className="space-y-2 mb-4">
              {bookedDates.map((booking, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-sm font-semibold text-neutral-800">
                    {new Date(booking.checkInDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    {booking.bookingType === "offline"
                      ? "🏢 Offline"
                      : "🌐 Online"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600 mb-4">
              No bookings yet for Current and Upcoming dates.
            </p>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default VillaCard;
