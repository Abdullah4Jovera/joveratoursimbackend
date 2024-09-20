// routes/packageRouter.js
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Package from '../models/packageModel.js'; // Adjust the path as needed
import { hasRole, isAuth } from '../utils.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dn1oz4vt9',
    api_key: '376365558848471',
    api_secret: 'USb46ns9p4V7fAWMppTP54xiv00'
});

// Configure multer and Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'packages',
        allowedFormats: ['jpg', 'jpeg', 'png'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});
const upload = multer({ storage });

// Create a new package
const router = express.Router();

router.post('/create', isAuth, hasRole(['admin', 'superadmin']), upload.fields([{ name: 'image' }, { name: 'foregroundimage' }]), async (req, res) => {
    try {
        const { flight, hotel, visa, amount, duration, type, title, description, country } = req.body;

        // Get image and foregroundimage paths
        const image = req.files['image'] ? req.files['image'][0].path : '';
        const foregroundimage = req.files['foregroundimage'] ? req.files['foregroundimage'][0].path : '';

        const newPackage = new Package({
            title,
            flight,
            hotel,
            visa,
            image,
            foregroundimage,
            amount,
            duration,
            type,
            description,
            country
        });

        await newPackage.save();
        res.status(201).json({ message: 'Package created successfully', package: newPackage });
    } catch (err) {
        console.error('Error creating package:', err);  // Log the actual error
        res.status(500).json({ message: 'Failed to create package', error: err.message });
    }
});

// Get all packages
router.get('/get-all-packages', async (req, res) => {
    try {
        const packages = await Package.find({delStatus:false})
            .populate('flight')
            .populate('hotel')
            .populate('visa');
        res.status(200).json(packages);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve packages', error: err.message });
    }
});

// Get a package by ID
router.get('/single-package/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id)
            .populate('flight') 
            .populate('hotel')
            .populate('visa');
        if (!pkg) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json(pkg);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve package', error: err.message });
    }
});


// Update a package by ID
router.put('/update-package/:id', isAuth, hasRole(['admin', 'superadmin']), upload.single('image'), async (req, res) => {
    try {
        const { flight, hotel, visa, amount, duration ,title} = req.body;

        // Find the package first
        const packageToUpdate = await Package.findById(req.params.id);
        if (!packageToUpdate) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // If a new image is uploaded, use the new image, otherwise keep the old image
        const image = req.file ? req.file.path : packageToUpdate.image;

        // Update the package with new fields
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            { flight, hotel, visa, title,image, amount, duration },
            { new: true, runValidators: true }
        ).populate('flight')
         .populate('hotel')
         .populate('visa');

        res.status(200).json({ message: 'Package updated successfully', package: updatedPackage });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update package', error: err.message });
    }
});

// Delete a package by ID
router.put('/delete-package/:id', isAuth, hasRole(['admin', 'superadmin']), async (req, res) => {
    try {
        // Find the package and update the delStatus to true
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id, 
            { delStatus: true }, // Update delStatus to true
            { new: true } // Return the updated document
        );
        
        // Check if the package was found
        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Return success response
        res.status(200).json({ message: 'Package marked as deleted successfully', updatedPackage });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: 'Failed to update package', error: err.message });
    }
});


export default router;
