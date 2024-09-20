import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js'; // .js extension is required
import flightRouter from './routes/flightRouter.js'; // .js extension is required
import hotelRouter from './routes/hotelRouter.js'; // .js extension is required
import visaRouter from './routes/visaRouter.js'; // .js extension is required
import packageRouter from './routes/packageRouter.js'; // .js extension is required
import cors from 'cors';
import { hasRole, isAuth } from './utils.js';
import contactRouter from './routes/contactRouter.js';
import blogRouter from './routes/blogRouter.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('API is Working....');
});

// Routes
app.use('/api/users', userRouter);
app.use('/api/flights', isAuth, hasRole(['admin', 'superadmin']), flightRouter)
app.use('/api/hotels', isAuth, hasRole(['admin', 'superadmin']), hotelRouter)
app.use('/api/visa', isAuth, hasRole(['admin', 'superadmin']),visaRouter)
app.use('/api/package', packageRouter)
app.use('/api/contact', contactRouter)
app.use('/api/blogs', blogRouter)

// Define the port and start the server
const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
