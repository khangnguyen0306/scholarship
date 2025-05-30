import asyncHandler from "express-async-handler";
import Scholarship from "../models/Scholarship.model.js";
import ScholarshipRequirement from "../models/ScholarshipRequirement.model.js";
import CertificateType from "../models/CertificateType.model.js";

// @desc    Tạo học bổng mới
// @route   POST /api/scholarships
// @access  Admin
const createScholarship = asyncHandler(async (req, res) => {
    const { school, name, value, field, location, deadline, description, detail, benefits, applicationMethod, requirements } = req.body;
    if (!school || !name || !value || !field || !location || !deadline || !detail || !benefits || !applicationMethod) {
        return res.status(400).json({ status: 400, message: "Vui lòng nhập đầy đủ các trường bắt buộc: school, name, value, field, location, deadline, detail, benefits, applicationMethod" });
    }
    const exists = await Scholarship.findOne({ name, school });
    if (exists) {
        return res.status(400).json({ status: 400, message: "Học bổng đã tồn tại cho trường này" });
    }
    const scholarship = await Scholarship.create({ school, name, value, field, location, deadline, description, detail, benefits, applicationMethod, requirements });
    res.status(201).json({ status: 201, message: "Tạo học bổng thành công", data: scholarship });
});

// @desc    Lấy danh sách học bổng (có search, filter)
// @route   GET /api/scholarships
// @access  Public
const getScholarships = asyncHandler(async (req, res) => {
    const { search, location, field, school, gpa, ielts, toeic, sat } = req.query;
    let filter = {};
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }
    if (location) {
        filter.location = location;
    }
    if (field) {
        filter.field = field;
    }
    if (school) {
        filter.school = school;
    }
    // Lấy danh sách học bổng trước
    let scholarships = await Scholarship.find(filter).populate('school', 'name description logo').lean();

    // Lấy requirement đầu tiên cho mỗi học bổng
    const reqIds = scholarships.map(s => s.requirements?.[0]).filter(Boolean);
    const reqs = await ScholarshipRequirement.find({ _id: { $in: reqIds } }).lean();
    const reqMap = {};
    reqs.forEach(r => { reqMap[r._id.toString()] = r; });
    // Lấy tất cả certificateTypeId trong minCertificateScores
    const allCertTypeIds = reqs.flatMap(r => (r.minCertificateScores || []).map(c => c.certificateType)).filter(Boolean);
    // Lấy thông tin certificateType
    const certTypes = await CertificateType.find({ _id: { $in: allCertTypeIds } }).lean();

    // Tính % match cho từng học bổng
    scholarships = scholarships.map(s => {
        const reqId = s.requirements && s.requirements[0];
        if (!reqId) {
            return { ...s, matchPercent: 100 };
        }
        const req = reqMap[reqId.toString()];
        if (!req) {
            return { ...s, matchPercent: 100 };
        }

        // Xác định các điều kiện mà học bổng yêu cầu
        let totalConditions = 0;
        let matchedConditions = 0;

        // GPA
        if (typeof req.minGPA === 'number') {
            totalConditions++;
            if (gpa && Number(gpa) >= req.minGPA) matchedConditions++;
        }

        // Chứng chỉ
        const certFilters = [
            { key: 'ielts', value: ielts },
            { key: 'toeic', value: toeic },
            { key: 'sat', value: sat },
        ];
        for (const { key, value } of certFilters) {
            // Kiểm tra học bổng có yêu cầu chứng chỉ này không
            const cert = (req.minCertificateScores || []).find(c => {
                const certType = certTypes.find(ct => ct._id.toString() === c.certificateType.toString());
                return certType && certType.name && certType.name.toLowerCase() === key.toLowerCase();
            });
            if (cert) {
                totalConditions++;
                if (value && Number(value) >= cert.minScore) matchedConditions++;
            }
        }

        // Nếu học bổng không yêu cầu gì thì match 100%
        const matchPercent = totalConditions === 0 ? 100 : Math.round((matchedConditions / totalConditions) * 100);

        return { ...s, matchPercent };
    });

    // Sắp xếp giảm dần theo matchPercent
    scholarships.sort((a, b) => b.matchPercent - a.matchPercent);

    res.json({ status: 200, message: "Lấy danh sách học bổng thành công", data: scholarships });
});

// @desc    Lấy chi tiết học bổng
// @route   GET /api/scholarships/:id
// @access  Public
const getScholarshipById = asyncHandler(async (req, res) => {
    const scholarship = await Scholarship.findById(req.params.id).populate('school');
    if (!scholarship) {
        return res.status(404).json({ status: 404, message: "Không tìm thấy học bổng" });
    }
    res.json({ status: 200, message: "Lấy chi tiết học bổng thành công", data: scholarship });
});

// @desc    Cập nhật học bổng
// @route   PUT /api/scholarships/:id
// @access  Admin
const updateScholarship = asyncHandler(async (req, res) => {
    const { school, name, value, field, location, deadline, description, detail, benefits, applicationMethod, requirements } = req.body;
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
        return res.status(404).json({ status: 404, message: "Không tìm thấy học bổng" });
    }
    if (school) scholarship.school = school;
    if (name) scholarship.name = name;
    if (value) scholarship.value = value;
    if (field) scholarship.field = field;
    if (location) scholarship.location = location;
    if (deadline) scholarship.deadline = deadline;
    if (description) scholarship.description = description;
    if (detail) scholarship.detail = detail;
    if (benefits) scholarship.benefits = benefits;
    if (applicationMethod) scholarship.applicationMethod = applicationMethod;
    if (requirements) scholarship.requirements = requirements;
    await scholarship.save();
    res.json({ status: 200, message: "Cập nhật học bổng thành công", data: scholarship });
});

// @desc    Xóa học bổng
// @route   DELETE /api/scholarships/:id
// @access  Admin
const deleteScholarship = asyncHandler(async (req, res) => {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
        return res.status(404).json({ status: 404, message: "Không tìm thấy học bổng" });
    }
    await scholarship.deleteOne();
    res.json({ status: 200, message: "Xóa học bổng thành công" });
});

export { createScholarship, getScholarships, getScholarshipById, updateScholarship, deleteScholarship }; 