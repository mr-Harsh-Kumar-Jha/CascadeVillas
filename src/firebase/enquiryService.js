// src/firebase/enquiryService.js
import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

const ENQUIRIES_COLLECTION = 'enquiries';

// Submit new enquiry
export const submitEnquiry = async (enquiryData) => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    const docRef = await addDoc(enquiriesRef, {
      ...enquiryData,
      status: 'pending',
      createdAt: new Date()
    });
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
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
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
      where('phone', '==', phone),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
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
    return uniqueEnquiries.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }
};

// Get all enquiries (for admin)
export const getAllEnquiries = async () => {
  try {
    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    const q = query(enquiriesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching all enquiries:', error);
    throw error;
  }
};