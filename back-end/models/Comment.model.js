import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  content: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment; 