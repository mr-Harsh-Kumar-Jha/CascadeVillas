// src/components/Villas/VillaDetail.jsx
import React, { useState, useEffect } from 'react';
import { getVillaById } from '../../firebase/villaService';
import { formatCurrency, calculateDiscountedPrice } from '../../utils/helpers';
import { AMENITIES_ICONS } from '../../utils/constants';
import ImageCarousel from '../Common/ImageCarousel';
import Loading from '../common/Loading';
import WhatsAppButton from '../Common/WhatsAppButton';

const VillaDetail = ({ villaId, onEnquireClick, onBack }) => {
  const [villa, setVilla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVilla();
  }, [villaId]);

  const loadVilla = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVillaById(villaId);
      setVilla(data);
    } catch (err) {
      console.error('Error loading villa:', err);
      setError('Failed to load villa details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading villa details..." />;
  }

  if (error || !villa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(
    villa.pricePerNight,
    villa.discountPercentage
  );

  return (
    <section className="py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-neutral-200 hover:text-neutral-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Villas
        </button>

        {/* Image Carousel */}
        <div className="mb-8">
          <ImageCarousel images={villa.images} alt={villa.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Location */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {villa.isFeatured && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                    Featured
                  </span>
                )}
                {villa.isTrending && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                    🔥 Trending
                  </span>
                )}
                {villa.discountPercentage > 0 && (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    {villa.discountPercentage}% OFF
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
                {villa.name}
              </h1>
              
              <div className="flex items-center gap-2 text-neutral-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">{villa.location}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="text-2xl font-bold text-neutral-800">{villa.bedrooms}</p>
                <p className="text-sm text-neutral-600">Bedrooms</p>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <p className="text-2xl font-bold text-neutral-800">{villa.bathrooms}</p>
                <p className="text-sm text-neutral-600">Bathrooms</p>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-2xl font-bold text-neutral-800">{villa.maxGuests}</p>
                <p className="text-sm text-neutral-600">Guests</p>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-2xl font-bold text-neutral-800">{villa.amenities?.length || 0}</p>
                <p className="text-sm text-neutral-600">Amenities</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">About This Villa</h2>
              <p className="text-neutral-600 leading-relaxed text-lg">
                {villa.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {villa.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 bg-neutral-50 rounded-lg p-4">
                    <span className="text-2xl">{AMENITIES_ICONS[amenity] || '✓'}</span>
                    <span className="text-neutral-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                {villa.discountPercentage > 0 && (
                  <div className="text-lg text-neutral-500 line-through mb-1">
                    {formatCurrency(villa.pricePerNight)}
                  </div>
                )}
                <div className="text-4xl font-bold text-neutral-800">
                  {formatCurrency(discountedPrice)}
                </div>
                <p className="text-neutral-600">per night</p>
              </div>

              <button
                onClick={() => onEnquireClick(villa)}
                className="w-full mb-3 px-6 py-4 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-semibold text-lg"
              >
                Enquire Now
              </button>

              <WhatsAppButton villaName={villa.name} position="relative" />

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-600 text-center">
                  Free cancellation up to 48 hours before check-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaDetail;