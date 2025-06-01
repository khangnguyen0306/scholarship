import asyncHandler from 'express-async-handler';
import MentorRequest from '../models/MentorRequest.model.js';
import ChatRoom from '../models/ChatRoom.model.js';
import Auth from '../models/Auth.model.js';
import transporter from '../utils/MailserVices.js';

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

  // Gửi email thông báo cho mentor
  try {
    const mentor = await Auth.findById(mentorId);
    const student = await Auth.findById(studentId);
    if (mentor?.email) {
      await transporter.sendMail({
        to: mentor.email,
        subject: 'Bạn có yêu cầu kết nối mới từ học sinh',
        text: `Xin chào ${mentor.firstName} ${mentor.lastName},\n\nBạn vừa nhận được một yêu cầu kết nối mới từ học sinh ${student.firstName} ${student.lastName} (${student.email}).\n\nVui lòng đăng nhập vào hệ thống để xem chi tiết và phản hồi.`,
        html: `<p>Xin chào <b>${mentor.firstName} ${mentor.lastName}</b>,</p><p>Bạn vừa nhận được một <b>yêu cầu kết nối mới</b> từ học sinh <b>${student.firstName} ${student.lastName}</b> (${student.email}).</p><p>Vui lòng đăng nhập vào hệ thống để xem chi tiết và phản hồi.</p>`
      });
    }
  } catch (err) {
    console.error('Lỗi gửi email thông báo mentor:', err);
  }

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
  // Gửi email cho học sinh
  try {
    const student = await Auth.findById(request.studentId);
    const mentor = await Auth.findById(request.mentorId);
    if (student?.email) {
      await transporter.sendMail({
        to: student.email,
        subject: 'Yêu cầu kết nối đã được chấp nhận',
        text: `Xin chào ${student.firstName} ${student.lastName},\n\nMentor ${mentor.firstName} ${mentor.lastName} đã chấp nhận yêu cầu kết nối của bạn.\n\nBạn có thể bắt đầu trò chuyện và trao đổi với mentor trên hệ thống.`,
        html: `<p>Xin chào <b>${student.firstName} ${student.lastName}</b>,</p><p>Mentor <b>${mentor.firstName} ${mentor.lastName}</b> đã <b>chấp nhận</b> yêu cầu kết nối của bạn.</p><p>Bạn có thể bắt đầu trò chuyện và trao đổi với mentor trên hệ thống.</p>`
      });
    }
  } catch (err) {
    console.error('Lỗi gửi email chấp nhận kết nối:', err);
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
  // Gửi email cho học sinh
  try {
    const student = await Auth.findById(request.studentId);
    const mentor = await Auth.findById(request.mentorId);
    const reason = req.body.reason || '';
    if (student?.email) {
      await transporter.sendMail({
        to: student.email,
        subject: 'Yêu cầu kết nối bị từ chối',
        text: `Xin chào ${student.firstName} ${student.lastName},\n\nMentor ${mentor.firstName} ${mentor.lastName} đã từ chối yêu cầu kết nối của bạn.${reason ? '\n\nLý do: ' + reason : ''}\n\nBạn có thể thử gửi yêu cầu tới mentor khác hoặc liên hệ lại sau.`,
        html: `<p>Xin chào <b>${student.firstName} ${student.lastName}</b>,</p><p>Mentor <b>${mentor.firstName} ${mentor.lastName}</b> đã <b>từ chối</b> yêu cầu kết nối của bạn.</p>${reason ? `<p><b>Lý do:</b> ${reason}</p>` : ''}<p>Bạn có thể thử gửi yêu cầu tới mentor khác hoặc liên hệ lại sau.</p>`
      });
    }
  } catch (err) {
    console.error('Lỗi gửi email từ chối kết nối:', err);
  }
  res.json({ success: true, data: request });
}); 