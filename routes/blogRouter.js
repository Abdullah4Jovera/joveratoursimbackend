import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Blog from '../models/blogModel.js';
import { isAuth, hasRole } from '../utils.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary config
cloudinary.config({
    cloud_name: 'dn1oz4vt9',
    api_key: '376365558848471',
    api_secret: 'USb46ns9p4V7fAWMppTP54xiv00',
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blogs',
        allowedFormats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage });

const blogRouter = express.Router();

// Create a new blog
blogRouter.post(
    '/post-blog',
    isAuth, hasRole(['admin', 'superadmin']),
    upload.single('image'), // Handle image upload
    expressAsyncHandler(async (req, res) => {
        const { title, content } = req.body;
        const image = req.file ? req.file.path : ''; // Get uploaded image URL

        const blog = new Blog({
            title,
            content,
            image,
            author: req.user._id, // The author is the authenticated user
        });

        const createdBlog = await blog.save();
        res.status(201).send(createdBlog);
    })
);

// Get all blogs (excluding those with delStatus = true)
blogRouter.get(
    '/get-all-blogs',
    expressAsyncHandler(async (req, res) => {
        const blogs = await Blog.find({ delStatus: false }).populate('author', 'name email');
        res.send(blogs);
    })
);

// Get a single blog by ID (only if not marked as deleted)
blogRouter.get(
    '/single-blog/:id',
    expressAsyncHandler(async (req, res) => {
        const blog = await Blog.findOne({ _id: req.params.id, delStatus: false }).populate('author', 'name email');
        if (blog) {
            res.send(blog);
        } else {
            res.status(404).send({ message: 'Blog not found' });
        }
    })
);

// Update a blog
// Edit blog route with Cloudinary image upload
blogRouter.put(
    '/edit-blog/:id',
    isAuth, // Ensure the user is authenticated
    upload.single('image'), // Handle the image upload if provided
    expressAsyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            // Update blog fields with the new data if provided
            blog.title = req.body.title || blog.title;
            blog.content = req.body.content || blog.content;

            // Check if a new image is uploaded
            if (req.file) {
                try {
                    // Upload the image to Cloudinary
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        folder: 'blogs', // Folder in Cloudinary
                        resource_type: 'image', // Ensure it's an image
                    });

                    // Update blog image URL with the uploaded image's URL
                    blog.image = result.secure_url;
                } catch (error) {
                    return res.status(500).send({ message: 'Image upload failed', error });
                }
            }

            // Save the updated blog to the database
            const updatedBlog = await blog.save();
            res.send(updatedBlog);
        } else {
            res.status(404).send({ message: 'Blog not found' });
        }
    })
);

// Soft delete a blog (set delStatus to true)
blogRouter.put(
    '/delete-blog/:id',
    isAuth, hasRole(['admin', 'superadmin']),
    expressAsyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            blog.delStatus = true;
            await blog.save();
            res.send({ message: 'Blog deleted (soft)' });
        } else {
            res.status(404).send({ message: 'Blog not found' });
        }
    })
);

export default blogRouter;
