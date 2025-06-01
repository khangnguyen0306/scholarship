import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  type: { type: String, enum: ['text', 'image', 'file', 'emoji'], default: 'text' },
  content: { type: String }, 
  fileUrl: { type: String },
  fileName: { type: String },
  emoji: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' }] // userId đã đọc
});

export default mongoose.model('Message', MessageSchema); 