// src/firebase/bookingService.js

import { 
  collection, 
  getDocs,
  updateDoc,
  addDoc,
  doc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

const ENQUIRIES_COLLECTION = 'enquiries';

/**
 * Helper function to safely convert various date formats to JavaScript Date
 * Handles: Firestore Timestamps, Date objects, ISO strings, null/undefined
 * @param {any} dateValue - The date value from Firestore
 * @returns {Date|null} JavaScript Date object or null
 */
const safeConvertToDate = (dateValue) => {
  if (!dateValue) return null;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  // If it's a Firestore Timestamp
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  // If it's a string (ISO format or date string) - THIS IS YOUR CASE
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  // If it's a number (Unix timestamp in milliseconds)
  if (typeof dateValue === 'number') {
    return new Date(dateValue);
  }
  
  // If it's an object with seconds (Firestore Timestamp-like)
  if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
    return new Date(dateValue.seconds * 1000);
  }
  
  console.warn('Unknown date format:', dateValue);
  return null;
};

/**
 * Get all confirmed enquiries (bookings) for a specific villa
 * @param {string} villaId 
 * @returns {Array} Array of confirmed booking/enquiry objects
 */
export const getVillaBookings = async (villaId) => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    // FIXED: Removed orderBy to avoid index requirement
    const q = query(
      enquiriesRef,
      where('villaId', '==', villaId),
      where('status', '==', 'confirmed')
    );
    
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkInDate: safeConvertToDate(data.checkInDate),
        checkOutDate: safeConvertToDate(data.checkOutDate),
        createdAt: safeConvertToDate(data.createdAt)
      };
    });
    
    // Sort in memory by checkInDate ascending
    bookings.sort((a, b) => {
      const dateA = a.checkInDate ? a.checkInDate.getTime() : 0;
      const dateB = b.checkInDate ? b.checkInDate.getTime() : 0;
      return dateA - dateB;
    });
    
    console.log(`✅ Loaded ${bookings.length} confirmed bookings for villa ${villaId}`);
    return bookings;
  } catch (error) {
    console.error('Error fetching villa bookings:', error);
    // Return empty array instead of throwing to prevent UI breaks
    return [];
  }
};

/**
 * Get all confirmed bookings (for admin dashboard)
 * @returns {Array} Array of all confirmed enquiries
 */
export const getAllBookings = async () => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    // FIXED: Removed orderBy to avoid index requirement
    const q = query(
      enquiriesRef,
      where('status', '==', 'confirmed')
    );
    
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkInDate: safeConvertToDate(data.checkInDate),
        checkOutDate: safeConvertToDate(data.checkOutDate),
        createdAt: safeConvertToDate(data.createdAt)
      };
    });
    
    // Sort in memory by checkInDate descending
    bookings.sort((a, b) => {
      const dateA = a.checkInDate ? a.checkInDate.getTime() : 0;
      const dateB = b.checkInDate ? b.checkInDate.getTime() : 0;
      return dateB - dateA;
    });
    
    return bookings;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return [];
  }
};

/**
 * Check if dates conflict with existing confirmed bookings
 * @param {string} villaId 
 * @param {string|Date} checkInDate 
 * @param {string|Date} checkOutDate 
 * @param {string} excludeEnquiryId - Enquiry ID to exclude from check
 * @returns {boolean} True if conflict exists
 */
export const checkDateConflict = async (villaId, checkInDate, checkOutDate, excludeEnquiryId = null) => {
  try {
    const bookings = await getVillaBookings(villaId);
    
    const newCheckIn = new Date(checkInDate);
    const newCheckOut = new Date(checkOutDate);
    
    for (const booking of bookings) {
      if (excludeEnquiryId && booking.id === excludeEnquiryId) {
        continue; // Skip this enquiry
      }
      
      const existingCheckIn = new Date(booking.checkInDate);
      const existingCheckOut = new Date(booking.checkOutDate);
      
      // Check for overlap: (StartA < EndB) AND (EndA > StartB)
      if (newCheckIn < existingCheckOut && newCheckOut > existingCheckIn) {
        return true; // Conflict found
      }
    }
    
    return false; // No conflict
  } catch (error) {
    console.error('Error checking date conflict:', error);
    throw error;
  }
};

