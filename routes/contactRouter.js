import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';
import { hasRole, isAuth } from '../utils.js';

const contactRouter = express.Router();

// POST route to create a new contact message
contactRouter.post(
  '/post-massage',
  expressAsyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Input validation
    if (!name || !email || !phone || !message) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    // Create a new contact message
    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    try {
      const savedContact = await contact.save();
      res.status(201).send({
        message: 'Message received successfully',
        contact: savedContact,
      });
    } catch (error) {
      res.status(500).send({ message: 'Error saving contact message' });
    }
  })
);

// GET route to retrieve all contact messages (for admin)
contactRouter.get(
  '/get-all-massages', isAuth, hasRole(['admin', 'superadmin']),
  expressAsyncHandler(async (req, res) => {
    try {
      const contacts = await Contact.find({});
      res.send(contacts);
    } catch (error) {
      res.status(500).send({ message: 'Error retrieving contact messages' });
    }
  })
);

export default contactRouter;
