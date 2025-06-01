import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Chỉ cho phép upload ảnh
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'chat_images', // Tên folder trên Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }],
  },
});
const upload = multer({ storage });

// ========== LOCAL UPLOAD (for files) =============
// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình Multer lưu file vào thư mục uploads/
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const uploadLocal = multer({ storage: localStorage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: API upload file, ảnh cho chat (Cloudinary & GridFS)
 */

/**
 * @swagger
 * /api/upload/:
 *   post:
 *     summary: Upload ảnh chat lên Cloudinary
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh cần upload (jpg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Trả về URL ảnh đã upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Đường dẫn ảnh đã upload
 */
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file || !req.file.path) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: req.file.path });
});

/**
 * @swagger
 * /api/upload/local-upload:
 *   post:
 *     summary: Upload file tài liệu chat (pdf, docx, zip,...) lên thư mục local của server
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File tài liệu cần upload (tối đa 10MB)
 *     responses:
 *       200:
 *         description: Trả về thông tin file đã upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   description: Đường dẫn tải file
 *                 fileName:
 *                   type: string
 *                   description: Tên file gốc
 */
router.post('/local-upload', uploadLocal.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Đường dẫn tải file: /api/upload/local-file/:filename
  res.json({ fileUrl: `/api/upload/local-file/${req.file.filename}`, fileName: req.file.originalname });
});

/**
 * @swagger
 * /api/upload/local-file/{filename}:
 *   get:
 *     summary: Tải file từ thư mục local theo filename
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên file đã upload
 *     responses:
 *       200:
 *         description: File được trả về dạng stream/download
 *       404:
 *         description: File không tồn tại
 */
router.get('/local-file/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  // Đặt lại tên file tải về đúng tên gốc (nếu lưu tên gốc trong DB/message)
  res.download(filePath, req.query.originalName || req.params.filename);
});

export default router; 