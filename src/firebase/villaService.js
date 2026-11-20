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
  limit
} from 'firebase/firestore';
import { db } from './config';
import { deleteMultipleImages } from './storageService';

const VILLAS_COLLECTION = 'villas';

// Get all villas
export const getAllVillas = async () => {
  try {
    const villasRef = collection(db, VILLAS_COLLECTION);
    const snapshot = await getDocs(villasRef);
    const remoteVillas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Merge any locally saved villas (from local fallback inventory)
    try {
      const localVillas = JSON.parse(localStorage.getItem('cascade_local_villas') || '[]');
      if (Array.isArray(localVillas) && localVillas.length > 0) {
        const remoteIds = new Set(remoteVillas.map(v => v.id));
        const uniqueLocal = localVillas.filter(v => !remoteIds.has(v.id));
        return [...uniqueLocal, ...remoteVillas];
      }
    } catch { /* ignore local storage errors */ }

    return remoteVillas;
  } catch (error) {
    console.error('Error fetching villas:', error);
    try {
      const localVillas = JSON.parse(localStorage.getItem('cascade_local_villas') || '[]');
      if (Array.isArray(localVillas) && localVillas.length > 0) {
        return localVillas;
      }
    } catch { /* ignore */ }
    throw error;
  }
};

// Get villa by ID
export const getVillaById = async (villaId) => {
  try {
    // Check local fallback first if it is a local ID
    if (typeof villaId === 'string' && villaId.startsWith('local_')) {
      try {
        const localVillas = JSON.parse(localStorage.getItem('cascade_local_villas') || '[]');
        const match = localVillas.find(v => v.id === villaId);
        if (match) return match;
      } catch { /* ignore */ }
    }

    const villaRef = doc(db, VILLAS_COLLECTION, villaId);
    const snapshot = await getDoc(villaRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      // Check local storage before throwing
      try {
        const localVillas = JSON.parse(localStorage.getItem('cascade_local_villas') || '[]');
        const match = localVillas.find(v => v.id === villaId);
        if (match) return match;
      } catch { /* ignore */ }
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
    const allVillas = await getAllVillas();

    return allVillas.filter(villa => {
      // 1. Destination / Location filter
      if (filters.location && filters.location !== 'all') {
        const villaLoc = (villa.location || '').trim().toLowerCase();
        const reqLoc = filters.location.trim().toLowerCase();
        if (villaLoc !== reqLoc) return false;
      }

      // 2. Bedrooms filter
      if (filters.bedrooms && filters.bedrooms !== 'all') {
        const reqBeds = parseInt(filters.bedrooms, 10);
        const villaBeds = parseInt(villa.bedrooms, 10) || 0;
        if (reqBeds === 5) {
          // 5+ Bedrooms matches 5, 6, 7+ BHK estates
          if (villaBeds < 5) return false;
        } else {
          if (villaBeds !== reqBeds) return false;
        }
      }

      // 3. Price filter
      const price = Number(villa.pricePerNight) || 0;
      if (filters.minPrice !== undefined && price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;

      return true;
    });
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

// Delete villa (for admin) - Also deletes all associated photos from Firebase Storage
export const deleteVilla = async (villaId) => {
  try {
    // 1. Fetch villa data first to locate linked photos
    try {
      const villa = await getVillaById(villaId);
      if (villa && Array.isArray(villa.images) && villa.images.length > 0) {
        // Delete all linked photos stored on server/Firebase Storage
        await deleteMultipleImages(villa.images);
      }
    } catch (fetchErr) {
      console.warn('Could not retrieve villa details for image cleanup prior to delete:', fetchErr);
    }

    // 2. Delete Firestore villa document
    const villaRef = doc(db, VILLAS_COLLECTION, villaId);
    await deleteDoc(villaRef);
    return true;
  } catch (error) {
    console.error('Error deleting villa:', error);
    throw error;
  }
};
