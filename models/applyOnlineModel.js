// models/ApplyOnline.js
import mongoose from 'mongoose';

const applyOnlineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
       
    },
    message: {
        type: String,
        required: true,
    },
    visa: {
        type: String,
    },
    flight: {
        type: String,
    },
    phone: {
        type: String,
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

const ApplyOnline = mongoose.model('ApplyOnline', applyOnlineSchema);

export default ApplyOnline;
