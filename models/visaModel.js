// models/visaModel.js
import mongoose from 'mongoose';

const visaSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String, // Duration can be stored as a string (e.g., "6 months", "1 year")
    required: true,
    trim: true
  },
  delStatus: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

const Visa = mongoose.model('Visa', visaSchema);

export default Visa;
