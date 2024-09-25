import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { generateToken, hasRole, isAuth } from '../utils.js'; // Import generateToken
import crypto from 'crypto';
import nodemailer from 'nodemailer';

cloudinary.config({
  cloud_name: 'dn1oz4vt9',
  api_key: '376365558848471',
  api_secret: 'USb46ns9p4V7fAWMppTP54xiv00'
});

const userRouter = express.Router();

// Use CloudinaryStorage to configure multer for image upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

const upload = multer({ storage });

// Middleware for Cloudinary image upload
const uploadToCloudinary = upload.single('picture');

userRouter.post(
  '/register-user',
  isAuth, // Check if the user is authenticated
  hasRole(['superadmin']),
  uploadToCloudinary,
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, role, contact, address, nationality } = req.body;

    // Use the uploaded picture if available, otherwise use the default picture URL
    const picture = req.file ? req.file.path : 'https://cdn-icons-png.freepik.com/512/18/18148.png';
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
      // Check if a user with the given email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: 'User with the provided Email already exists' });
      }

      // Create a new user if email is unique
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        picture,
        role,
        contact,
        address,
        nationality,
      });

      const user = await newUser.save();

      // Generate a token for the user
      const token = generateToken(user);

      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        contact: user.contact,
        address: user.address,
        nationality: user.nationality,
        token, // Send the token in the response
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send({ message: 'Error registering user' });
    }
  })
);

userRouter.post(
  '/register',
  uploadToCloudinary,
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, contact, address, nationality } = req.body;

    // Use the uploaded picture if available, otherwise use the default picture URL
    const picture = req.file ? req.file.path : 'https://cdn-icons-png.freepik.com/512/18/18148.png';
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
      // Check if a user with the given email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: 'User with the provided Email already exists' });
      }

      // Create a new user if email is unique
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        picture,
        contact,
        address,
        nationality,
      });

      const user = await newUser.save();

      // Generate a token for the user
      const token = generateToken(user);

      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        contact: user.contact,
        address: user.address,
        nationality: user.nationality,
        token, // Send the token in the response
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send({ message: 'Error registering user' });
    }
  })
);



userRouter.put(
    '/profile',
    isAuth,
    uploadToCloudinary,
    expressAsyncHandler(async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            const updateData = {
                name: req.body.name,
                email: req.body.email,
            };

            if (req.body.password) {
                // If newPassword is provided, update the password
                updateData.password = bcrypt.hashSync(req.body.password, 8);
            }

            if (req.file && req.file.path) {
                // If a new picture was uploaded to Cloudinary, update the picture
                updateData.picture = req.file.path;
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                updateData,
                { new: true }
            );

            if (updatedUser) {
                res.status(200).send(updatedUser);
            } else {
                res.status(500).send({ message: 'Error updating user profile' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).send({ message: 'Error updating user profile' });
        }
    })
);
userRouter.put(
    '/delete/:id',isAuth,
    hasRole(['superadmin']),
    expressAsyncHandler(async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id });

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            if (user.isAdmin) {
                return res.status(400).send({ message: 'Cannot delete an admin user' });
            }
            if (req.body.DelStatus === undefined) {
                return res.status(400).send({ message: 'DelStatus is required' });
            }

            user.DelStatus = req.body.DelStatus;
            await user.save();

            res.send({ message: 'User status updated successfully' });
        } catch (error) {
            console.error('Error updating user status:', error);
            res.status(500).send({ message: 'Error updating user status' });
        }
    })
);


userRouter.post(
  '/forgot-password',
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Set OTP and expiration time in the user document
    user.otp = otp;
    user.otpExpiration = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    await user.save();

    // Send OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `
          <html>
          <head></head>
          <body>
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Jovera Groups</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Thank you for choosing Jovera Tourism. Use the following OTP to complete your password reset procedure. OTP is valid for 5 minutes.</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
              <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Jovera Groups</p>
                <p>Abu Dhabi</p>
                <p>UAE</p>
              </div>
            </div>
          </div>
          </body>
          </html>
        `,
    };

    await transporter.sendMail(mailOptions);

    res.send({ message: 'OTP sent successfully' });
  })
);


userRouter.post(
  '/verify-otp',
  expressAsyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).send({ message: 'Incorrect OTP. Please try again.' });
    }

    if (user.otpExpiration < Date.now()) {
      return res.status(400).send({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Generate a reset token and set its expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 5 * 60 * 1000; // Token expires in 5 minutes

    // Save reset token and expiration
    user.resettoken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    res.send({ message: 'OTP verification successful', resetToken });
  })
);



// // Password reset route
userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { email, newPassword, resetToken } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    // Check if the provided reset token matches the one in the database
    if (user.resettoken !== resetToken) {
      return res.status(400).send({ message: 'Invalid reset token' });
    }

    // Check if the reset token has expired
    if (user.resetTokenExpiration < Date.now()) {
      return res.status(400).send({ message: 'Reset token has expired. Please request a new one.' });
    }

    // Reset the password
    user.password = bcrypt.hashSync(newPassword, 8);
    user.resettoken = undefined; // Clear the reset token
    user.resetTokenExpiration = undefined; // Clear the reset token expiration
    await user.save();

    res.send({ message: 'Password reset successfully' });
  })
);




userRouter.get(
  '/allusers',
  isAuth,
  hasRole(['superadmin']),
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({DelStatus:false});
    res.send(users);
  })
);


userRouter.put(
  '/edit-pass/:id', isAuth,
  hasRole(['superadmin']),
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.params.id;
      const { newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      // If newPassword is provided, hash and update password
      if (newPassword) {
        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        user.password = hashedPassword;
      }

      // Save the updated user
      const updatedUser = await user.save();

      res.status(200).send(updatedUser);
    } catch (error) {
      console.error('Error editing user:', error);
      res.status(500).send({ message: 'Error editing user' });
    }
  })
);
userRouter.put(
  '/edit-user/:id', isAuth,
  hasRole(['superadmin']),
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, role, contact, othercontact, address, nationality } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      user.name = name;
      user.email = email;
      user.role = role;
      user.contact = contact;
      user.othercontact = othercontact;
      user.address = address;
      user.nationality = nationality;

      const updatedUser = await user.save();

      res.status(200).send(updatedUser);
    } catch (error) {
      console.error('Error editing user:', error);
      res.status(500).send({ message: 'Error editing user' });
    }
  })
);


// // Modify login route to handle both traditional login and OAuth login
userRouter.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      // Handle traditional login as before
      const user = await User.findOne({ email });

      if (user && bcrypt.compareSync(password, user.password)) {
        return res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role,
          token: generateToken(user),
        });
      } else {
        return res.status(401).send({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).send({ message: 'Error logging in' });
    }
  })
);



export default userRouter;