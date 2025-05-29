import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog; 