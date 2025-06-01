import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

ratingSchema.index({ mentorId: 1, studentId: 1, roomId: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema); 