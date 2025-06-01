import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getRoomMessages, getUserChatRooms, markRoomAsRead, sendMessage } from '../controllers/chatRoom.controller.js';


const router = express.Router();

// Lấy danh sách phòng chat của user
router.get('/', protect, getUserChatRooms);
// Lấy tin nhắn trong room
router.get('/:roomId/messages', protect, getRoomMessages);
// Gửi tin nhắn mới
router.post('/:roomId/messages', protect, sendMessage);
// Đánh dấu đã đọc
router.patch('/:roomId/read', protect, markRoomAsRead);

export default router; 