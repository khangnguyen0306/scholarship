import Rating from '../models/Rating.model.js';
import ChatRoom from '../models/ChatRoom.model.js';
import asyncHandler from 'express-async-handler';

// POST /api/ratings
export const createRating = asyncHandler(async (req, res) => {
  const { mentorId, roomId, stars, comment } = req.body;
  const studentId = req.user._id;

  // Kiểm tra đã từng kết nối (có phòng chat)
  const room = await ChatRoom.findOne({ _id: roomId, mentorId, studentId });
  if (!room) {
    res.status(400);
    throw new Error('Bạn chưa từng kết nối với mentor này!');
  }

  // Kiểm tra đã đánh giá chưa
  const exists = await Rating.findOne({ mentorId, studentId, roomId });
  if (exists) {
    res.status(400);
    throw new Error('Bạn đã đánh giá mentor này rồi!');
  }

  const rating = await Rating.create({ mentorId, studentId, roomId, stars, comment });
  res.status(201).json({ success: true, data: rating });
});

// GET /api/ratings/mentor/:mentorId
export const getMentorRatings = asyncHandler(async (req, res) => {
  const mentorId = req.params.mentorId;
  const ratings = await Rating.find({ mentorId })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate('studentId', 'firstName lastName email');
  const count = await Rating.countDocuments({ mentorId });
  const avgAgg = await Rating.aggregate([
    { $match: { mentorId: typeof mentorId === 'string' ? new (await import('mongoose')).default.Types.ObjectId(mentorId) : mentorId } },
    { $group: { _id: null, avg: { $avg: '$stars' } } }
  ]);
  const avg = avgAgg[0]?.avg ? avgAgg[0].avg.toFixed(2) : 0;
  res.json({ success: true, count, avg, ratings });
});     