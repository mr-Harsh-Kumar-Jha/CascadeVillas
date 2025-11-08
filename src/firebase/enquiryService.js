// src/firebase/enquiryService.js
import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

const ENQUIRIES_COLLECTION = 'enquiries';

/**
 * Helper to convert Date to Firestore Timestamp
 * @param {Date|string|Timestamp} dateValue 
 * @returns {Timestamp}
 */
const ensureTimestamp = (dateValue) => {
  if (!dateValue) return Timestamp.now();
  
  // Already a Timestamp
  if (dateValue instanceof Timestamp) {
    return dateValue;
  }
  
  // If it's a Date object
  if (dateValue instanceof Date) {
    return Timestamp.fromDate(dateValue);
  }
  
  // If it's a string, parse it first
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? Timestamp.now() : Timestamp.fromDate(date);
  }
  
  // Fallback to current time
  return Timestamp.now();
};

/**
 * Helper to safely convert dates from Firestore
 * @param {any} dateValue 
 * @returns {Date|null}
 */
const safeConvertToDate = (dateValue) => {
  if (!dateValue) return null;
  
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  if (typeof dateValue === 'number') {
    return new Date(dateValue);
  }
  
  if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
    return new Date(dateValue.seconds * 1000);
  }
  
  return null;
};

// Submit new enquiry
export const submitEnquiry = async (enquiryData) => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    
    // Ensure dates are proper Timestamps
    const dataToSubmit = {
      ...enquiryData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Convert checkInDate and checkOutDate to Timestamps if they exist
    if (enquiryData.checkInDate) {
      dataToSubmit.checkInDate = ensureTimestamp(enquiryData.checkInDate);
    }
    
    if (enquiryData.checkOutDate) {
      dataToSubmit.checkOutDate = ensureTimestamp(enquiryData.checkOutDate);
    }
    
    const docRef = await addDoc(enquiriesRef, dataToSubmit);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    throw error;
  }
};

// Get enquiries by email
export const getEnquiriesByEmail = async (email) => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    const q = query(
      enquiriesRef,
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);
    const enquiries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkInDate: safeConvertToDate(data.checkInDate),
        checkOutDate: safeConvertToDate(data.checkOutDate),
        createdAt: safeConvertToDate(data.createdAt)
      };
    });
    
    // Sort by createdAt descending (most recent first)
    enquiries.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
    
    return enquiries;
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }
};

// Get enquiries by phone
export const getEnquiriesByPhone = async (phone) => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    const q = query(
      enquiriesRef,
      where('phone', '==', phone)
    );
    const snapshot = await getDocs(q);
    const enquiries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkInDate: safeConvertToDate(data.checkInDate),
        checkOutDate: safeConvertToDate(data.checkOutDate),
        createdAt: safeConvertToDate(data.createdAt)
      };
    });
    
    // Sort by createdAt descending (most recent first)
    enquiries.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
    
    return enquiries;
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }
};

// Get enquiries by email OR phone
export const getEnquiriesByEmailOrPhone = async (email, phone) => {
  try {
    const enquiriesByEmail = await getEnquiriesByEmail(email);
    const enquiriesByPhone = await getEnquiriesByPhone(phone);
    
    // Combine and remove duplicates
    const allEnquiries = [...enquiriesByEmail, ...enquiriesByPhone];
    const uniqueEnquiries = allEnquiries.filter((enquiry, index, self) =>
      index === self.findIndex((e) => e.id === enquiry.id)
    );
    
    // Sort by date
    return uniqueEnquiries.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }
};

// Get all enquiries (for admin)
export const getAllEnquiries = async () => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    const snapshot = await getDocs(enquiriesRef);
    const enquiries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkInDate: safeConvertToDate(data.checkInDate),
        checkOutDate: safeConvertToDate(data.checkOutDate),
        createdAt: safeConvertToDate(data.createdAt)
      };
    });
    
    // Sort by createdAt descending (most recent first)
    enquiries.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
    
    return enquiries;
  } catch (error) {
    console.error('Error fetching all enquiries:', error);
    throw error;
  }
};