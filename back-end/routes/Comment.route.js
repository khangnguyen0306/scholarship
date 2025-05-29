import express from "express";
import {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment
} from "../controllers/comment.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Tạo bình luận mới (chỉ user VIP)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blogId
 *               - content
 *             properties:
 *               blogId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo bình luận thành công
 *       403:
 *         description: Chỉ user VIP mới được bình luận
 */
router.post("/", protect, createComment);

/**
 * @swagger
 * /api/comments/blog/{blogId}:
 *   get:
 *     summary: Lấy tất cả bình luận của 1 blog (ai cũng xem được)
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog id
 *     responses:
 *       200:
 *         description: Lấy bình luận thành công
 */
router.get("/blog/:blogId", getCommentsByBlog);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Sửa bình luận (chỉ user VIP, chỉ sửa bình luận của mình)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Cập nhật bình luận thành công
 *       403:
 *         description: Chỉ user VIP mới được sửa bình luận
 *   delete:
 *     summary: Xóa bình luận (chỉ user VIP, chỉ xóa bình luận của mình)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa bình luận thành công
 *       403:
 *         description: Chỉ user VIP mới được xóa bình luận
 */
router.route("/:id")
  .put(protect, updateComment)
  .delete(protect, deleteComment);

export default router; 