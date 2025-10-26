// src/components/Enquiry/EnquiryModal.jsx
import React, { useState } from 'react';
import { submitEnquiry } from '../../firebase/enquiryService';
import { getCurrentUser } from '../../firebase/authService';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
        isGuestEnquiry: !user // Track if this was submitted without login
      };

      await submitEnquiry(enquiryData);
      
      // If user is not logged in, show login suggestion
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

  // Success modal for non-logged-in users
  if (showLoginSuggestion) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h3 className="text-2xl font-bold text-neutral-800 text-center mb-3">
            Enquiry Submitted Successfully!
          </h3>
          <p className="text-neutral-600 text-center mb-6">
            We've received your enquiry and will get back to you shortly at{' '}
            <span className="font-semibold">{formData.email}</span>
          </p>

          {/* Email Confirmation Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-blue-800">
                A confirmation email has been sent to your inbox with your enquiry details.
              </p>
            </div>
          </div>

          {/* Login Suggestion */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-neutral-700 mb-3">
              💡 <strong>Want to track your enquiry?</strong>
            </p>
            <p className="text-sm text-neutral-600 mb-3">
              Create an account to view all your enquiries, get real-time updates, and manage your bookings in one place!
            </p>
            <button
              onClick={() => {
                onClose();
                if (onLoginRequired) {
                  setTimeout(() => onLoginRequired(), 100);
                }
              }}
              className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-semibold text-sm"
            >
              Create Account / Login
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Enquire About Villa</h2>
            <p className="text-neutral-600 mt-1">{villa.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info Display (if logged in) */}
        {user && (
          <div className="px-6 pt-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-green-800">You're logged in</p>
              </div>
              <p className="text-sm text-green-700">Your enquiry will be tracked automatically in your dashboard</p>
            </div>
          </div>
        )}

        {/* Not Logged In Notice */}
        {!user && (
          <div className="px-6 pt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Quick Enquiry</p>
                  <p className="text-sm text-blue-700">
                    You can submit an enquiry without logging in. To track your enquiry status, consider creating an account after submitting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contact Information - Always visible, pre-filled if logged in */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-800">Contact Information</h3>
            
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
                  errors.name ? 'border-red-500' : 'border-neutral-200'
                } ${user ? 'bg-neutral-50' : ''}`}
                disabled={loading || user}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
                  errors.email ? 'border-red-500' : 'border-neutral-200'
                } ${user ? 'bg-neutral-50' : ''}`}
                disabled={loading || user}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXXXXXXX"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
                  errors.phone ? 'border-red-500' : 'border-neutral-200'
                }`}
                disabled={loading}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-800">Booking Details</h3>
            
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Check-out Date
                </label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                min="1"
                max={villa.maxGuests}
                placeholder={`Max ${villa.maxGuests} guests`}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                disabled={loading}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your requirements, special requests, or any questions..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 resize-none ${
                  errors.message ? 'border-red-500' : 'border-neutral-200'
                }`}
                disabled={loading}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-semibold disabled:bg-neutral-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;