import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  trip: {
    type: String,
    required: true,
  },
  delStatus: {
    type: Boolean,
    default: false, 
  },
}, {
  timestamps: true, 
});

// Create and export the model
const Flight = mongoose.model('Flight', flightSchema);
export default Flight;
