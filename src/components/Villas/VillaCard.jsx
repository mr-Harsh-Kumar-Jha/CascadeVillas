// src/components/Villas/VillaCard.jsx
import React from "react";
import { formatCurrency, calculateDiscountedPrice } from "../../utils/helpers";

const VillaCard = ({ villa, onClick }) => {
  const discountedPrice = calculateDiscountedPrice(
    villa.pricePerNight,
    villa.discountPercentage
  );

  return (
    <div
      onClick={() => onClick(villa)}
      className="bg-white rounded-lg border border-neutral-200/20 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={villa.images?.[0] || "https://placehold.co/600x400?text=Villa"}
          alt={villa.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {villa.isFeatured && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
          {villa.isTrending && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
              🔥 Trending
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {villa.discountPercentage > 0 && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
            {villa.discountPercentage}% OFF
          </span>
        )}

        {/* Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {villa.location}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-neutral-600 transition-colors">
          {villa.name}
        </h3>

        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {villa.description}
        </p>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
          <div className="flex items-center gap-1">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>{villa.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{villa.maxGuests} Guests</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {villa.amenities?.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {villa.amenities?.length > 3 && (
            <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
              +{villa.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-4 border-t border-neutral-200">
            {villa.discountPercentage > 0 && (
              <div className="text-xl text-neutral-500 line-through">
                {formatCurrency(villa.pricePerNight)}
              </div>
            )}
            <div className="text-2xl font-bold text-neutral-800">
              {formatCurrency(discountedPrice)}
              <span className="text-sm font-normal text-neutral-600">
                /night
              </span>
            </div>
        </div>
        <button className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium" style={{ width: '100%' }}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default VillaCard;
