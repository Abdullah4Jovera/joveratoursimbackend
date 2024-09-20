// models/packageModel.js
import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    // required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    // required: true
  },
  visa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visa',
    // required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  foregroundimage: {
    type: String,
    required: true
  },
  type: {
    type: String, 
    required: true
  },
  duration: {
    type: String, // Duration can be stored as a string (e.g., "6 months", "1 year")
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    // required: true
  },
  delStatus: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

const Package = mongoose.model('Package', packageSchema);

export default Package;
