import express from "express";
import { createSchool, getSchools, getSchoolById, updateSchool, deleteSchool } from "../controllers/school.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: Quản lý trường học
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolResponse'
 *       400:
 *         description: Lỗi validate hoặc trường đã tồn tại
 *   get:
 *     summary: Lấy danh sách trường học
 *     tags: [Schools]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên trường
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *         description: Lọc theo quốc gia
 *     responses:
 *       200:
 *         description: Lấy danh sách trường học thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/School'
 */
router.post("/", protect, admin, createSchool);
router.get("/", getSchools);

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Lấy chi tiết trường học
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID trường học
 *     responses:
 *       200:
 *         description: Lấy chi tiết trường học thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolResponse'
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
 *         description: ID trường học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       200:
 *         description: Cập nhật trường học thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolResponse'
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
 *         description: ID trường học
 *     responses:
 *       200:
 *         description: Xóa trường học thành công
 *       404:
 *         description: Không tìm thấy trường học
 */
router.get("/:id", getSchoolById);
router.put("/:id", protect, admin, updateSchool);
router.delete("/:id", protect, admin, deleteSchool);

/**
 * @swagger
 * components:
 *   schemas:
 *     School:
 *       type: object
 *       required:
 *         - name
 *         - nationality
 *         - address
 *         - description
 *         - foundedYear
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           example: "60f7c0b8b4d1c80015b4d1c8"
 *         name:
 *           type: string
 *           example: "Đại học Bách Khoa Hà Nội"
 *         nationality:
 *           type: string
 *           example: "Việt Nam"
 *         address:
 *           type: string
 *           example: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội"
 *         website:
 *           type: string
 *           example: "https://hust.edu.vn"
 *         description:
 *           type: string
 *           example: "Trường đại học kỹ thuật hàng đầu Việt Nam."
 *         logo:
 *           type: string
 *           example: "https://domain.com/logo.png"
 *         image:
 *           type: string
 *           example: "https://domain.com/image.png"
 *         foundedYear:
 *           type: integer
 *           example: 1956
 *         email:
 *           type: string
 *           example: "contact@hust.edu.vn"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   SchoolResponse:
 *     type: object
 *     properties:
 *       status:
 *         type: integer
 *         example: 200
 *       message:
 *         type: string
 *         example: "Lấy chi tiết trường học thành công"
 *       data:
 *         $ref: '#/components/schemas/School'
 */

export default router; 