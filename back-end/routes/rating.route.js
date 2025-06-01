import express from 'express';
import { createRating, getMentorRatings } from '../controllers/rating.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: API đánh giá mentor từ học sinh đã kết nối
 */

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Học sinh đánh giá mentor (chỉ khi đã từng kết nối)
 *     tags: [Ratings]
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
 *               - roomId
 *               - stars
 *             properties:
 *               mentorId:
 *                 type: string
 *                 description: ID của mentor
 *               roomId:
 *                 type: string
 *                 description: ID phòng chat giữa học sinh và mentor
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Số sao đánh giá (1-5)
 *               comment:
 *                 type: string
 *                 description: Nhận xét (tùy chọn)
 *     responses:
 *       201:
 *         description: Đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Rating'
 *       400:
 *         description: Đã đánh giá hoặc chưa từng kết nối
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/', protect, createRating);

/**
 * @swagger
 * /api/ratings/mentor/{mentorId}:
 *   get:
 *     summary: Lấy số lượt đánh giá, điểm trung bình và danh sách đánh giá của mentor
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: mentorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mentor
 *     responses:
 *       200:
 *         description: Danh sách đánh giá và thống kê
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                   description: Số lượt đánh giá
 *                 avg:
 *                   type: number
 *                   description: Điểm trung bình
 *                 ratings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rating'
 */
router.get('/mentor/:mentorId', getMentorRatings);

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         mentorId:
 *           type: string
 *         studentId:
 *           type: string
 *         roomId:
 *           type: string
 *         stars:
 *           type: integer
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export default router; 