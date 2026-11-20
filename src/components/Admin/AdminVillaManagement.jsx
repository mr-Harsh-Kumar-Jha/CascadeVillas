// src/components/Admin/AdminVillaManagement.jsx

import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LOCATIONS, AMENITIES_ICONS } from '../../utils/constants';
import { 
  getVillaBookings, 
  createManualBlock, 
  deleteBooking,
  getConflictingEnquiries,
  notifyConflictingEnquiries 
} from '../../firebase/bookingService';
import { deleteVilla } from '../../firebase/villaService';
import { 
  uploadVillaImage, 
  deleteVillaImage, 
  isFirebaseStorageUrl,
  isStorageBucketReady 
} from '../../firebase/storageService';
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
  
  // Image Upload state
  const [uploadingFiles, setUploadingFiles] = useState([]); // Array of { id, name, progress, error }
  const [externalUrlInput, setExternalUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [bucketReady, setBucketReady] = useState(true);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    location: 'Lonavala',
    description: '',
    pricePerNight: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: [],
    images: [], // List of image URLs
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
  const [notification, setNotification] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [pendingVillaData, setPendingVillaData] = useState(null);

  const availableAmenities = Object.keys(AMENITIES_ICONS);

  useEffect(() => {
    loadVillas();
    isStorageBucketReady().then(ready => setBucketReady(ready));
    
    // Check if there is an unsaved draft from a previous failed permission save
    try {
      const draft = localStorage.getItem('cascade_villa_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed?.name && !formData.name) {
          // Keep draft accessible
          console.log('Found unsaved villa draft in storage');
        }
      }
    } catch { /* ignore */ }
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadVillas = async () => {
    try {
      setLoading(true);
      const villasRef = collection(db, 'villas');
      const snapshot = await getDocs(villasRef);
      const remoteData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Merge locally cached fallback villas
      let combined = remoteData;
      try {
        const local = JSON.parse(localStorage.getItem('cascade_local_villas') || '[]');
        if (Array.isArray(local) && local.length > 0) {
          const remoteIds = new Set(remoteData.map(v => v.id));
          const uniqueLocal = local.filter(v => !remoteIds.has(v.id));
          combined = [...uniqueLocal, ...remoteData];
        }
      } catch { /* ignore */ }

      setVillas(combined);
    } catch (error) {
      console.error('Error loading villas:', error);
      showToast('Failed to load villas: ' + error.message, 'error');
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

  // MULTI-PHOTO SERVER UPLOAD (CONCURRENT & RESILIENT)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter valid images
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length < files.length) {
      showToast('Only image files (JPG, PNG, WebP) are allowed', 'error');
    }

    if (validFiles.length === 0) return;

    // Upload concurrently with individual progress tracking
    const uploadPromises = validFiles.map(async (file) => {
      const uploadId = `${Date.now()}_${Math.random()}`;
      setUploadingFiles(prev => [...prev, { id: uploadId, name: file.name, progress: 15 }]);

      try {
        const { downloadUrl } = await uploadVillaImage(file, (progress) => {
          setUploadingFiles(prev => 
            prev.map(item => item.id === uploadId ? { ...item, progress } : item)
          );
        });

        // Add to form images
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, downloadUrl]
        }));

        // Remove from uploading list
        setUploadingFiles(prev => prev.filter(item => item.id !== uploadId));
        return { success: true, name: file.name };
      } catch (err) {
        console.error('Upload failed for file:', file.name, err);
        setUploadingFiles(prev => 
          prev.map(item => item.id === uploadId ? { ...item, error: err.message || 'Upload failed' } : item)
        );
        return { success: false, name: file.name };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulCount = results.filter(r => r.success).length;
    if (successfulCount > 0) {
      showToast(`Added ${successfulCount} photo${successfulCount > 1 ? 's' : ''} to villa gallery!`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // REMOVE PHOTO (Deletes from Firebase Storage if hosted there)
  const handleRemovePhoto = async (indexToRemove) => {
    const photoUrl = formData.images[indexToRemove];
    if (!photoUrl) return;

    // Optimistically remove from state
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));

    // If it's a Firebase Storage URL, delete from server
    if (isFirebaseStorageUrl(photoUrl)) {
      try {
        await deleteVillaImage(photoUrl);
        showToast('Photo removed from server storage');
      } catch (err) {
        console.warn('Could not delete photo from server storage:', err);
      }
    }
  };

  // Set photo as primary cover
  const handleSetPrimaryPhoto = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const reordered = [...prev.images];
      const [chosen] = reordered.splice(index, 1);
      reordered.unshift(chosen);
      return { ...prev, images: reordered };
    });
    showToast('Cover photo updated');
  };

  // Add external URL fallback
  const handleAddExternalUrl = () => {
    const url = externalUrlInput.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      showToast('Please enter a valid HTTP/HTTPS URL', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    setExternalUrlInput('');
    setShowUrlInput(false);
    showToast('External image link added');
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
    
    if (!formData.images || formData.images.length === 0) {
      newErrors.images = 'Please upload at least one photo for this villa';
    }
    
    if (formData.amenities.length === 0) newErrors.amenities = 'Select at least one amenity';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      showToast('Please fix the highlighted errors', 'error');
      return;
    }

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
        images: formData.images.filter(img => img && img.trim()),
        isFeatured: Boolean(formData.isFeatured),
        isTrending: Boolean(formData.isTrending),
        discountPercentage: parseInt(formData.discountPercentage) || 0,
        status: formData.status,
        updatedAt: new Date()
      };

      if (editingVilla) {
        const villaRef = doc(db, 'villas', editingVilla.id);
        await updateDoc(villaRef, villaData);
        showToast('Villa updated successfully!');
      } else {
        villaData.createdAt = new Date();
        await addDoc(collection(db, 'villas'), villaData);
        showToast('Villa created successfully!');
      }

      try {
        localStorage.removeItem('cascade_villa_draft');
      } catch { /* ignore */ }

      resetForm();
      loadVillas();
    } catch (error) {
      console.error('Error saving villa:', error);
      const isPermissionError = error.code === 'permission-denied' || 
                                error.message?.toLowerCase().includes('permission');

      if (isPermissionError) {
        setPendingVillaData({
          name: formData.name.trim(),
          location: formData.location,
          description: formData.description.trim(),
          pricePerNight: parseInt(formData.pricePerNight),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          maxGuests: parseInt(formData.maxGuests),
          amenities: formData.amenities,
          images: formData.images.filter(img => img && img.trim()),
          isFeatured: Boolean(formData.isFeatured),
          isTrending: Boolean(formData.isTrending),
          discountPercentage: parseInt(formData.discountPercentage) || 0,
          status: formData.status,
          updatedAt: new Date()
        });
        setShowPermissionModal(true);
        try {
          localStorage.setItem('cascade_villa_draft', JSON.stringify(formData));
        } catch { /* ignore */ }
      } else {
        showToast('Failed to save villa: ' + error.message, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLocally = () => {
    if (!pendingVillaData) return;
    try {
      const localId = 'local_' + Date.now();
      const savedVilla = {
        ...pendingVillaData,
        id: localId,
        createdAt: new Date(),
        isLocalFallback: true
      };

      const existing = JSON.parse(localStorage.getItem('cascade_local_villas') || '[]');
      const updated = [savedVilla, ...existing];
      localStorage.setItem('cascade_local_villas', JSON.stringify(updated));

      setVillas(prev => [savedVilla, ...prev]);
      setShowPermissionModal(false);
      resetForm();
      showToast('Saved to local inventory! (Visible in your browser)', 'success');
    } catch (err) {
      console.error('Failed to save locally:', err);
    }
  };

  const handleEdit = (villa) => {
    setEditingVilla(villa);
    setFormData({
      name: villa.name || '',
      location: villa.location || 'Lonavala',
      description: villa.description || '',
      pricePerNight: villa.pricePerNight ? villa.pricePerNight.toString() : '',
      bedrooms: villa.bedrooms ? villa.bedrooms.toString() : '',
      bathrooms: villa.bathrooms ? villa.bathrooms.toString() : '',
      maxGuests: villa.maxGuests ? villa.maxGuests.toString() : '',
      amenities: villa.amenities || [],
      images: Array.isArray(villa.images) ? villa.images : [],
      isFeatured: villa.isFeatured || false,
      isTrending: villa.isTrending || false,
      discountPercentage: villa.discountPercentage || 0,
      status: villa.status || 'available'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (villaId) => {
    if (!window.confirm('Are you sure you want to delete this villa? All associated photos stored on the server will be permanently deleted.')) {
      return;
    }

    try {
      setSaving(true);
      await deleteVilla(villaId);
      showToast('Villa and all its server-stored photos were permanently deleted!');
      loadVillas();
    } catch (error) {
      console.error('Error deleting villa:', error);
      showToast('Failed to delete villa: ' + error.message, 'error');
    } finally {
      setSaving(false);
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
      images: [],
      isFeatured: false,
      isTrending: false,
      discountPercentage: 0,
      status: 'available'
    });
    setEditingVilla(null);
    setShowForm(false);
    setErrors({});
    setUploadingFiles([]);
    setExternalUrlInput('');
  };

  // Booking management
  const handleManageBookings = async (villa) => {
    setSelectedVillaForBooking(villa);
    await loadVillaBookings(villa.id);
    setShowBookingModal(true);
  };

  const handleCreateManualBlock = async (e) => {
    e.preventDefault();
    
    if (!blockingData.checkInDate || !blockingData.checkOutDate) {
      showToast('Please select both check-in and check-out dates', 'error');
      return;
    }

    if (new Date(blockingData.checkInDate) >= new Date(blockingData.checkOutDate)) {
      showToast('Check-out date must be after check-in date', 'error');
      return;
    }

    try {
      setSaving(true);
      
      const conflicting = await getConflictingEnquiries(
        selectedVillaForBooking.id,
        blockingData.checkInDate,
        blockingData.checkOutDate
      );

      if (conflicting.length > 0) {
        const confirmed = window.confirm(
          `This will affect ${conflicting.length} pending enquir${conflicting.length === 1 ? 'y' : 'ies'}. Continue?`
        );
        
        if (!confirmed) {
          setSaving(false);
          return;
        }

        await notifyConflictingEnquiries(conflicting.map(e => e.id));
      }

      await createManualBlock({
        villaId: selectedVillaForBooking.id,
        villaName: selectedVillaForBooking.name,
        checkInDate: blockingData.checkInDate,
        checkOutDate: blockingData.checkOutDate,
        reason: blockingData.reason || 'Manually blocked by admin'
      });

      showToast('Dates blocked successfully!');
      setBlockingData({ checkInDate: '', checkOutDate: '', reason: '' });
      await loadVillaBookings(selectedVillaForBooking.id);
    } catch (error) {
      console.error('Error creating block:', error);
      showToast('Failed to block dates: ' + error.message, 'error');
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
      showToast('Booking removed successfully!');
      await loadVillaBookings(selectedVillaForBooking.id);
    } catch (error) {
      console.error('Error deleting booking:', error);
      showToast('Failed to remove booking: ' + error.message, 'error');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading luxury inventory..." />;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-semibold flex items-center gap-2 animate-slide-in ${
          notification.type === 'error'
            ? 'bg-rose-500/90 text-white border-rose-400/30'
            : 'bg-emerald-500/90 text-neutral-950 border-emerald-400/40'
        }`}>
          <span>{notification.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Villa Listings &amp; Inventory
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-rose-300 border border-brand-500/20">
                {villas.length} Total
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Add, edit, upload photos with server storage, and manage live availability
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Villa</span>
            </button>
          )}
        </div>

        {/* Villa Form Section */}
        {showForm && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10 border border-neutral-200/80 dark:border-white/10 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-200/60 dark:border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {editingVilla ? `Editing: ${editingVilla.name}` : 'Create New Luxury Villa'}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Photos uploaded here are stored on server storage and cleaned up automatically if removed
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Villa Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-medium ${
                      errors.name ? 'border-rose-500 ring-1 ring-rose-500' : ''
                    }`}
                    placeholder="e.g. Whispering Pines Infinity Villa"
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Location <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-neutral-100 dark:bg-neutral-900"
                  >
                    {LOCATIONS.filter(loc => loc.value !== 'all').map(loc => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl glass-input text-sm resize-none ${
                    errors.description ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                  placeholder="Detail the experience, private pool, mountain vistas, event suitability..."
                />
                {errors.description && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.description}</p>}
              </div>

              {/* Numerical Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Price/Night (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="15000"
                    className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-medium ${
                      errors.pricePerNight ? 'border-rose-500' : ''
                    }`}
                  />
                  {errors.pricePerNight && <p className="mt-1 text-xs text-rose-500">{errors.pricePerNight}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Bedrooms <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="4"
                    className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-medium ${
                      errors.bedrooms ? 'border-rose-500' : ''
                    }`}
                  />
                  {errors.bedrooms && <p className="mt-1 text-xs text-rose-500">{errors.bedrooms}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Bathrooms <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="4"
                    className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-medium ${
                      errors.bathrooms ? 'border-rose-500' : ''
                    }`}
                  />
                  {errors.bathrooms && <p className="mt-1 text-xs text-rose-500">{errors.bathrooms}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Max Guests <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="12"
                    className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-medium ${
                      errors.maxGuests ? 'border-rose-500' : ''
                    }`}
                  />
                  {errors.maxGuests && <p className="mt-1 text-xs text-rose-500">{errors.maxGuests}</p>}
                </div>
              </div>

              {/* PHOTO UPLOADING (SERVER STORAGE) SECTION */}
              <div className="p-5 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>📸 Villa Photos &amp; Gallery</span>
                      <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                        ({formData.images.length} saved)
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Upload photos directly from your device. Linked photos are removed when a villa is deleted.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 hover:bg-neutral-50 transition-colors"
                    >
                      {showUrlInput ? 'Hide URL Input' : '+ Add via URL'}
                    </button>
                    <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-neutral-950 transition-all shadow-md flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Upload Photos</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Cloud Storage Status Banner */}
                {!bucketReady && (
                  <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                    <span className="text-base shrink-0">⚡</span>
                    <div className="flex-1">
                      <div className="font-bold flex items-center gap-2">
                        <span>High-Speed Resilient Photo Engine Active</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">
                          Zero-Lag
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                        Photos are compressed into web JPEG format and saved instantly with villa listings. To enable Google Cloud Storage bucket hosting, open{' '}
                        <a 
                          href="https://console.firebase.google.com/project/cascadevillas/storage" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-bold underline hover:text-amber-950 dark:hover:text-white"
                        >
                          Firebase Console &gt; Storage ↗
                        </a>{' '}
                        and click <strong>Get Started</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* External URL Entry */}
                {showUrlInput && (
                  <div className="flex gap-2 mb-4 p-3 rounded-xl bg-white/60 dark:bg-black/30 border border-neutral-200 dark:border-white/10">
                    <input
                      type="url"
                      value={externalUrlInput}
                      onChange={(e) => setExternalUrlInput(e.target.value)}
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      className="flex-1 px-3 py-2 rounded-lg glass-input text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddExternalUrl}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    >
                      Add URL
                    </button>
                  </div>
                )}

                {/* In-progress concurrent uploads */}
                {uploadingFiles.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {uploadingFiles.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60 border border-neutral-300 dark:border-white/10 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">
                            {item.name}
                          </span>
                          <span className="text-emerald-500 font-bold">{item.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Thumbnail Preview Grid */}
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {formData.images.map((imgUrl, index) => (
                      <div 
                        key={index} 
                        className={`group relative rounded-xl overflow-hidden border aspect-[4/3] bg-neutral-900 transition-all ${
                          index === 0 ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-neutral-200 dark:border-white/10'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Villa upload ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Primary Badge */}
                        {index === 0 && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-neutral-950 shadow">
                            Cover
                          </span>
                        )}

                        {/* Cloud indicator if hosted in Firebase Storage */}
                        {isFirebaseStorageUrl(imgUrl) && (
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-neutral-900/80 text-emerald-400 backdrop-blur-sm">
                            ☁️ Cloud
                          </span>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                              className="p-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                              title="Delete this photo"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryPhoto(index)}
                              className="w-full py-1 rounded bg-white/90 hover:bg-white text-neutral-950 text-[10px] font-bold transition-colors"
                            >
                              ★ Set as Cover
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-neutral-300 dark:border-white/10 rounded-xl">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      No photos uploaded yet. Click <strong>Upload Photos</strong> to select images from your computer.
                    </p>
                  </div>
                )}

                {errors.images && (
                  <p className="mt-2 text-xs text-rose-500 font-semibold">{errors.images}</p>
                )}
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                  Amenities <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {availableAmenities.map(amenity => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                          isSelected 
                            ? 'border-brand-500/50 bg-brand-500/10 text-brand-600 dark:text-brand-300 shadow-sm'
                            : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <span className="text-base">{AMENITIES_ICONS[amenity] || '✨'}</span>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.amenities && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.amenities}</p>}
              </div>

              {/* Flags & Promotion */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 cursor-pointer bg-neutral-50/50 dark:bg-white/5">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span className="text-xs font-bold">Featured Villa</span>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-white/10 cursor-pointer bg-neutral-50/50 dark:bg-white/5">
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span className="text-xs font-bold">🔥 Trending Villa</span>
                </label>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Booking Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-neutral-100 dark:bg-neutral-900"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-neutral-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-xl border border-neutral-300 dark:border-white/10 font-bold text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-brand-600 hover:bg-brand-500 text-white shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Processing...' : editingVilla ? 'Update Villa' : 'Save & Publish Villa'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Villa Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {villas.map(villa => (
            <div 
              key={villa.id} 
              className="glass-card rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-white/10 flex flex-col group transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <img
                  src={villa.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'}
                  alt={villa.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                    📍 {villa.location}
                  </span>
                  {villa.isFeatured && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow">
                      Featured
                    </span>
                  )}
                  {villa.isTrending && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-neutral-950 shadow">
                      🔥 Trending
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900/80 text-white backdrop-blur-md">
                  📷 {villa.images?.length || 0} Photos
                </div>

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white">
                  <span className="text-base font-extrabold font-serif">₹{villa.pricePerNight?.toLocaleString()}</span>
                  <span className="text-[10px] text-neutral-400"> / night</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-1 mb-1">
                    {villa.name}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
                    {villa.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 pb-3 border-b border-neutral-200/60 dark:border-white/10">
                    <span>🛏️ {villa.bedrooms} BHK</span>
                    <span>•</span>
                    <span>🚿 {villa.bathrooms} Baths</span>
                    <span>•</span>
                    <span>👥 Up to {villa.maxGuests} Guests</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(villa)}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-neutral-200/80 hover:bg-neutral-300 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-800 dark:text-white transition-colors"
                    >
                      ✏️ Edit Villa
                    </button>
                    <button
                      onClick={() => handleDelete(villa.id)}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <button
                    onClick={() => handleManageBookings(villa)}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 hover:text-neutral-950 dark:text-emerald-400 dark:hover:text-neutral-950 border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>📅</span>
                    <span>Manage Calendar &amp; Bookings</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {villas.length === 0 && (
          <div className="text-center py-16 glass-card rounded-3xl border border-neutral-200/80 dark:border-white/10">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              No villas listed yet. Create your first luxury listing!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-xs uppercase tracking-wider shadow"
            >
              Add New Villa
            </button>
          </div>
        )}
      </div>

      {/* Booking Calendar Modal */}
      {showBookingModal && selectedVillaForBooking && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-neutral-200/80 dark:border-white/10 shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200/60 dark:border-white/10">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  {selectedVillaForBooking.name}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage live reservations, blocked dates &amp; auto-cleared records
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedVillaForBooking(null);
                  setBlockingData({ checkInDate: '', checkOutDate: '', reason: '' });
                }}
                className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Calendar View */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-3">
                  Interactive Live Calendar
                </h3>
                <BookingCalendar villaId={selectedVillaForBooking.id} />
              </div>

              {/* Manual Block Form */}
              <div className="p-5 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
                  Block Dates Manually (Host Hold / Offline Booking)
                </h3>
                <form onSubmit={handleCreateManualBlock} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={blockingData.checkInDate}
                        onChange={(e) => setBlockingData(prev => ({ ...prev, checkInDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={blockingData.checkOutDate}
                        onChange={(e) => setBlockingData(prev => ({ ...prev, checkOutDate: e.target.value }))}
                        min={blockingData.checkInDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Reason / Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={blockingData.reason}
                      onChange={(e) => setBlockingData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="e.g. Owner direct family stay or maintenance"
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
                  >
                    {saving ? 'Processing...' : 'Block Dates on Calendar'}
                  </button>
                </form>
              </div>

              {/* Existing Bookings List */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-3">
                  Current &amp; Upcoming Bookings ({villaBookings.length})
                </h3>
                {villaBookings.length === 0 ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center py-6 border border-neutral-200/60 dark:border-white/10 rounded-xl">
                    No active bookings for this villa. Past dates are automatically cleaned.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {villaBookings.map(booking => (
                      <div 
                        key={booking.id} 
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/60 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 text-xs"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-neutral-900 dark:text-white">
                              {new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} → {new Date(booking.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              booking.bookingType === 'offline' 
                                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30' 
                                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {booking.bookingType === 'offline' ? '🏢 Direct Host Block' : '🌐 Guest Booking'}
                            </span>
                          </div>
                          {booking.guestInfo && (
                            <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                              {booking.guestInfo.name}
                              {booking.guestInfo.email && booking.guestInfo.email !== 'admin@cascadevillas.in' && ` • ${booking.guestInfo.email}`}
                              {booking.reason && ` • Note: ${booking.reason}`}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 font-bold transition-all text-xs"
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

      {/* Firestore Security Rules Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="glass-card rounded-3xl w-full max-w-xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🔑</span>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Firestore Database Rules Notice
                  </h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Missing or insufficient permissions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-100 dark:bg-white/5 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-600 dark:text-neutral-300">
              <p className="leading-relaxed">
                Your Firebase Firestore security rules currently block client writes to the <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-emerald-400">villas</code> collection.
                Your villa form data and photos have been <strong>safely preserved in your draft</strong> so nothing is lost.
              </p>

              <div className="p-3.5 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[11px] overflow-x-auto border border-neutral-800 leading-relaxed">
                <div className="text-neutral-500">{'# Rules to paste in Firebase Console > Firestore > Rules:'}</div>
                <div className="text-emerald-400">match /villas/{'{'}villaId{'}'} {'{'}</div>
                <div className="pl-4 text-cyan-300">allow read: if true;</div>
                <div className="pl-4 text-cyan-300">{'allow write: if request.auth != null;'}</div>
                <div className="text-emerald-400">{'}'}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://console.firebase.google.com/project/cascadevillas/firestore/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Open Firebase Rules ↗</span>
                </a>
                <button
                  type="button"
                  onClick={handleSaveLocally}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs shadow transition-all text-center"
                >
                  Save Locally (Continue Testing)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVillaManagement;
