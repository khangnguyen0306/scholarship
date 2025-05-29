import express from "express";
import { createScholarship, getScholarships, getScholarshipById, updateScholarship, deleteScholarship } from "../controllers/scholarship.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/scholarships:
 *   post:
 *     summary: Tạo học bổng mới (chỉ admin)
 *     tags: [Scholarships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scholarship'
 *     responses:
 *       201:
 *         description: Tạo học bổng thành công
 *       400:
 *         description: Lỗi validate hoặc học bổng đã tồn tại
 *   get:
 *     summary: Lấy danh sách học bổng (có search, filter)
 *     tags: [Scholarships]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên học bổng
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Lọc theo địa điểm học
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         description: Lọc theo lĩnh vực
 *       - in: query
 *         name: school
 *         schema:
 *           type: string
 *         description: Lọc theo school id (ObjectId của trường)
 *     responses:
 *       200:
 *         description: Lấy danh sách học bổng thành công
 */
router.post("/", protect, admin, createScholarship);
router.get("/", getScholarships);

/**
 * @swagger
 * /api/scholarships/{id}:
 *   get:
 *     summary: Lấy chi tiết học bổng
 *     tags: [Scholarships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết học bổng thành công
 *       404:
 *         description: Không tìm thấy học bổng
 *   put:
 *     summary: Cập nhật học bổng (chỉ admin)
 *     tags: [Scholarships]
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
 *             $ref: '#/components/schemas/Scholarship'
 *     responses:
 *       200:
 *         description: Cập nhật học bổng thành công
 *       404:
 *         description: Không tìm thấy học bổng
 *   delete:
 *     summary: Xóa học bổng (chỉ admin)
 *     tags: [Scholarships]
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
 *         description: Xóa học bổng thành công
 *       404:
 *         description: Không tìm thấy học bổng
 */
router.get("/:id", getScholarshipById);
router.put("/:id", protect, admin, updateScholarship);
router.delete("/:id", protect, admin, deleteScholarship);

export default router; 