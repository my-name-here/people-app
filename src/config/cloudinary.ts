import { Cloudinary } from '@cloudinary/url-gen';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName || !uploadPreset) {
  throw new Error('Missing required Cloudinary environment variables');
}

// Initialize Cloudinary with your cloud name
export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
});

// Upload preset for unsigned uploads
export const UPLOAD_PRESET = uploadPreset;

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}; 