// src/components/Villas/VillaDetail.jsx

import React, { useState, useEffect } from 'react';
import { getVillaById } from '../../firebase/villaService';
import { getBlockedDates } from '../../firebase/bookingService';
import { formatCurrency } from '../../utils/helpers';
import { AMENITIES_ICONS } from '../../utils/constants';
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
      
      // Load villa details
      const villaData = await getVillaById(villaId);
      setVilla(villaData);
      
      // Load booking dates
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center p-8">
          <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            {error || 'Villa not found'}
          </h2>
          <p className="text-neutral-600 mb-6">
            The villa you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium"
          >
            Back to Villas
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = villa.discountPercentage > 0
    ? villa.pricePerNight * (1 - villa.discountPercentage / 100)
    : villa.pricePerNight;

  // Get next 5 upcoming bookings
  const upcomingBookings = blockedDates
    .filter(booking => new Date(booking.checkInDate) >= new Date())
    .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors group"
          >
            <svg 
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Villas</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Carousel */}
        <div className="mb-8">
          <ImageCarousel images={villa.images} alt={villa.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Villa Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                    📍 {villa.location}
                  </p>
                  <h1 className="text-4xl font-bold text-neutral-800 mb-2">
                    {villa.name}
                  </h1>
                  <div className="flex items-center gap-4 text-neutral-600">
                    <span>{villa.bedrooms} Bedrooms</span>
                    <span>•</span>
                    <span>{villa.bathrooms} Bathrooms</span>
                    <span>•</span>
                    <span>Up to {villa.maxGuests} Guests</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {villa.isFeatured && (
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                  {villa.isTrending && (
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                      🔥 Trending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">About This Villa</h2>
              <p className="text-neutral-700 leading-relaxed">
                {villa.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {villa.amenities?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <span className="text-2xl">{AMENITIES_ICONS[amenity]}</span>
                    <span className="text-sm font-medium text-neutral-800">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Availability Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                    Booking Availability
                  </h2>
                  <p className="text-sm text-neutral-600">
                    {blockedDates.length > 0 
                      ? `${blockedDates.length} booking${blockedDates.length !== 1 ? 's' : ''} scheduled`
                      : 'No bookings yet - Fully available!'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium"
                >
                  {showCalendar ? 'Hide' : 'Show'} Calendar
                </button>
              </div>

              {/* Upcoming Bookings List */}
              {upcomingBookings.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                    Upcoming Bookings:
                  </h3>
                  <div className="space-y-2">
                    {upcomingBookings.map((booking, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-neutral-800">
                              {new Date(booking.checkInDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })} - {new Date(booking.checkOutDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {booking.bookingType === 'offline' ? '🏢 Offline Booking' : '🌐 Online Booking'}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          Booked
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar View */}
              {showCalendar && (
                <div className="mt-4">
                  <BookingCalendar villaId={villaId} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border-2 border-neutral-200 rounded-xl p-6 shadow-lg">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  {villa.discountPercentage > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-neutral-800">
                        {formatCurrency(discountedPrice)}
                      </span>
                      <span className="text-lg text-neutral-500 line-through">
                        {formatCurrency(villa.pricePerNight)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-neutral-800">
                      {formatCurrency(villa.pricePerNight)}
                    </span>
                  )}
                </div>
                <p className="text-neutral-600">per night</p>
                {villa.discountPercentage > 0 && (
                  <span className="inline-block mt-2 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    Save {villa.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Villa Stats */}
              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                <div className="flex items-center gap-3 text-neutral-700">
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm">{villa.bedrooms} Bedrooms • {villa.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700">
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm">Up to {villa.maxGuests} Guests</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700">
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{villa.location}, Maharashtra</span>
                </div>
              </div>

              {/* Booking Status */}
              {blockedDates.length > 0 && (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800 font-medium">
                    ⚠️ {blockedDates.length} date{blockedDates.length !== 1 ? 's' : ''} already booked. 
                    Check calendar above for availability.
                  </p>
                </div>
              )}

              {/* Enquire Button */}
              <button
                onClick={() => onEnquireClick(villa)}
                className="w-full px-6 py-4 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl mb-4"
              >
                Enquire Now
              </button>

              <WhatsAppButton villaName={villa.villaName} />

              <p className="text-xs text-neutral-500 text-center mt-4">
                You won't be charged yet. Our team will contact you with availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaDetail;