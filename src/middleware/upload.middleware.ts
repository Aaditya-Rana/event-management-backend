import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'events-images',
    resource_type: 'image',
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  }),
});

export const upload = multer({ storage });
