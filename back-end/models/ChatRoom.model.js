import mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChatRoom', ChatRoomSchema); 