import asyncHandler from "express-async-handler";
import ScholarshipRequirement from "../models/ScholarshipRequirement.model.js";

/**
 * Tạo yêu cầu học bổng
 * Validate:
 *  - minGPA: Không bắt buộc, nếu có nên là số hợp lệ
 *  - requiredCertificates: Không bắt buộc, mảng ObjectId chứng chỉ
 *  - minCertificateScores: Không bắt buộc, mảng object { certificateType, minScore }
 *  - otherConditions: Không bắt buộc, string
 */
export const createScholarshipRequirement = asyncHandler(async (req, res) => {
  const { minGPA, requiredCertificates, minCertificateScores, otherConditions } = req.body;
  const requirement = await ScholarshipRequirement.create({ minGPA, requiredCertificates, minCertificateScores, otherConditions });
  res.status(201).json({ status: 201, message: "Tạo yêu cầu học bổng thành công", data: requirement });
});

/**
 * Lấy tất cả yêu cầu học bổng
 * Trả về 200, data là mảng yêu cầu
 */
export const getScholarshipRequirements = asyncHandler(async (req, res) => {
  const requirements = await ScholarshipRequirement.find()
    .populate('requiredCertificates', 'name')
    .populate('minCertificateScores.certificateType', 'name');
  const data = requirements.map(r => ({
    _id: r._id,
    name: r.name,
    minScore: r.minScore,
    minGPA: r.minGPA,
    requiredCertificates: r.requiredCertificates?.map(c => ({
      _id: c._id,
      name: c.name
    })),
    minCertificateScores: r.minCertificateScores?.map(mcs => ({
      certificateType: mcs.certificateType?._id,
      certificateName: mcs.certificateType?.name,
      minScore: mcs.minScore
    })),
    otherConditions: r.otherConditions
  }));
  res.json({ status: 200, message: "Lấy danh sách yêu cầu học bổng thành công", data });
});

/**
 * Lấy chi tiết yêu cầu học bổng theo id
 * Nếu không tìm thấy trả về 404
 */
export const getScholarshipRequirementById = asyncHandler(async (req, res) => {
  const requirement = await ScholarshipRequirement.findById(req.params.id);
  if (!requirement) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy yêu cầu học bổng" });
  }
  res.json({ status: 200, message: "Lấy chi tiết yêu cầu học bổng thành công", data: requirement });
});

/**
 * Cập nhật yêu cầu học bổng
 * Chỉ cập nhật trường truyền lên
 * Nếu không tìm thấy trả về 404
 */
export const updateScholarshipRequirement = asyncHandler(async (req, res) => {
  const { minGPA, requiredCertificates, minCertificateScores, otherConditions } = req.body;
  const requirement = await ScholarshipRequirement.findById(req.params.id);
  if (!requirement) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy yêu cầu học bổng" });
  }
  if (minGPA !== undefined) requirement.minGPA = minGPA;
  if (requiredCertificates) requirement.requiredCertificates = requiredCertificates;
  if (minCertificateScores) requirement.minCertificateScores = minCertificateScores;
  if (otherConditions) requirement.otherConditions = otherConditions;
  await requirement.save();
  res.json({ status: 200, message: "Cập nhật yêu cầu học bổng thành công", data: requirement });
});

/**
 * Xóa yêu cầu học bổng
 * Nếu không tìm thấy trả về 404
 */
export const deleteScholarshipRequirement = asyncHandler(async (req, res) => {
  const requirement = await ScholarshipRequirement.findById(req.params.id);
  if (!requirement) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy yêu cầu học bổng" });
  }
  await requirement.deleteOne();
  res.json({ status: 200, message: "Xóa yêu cầu học bổng thành công" });
}); 