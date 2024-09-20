import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'superadmin', 'user'],
      default: 'user',
      required: true,
    },
    picture: { type: String, required: true },
    contact: { type: String },
    address: { type: String },
    nationality: { type: String },
    otp: { type: String },
    otpExpiration: { type: Date },
    resettoken: { type: String },
    resetTokenExpiration: { type: Date }, // New field for token expiration
    DelStatus: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
