import express from "express";
import {
  createApplication,
  getMyApplications,
  getApplicationsByScholarship,
  updateApplicationStatus
} from "../controllers/application.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Nộp hồ sơ đăng ký học bổng (student)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scholarshipId
 *             properties:
 *               scholarshipId:
 *                 type: string
 *               note:
 *                 type: string
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Nộp hồ sơ thành công
 *       409:
 *         description: Đã nộp hồ sơ cho học bổng này
 *   get:
 *     summary: Xem hồ sơ đã nộp của mình (student)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách hồ sơ đã nộp thành công
 */
router.route("/")
  .post(protect, createApplication)
  .get(protect, getMyApplications);

/**
 * @swagger
 * /api/applications/by-scholarship:
 *   get:
 *     summary: Xem hồ sơ nộp vào 1 học bổng (admin/trường)
 *     tags: [Application]
 *     parameters:
 *       - in: query
 *         name: scholarshipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy danh sách hồ sơ theo học bổng thành công
 */
router.get("/by-scholarship", getApplicationsByScholarship);

/**
 * @swagger
 * /api/applications/{id}:
 *   put:
 *     summary: Duyệt/cập nhật trạng thái hồ sơ (admin/trường)
 *     tags: [Application]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, cancelled]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái hồ sơ thành công
 */
router.put("/:id", updateApplicationStatus);

export default router; 