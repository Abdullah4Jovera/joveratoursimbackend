// routes/packageRouter.js
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Package from '../models/packageModel.js'; // Adjust the path as needed

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

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { flight, hotel, visa, amount,duration } = req.body;
        const image = req.file ? req.file.path : '';

        const newPackage = new Package({
            flight,
            hotel,
            visa,
            image,
            amount,
            duration
        });

        await newPackage.save();
        res.status(201).json({ message: 'Package created successfully', package: newPackage });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create package', error: err.message });
    }
});

// Get all packages
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find()
            .populate('flight')
            .populate('hotel')
            .populate('visa');
        res.status(200).json(packages);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve packages', error: err.message });
    }
});

// Get a package by ID
router.get('/:id', async (req, res) => {
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
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { flight, hotel, visa, amount } = req.body;
        const image = req.file ? req.file.path : '';

        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            { flight, hotel, visa, image, amount },
            { new: true, runValidators: true }
        ).populate('flight')
         .populate('hotel')
         .populate('visa');

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.status(200).json({ message: 'Package updated successfully', package: updatedPackage });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update package', error: err.message });
    }
});

// Delete a package by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete package', error: err.message });
    }
});

export default router;
