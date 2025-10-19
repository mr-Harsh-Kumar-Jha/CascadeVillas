// src/components/Enquiry/EnquiryModal.jsx
import React, { useState } from 'react';
import { submitEnquiry } from '../../firebase/enquiryService';
import { getCurrentUser } from '../../firebase/authService';

const EnquiryModal = ({ villa, onClose, onSuccess, onLoginRequired }) => {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      onLoginRequired();
      return;
    }

    if (!validate()) return;

    try {
      setLoading(true);

      const enquiryData = {
        villaId: villa.id,
        villaName: villa.name,
        userName: user.displayName || user.email.split('@')[0],
        email: user.email,
        phone: user.phoneNumber || 'Not provided',
        checkInDate: formData.checkInDate || null,
        checkOutDate: formData.checkOutDate || null,
        numberOfGuests: formData.numberOfGuests ? parseInt(formData.numberOfGuests) : null,
        message: formData.message.trim(),
        source: 'website' // Track that this came from website
      };

      await submitEnquiry(enquiryData);
      onSuccess();
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert(error.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
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

        {/* User Info Display */}
        {user && (
          <div className="px-6 pt-6">
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <p className="text-sm text-neutral-600 mb-2">Enquiring as:</p>
              <p className="font-semibold text-neutral-800">{user.displayName || 'User'}</p>
              <p className="text-sm text-neutral-600">{user.email}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          {/* Submit Button */}
          <div className="flex gap-4">
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