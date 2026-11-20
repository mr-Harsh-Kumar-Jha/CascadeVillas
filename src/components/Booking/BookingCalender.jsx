// src/components/Booking/BookingCalendar.jsx
import React, { useState, useEffect } from 'react';
import { getBlockedDates } from '../../firebase/bookingService';

const BookingCalendar = ({ villaId, compact = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    loadBlockedDates();
  }, [villaId]);

  const loadBlockedDates = async () => {
    try {
      setLoading(true);
      const dates = await getBlockedDates(villaId);
      setBlockedDates(dates);
    } catch (error) {
      console.error('Error loading blocked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateBlocked = (date) => {
    return blockedDates.some(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= checkIn && date < checkOut;
    });
  };

  const getBookingInfo = (date) => {
    return blockedDates.find(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= checkIn && date < checkOut;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const canGoPrevious = () => {
    const today = new Date();
    return (
      currentMonth.getFullYear() > today.getFullYear() ||
      (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth())
    );
  };

  const previousMonth = () => {
    if (!canGoPrevious()) return;
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const past = isPastDate(date);
      // Auto-clear past bookings: only current/future days can be blocked
      const blocked = !past && isDateBlocked(date);
      const today = isToday(date);
      const bookingInfo = blocked ? getBookingInfo(date) : null;

      days.push(
        <div
          key={day}
          className={`aspect-square flex items-center justify-center rounded-xl text-xs font-semibold relative transition-all ${
            past
              ? 'text-neutral-400 dark:text-neutral-600 opacity-40 cursor-default'
              : blocked 
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30 cursor-not-allowed' 
                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer'
          } ${today ? 'ring-2 ring-emerald-500 font-black' : ''}`}
          onMouseEnter={() => setHoveredDate(bookingInfo)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
          {blocked && !compact && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500" />
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`glass-panel rounded-2xl ${compact ? 'p-3' : 'p-6'} border border-neutral-200/80 dark:border-white/10 shadow-sm`}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          disabled={!canGoPrevious()}
          className={`p-2 rounded-xl transition-all ${
            canGoPrevious()
              ? 'hover:bg-neutral-200/60 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 cursor-pointer active:scale-95'
              : 'opacity-25 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
          }`}
          title={canGoPrevious() ? 'Previous Month' : 'Past months cleared'}
          aria-label="Previous Month"
        >
          ←
        </button>
        
        <h3 className={`font-bold text-neutral-900 dark:text-white ${compact ? 'text-xs' : 'text-sm'}`}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl hover:bg-neutral-200/60 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer active:scale-95"
          title="Next Month"
          aria-label="Next Month"
        >
          →
        </button>
      </div>

      {/* Week Day Header */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-bold text-neutral-400 uppercase">
        {dayNames.map(day => (
          <div key={day}>{compact ? day.charAt(0) : day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-neutral-200/60 dark:border-white/10 flex items-center justify-center gap-6 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-neutral-600 dark:text-neutral-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-neutral-600 dark:text-neutral-400">Reserved</span>
        </div>
      </div>

      {hoveredDate && !compact && (
        <div className="mt-3 p-3 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs">
          <p className="font-bold text-neutral-900 dark:text-white">
            {new Date(hoveredDate.checkInDate).toLocaleDateString()} → {new Date(hoveredDate.checkOutDate).toLocaleDateString()}
          </p>
          <p className="text-neutral-500 mt-0.5">{hoveredDate.reason || 'Reserved Booking'}</p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
