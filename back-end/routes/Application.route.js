import express from "express";
import {
  createApplication,
  getMyApplications,
  getApplicationsByScholarship,
  updateApplicationStatus,
  getAllApplications,
  getApplicationDetail
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
 *               essay:
 *                 type: string
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     url:
 *                       type: string
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

/**
 * @swagger
 * /api/applications/all:
 *   get:
 *     summary: Lấy tất cả hồ sơ đã nộp (admin)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy tất cả hồ sơ đã nộp thành công
 */
router.get("/all", protect, getAllApplications);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn nộp (admin)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn nộp
 *     responses:
 *       200:
 *         description: Lấy chi tiết đơn nộp thành công
 *       404:
 *         description: Không tìm thấy đơn nộp
 */
router.get('/:id', protect, getApplicationDetail);

export default router; 