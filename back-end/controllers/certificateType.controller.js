import asyncHandler from "express-async-handler";
import CertificateType from "../models/CertificateType.model.js";

/**
 * Tạo loại chứng chỉ
 * Validate:
 *  - name: Bắt buộc, không trùng
 *  - maxScore: Nếu có phải là số dương
 */
export const createCertificateType = asyncHandler(async (req, res) => {
  const { name, description, maxScore } = req.body;
  if (!name) {
    return res.status(400).json({ status: 400, message: "Tên chứng chỉ là bắt buộc" });
  }
  if (maxScore !== undefined && (isNaN(maxScore) || maxScore <= 0)) {
    return res.status(400).json({ status: 400, message: "maxScore phải là số dương" });
  }
  const exists = await CertificateType.findOne({ name });
  if (exists) {
    return res.status(400).json({ status: 400, message: "Tên chứng chỉ đã tồn tại" });
  }
  const cert = await CertificateType.create({ name, description, maxScore });
  res.status(201).json({ status: 201, message: "Tạo loại chứng chỉ thành công", data: cert });
});

/**
 * Lấy danh sách loại chứng chỉ
 */
export const getCertificateTypes = asyncHandler(async (req, res) => {
  const certs = await CertificateType.find();
  res.json({ status: 200, message: "Lấy danh sách loại chứng chỉ thành công", data: certs });
});

/**
 * Lấy chi tiết loại chứng chỉ
 */
export const getCertificateTypeById = asyncHandler(async (req, res) => {
  const cert = await CertificateType.findById(req.params.id);
  if (!cert) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy loại chứng chỉ" });
  }
  res.json({ status: 200, message: "Lấy chi tiết loại chứng chỉ thành công", data: cert });
});

/**
 * Cập nhật loại chứng chỉ
 * Chỉ cập nhật trường truyền lên
 */
export const updateCertificateType = asyncHandler(async (req, res) => {
  const { name, description, maxScore } = req.body;
  const cert = await CertificateType.findById(req.params.id);
  if (!cert) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy loại chứng chỉ" });
  }
  if (name) {
    const exists = await CertificateType.findOne({ name, _id: { $ne: cert._id } });
    if (exists) {
      return res.status(400).json({ status: 400, message: "Tên chứng chỉ đã tồn tại" });
    }
    cert.name = name;
  }
  if (description !== undefined) cert.description = description;
  if (maxScore !== undefined) {
    if (isNaN(maxScore) || maxScore <= 0) {
      return res.status(400).json({ status: 400, message: "maxScore phải là số dương" });
    }
    cert.maxScore = maxScore;
  }
  await cert.save();
  res.json({ status: 200, message: "Cập nhật loại chứng chỉ thành công", data: cert });
});

/**
 * Xóa loại chứng chỉ
 */
export const deleteCertificateType = asyncHandler(async (req, res) => {
  const cert = await CertificateType.findById(req.params.id);
  if (!cert) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy loại chứng chỉ" });
  }
  await cert.deleteOne();
  res.json({ status: 200, message: "Xóa loại chứng chỉ thành công" });
}); 