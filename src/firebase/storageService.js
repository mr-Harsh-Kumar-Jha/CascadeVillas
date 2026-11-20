// src/firebase/storageService.js
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './config';

let cachedBucketStatus = null;

/**
 * Checks if the Firebase Storage bucket is provisioned and reachable.
 * Uses a non-blocking fetch to the bucket list endpoint with 2s timeout.
 * Returns false if the bucket is not created in Firebase Console (HTTP 404).
 * @returns {Promise<boolean>}
 */
export const isStorageBucketReady = async () => {
  if (cachedBucketStatus !== null) return cachedBucketStatus;
  try {
    const bucket = storage?.app?.options?.storageBucket || 'cascadevillas.firebasestorage.app';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o`, { 
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeout);

    // If bucket does not exist, Google returns JSON with error 404
    const data = await res.json().catch(() => null);
    if (data?.error?.code === 404 || data?.error?.message === 'Not Found.') {
      cachedBucketStatus = false;
      return false;
    }

    cachedBucketStatus = true;
    return true;
  } catch (err) {
    console.warn('Storage bucket probe error:', err);
    // If probe fails or times out, don't stall user uploads
    cachedBucketStatus = false;
    return false;
  }
};

/**
 * Compress an image file using browser HTML5 canvas to reduce file size (< 250KB)
 * while maintaining crisp resolution for retina villa displays.
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} quality (0 to 1)
 * @returns {Promise<Blob>}
 */
export const compressImage = (file, maxWidth = 1600, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

/**
 * Converts a file directly into a high-efficiency Web JPEG Data URL (< 180KB)
 * Used as automatic resilient fallback if the Firebase Storage bucket is unprovisioned.
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} quality 
 * @returns {Promise<string>}
 */
export const fileToOptimizedDataUrl = (file, maxWidth = 1200, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload an image file.
 * Fast check: If bucket is unprovisioned (404), it instantly uses the
 * canvas optimizer with smooth responsive progress animation so it NEVER stalls at 0%.
 * If bucket is provisioned, it uploads to Firebase Cloud Storage with a 4-second timeout safeguard.
 * 
 * @param {File} file 
 * @param {Function} onProgress - Callback receiving (progressPercent: number)
 * @returns {Promise<{ downloadUrl: string, storagePath: string, isFallback: boolean }>}
 */
export const uploadVillaImage = async (file, onProgress = null) => {
  const updateProgress = (pct) => {
    if (typeof onProgress === 'function') onProgress(pct);
  };

  updateProgress(15);

  // Fast check: is Firebase Storage bucket initialized?
  const bucketReady = await isStorageBucketReady();

  if (!bucketReady) {
    // Instant responsive progress animation
    updateProgress(45);
    await new Promise(r => setTimeout(r, 80));
    updateProgress(80);
    const dataUrl = await fileToOptimizedDataUrl(file);
    updateProgress(100);

    return {
      downloadUrl: dataUrl,
      storagePath: 'firestore_optimized',
      isFallback: true
    };
  }

  // Attempt Firebase Storage Upload with 4-second timeout safeguard
  try {
    const compressedBlob = await compressImage(file);
    updateProgress(30);

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
    const storagePath = `villas/${timestamp}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, compressedBlob, {
      contentType: 'image/jpeg',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    return await new Promise((resolve, reject) => {
      // 4-second timeout safeguard to prevent hanging at 0%
      const timeoutId = setTimeout(() => {
        try { uploadTask.cancel(); } catch { /* ignore cancel error */ }
        console.warn('[StorageService] Firebase Storage upload stalled > 4s. Switching to instant optimized storage.');
        fileToOptimizedDataUrl(file).then(dataUrl => {
          updateProgress(100);
          resolve({
            downloadUrl: dataUrl,
            storagePath: 'firestore_fallback_timeout',
            isFallback: true
          });
        }).catch(reject);
      }, 4000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const rawProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const scaled = Math.round(30 + (rawProgress * 0.65));
            updateProgress(scaled);
          }
        },
        async (error) => {
          clearTimeout(timeoutId);
          console.warn('[StorageService] Firebase Storage upload error:', error.code || error.message);
          
          try {
            updateProgress(85);
            const dataUrl = await fileToOptimizedDataUrl(file);
            updateProgress(100);
            resolve({
              downloadUrl: dataUrl,
              storagePath: 'firestore_fallback_onerror',
              isFallback: true
            });
          } catch (fallbackErr) {
            reject(fallbackErr);
          }
        },
        async () => {
          clearTimeout(timeoutId);
          try {
            updateProgress(98);
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            updateProgress(100);
            resolve({
              downloadUrl,
              storagePath,
              isFallback: false
            });
          } catch (err) {
            console.warn('[StorageService] Error getting download URL, falling back:', err);
            const dataUrl = await fileToOptimizedDataUrl(file);
            updateProgress(100);
            resolve({
              downloadUrl: dataUrl,
              storagePath: 'firestore_fallback_onurlerror',
              isFallback: true
            });
          }
        }
      );
    });
  } catch (error) {
    console.warn('[StorageService] Unexpected upload error, utilizing fallback:', error);
    updateProgress(85);
    const dataUrl = await fileToOptimizedDataUrl(file);
    updateProgress(100);
    return {
      downloadUrl: dataUrl,
      storagePath: 'firestore_fallback_catch',
      isFallback: true
    };
  }
};

/**
 * Checks if a given image URL belongs to our Firebase Storage bucket
 * @param {string} url 
 * @returns {boolean}
 */
export const isFirebaseStorageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('cascadevillas.firebasestorage.app') ||
    url.startsWith('villas/')
  );
};

/**
 * Delete an image from Firebase Storage by URL or storage path
 * @param {string} imageUrlOrPath 
 * @returns {Promise<boolean>} True if deleted or ignored
 */
export const deleteVillaImage = async (imageUrlOrPath) => {
  if (!imageUrlOrPath) return false;

  // If it's a data URL or external URL, no Firebase Storage object exists
  if (!isFirebaseStorageUrl(imageUrlOrPath)) {
    return true;
  }

  try {
    const fileRef = ref(storage, imageUrlOrPath);
    await deleteObject(fileRef);
    console.log('Successfully deleted image from Firebase Storage:', imageUrlOrPath);
    return true;
  } catch (error) {
    // If object was already deleted or not found, ignore silently
    if (error.code === 'storage/object-not-found' || error.code === 'storage/unknown') {
      return true;
    }
    console.warn('Notice deleting image from Firebase Storage:', error.code || error.message);
    return false;
  }
};

/**
 * Delete multiple images from Firebase Storage in parallel
 * @param {string[]} imageUrls 
 * @returns {Promise<void>}
 */
export const deleteMultipleImages = async (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

  const storageUrls = imageUrls.filter(url => isFirebaseStorageUrl(url));
  if (storageUrls.length === 0) return;

  await Promise.allSettled(
    storageUrls.map(url => deleteVillaImage(url))
  );
};
