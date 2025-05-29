import asyncHandler from "express-async-handler";
import Scholarship from "../models/Scholarship.model.js";

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
    const { search, location, field, school } = req.query;
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
    const scholarships = await Scholarship.find(filter).populate('school', 'name description logo');
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