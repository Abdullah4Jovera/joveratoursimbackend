// routes/hotelRouter.js
import express from 'express';
import Hotel from '../models/hotelModel.js'; // Adjust the path as needed

const router = express.Router();

// Create a new hotel
router.post('/create', async (req, res) => {
  try {
    const { name, stars, delStatus } = req.body;
    const hotel = new Hotel({ name, stars, delStatus });
    await hotel.save();
    res.status(201).json({ message: 'Hotel created successfully', hotel });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create hotel', error: err.message });
  }
});

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve hotels', error: err.message });
  }
});

// Get a hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve hotel', error: err.message });
  }
});

// Update a hotel by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, star, delStatus } = req.body;
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { name, star, delStatus },
      { new: true, runValidators: true }
    );
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(200).json({ message: 'Hotel updated successfully', hotel });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update hotel', error: err.message });
  }
});

// Delete a hotel by ID
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete hotel', error: err.message });
  }
});

export default router;
