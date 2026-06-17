/**
 * Image Hosting Utility
 * Uploads base64 images to ImgBB (free) or falls back to Cloudinary/direct URL.
 * This ensures product images are accessible on ALL devices, not just localhost.
 */

// ImgBB free API - 32MB limit, permanent hosting, no account required for basic use
// Get your free API key at: https://api.imgbb.com/
// Default key is a public demo key with rate limits - admin should set their own
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

/**
 * Upload a base64 image to ImgBB and return the permanent public URL.
 * Falls back to the original base64 if upload fails.
 */
export async function uploadImageToHost(
  base64OrUrl: string,
  imgbbApiKey: string
): Promise<string> {
  // If it's already a URL (not base64), return as-is
  if (!base64OrUrl || !base64OrUrl.startsWith('data:')) {
    return base64OrUrl;
  }

  if (!imgbbApiKey || imgbbApiKey.trim() === '') {
    // No API key configured - return base64 as fallback
    console.warn('ImgBB API key not configured. Image will only show on this device.');
    return base64OrUrl;
  }

  try {
    // Extract pure base64 from data URL (remove "data:image/jpeg;base64," prefix)
    const base64Data = base64OrUrl.split(',')[1];
    if (!base64Data) return base64OrUrl;

    const formData = new FormData();
    formData.append('image', base64Data);
    formData.append('key', imgbbApiKey.trim());

    const response = await fetch(IMGBB_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ImgBB upload failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data?.url) {
      // Return the direct display URL (not the page URL)
      return result.data.display_url || result.data.url;
    } else {
      throw new Error(result.error?.message || 'ImgBB returned no URL');
    }
  } catch (err) {
    console.error('Image hosting upload failed:', err);
    // Return original base64 as fallback - at least local device will show it
    return base64OrUrl;
  }
}

/**
 * Upload multiple images. Returns array of URLs (hosted or base64 fallback).
 */
export async function uploadMultipleImages(
  base64Array: string[],
  imgbbApiKey: string
): Promise<string[]> {
  const results: string[] = [];
  for (const img of base64Array) {
    const url = await uploadImageToHost(img, imgbbApiKey);
    results.push(url);
  }
  return results;
}

/**
 * Check if an image is base64 (not a hosted URL).
 * Base64 images only work on the device where they were uploaded.
 */
export function isBase64Image(img: string): boolean {
  return typeof img === 'string' && img.startsWith('data:');
}

/**
 * Check if any product has un-hosted base64 images.
 */
export function hasUnhostedImages(products: { image?: string; images?: string[] }[]): boolean {
  return products.some(p =>
    isBase64Image(p.image || '') ||
    (p.images || []).some(img => isBase64Image(img))
  );
}
