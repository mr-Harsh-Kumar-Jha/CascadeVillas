// src/components/Enquiry/EnquiryModal.jsx
import React, { useState, useEffect } from 'react';
import { submitEnquiry } from '../../firebase/enquiryService';
import { getCurrentUser } from '../../firebase/authService';
import { checkDateConflict } from '../../firebase/bookingService';

const EnquiryModal = ({ villa, onClose, onSuccess, onLoginRequired }) => {
  const user = getCurrentUser();
  
  const [formData, setFormData] = useState({
    name: user ? (user.displayName || user.email.split('@')[0]) : '',
    email: user ? user.email : '',
    phone: user ? (user.phoneNumber || '') : '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginSuggestion, setShowLoginSuggestion] = useState(false);
  const [dateConflict, setDateConflict] = useState(null);
  const [checkingDates, setCheckingDates] = useState(false);

  useEffect(() => {
    const checkDates = async () => {
      if (formData.checkInDate && formData.checkOutDate && villa?.id) {
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        
        if (checkOut <= checkIn) {
          setDateConflict({
            hasConflict: true,
            message: 'Check-out date must be after check-in date'
          });
          return;
        }

        setCheckingDates(true);
        try {
          const hasConflict = await checkDateConflict(
            villa.id,
            formData.checkInDate,
            formData.checkOutDate
          );
          
          if (hasConflict) {
            setDateConflict({
              hasConflict: true,
              message: 'These dates have a confirmed booking. Please choose alternate dates.'
            });
          } else {
            setDateConflict({
              hasConflict: false,
              message: 'Selected dates are completely available!'
            });
          }
        } catch (error) {
          console.error('Error checking date conflict:', error);
          setDateConflict(null);
        } finally {
          setCheckingDates(false);
        }
      } else {
        setDateConflict(null);
      }
    };

    const timer = setTimeout(checkDates, 500);
    return () => clearTimeout(timer);
  }, [formData.checkInDate, formData.checkOutDate, villa?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10,15}$/.test(phone.replace(/[\s-]/g, ''));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Valid phone number required (10-15 digits)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please add a brief note about your stay requirement';
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Check-out must be after check-in';
      }
    }

    if (dateConflict && dateConflict.hasConflict) {
      newErrors.dates = dateConflict.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (dateConflict && dateConflict.hasConflict) {
      alert('Selected dates are already booked');
      return;
    }

    try {
      setLoading(true);

      const enquiryData = {
        villaId: villa.id,
        villaName: villa.name,
        userName: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        userId: user ? user.uid : null,
        userEmail: user ? user.email : formData.email.trim().toLowerCase(),
        checkInDate: formData.checkInDate || null,
        checkOutDate: formData.checkOutDate || null,
        numberOfGuests: formData.numberOfGuests ? parseInt(formData.numberOfGuests) : null,
        message: formData.message.trim(),
        source: 'website',
        isGuestEnquiry: !user
      };

      await submitEnquiry(enquiryData);
      
      if (!user) {
        setShowLoginSuggestion(true);
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert(error.message || 'Failed to submit enquiry. Please try again.');
      setLoading(false);
    }
  };

  if (showLoginSuggestion) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="glass-panel bg-neutral-950 text-white rounded-3xl max-w-md w-full p-8 border border-white/15 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl mb-4 border border-emerald-500/30">
            ✓
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-2">
            Enquiry Submitted!
          </h3>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Thank you! The Cascade concierge team will contact you shortly at <span className="text-emerald-400 font-semibold">{formData.email}</span>.
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 text-left">
            <p className="text-xs font-bold text-white mb-1">
              💡 Track Your Inquiry & Bookings
            </p>
            <p className="text-[11px] text-neutral-400 mb-3">
              Create a free passwordless or Google account to check live status and chat with the host.
            </p>
            <button
              onClick={() => {
                onClose();
                if (onLoginRequired) setTimeout(onLoginRequired, 100);
              }}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500 text-neutral-950 hover:bg-emerald-600 transition-colors"
            >
              Sign In / Track Enquiry
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-neutral-800 text-neutral-300 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-panel bg-neutral-950 text-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-white/15 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">
              Direct Host Reservation Inquiry
            </span>
            <h2 className="text-xl font-black tracking-tight">{villa.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-white/5 transition-colors"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* User state badge */}
        <div className="px-6 pt-4">
          {user ? (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <span>✓</span>
              <span>Logged in as <strong>{user.email}</strong>. This inquiry will be linked to your dashboard.</span>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-2">
              <span>ℹ️</span>
              <span>Submitting as guest. No payment required at this step.</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                disabled={loading || user}
              />
              {errors.name && <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                disabled={loading || user}
              />
              {errors.email && <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                disabled={loading}
              />
              {errors.phone && <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Number of Guests
              </label>
              <input
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                min="1"
                max={villa.maxGuests || 50}
                placeholder={`Up to ${villa.maxGuests || 15}`}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                disabled={loading}
              />
            </div>
          </div>

          {/* Dates & Live Conflict Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Check-in Date</label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Check-out Date</label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                disabled={loading}
              />
            </div>
          </div>

          {checkingDates && (
            <p className="text-[11px] text-neutral-400 animate-pulse">Checking calendar availability...</p>
          )}

          {dateConflict && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              dateConflict.hasConflict
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
            }`}>
              {dateConflict.hasConflict ? '⚠️' : '✓'} {dateConflict.message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              Your Requirements / Special Requests <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              placeholder="Tell us about the occasion (family stay, corporate retreat, birthday), catering needs, or check-in preferences..."
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs resize-none"
              disabled={loading}
            />
            {errors.message && <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.message}</p>}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || (dateConflict && dateConflict.hasConflict)}
              className="flex-1 py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Inquiry to Concierge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