/**
 * Get conflicting pending enquiries when admin confirms a booking
 * @param {string} villaId 
 * @param {string|Date} checkInDate 
 * @param {string|Date} checkOutDate 
 * @param {string} excludeEnquiryId - The enquiry being confirmed (exclude from conflicts)
 * @returns {Array} Array of conflicting enquiries
 */
export const getConflictingEnquiries = async (villaId, checkInDate, checkOutDate, excludeEnquiryId = null) => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    const q = query(
      enquiriesRef,
      where('villaId', '==', villaId),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(q);
    const newCheckIn = new Date(checkInDate);
    const newCheckOut = new Date(checkOutDate);
    
    const conflictingEnquiries = [];
    
    snapshot.docs.forEach(doc => {
      if (excludeEnquiryId && doc.id === excludeEnquiryId) {
        return; // Skip the enquiry being confirmed
      }
      
      const data = doc.data();
      const enquiryCheckIn = safeConvertToDate(data.checkInDate);
      const enquiryCheckOut = safeConvertToDate(data.checkOutDate);
      
      // Check for overlap
      if (enquiryCheckIn && enquiryCheckOut) {
        if (newCheckIn < enquiryCheckOut && newCheckOut > enquiryCheckIn) {
          conflictingEnquiries.push({
            id: doc.id,
            ...data,
            checkInDate: enquiryCheckIn,
            checkOutDate: enquiryCheckOut,
            createdAt: safeConvertToDate(data.createdAt)
          });
        }
      }
    });
    
    return conflictingEnquiries;
  } catch (error) {
    console.error('Error fetching conflicting enquiries:', error);
    throw error;
  }
};

/**
 * Confirm an enquiry (marks as booked)
 * Also notifies conflicting pending enquiries
 * @param {string} enquiryId - Enquiry to confirm
 * @returns {Promise}
 */
