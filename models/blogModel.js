import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, 
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Blog author
    },
    delStatus: {
      type: Boolean,
      default: false, // If true, blog is considered "deleted"
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
