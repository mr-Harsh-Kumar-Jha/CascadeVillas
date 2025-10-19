// src/firebase/villaService.js
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './config';

const VILLAS_COLLECTION = 'villas';

// Get all villas
export const getAllVillas = async () => {
  try {
    const villasRef = collection(db, VILLAS_COLLECTION);
    const snapshot = await getDocs(villasRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching villas:', error);
    throw error;
  }
};

// Get villa by ID
export const getVillaById = async (villaId) => {
  try {
    const villaRef = doc(db, VILLAS_COLLECTION, villaId);
    const snapshot = await getDoc(villaRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      throw new Error('Villa not found');
    }
  } catch (error) {
    console.error('Error fetching villa:', error);
    throw error;
  }
};

// Get featured villas (for hot deals)
export const getFeaturedVillas = async () => {
  try {
    const villasRef = collection(db, VILLAS_COLLECTION);
    const q = query(
      villasRef, 
      where('isFeatured', '==', true),
      limit(6)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching featured villas:', error);
    throw error;
  }
};

// Get trending villas
export const getTrendingVillas = async () => {
  try {
    const villasRef = collection(db, VILLAS_COLLECTION);
    const q = query(
      villasRef, 
      where('isTrending', '==', true),
      limit(6)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching trending villas:', error);
    throw error;
  }
};

// Filter villas
export const filterVillas = async (filters) => {
  try {
    let villasRef = collection(db, VILLAS_COLLECTION);
    let q = villasRef;

    // Apply filters
    if (filters.location && filters.location !== 'all') {
      q = query(q, where('location', '==', filters.location));
    }

    if (filters.bedrooms && filters.bedrooms !== 'all') {
      q = query(q, where('bedrooms', '==', parseInt(filters.bedrooms)));
    }

    const snapshot = await getDocs(q);
    let villas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side price filtering (Firestore doesn't support range queries well with other filters)
    if (filters.minPrice || filters.maxPrice) {
      villas = villas.filter(villa => {
        const price = villa.pricePerNight;
        if (filters.minPrice && price < filters.minPrice) return false;
        if (filters.maxPrice && price > filters.maxPrice) return false;
        return true;
      });
    }

    return villas;
  } catch (error) {
    console.error('Error filtering villas:', error);
    throw error;
  }
};

// Add new villa (for admin)
export const addVilla = async (villaData) => {
  try {
    const villasRef = collection(db, VILLAS_COLLECTION);
    const docRef = await addDoc(villasRef, {
      ...villaData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding villa:', error);
    throw error;
  }
};

// Update villa (for admin)
export const updateVilla = async (villaId, villaData) => {
  try {
    const villaRef = doc(db, VILLAS_COLLECTION, villaId);
    await updateDoc(villaRef, {
      ...villaData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating villa:', error);
    throw error;
  }
};

// Delete villa (for admin)
export const deleteVilla = async (villaId) => {
  try {
    const villaRef = doc(db, VILLAS_COLLECTION, villaId);
    await deleteDoc(villaRef);
  } catch (error) {
    console.error('Error deleting villa:', error);
    throw error;
  }
};