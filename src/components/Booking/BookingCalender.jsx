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
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const blocked = isDateBlocked(date);
      const today = isToday(date);
      const past = isPastDate(date);
      const bookingInfo = getBookingInfo(date);

      days.push(
        <div
          key={day}
          className={`aspect-square flex items-center justify-center rounded-lg text-sm relative cursor-pointer transition-all
            ${blocked ? 'bg-red-100 text-red-700 font-semibold hover:bg-red-200' : ''}
            ${!blocked && !past ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}
            ${past && !blocked ? 'bg-neutral-50 text-neutral-400' : ''}
            ${today ? 'ring-2 ring-neutral-800' : ''}
            ${compact ? 'text-xs' : ''}
          `}
          onMouseEnter={() => setHoveredDate(bookingInfo)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
          {blocked && !compact && (
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${compact ? 'p-3' : 'p-6'} rounded-lg border border-neutral-200`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className={`font-bold text-neutral-800 ${compact ? 'text-sm' : 'text-lg'}`}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className={`grid grid-cols-7 gap-1 mb-2 ${compact ? 'mb-1' : 'mb-2'}`}>
        {dayNames.map(day => (
          <div
            key={day}
            className={`text-center font-semibold text-neutral-600 ${compact ? 'text-xs' : 'text-sm'}`}
          >
            {compact ? day.charAt(0) : day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`grid grid-cols-7 gap-1 ${compact ? 'gap-0.5' : 'gap-1'}`}>
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className={`mt-4 pt-4 border-t border-neutral-200 flex ${compact ? 'flex-col gap-2' : 'flex-wrap gap-4'}`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-50 border border-green-200"></div>
          <span className={`text-neutral-600 ${compact ? 'text-xs' : 'text-sm'}`}>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
          <span className={`text-neutral-600 ${compact ? 'text-xs' : 'text-sm'}`}>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-neutral-50 border border-neutral-200"></div>
          <span className={`text-neutral-600 ${compact ? 'text-xs' : 'text-sm'}`}>Past</span>
        </div>
      </div>

      {/* Booking info tooltip */}
      {hoveredDate && !compact && (
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-800">
            {new Date(hoveredDate.checkInDate).toLocaleDateString()} - {new Date(hoveredDate.checkOutDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            {hoveredDate.bookingType === 'offline' ? '🏢 Offline Booking' : '🌐 Online Booking'}
          </p>
          {hoveredDate.guestName && hoveredDate.guestName !== 'Reserved' && (
            <p className="text-xs text-neutral-600">Guest: {hoveredDate.guestName}</p>
          )}
        </div>
      )}

      {/* Summary */}
      {!compact && blockedDates.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{blockedDates.length}</span> booking{blockedDates.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;