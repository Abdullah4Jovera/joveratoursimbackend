// routes/applyOnlineRouter.js
import express from 'express';
import ApplyOnline from '../models/applyOnlineModel.js';

const router = express.Router();

// Create a new application
router.post('/apply', async (req, res) => {
    try {
        const { name, email, message, visa, phone, flight } = req.body;

        // Create a new ApplyOnline document
        const application = new ApplyOnline({
            name,
            email,
            message,
            visa,
            flight,
            phone
        });

        await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to submit application', error: err.message });
    }
});

// Get all applications (optional)
router.get('/applications', async (req, res) => {
    try {
        const applications = await ApplyOnline.find();
        res.status(200).json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
    }
});

// Get an application by ID (optional)
router.get('/applications/:id', async (req, res) => {
    try {
        const application = await ApplyOnline.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json(application);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch application', error: err.message });
    }
});

// Delete an application (optional)
router.delete('/applications/:id', async (req, res) => {
    try {
        const application = await ApplyOnline.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete application', error: err.message });
    }
});


export default router;
