import express from 'express';
import Flight from '../models/flightModel.js'; // Adjust the path as needed

const router = express.Router();

// Create a new flight
router.post('/create', async (req, res) => {
  try {
    const { from, to, trip, delStatus } = req.body;
    const flight = new Flight({ from, to, trip, delStatus });
    await flight.save();
    res.status(201).json({ message: 'Flight created successfully', flight });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create flight', error: err.message });
  }
});

// Get all flights
router.get('/get-all-flights', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve flights', error: err.message });
  }
});

// Get a flight by ID
router.get('/single-flight/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.status(200).json(flight);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve flight', error: err.message });
  }
});

// Update a flight by ID
router.put('/update-flight/:id', async (req, res) => {
  try {
    const { from, to, trip, delStatus } = req.body;
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      { from, to, trip, delStatus },
      { new: true, runValidators: true }
    );
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.status(200).json({ message: 'Flight updated successfully', flight });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update flight', error: err.message });
  }
});

// Delete a flight by ID
router.delete('delete-flight/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.status(200).json({ message: 'Flight deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete flight', error: err.message });
  }
});

export default router;
