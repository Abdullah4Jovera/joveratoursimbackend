import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dn1oz4vt9',
    api_key: '376365558848471',
    api_secret: 'USb46ns9p4V7fAWMppTP54xiv00',
});

// Configure multer and Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blogs', // Folder name in Cloudinary
        allowedFormats: ['jpg', 'jpeg', 'png'], // Allowed image formats
    },
});

const uploadToCloudinary = multer({ storage });

export { uploadToCloudinary };
