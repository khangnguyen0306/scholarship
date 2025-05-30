import express from "express";
import { createPayOSPayment, handlePayOSWebhook, handlePayOSReturn } from "../controllers/payment.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/payments/payos/create:
 *   post:
 *     summary: Tạo đơn thanh toán nâng cấp Vip qua PayOS
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tạo đơn thanh toán thành công
 */
router.post("/payos/create", protect, createPayOSPayment);

/**
 * @swagger
 * /api/payments/payos/return:
 *   get:
 *     summary: Xử lý return URL từ PayOS
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Chuyển hướng về trang thành công/thất bại
 */
router.get("/payos/return", handlePayOSReturn);

/**
 * @swagger
 * /api/payments/payos/webhook:
 *   post:
 *     summary: PayOS callback xác nhận thanh toán
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Đã nhận callback từ PayOS
 */
router.post("/payos/webhook", handlePayOSWebhook);

export default router;