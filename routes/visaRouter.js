// routes/visaRouter.js
import express from 'express';
import Visa from '../models/visaModel.js'; // Adjust the path as needed

const router = express.Router();

// Create a new visa
router.post('/create', async (req, res) => {
  try {
    const { type, country, duration, delStatus } = req.body;
    const visa = new Visa({ type, country, duration, delStatus });
    await visa.save();
    res.status(201).json({ message: 'Visa created successfully', visa });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create visa', error: err.message });
  }
});

// Get all visas
router.get('/', async (req, res) => {
  try {
    const visas = await Visa.find();
    res.status(200).json(visas);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve visas', error: err.message });
  }
});

// Get a visa by ID
router.get('/:id', async (req, res) => {
  try {
    const visa = await Visa.findById(req.params.id);
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }
    res.status(200).json(visa);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve visa', error: err.message });
  }
});

// Update a visa by ID
router.put('/:id', async (req, res) => {
  try {
    const { type, country, duration, delStatus } = req.body;
    const visa = await Visa.findByIdAndUpdate(
      req.params.id,
      { type, country, duration, delStatus },
      { new: true, runValidators: true }
    );
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }
    res.status(200).json({ message: 'Visa updated successfully', visa });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update visa', error: err.message });
  }
});

// Delete a visa by ID
router.delete('/:id', async (req, res) => {
  try {
    const visa = await Visa.findByIdAndDelete(req.params.id);
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }
    res.status(200).json({ message: 'Visa deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete visa', error: err.message });
  }
});

export default router;
