import express from "express";
import { matchScholarships } from "../controllers/scholarship.match.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/scholarships/match:
 *   post:
 *     summary: Tìm kiếm học bổng phù hợp với hồ sơ học sinh (có % match)
 *     tags:
 *       - Scholarships
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grades10:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     score:
 *                       type: number
 *               grades11:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     score:
 *                       type: number
 *               grades12:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     score:
 *                       type: number
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     certificateType:
 *                       type: string
 *                     score:
 *                       type: number
 *     responses:
 *       200:
 *         description: Danh sách học bổng phù hợp, có % match, sort giảm dần
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       scholarship:
 *                         $ref: '#/components/schemas/Scholarship'
 *                       matchPercent:
 *                         type: number
 *                         description: Phần trăm phù hợp (0-100)
 */
router.post("/match", matchScholarships);

export default router; 