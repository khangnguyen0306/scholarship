import express from "express";
import {
  createScholarshipRequirement,
  getScholarshipRequirements,
  getScholarshipRequirementById,
  updateScholarshipRequirement,
  deleteScholarshipRequirement
} from "../controllers/scholarshipRequirement.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ScholarshipRequirements
 *   description: Quản lý các yêu cầu của học bổng
 */

/**
 * @swagger
 * /api/scholarship-requirements:
 *   post:
 *     summary: Tạo yêu cầu học bổng (chỉ admin)
 *     tags: [ScholarshipRequirements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scholarship
 *             properties:
 *               scholarship:
 *                 type: string
 *                 description: ID học bổng liên kết
 *               minGPA:
 *                 type: number
 *                 description: Điểm trung bình tối thiểu
 *               requiredCertificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách chứng chỉ yêu cầu
 *               minCertificateScores:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     certificateType:
 *                       type: string
 *                     minScore:
 *                       type: number
 *                 description: Danh sách điểm tối thiểu cho từng chứng chỉ
 *               otherConditions:
 *                 type: string
 *                 description: Điều kiện khác
 *     responses:
 *       201:
 *         description: Tạo yêu cầu học bổng thành công
 *   get:
 *     summary: Lấy danh sách yêu cầu học bổng (filter theo scholarship)
 *     tags: [ScholarshipRequirements]
 *     parameters:
 *       - in: query
 *         name: scholarship
 *         schema:
 *           type: string
 *         description: Lọc theo id học bổng
 *     responses:
 *       200:
 *         description: Lấy danh sách yêu cầu học bổng thành công
 */
router.post("/", protect, admin, createScholarshipRequirement);
router.get("/", getScholarshipRequirements);

/**
 * @swagger
 * /api/scholarship-requirements/{id}:
 *   get:
 *     summary: Lấy chi tiết yêu cầu học bổng
 *     tags: [ScholarshipRequirements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết yêu cầu học bổng thành công
 *       404:
 *         description: Không tìm thấy yêu cầu học bổng
 *   put:
 *     summary: Cập nhật yêu cầu học bổng (chỉ admin)
 *     tags: [ScholarshipRequirements]
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
 *               minGPA:
 *                 type: number
 *               requiredCertificates:
 *                 type: array
 *                 items:
 *                   type: string
 *               minCertificateScores:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     certificateType:
 *                       type: string
 *                     minScore:
 *                       type: number
 *               otherConditions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật yêu cầu học bổng thành công
 *       404:
 *         description: Không tìm thấy yêu cầu học bổng
 *   delete:
 *     summary: Xóa yêu cầu học bổng (chỉ admin)
 *     tags: [ScholarshipRequirements]
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
 *         description: Xóa yêu cầu học bổng thành công
 *       404:
 *         description: Không tìm thấy yêu cầu học bổng
 */
router.get("/:id", getScholarshipRequirementById);
router.put("/:id", protect, admin, updateScholarshipRequirement);
router.delete("/:id", protect, admin, deleteScholarshipRequirement);

export default router; 