import asyncHandler from "express-async-handler";
import Scholarship from "../models/Scholarship.model.js";
import ScholarshipRequirement from "../models/ScholarshipRequirement.model.js";
import Auth from "../models/Auth.model.js";

// Tính GPA trung bình từ điểm 3 năm
function calculateGPA(grades10 = [], grades11 = [], grades12 = []) {
  const allScores = [
    ...grades10.map(s => s.score),
    ...grades11.map(s => s.score),
    ...grades12.map(s => s.score)
  ];
  if (allScores.length === 0) return null;
  return allScores.reduce((a, b) => a + b, 0) / allScores.length;
}

// So khớp chứng chỉ
function hasRequiredCertificates(userCerts, requiredCerts = []) {
  if (!requiredCerts.length) return true;
  const userCertIds = userCerts.map(c => c.certificateType.toString());
  return requiredCerts.every(rc => userCertIds.includes(rc.toString()));
}

// So khớp điểm chứng chỉ tối thiểu
function matchMinCertificateScores(userCerts, minCertScores = []) {
  if (!minCertScores.length) return true;
  return minCertScores.every(req => {
    const found = userCerts.find(c => c.certificateType.toString() === req.certificateType.toString());
    return found && found.score >= req.minScore;
  });
}

// Tính % match cho từng requirement
function calcRequirementMatch(req, userGPA, certificates) {
  let percent = 0;
  let total = 0;
  if (req.minGPA !== undefined && req.minGPA !== null) {
    total += 1;
    if (userGPA && userGPA >= req.minGPA) percent += 1;
  }
  if (req.requiredCertificates && req.requiredCertificates.length) {
    total += 1;
    if (hasRequiredCertificates(certificates, req.requiredCertificates)) percent += 1;
  }
  if (req.minCertificateScores && req.minCertificateScores.length) {
    total += 1;
    if (matchMinCertificateScores(certificates, req.minCertificateScores)) percent += 1;
  }
  if (total === 0) return 1; // Nếu không có yêu cầu gì thì match 100%
  return percent / total;
}

/**
 * Tìm kiếm học bổng phù hợp, trả về kèm % match và sort giảm dần
 */
export const matchScholarships = asyncHandler(async (req, res) => {
  let { grades10, grades11, grades12, certificates } = req.body;
  // Nếu user đăng nhập và không truyền body, lấy từ profile
  if (req.user && (!grades10 && !grades11 && !grades12 && !certificates)) {
    const user = await Auth.findById(req.user._id);
    grades10 = user.grades10;
    grades11 = user.grades11;
    grades12 = user.grades12;
    certificates = user.certificates;
  }
  grades10 = grades10 || [];
  grades11 = grades11 || [];
  grades12 = grades12 || [];
  certificates = certificates || [];

  const userGPA = calculateGPA(grades10, grades11, grades12);

  // Lấy tất cả học bổng và yêu cầu
  const scholarships = await Scholarship.find().populate('requirements');

  // Tính % match cho từng học bổng
  const matched = scholarships.map(sch => {
    if (!sch.requirements || !sch.requirements.length) {
      return { scholarship: sch, matchPercent: 100 };
    }
    // Lấy % match cao nhất trong các requirement
    const maxMatch = Math.max(...sch.requirements.map(req => calcRequirementMatch(req, userGPA, certificates)));
    return { scholarship: sch, matchPercent: Math.round(maxMatch * 100) };
  }).filter(item => item.matchPercent > 0);

  // Sort giảm dần theo % match
  matched.sort((a, b) => b.matchPercent - a.matchPercent);

  res.json({
    status: 200,
    message: "Danh sách học bổng phù hợp (có % match)",
    data: matched
  });
}); 