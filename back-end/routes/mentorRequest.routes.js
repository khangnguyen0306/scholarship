import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createMentorRequest, getMentorRequests, acceptMentorRequest, rejectMentorRequest } from '../controllers/mentorRequest.controller.js';

const router = express.Router();

// Student gửi yêu cầu
router.post('/', protect, createMentorRequest);
// Mentor lấy danh sách yêu cầu
router.get('/', protect, getMentorRequests);
// Mentor accept/reject
router.patch('/:id/accept', protect, acceptMentorRequest);
router.patch('/:id/reject', protect, rejectMentorRequest);

export default router; 