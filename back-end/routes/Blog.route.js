import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from "../controllers/blog.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Lấy danh sách blog (ai cũng xem được)
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách blog thành công
 *   post:
 *     summary: Tạo blog mới (chỉ user VIP)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - title
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên bài viết
 *               title:
 *                 type: string
 *                 description: Tiêu đề
 *               content:
 *                 type: string
 *                 description: Nội dung bài viết
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Các thẻ tag
 *     responses:
 *       201:
 *         description: Tạo blog thành công
 *       403:
 *         description: Chỉ user VIP mới được đăng blog
 */
router.route("/")
  .get(getAllBlogs)
  .post(protect, createBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Lấy blog theo id (ai cũng xem được)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog id
 *     responses:
 *       200:
 *         description: Lấy blog thành công
 *       404:
 *         description: Không tìm thấy blog
 *   put:
 *     summary: Sửa blog (chỉ user VIP, chỉ sửa blog của mình)
 *     tags: [Blog]
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
 *             properties:
 *               name:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Cập nhật blog thành công
 *       403:
 *         description: Chỉ user VIP mới được sửa blog
 *   delete:
 *     summary: Xóa blog (chỉ user VIP, chỉ xóa blog của mình)
 *     tags: [Blog]
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
 *         description: Xóa blog thành công
 *       403:
 *         description: Chỉ user VIP mới được xóa blog
 */
router.route("/:id")
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

export default router; 