import mongoose from 'mongoose';

const MentorRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MentorRequest', MentorRequestSchema); 