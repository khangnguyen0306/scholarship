import asyncHandler from 'express-async-handler';
import MentorRequest from '../models/MentorRequest.model.js';
import ChatRoom from '../models/ChatRoom.model.js';

/**
 * @swagger
 * tags:
 *   name: MentorRequests
 *   description: API quản lý yêu cầu hướng dẫn giữa student và mentor
 */

/**
 * @swagger
 * /api/mentor-requests:
 *   post:
 *     summary: Student gửi yêu cầu hướng dẫn tới mentor
 *     tags: [MentorRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mentorId
 *             properties:
 *               mentorId:
 *                 type: string
 *                 description: ID của mentor
 *     responses:
 *       201:
 *         description: Gửi yêu cầu thành công
 *       400:
 *         description: Đã gửi yêu cầu hoặc đã có phòng chat
 */
// Student gửi yêu cầu hướng dẫn tới mentor
export const createMentorRequest = asyncHandler(async (req, res) => {
  const { mentorId } = req.body;
  const studentId = req.user._id;
  // Không cho gửi trùng
  const exists = await MentorRequest.findOne({ studentId, mentorId, status: { $in: ['pending', 'accepted'] } });
  if (exists) {
    res.status(400);
    throw new Error('Bạn đã gửi yêu cầu tới mentor này hoặc đã có phòng chat!');
  }
  const request = await MentorRequest.create({ studentId, mentorId });
  res.status(201).json({ success: true, data: request });
});

/**
 * @swagger
 * /api/mentor-requests:
 *   get:
 *     summary: Mentor lấy danh sách yêu cầu hướng dẫn
 *     tags: [MentorRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu
 */
// Mentor lấy danh sách yêu cầu hướng dẫn
export const getMentorRequests = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;
  const requests = await MentorRequest.find({ mentorId }).populate('studentId', 'firstName lastName email');
  res.json({ success: true, data: requests });
});

/**
 * @swagger
 * /api/mentor-requests/{id}/accept:
 *   patch:
 *     summary: Mentor chấp nhận yêu cầu hướng dẫn
 *     tags: [MentorRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của yêu cầu
 *     responses:
 *       200:
 *         description: Chấp nhận thành công, trả về request và room
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       400:
 *         description: Yêu cầu đã được xử lý
 */
// Mentor accept yêu cầu, tạo ChatRoom nếu chưa có
export const acceptMentorRequest = asyncHandler(async (req, res) => {
  const request = await MentorRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Không tìm thấy yêu cầu');
  }
  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Yêu cầu đã được xử lý');
  }
  request.status = 'accepted';
  await request.save();
  // Tạo ChatRoom nếu chưa có
  let room = await ChatRoom.findOne({ studentId: request.studentId, mentorId: request.mentorId });
  if (!room) {
    room = await ChatRoom.create({ studentId: request.studentId, mentorId: request.mentorId });
  }
  res.json({ success: true, data: { request, room } });
});

/**
 * @swagger
 * /api/mentor-requests/{id}/reject:
 *   patch:
 *     summary: Mentor từ chối yêu cầu hướng dẫn
 *     tags: [MentorRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của yêu cầu
 *     responses:
 *       200:
 *         description: Từ chối thành công
 *       404:
 *         description: Không tìm thấy yêu cầu
 *       400:
 *         description: Yêu cầu đã được xử lý
 */
// Mentor reject yêu cầu
export const rejectMentorRequest = asyncHandler(async (req, res) => {
  const request = await MentorRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Không tìm thấy yêu cầu');
  }
  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Yêu cầu đã được xử lý');
  }
  request.status = 'rejected';
  await request.save();
  res.json({ success: true, data: request });
}); 