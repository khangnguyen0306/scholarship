import express from "express";
import { createSchool, getSchools, getSchoolById, updateSchool, deleteSchool } from "../controllers/school.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Tạo trường học mới (chỉ admin)
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       201:
 *         description: Tạo trường học thành công
 *       400:
 *         description: Lỗi validate hoặc trường đã tồn tại
 *   get:
 *     summary: Lấy danh sách trường học (chỉ admin)
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách trường học thành công
 */
router.post("/", protect, admin, createSchool);
router.get("/", protect, admin, getSchools);

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Lấy chi tiết trường học (chỉ admin)
 *     tags: [Schools]
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
 *         description: Lấy chi tiết trường học thành công
 *       404:
 *         description: Không tìm thấy trường học
 *   put:
 *     summary: Cập nhật trường học (chỉ admin)
 *     tags: [Schools]
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
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       200:
 *         description: Cập nhật trường học thành công
 *       404:
 *         description: Không tìm thấy trường học
 *   delete:
 *     summary: Xóa trường học (chỉ admin)
 *     tags: [Schools]
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
 *         description: Xóa trường học thành công
 *       404:
 *         description: Không tìm thấy trường học
 */
router.get("/:id", protect, admin, getSchoolById);
router.put("/:id", protect, admin, updateSchool);
router.delete("/:id", protect, admin, deleteSchool);

export default router; 