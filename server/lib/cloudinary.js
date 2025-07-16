import { v2 as cloudinary } from 'cloudinary';

// ✅ Only cloud_name and api_key should be public
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Remove NEXT_PUBLIC_ prefix
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
