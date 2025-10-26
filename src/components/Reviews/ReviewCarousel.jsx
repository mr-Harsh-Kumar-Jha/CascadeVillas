// src/components/Reviews/GoogleReviewsCarousel.jsx
import React, { useState, useEffect } from 'react';

const GoogleReviewsCarousel = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // MOCK DATA - Replace this with actual Google reviews data
  // You can fetch this from Google My Business API or manually add reviews
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      date: '2 weeks ago',
      text: 'Amazing experience! The villa was spacious, clean, and had all the amenities we needed. The view was breathtaking. Highly recommend for family vacations!',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      rating: 5,
      date: '1 month ago',
      text: 'Perfect weekend getaway! The staff was extremely helpful and the property was well-maintained. The pool area was beautiful. Will definitely come back!',
      avatar: 'SS'
    },
    {
      id: 3,
      name: 'Rajesh Kumar',
      rating: 5,
      date: '3 weeks ago',
      text: 'Excellent service and beautiful villas. We celebrated our anniversary here and it was magical. The location is perfect for a peaceful retreat.',
      avatar: 'RK'
    },
    {
      id: 4,
      name: 'Emily Johnson',
      rating: 4,
      date: '2 months ago',
      text: 'Great place for a family reunion. The villa had plenty of space for everyone. Minor issue with Wi-Fi but overall fantastic stay!',
      avatar: 'EJ'
    },
    {
      id: 5,
      name: 'Priya Sharma',
      rating: 5,
      date: '1 week ago',
      text: 'Best villa rental experience ever! The booking process was smooth, and the property exceeded our expectations. Perfect for corporate retreats too!',
      avatar: 'PS'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const goToReview = (index) => {
    setCurrentReview(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Read reviews from our satisfied guests who experienced the Cascade Villas difference
          </p>
          
          {/* Google Reviews Link */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Cascade+Villas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            View all reviews on Google
          </a>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Review Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 min-h-[300px] flex flex-col justify-between">
            {/* Quote Icon */}
            <div className="text-neutral-200 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Review Content */}
            <div className="flex-grow">
              <div className="flex items-center gap-1 mb-4">
                {renderStars(reviews[currentReview].rating)}
              </div>
              
              <p className="text-neutral-700 text-lg leading-relaxed mb-6">
                "{reviews[currentReview].text}"
              </p>
            </div>

            {/* Reviewer Info */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-neutral-100">
              <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-white font-semibold">
                {reviews[currentReview].avatar}
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  {reviews[currentReview].name}
                </p>
                <p className="text-sm text-neutral-500">
                  {reviews[currentReview].date}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-neutral-800 hover:bg-neutral-50"
            aria-label="Previous review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-neutral-800 hover:bg-neutral-50"
            aria-label="Next review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentReview
                    ? 'bg-neutral-800 w-8'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Instructions for updating reviews */}
        {/* TODO: Remove this comment block in production */}
        {/* 
          TO UPDATE REVIEWS:
          1. Replace the 'reviews' array above with your actual Google reviews
          2. You can fetch reviews from Google My Business API
          3. Or manually add reviews in the same format
          4. Each review should have: id, name, rating, date, text, avatar
        */}
      </div>
    </section>
  );
};

export default GoogleReviewsCarousel;