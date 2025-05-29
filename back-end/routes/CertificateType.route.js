import express from "express";
import {
  createCertificateType,
  getCertificateTypes,
  getCertificateTypeById,
  updateCertificateType,
  deleteCertificateType
} from "../controllers/certificateType.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CertificateTypes
 *   description: Quản lý loại chứng chỉ
 */

/**
 * @swagger
 * /api/certificate-types:
 *   post:
 *     summary: Tạo loại chứng chỉ (chỉ admin)
 *     tags: [CertificateTypes]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên chứng chỉ (bắt buộc, duy nhất)
 *               description:
 *                 type: string
 *                 description: Mô tả
 *               maxScore:
 *                 type: number
 *                 description: Điểm tối đa (số dương)
 *     responses:
 *       201:
 *         description: Tạo loại chứng chỉ thành công
 *       400:
 *         description: Lỗi validate hoặc tên đã tồn tại
 *   get:
 *     summary: Lấy danh sách loại chứng chỉ
 *     tags: [CertificateTypes]
 *     responses:
 *       200:
 *         description: Lấy danh sách loại chứng chỉ thành công
 */
router.post("/", protect, admin, createCertificateType);
router.get("/", getCertificateTypes);

/**
 * @swagger
 * /api/certificate-types/{id}:
 *   get:
 *     summary: Lấy chi tiết loại chứng chỉ
 *     tags: [CertificateTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết loại chứng chỉ thành công
 *       404:
 *         description: Không tìm thấy loại chứng chỉ
 *   put:
 *     summary: Cập nhật loại chứng chỉ (chỉ admin)
 *     tags: [CertificateTypes]
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
 *               description:
 *                 type: string
 *               maxScore:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật loại chứng chỉ thành công
 *       400:
 *         description: Lỗi validate hoặc tên đã tồn tại
 *       404:
 *         description: Không tìm thấy loại chứng chỉ
 *   delete:
 *     summary: Xóa loại chứng chỉ (chỉ admin)
 *     tags: [CertificateTypes]
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
 *         description: Xóa loại chứng chỉ thành công
 *       404:
 *         description: Không tìm thấy loại chứng chỉ
 */
router.get("/:id", getCertificateTypeById);
router.put("/:id", protect, admin, updateCertificateType);
router.delete("/:id", protect, admin, deleteCertificateType);

export default router; 