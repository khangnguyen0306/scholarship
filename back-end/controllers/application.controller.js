import asyncHandler from "express-async-handler";
import Application from "../models/Application.model.js";
import Scholarship from "../models/Scholarship.model.js";
import Auth from "../models/Auth.model.js";
import mongoose from "mongoose";
import { sendApplicationEmail } from "../utils/sendApplicationEmail.js";
import CertificateType from "../models/CertificateType.model.js";

// Nộp hồ sơ đăng ký học bổng
export const createApplication = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ status: 401, message: "Bạn cần đăng nhập để nộp hồ sơ" });
  }
  // Chỉ cho phép user VIP nộp hồ sơ
  const user = await Auth.findById(req.user._id);
  if (!user.isPremium) {
    return res.status(403).json({ status: 403, message: "Chỉ user đã đăng ký gói VIP mới được nộp hồ sơ học bổng" });
  }
  const { scholarshipId, essay, documents } = req.body;
  if (!scholarshipId) {
    return res.status(400).json({ status: 400, message: "Thiếu scholarshipId" });
  }
  if (!mongoose.Types.ObjectId.isValid(scholarshipId)) {
    return res.status(400).json({ status: 400, message: "scholarshipId không hợp lệ" });
  }
  // Không cho nộp trùng
  const existed = await Application.findOne({ student: req.user._id, scholarship: scholarshipId, status: { $in: ["pending", "approved"] } });
  if (existed) {
    return res.status(409).json({ status: 409, message: "Bạn đã nộp hồ sơ cho học bổng này" });
  }
  // Kiểm tra đã có đủ bảng điểm chưa
  if (!user.grades10?.length || !user.grades11?.length || !user.grades12?.length) {
    return res.status(400).json({ status: 400, message: "Bạn cần cập nhật đầy đủ bảng điểm lớp 10, 11, 12 trong hồ sơ trước khi nộp đơn." });
  }
  const profileSnapshot = {
    grades10: user.grades10,
    grades11: user.grades11,
    grades12: user.grades12,
    certificates: user.certificates,
  };
  const app = await Application.create({
    student: req.user._id,
    scholarship: scholarshipId,
    essay,
    documents,
    profileSnapshot,
    status: "pending"
  });
  // Gửi email xác nhận
  const scholarship = await Scholarship.findById(scholarshipId).populate('school');
  let school = null;
  if (scholarship && scholarship.school) {
    school = scholarship.school;
  }
  // Populate certificates.certificateType để lấy tên chứng chỉ, giữ nguyên score và date
  let certificatesPopulated = [];
  if (app.profileSnapshot && app.profileSnapshot.certificates && app.profileSnapshot.certificates.length > 0) {
    certificatesPopulated = await Promise.all(app.profileSnapshot.certificates.map(async c => {
      let certType = c.certificateType;
      if (certType && (typeof certType === 'string' || (typeof certType === 'object' && certType instanceof mongoose.Types.ObjectId))) {
        // Nếu chỉ là id, populate
        const certDoc = await CertificateType.findById(certType);
        certType = certDoc ? { _id: certDoc._id, name: certDoc.name } : certType;
      } else if (certType && certType.name) {
        // Đã là object có name
        certType = { _id: certType._id, name: certType.name };
      }
      // Giữ lại score, date, chỉ thay certificateType
      return { certificateType: certType, score: c.score, date: c.date };
    }));
  }
  try {
    await sendApplicationEmail({ to: user.email, application: app, scholarship, user, school, certificatesPopulated });
  } catch (e) {
    console.error("Lỗi gửi email xác nhận hồ sơ:", e);
  }
  res.status(201).json({ status: 201, message: "Nộp hồ sơ thành công", data: app });
});

// Xem hồ sơ đã nộp của chính mình
export const getMyApplications = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ status: 401, message: "Bạn cần đăng nhập" });
  }
  const apps = await Application.find({ student: req.user._id })
    .populate('scholarship')
    .sort({ createdAt: -1 });
  res.json({ status: 200, message: "Lấy danh sách hồ sơ đã nộp thành công", data: apps });
});

// Xem hồ sơ nộp vào 1 học bổng (admin/trường)
export const getApplicationsByScholarship = asyncHandler(async (req, res) => {
  const { scholarshipId } = req.query;
  if (!scholarshipId || !mongoose.Types.ObjectId.isValid(scholarshipId)) {
    return res.status(400).json({ status: 400, message: "scholarshipId không hợp lệ" });
  }
  // TODO: kiểm tra quyền admin/trường
  const apps = await Application.find({ scholarship: scholarshipId })
    .populate('student', 'firstName lastName email profileImage')
    .sort({ createdAt: -1 });
  res.json({ status: 200, message: "Lấy danh sách hồ sơ theo học bổng thành công", data: apps });
});

// Duyệt/cập nhật trạng thái hồ sơ (admin/trường)
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "ID không hợp lệ" });
  }
  if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
    return res.status(400).json({ status: 400, message: "Trạng thái không hợp lệ" });
  }
  // TODO: kiểm tra quyền admin/trường
  const app = await Application.findById(id);
  if (!app) return res.status(404).json({ status: 404, message: "Không tìm thấy hồ sơ" });
  app.status = status;
  await app.save();
  res.json({ status: 200, message: "Cập nhật trạng thái hồ sơ thành công", data: app });
}); 