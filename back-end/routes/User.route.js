import express from "express";
import { authUser, registerUser, forgotPassword, verifyCode, resetPassword, changePassword, updateProfile, verifyEmail, getAllUsers, getUserProfileById } from "../controllers/user.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const UserRoute = express.Router();

UserRoute.post("/login", authUser);
UserRoute.post("/register", registerUser);
UserRoute.post("/forgot-password", forgotPassword);
UserRoute.post("/verify-code", verifyCode);
UserRoute.get("/verify-email/:token", verifyEmail);
UserRoute.post("/reset-password", resetPassword);
UserRoute.post("/change-password", changePassword);
UserRoute.put("/update-profile", protect, updateProfile);

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Lấy danh sách tất cả user (chỉ admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách user thành công
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
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       role:
 *                         type: string
 *                       isPremium:
 *                         type: boolean
 *                       isEmailVerified:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
UserRoute.get("/all", protect, admin, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin user theo id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: Lấy thông tin user thành công
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
 *                   type: object
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 */
UserRoute.get('/:id', getUserProfileById);

export default UserRoute;
