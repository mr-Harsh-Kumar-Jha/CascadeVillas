// src/components/Admin/AdminVillaManagement.jsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LOCATIONS, AMENITIES_ICONS } from '../../utils/constants';
import { 
  getVillaBookings, 
  createManualBlock, 
  deleteBooking,
  getConflictingEnquiries,
  notifyConflictingEnquiries 
} from '../../firebase/bookingService';
import Loading from '../Common/Loading';
import BookingCalendar from "../Booking/BookingCalender";

const AdminVillaManagement = () => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVilla, setEditingVilla] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVillaForBooking, setSelectedVillaForBooking] = useState(null);
  const [villaBookings, setVillaBookings] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    location: 'Lonavala',
    description: '',
    pricePerNight: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: [],
    images: [''], // Start with one empty field
    isFeatured: false,
    isTrending: false,
    discountPercentage: 0,
    status: 'available'
  });
  
  const [blockingData, setBlockingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    reason: ''
  });
  
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const availableAmenities = Object.keys(AMENITIES_ICONS);

  useEffect(() => {
    loadVillas();
  }, []);

  const loadVillas = async () => {
    try {
      setLoading(true);
      const villasRef = collection(db, 'villas');
      const snapshot = await getDocs(villasRef);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVillas(data);
    } catch (error) {
      console.error('Error loading villas:', error);
      alert('Failed to load villas');
    } finally {
      setLoading(false);
    }
  };

  const loadVillaBookings = async (villaId) => {
    try {
      const bookings = await getVillaBookings(villaId);
      setVillaBookings(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ENHANCED: Dynamic image handling - unlimited photos
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Villa name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.pricePerNight || formData.pricePerNight <= 0) newErrors.pricePerNight = 'Valid price is required';
    if (!formData.bedrooms || formData.bedrooms <= 0) newErrors.bedrooms = 'Number of bedrooms is required';
    if (!formData.bathrooms || formData.bathrooms <= 0) newErrors.bathrooms = 'Number of bathrooms is required';
    if (!formData.maxGuests || formData.maxGuests <= 0) newErrors.maxGuests = 'Max guests is required';
    
    const validImages = formData.images.filter(img => img.trim()).length;
    if (validImages === 0) newErrors.images = 'At least one image URL is required';
    
    if (formData.amenities.length === 0) newErrors.amenities = 'Select at least one amenity';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setSaving(true);
      
      const villaData = {
        name: formData.name.trim(),
        location: formData.location,
        description: formData.description.trim(),
        pricePerNight: parseInt(formData.pricePerNight),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        maxGuests: parseInt(formData.maxGuests),
        amenities: formData.amenities,
        images: formData.images.filter(img => img.trim()), // Only save non-empty images
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending,
        discountPercentage: parseInt(formData.discountPercentage) || 0,
        status: formData.status,
        updatedAt: new Date()
      };

      if (editingVilla) {
        const villaRef = doc(db, 'villas', editingVilla.id);
        await updateDoc(villaRef, villaData);
        alert('Villa updated successfully!');
      } else {
        villaData.createdAt = new Date();
        await addDoc(collection(db, 'villas'), villaData);
        alert('Villa created successfully!');
      }

      resetForm();
      loadVillas();
    } catch (error) {
      console.error('Error saving villa:', error);
      alert('Failed to save villa: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (villa) => {
    setEditingVilla(villa);
    setFormData({
      name: villa.name,
      location: villa.location,
      description: villa.description,
      pricePerNight: villa.pricePerNight.toString(),
      bedrooms: villa.bedrooms.toString(),
      bathrooms: villa.bathrooms.toString(),
      maxGuests: villa.maxGuests.toString(),
      amenities: villa.amenities || [],
      images: villa.images && villa.images.length > 0 ? villa.images : [''],
      isFeatured: villa.isFeatured || false,
      isTrending: villa.isTrending || false,
      discountPercentage: villa.discountPercentage || 0,
      status: villa.status || 'available'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (villaId) => {
    if (!window.confirm('Are you sure you want to delete this villa? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'villas', villaId));
      alert('Villa deleted successfully!');
      loadVillas();
    } catch (error) {
      console.error('Error deleting villa:', error);
      alert('Failed to delete villa: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: 'Lonavala',
      description: '',
      pricePerNight: '',
      bedrooms: '',
      bathrooms: '',
      maxGuests: '',
      amenities: [],
      images: [''],
      isFeatured: false,
      isTrending: false,
      discountPercentage: 0,
      status: 'available'
    });
    setEditingVilla(null);
    setShowForm(false);
    setErrors({});
  };

  // NEW: Booking management functions
  const handleManageBookings = async (villa) => {
    setSelectedVillaForBooking(villa);
    await loadVillaBookings(villa.id);
    setShowBookingModal(true);
  };

  const handleCreateManualBlock = async (e) => {
    e.preventDefault();
    
    if (!blockingData.checkInDate || !blockingData.checkOutDate) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    if (new Date(blockingData.checkInDate) >= new Date(blockingData.checkOutDate)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    try {
      setSaving(true);
      
      // Check for conflicting enquiries
      const conflicting = await getConflictingEnquiries(
        selectedVillaForBooking.id,
        blockingData.checkInDate,
        blockingData.checkOutDate
      );

      if (conflicting.length > 0) {
        const confirmed = window.confirm(
          `This will affect ${conflicting.length} pending enquir${conflicting.length === 1 ? 'y' : 'ies'}. They will be notified that these dates are no longer available. Continue?`
        );
        
        if (!confirmed) {
          setSaving(false);
          return;
        }

        // Notify conflicting enquiries
        await notifyConflictingEnquiries(conflicting.map(e => e.id));
      }

      await createManualBlock({
        villaId: selectedVillaForBooking.id,
        villaName: selectedVillaForBooking.name,
        checkInDate: blockingData.checkInDate,
        checkOutDate: blockingData.checkOutDate,
        reason: blockingData.reason || 'Manually blocked by admin'
      });

      alert('Dates blocked successfully!');
      setBlockingData({ checkInDate: '', checkOutDate: '', reason: '' });
      await loadVillaBookings(selectedVillaForBooking.id);
    } catch (error) {
      console.error('Error creating block:', error);
      alert('Failed to block dates: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to remove this booking? This will make the dates available again.')) {
      return;
    }

    try {
      await deleteBooking(bookingId);
      alert('Booking removed successfully!');
      await loadVillaBookings(selectedVillaForBooking.id);
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to remove booking: ' + error.message);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading villas..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Villa Management</h1>
            <p className="text-neutral-600 mt-1">Manage your property listings</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Villa
            </button>
          )}
        </div>

        {/* Villa Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              {editingVilla ? 'Edit Villa' : 'Create New Villa'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Villa Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
                      errors.name ? 'border-red-500' : 'border-neutral-200'
                    }`}
                    placeholder="e.g., Sunset Paradise Villa"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  >
                    {LOCATIONS.filter(loc => loc.value !== 'all').map(loc => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 resize-none ${
                    errors.description ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="Describe the villa, its features, and what makes it special..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Price/Night (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
                      errors.pricePerNight ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.pricePerNight && <p className="mt-1 text-sm text-red-500">{errors.pricePerNight}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Bedrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
                      errors.bedrooms ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-500">{errors.bedrooms}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Bathrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
                      errors.bathrooms ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-500">{errors.bathrooms}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Max Guests <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
                      errors.maxGuests ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                  {errors.maxGuests && <p className="mt-1 text-sm text-red-500">{errors.maxGuests}</p>}
                </div>
              </div>

              {/* ENHANCED: UNLIMITED Image URLs */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Image URLs <span className="text-red-500">*</span> 
                  <span className="text-xs text-neutral-500 font-normal ml-2">(At least 1 required)</span>
                </label>
                <div className="space-y-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder={`Image URL ${index + 1} (e.g., https://images.unsplash.com/...)`}
                        className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="px-3 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove this image"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 text-neutral-600 rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Another Image
                  </button>
                </div>
                {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
                <p className="mt-2 text-xs text-neutral-600">
                  💡 Use free images from <a href="https://unsplash.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Unsplash</a> or upload to <a href="https://cloudinary.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Cloudinary</a>
                </p>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Amenities <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableAmenities.map(amenity => (
                    <label
                      key={amenity}
                      className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'border-neutral-800 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{AMENITIES_ICONS[amenity]} {amenity}</span>
                    </label>
                  ))}
                </div>
                {errors.amenities && <p className="mt-1 text-sm text-red-500">{errors.amenities}</p>}
              </div>

              {/* Flags & Settings */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium text-neutral-700">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium text-neutral-700">Trending</span>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-semibold disabled:bg-neutral-400"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingVilla ? 'Update Villa' : 'Create Villa'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Villas List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {villas.map(villa => (
            <div key={villa.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={villa.images?.[0] || 'https://placehold.co/600x400?text=No+Image'}
                  alt={villa.name}
                  className="w-full h-full object-cover"
                />
                {villa.isFeatured && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                    Featured
                  </span>
                )}
                {villa.isTrending && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                    🔥 Trending
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-neutral-800 mb-2">{villa.name}</h3>
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{villa.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-neutral-800">
                    ₹{villa.pricePerNight?.toLocaleString()}/night
                  </span>
                  {villa.discountPercentage > 0 && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                      {villa.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(villa)}
                      className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(villa.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => handleManageBookings(villa)}
                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Manage Bookings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {villas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
            <p className="text-neutral-600 mb-4">No villas yet. Create your first villa listing!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium"
            >
              Add New Villa
            </button>
          </div>
        )}
      </div>

      {/* Booking Management Modal */}
      {showBookingModal && selectedVillaForBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">{selectedVillaForBooking.name}</h2>
                <p className="text-neutral-600 mt-1">Manage bookings and blocked dates</p>
              </div>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedVillaForBooking(null);
                  setBlockingData({ checkInDate: '', checkOutDate: '', reason: '' });
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Calendar View */}
              <div>
                <h3 className="text-lg font-bold text-neutral-800 mb-4">Calendar View</h3>
                <BookingCalendar villaId={selectedVillaForBooking.id} />
              </div>

              {/* Manual Block Form */}
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-neutral-800 mb-4">Block Dates Manually</h3>
                <form onSubmit={handleCreateManualBlock} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={blockingData.checkInDate}
                        onChange={(e) => setBlockingData(prev => ({ ...prev, checkInDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={blockingData.checkOutDate}
                        onChange={(e) => setBlockingData(prev => ({ ...prev, checkOutDate: e.target.value }))}
                        min={blockingData.checkInDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Reason (Optional)
                    </label>
                    <input
                      type="text"
                      value={blockingData.reason}
                      onChange={(e) => setBlockingData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="e.g., Maintenance, Private event, etc."
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors font-semibold disabled:bg-neutral-400"
                  >
                    {saving ? 'Blocking...' : 'Block These Dates'}
                  </button>
                </form>
              </div>

              {/* Existing Bookings List */}
              <div>
                <h3 className="text-lg font-bold text-neutral-800 mb-4">
                  Existing Bookings ({villaBookings.length})
                </h3>
                {villaBookings.length === 0 ? (
                  <p className="text-neutral-600 text-center py-8 bg-neutral-50 rounded-lg">
                    No bookings yet for this villa.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {villaBookings.map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-neutral-800">
                              {new Date(booking.checkInDate).toLocaleDateString()} → {new Date(booking.checkOutDate).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                              booking.bookingType === 'offline' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {booking.bookingType === 'offline' ? '🏢 Offline' : '🌐 Online'}
                            </span>
                          </div>
                          {booking.guestInfo && (
                            <p className="text-sm text-neutral-600">
                              {booking.guestInfo.name}
                              {booking.guestInfo.email && booking.guestInfo.email !== 'admin@cascadevillas.in' && 
                                ` • ${booking.guestInfo.email}`
                              }
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVillaManagement;