// src/components/Reviews/ReviewCarousel.jsx
import React, { useState, useEffect } from 'react';

const GoogleReviewsCarousel = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const reviews = [
    {
      id: 1,
      name: 'Santosh Pawar',
      rating: 5,
      date: '1 month ago',
      text: 'Had an extraordinary stay at their property. Harsh and the concierge team were exceptionally cooperative and prompt. The private pool and lawn were immaculate. Will surely visit again!',
      avatar: 'SP',
      rooms: 5,
      services: 5,
      location: 5
    },
    {
      id: 2,
      name: 'Sanket Dalvi',
      rating: 5,
      date: '1 month ago',
      text: 'Visited with a group of 32 people for a family celebration. They handled the large count with absolute ease! Delicious on-demand chef meals, clean pool, and massive parking space.',
      avatar: 'SD',
      rooms: 5,
      services: 5,
      location: 5
    },
    {
      id: 3,
      name: 'Siddharth Bhandare',
      rating: 5,
      date: '3 weeks ago',
      text: 'Stayed with my family at Cascade Villa in Lonavala. The scenic view, privacy, and hygiene exceeded all expectations. Booking directly saved us a lot of platform fees.',
      avatar: 'SB',
      rooms: 5,
      services: 5,
      location: 5
    },
    {
      id: 4,
      name: 'Sushant Jadhav',
      rating: 5,
      date: '2 months ago',
      text: 'Loved the food and atmosphere. The team made customized barbecue arrangements in the evening. True luxury experience with personal care from the host.',
      avatar: 'SJ',
      rooms: 5,
      services: 5,
      location: 5
    },
    {
      id: 5,
      name: 'Himanshu Mandiya',
      rating: 5,
      date: '1 week ago',
      text: 'Outstanding experience! Rooms were pristine, lighting and pool were spectacular. The host was supportive throughout our weekend. 10/10 recommendation for luxury stays in Lonavala.',
      avatar: 'HM',
      rooms: 5,
      services: 5,
      location: 5
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const goToReview = (index) => {
    setCurrentReview(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-400/30'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
            ⭐ Verified Guest Reviews
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-serif">
            Words From Our Guests
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl mx-auto">
            Honest feedback from families and groups who experienced the Cascade hospitality difference
          </p>
          
          <a
            href="https://share.google/5OEOuaF0JXt770NGA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-sky-500 hover:text-sky-400 hover:underline transition-colors"
          >
            <span>Read 100+ Reviews on Google</span>
            <span>↗</span>
          </a>
        </div>

        {/* Carousel Card Container */}
        <div className="relative max-w-3xl mx-auto">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-neutral-200/80 dark:border-white/10 shadow-2xl min-h-[340px] flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Stars & Quote */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(reviews[currentReview].rating)}
                </div>
                <span className="text-3xl text-neutral-400/40 font-serif">“</span>
              </div>

              {/* Review Text */}
              <p className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal italic mb-6">
                &ldquo;{reviews[currentReview].text}&rdquo;
              </p>

              {/* Rating Metric Badges */}
              <div className="flex flex-wrap items-center gap-3 py-2.5 px-4 rounded-2xl bg-neutral-100/80 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>Rooms: <strong>{reviews[currentReview].rooms}/5</strong></span>
                <span className="text-neutral-400">•</span>
                <span>Hospitality: <strong>{reviews[currentReview].services}/5</strong></span>
                <span className="text-neutral-400">•</span>
                <span>Vibe & Location: <strong>{reviews[currentReview].location}/5</strong></span>
              </div>
            </div>

            {/* Guest Identity */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-200/60 dark:border-white/10 mt-6">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-neutral-950 font-bold flex items-center justify-center text-sm shadow">
                  {reviews[currentReview].avatar}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">
                    {reviews[currentReview].name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Stayed {reviews[currentReview].date} • Verified Guest
                  </p>
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevReview}
                  className="p-2.5 rounded-xl bg-neutral-200/70 hover:bg-neutral-300 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 transition-colors"
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  onClick={nextReview}
                  className="p-2.5 rounded-xl bg-neutral-200/70 hover:bg-neutral-300 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 transition-colors"
                  aria-label="Next"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentReview
                    ? 'w-8 bg-emerald-500'
                    : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsCarousel;
