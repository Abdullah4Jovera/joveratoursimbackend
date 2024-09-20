// models/hotelModel.js
import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  delStatus: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
