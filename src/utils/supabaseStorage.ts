import { getSupabase } from '../lib/supabase';

// Convert a base64 data URL to a Blob
export function base64ToBlob(base64Data: string): Blob {
  const parts = base64Data.split(';base64,');
  const contentType = parts[0].split(':')[1] || 'image/jpeg';
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

/**
 * Upload an image (File or base64) directly to the Supabase Storage bucket 'product-images'
 * Returns the public URL of the uploaded image.
 */
export async function uploadImageToSupabase(
  imageInput: File | string,
  fileNamePrefix: string = 'product'
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  try {
    let fileBlob: Blob;
    let extension = 'jpg';

    if (typeof imageInput === 'string') {
      if (!imageInput.startsWith('data:')) {
        // Already a remote URL
        return imageInput;
      }
      fileBlob = base64ToBlob(imageInput);
      if (imageInput.startsWith('data:image/png')) extension = 'png';
      else if (imageInput.startsWith('data:image/webp')) extension = 'webp';
    } else {
      fileBlob = imageInput;
      const ext = imageInput.name.split('.').pop()?.toLowerCase();
      if (ext) extension = ext;
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const cleanPrefix = fileNamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filePath = `${cleanPrefix}_${uniqueId}.${extension}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, fileBlob, {
        contentType: fileBlob.type || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload image to Supabase:', err);
    return null;
  }
}

/**
 * Upload multiple images (base64 or Files) concurrently to Supabase Storage
 */
export async function uploadMultipleImagesToSupabase(
  images: (File | string)[],
  fileNamePrefix: string = 'product'
): Promise<string[]> {
  const uploadPromises = images.map((img, index) =>
    uploadImageToSupabase(img, `${fileNamePrefix}_${index + 1}`)
  );
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => Boolean(url));
}
