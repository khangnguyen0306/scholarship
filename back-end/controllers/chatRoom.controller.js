import asyncHandler from 'express-async-handler';
import ChatRoom from '../models/ChatRoom.model.js';
import Message from '../models/Message.model.js';

/**
 * @swagger
 * tags:
 *   name: ChatRooms
 *   description: API quản lý phòng chat và tin nhắn giữa student và mentor
 */

/**
 * @swagger
 * /api/chat-rooms:
 *   get:
 *     summary: Lấy danh sách phòng chat của user
 *     tags: [ChatRooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phòng chat (có trường unreadCount)
 */
// Lấy danh sách phòng chat của user (student hoặc mentor)
export const getUserChatRooms = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const rooms = await ChatRoom.find({ $or: [ { studentId: userId }, { mentorId: userId } ] })
    .populate('studentId', 'firstName lastName email profileImage')
    .populate('mentorId', 'firstName lastName email profileImage');

  // Đếm số lượng tin nhắn chưa đọc cho từng room
  const roomsWithUnread = await Promise.all(
    rooms.map(async (room) => {
      const unreadCount = await Message.countDocuments({
        roomId: room._id,
        readBy: { $ne: userId }
      });
      return {
        ...room.toObject(),
        unreadCount
      };
    })
  );

  res.json({ success: true, data: roomsWithUnread });
});

/**
 * @swagger
 * /api/chat-rooms/{roomId}/messages:
 *   get:
 *     summary: Lấy tin nhắn trong 1 phòng chat
 *     tags: [ChatRooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng chat
 *     responses:
 *       200:
 *         description: Danh sách tin nhắn
 */
// Lấy tin nhắn trong 1 room
export const getRoomMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId }).populate('senderId', '_id');
  res.json({ success: true, data: messages });
});

/**
 * @swagger
 * /api/chat-rooms/{roomId}/messages:
 *   post:
 *     summary: Gửi tin nhắn mới trong phòng chat
 *     tags: [ChatRooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung tin nhắn
 *     responses:
 *       201:
 *         description: Tin nhắn đã được gửi
 */
// Gửi tin nhắn mới
export const sendMessage = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { content, type = 'text', fileUrl, fileName, emoji } = req.body;
  const senderId = req.user._id;
  // Tạo message với các trường phù hợp
  const message = await Message.create({
    roomId,
    senderId,
    type,
    content,
    fileUrl,
    fileName,
    emoji
  });
  // Populate senderId giống getRoomMessages
  const populatedMsg = await message.populate('senderId', '_id');
  res.status(201).json({ success: true, data: populatedMsg });
});

/**
 * @swagger
 * /api/chat-rooms/{roomId}/read:
 *   patch:
 *     summary: Đánh dấu tất cả tin nhắn trong phòng chat là đã đọc với user hiện tại
 *     tags: [ChatRooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng chat
 *     responses:
 *       200:
 *         description: Đã đánh dấu đã đọc
 */
export const markRoomAsRead = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;
  await Message.updateMany(
    { roomId, readBy: { $ne: userId } },
    { $push: { readBy: userId } }
  );
  res.json({ success: true, message: 'Đã đánh dấu đã đọc' });
}); 