export const confirmEnquiry = async (enquiryId) => {
  try {
    const enquiryRef = doc(db, ENQUIRIES_COLLECTION, enquiryId);
    await updateDoc(enquiryRef, {
      status: 'confirmed',
      confirmedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error confirming enquiry:', error);
    throw error;
  }
};

/**
 * Notify conflicting enquiries (update their status to date_unavailable)
 * @param {Array} enquiryIds - Array of enquiry IDs to notify
 * @returns {Promise} 
 */
export const notifyConflictingEnquiries = async (enquiryIds) => {
  try {
    const updatePromises = enquiryIds.map(async (enquiryId) => {
      const enquiryRef = doc(db, ENQUIRIES_COLLECTION, enquiryId);
      await updateDoc(enquiryRef, {
        status: 'date_unavailable',
        notifiedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error notifying conflicting enquiries:', error);
    throw error;
  }
};

/**
 * Cancel an enquiry
 * @param {string} enquiryId 
 * @returns {Promise}
 */
export const cancelEnquiry = async (enquiryId) => {
  try {
    const enquiryRef = doc(db, ENQUIRIES_COLLECTION, enquiryId);
    await updateDoc(enquiryRef, {
      status: 'cancelled',
      cancelledAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error cancelling enquiry:', error);
    throw error;
  }
};

/**
 * Get blocked dates for a villa (for calendar display)
 * Returns all confirmed enquiries as blocked dates
 * @param {string} villaId 
 * @returns {Array} Array of {checkInDate, checkOutDate} objects
 */
export const getBlockedDates = async (villaId) => {
  try {
    const bookings = await getVillaBookings(villaId);
    return bookings.map(booking => ({
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      guestName: booking.userName || booking.name || 'Reserved',
      bookingType: booking.bookingType || 'online', // online or offline
      enquiryId: booking.id
    }));
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    // Return empty array instead of throwing to prevent UI breaks
    return [];
  }
};

/**
 * Check if a specific date is available
 * @param {string} villaId 
 * @param {Date} date 
 * @returns {boolean} True if available
 */
export const isDateAvailable = async (villaId, date) => {
  try {
    const bookings = await getVillaBookings(villaId);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    for (const booking of bookings) {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      
      if (checkDate >= checkIn && checkDate < checkOut) {
        return false; // Date is blocked
      }
    }
    
    return true; // Date is available
  } catch (error) {
    console.error('Error checking date availability:', error);
    return false;
  }
};

/**
 * Get date range availability (for multi-day bookings)
 * @param {string} villaId 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Object} {available: boolean, conflictingDates: Array}
 */
export const checkDateRangeAvailability = async (villaId, startDate, endDate) => {
  try {
    const hasConflict = await checkDateConflict(villaId, startDate, endDate);
    
    if (!hasConflict) {
      return {
        available: true,
        conflictingDates: []
      };
    }
    
    // Find which specific dates are conflicting
    const bookings = await getVillaBookings(villaId);
    const conflictingDates = [];
    
    const newCheckIn = new Date(startDate);
    const newCheckOut = new Date(endDate);
    
    bookings.forEach(booking => {
      const existingCheckIn = new Date(booking.checkInDate);
      const existingCheckOut = new Date(booking.checkOutDate);
      
      if (newCheckIn < existingCheckOut && newCheckOut > existingCheckIn) {
        conflictingDates.push({
          checkInDate: existingCheckIn,
          checkOutDate: existingCheckOut
        });
      }
    });
    
    return {
      available: false,
      conflictingDates
    };
  } catch (error) {
    console.error('Error checking date range availability:', error);
    throw error;
  }
};

/**
 * Create manual booking block (for offline bookings/maintenance)
 * Creates an enquiry with status 'confirmed' and bookingType 'offline'
 * @param {Object} blockData - { villaId, villaName, checkInDate, checkOutDate, reason }
 * @returns {string} Enquiry ID
 */
export const createManualBlock = async (blockData) => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    
    // Check for conflicts before creating
    const hasConflict = await checkDateConflict(
      blockData.villaId,
      blockData.checkInDate,
      blockData.checkOutDate
    );
    
    if (hasConflict) {
      throw new Error('These dates conflict with an existing booking');
    }
    
    const docRef = await addDoc(enquiriesRef, {
      villaId: blockData.villaId,
      villaName: blockData.villaName,
      checkInDate: Timestamp.fromDate(new Date(blockData.checkInDate)),
      checkOutDate: Timestamp.fromDate(new Date(blockData.checkOutDate)),
      userName: blockData.reason || 'Manually Blocked',
      name: blockData.reason || 'Manually Blocked',
      email: 'admin@cascadevillas.in',
      phone: 'N/A',
      guests: 0,
      message: blockData.reason || 'Manually blocked by admin',
      status: 'confirmed',
      bookingType: 'offline', // Mark as offline booking
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating manual block:', error);
    throw error;
  }
};

/**
 * Remove a booking (for admin)
 * Changes status from 'confirmed' to 'cancelled'
 * @param {string} enquiryId 
 * @returns {Promise}
 */
export const deleteBooking = async (enquiryId) => {
  try {
    // Just cancel it instead of deleting
    await cancelEnquiry(enquiryId);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// Export all functions
export default {
  getVillaBookings,
  getAllBookings,
  checkDateConflict,
  getConflictingEnquiries,
  confirmEnquiry,
  notifyConflictingEnquiries,
  cancelEnquiry,
  getBlockedDates,
  isDateAvailable,
  checkDateRangeAvailability,
  createManualBlock,
  deleteBooking
};