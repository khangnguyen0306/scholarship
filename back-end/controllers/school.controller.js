import asyncHandler from "express-async-handler";
import School from "../models/School.model.js";
import Scholarship from "../models/Scholarship.model.js";

// @desc    Tạo trường học mới
// @route   POST /api/schools
// @access  Admin
const createSchool = asyncHandler(async (req, res) => {
  const { name, nationality, address, website, description, logo, image, foundedYear, email } = req.body;
  if (!name || !nationality || !address || !description || !foundedYear || !email) {
    return res.status(400).json({ status: 400, message: "Vui lòng nhập đầy đủ các trường bắt buộc: name, nationality, address, description, foundedYear, email" });
  }
  const exists = await School.findOne({ name });
  if (exists) {
    return res.status(400).json({ status: 400, message: "Trường học đã tồn tại" });
  }
  const school = await School.create({ name, nationality, address, website, description, logo, image, foundedYear, email });
  res.status(201).json({ status: 201, message: "Tạo trường học thành công", data: school });
});
 
// @desc    Lấy danh sách trường học
// @route   GET /api/schools
// @access  Admin
const getSchools = asyncHandler(async (req, res) => {
  const { search, nationality, limit } = req.query;
  let filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (nationality) {
    filter.nationality = { $regex: `^${nationality}$`, $options: 'i' };
  }
  let query = School.find(filter);
  if (limit) {
    query = query.limit(Number(limit));
  }
  const schools = await query;
  // Lấy số lượng học bổng cho từng trường
  const Scholarship = (await import('../models/Scholarship.model.js')).default;
  const schoolsWithScholarshipCount = await Promise.all(
    schools.map(async (school) => {
      const count = await Scholarship.countDocuments({ school: school._id });
      return { ...school.toObject(), scholarshipCount: count };
    })
  );
  res.json({ status: 200, message: "Lấy danh sách trường học thành công", data: schoolsWithScholarshipCount });
});

// @desc    Lấy chi tiết trường học
// @route   GET /api/schools/:id
// @access  Admin
const getSchoolById = asyncHandler(async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy trường học" });
  }
  // Lấy các học bổng liên quan
  const scholarships = await Scholarship.find({ school: school._id })
    .select('name description deadline value field');
  res.json({ status: 200, message: "Lấy chi tiết trường học thành công", data: { ...school.toObject(), scholarships } });
});

// @desc    Cập nhật trường học
// @route   PUT /api/schools/:id
// @access  Admin
const updateSchool = asyncHandler(async (req, res) => {
  const { name, address, website, description, logo, image, foundedYear, email } = req.body;
  const school = await School.findById(req.params.id);
  if (!school) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy trường học" });
  }
  if (name) school.name = name;
  if (address) school.address = address;
  if (website) school.website = website;
  if (description) school.description = description;
  if (logo) school.logo = logo;
  if (image) school.image = image;
  if (foundedYear) school.foundedYear = foundedYear;
  if (email) school.email = email;
  await school.save();
  res.json({ status: 200, message: "Cập nhật trường học thành công", data: school });
});

// @desc    Xóa trường học
// @route   DELETE /api/schools/:id
// @access  Admin
const deleteSchool = asyncHandler(async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy trường học" });
  }
  await school.deleteOne();
  res.json({ status: 200, message: "Xóa trường học thành công" });
});

export { createSchool, getSchools, getSchoolById, updateSchool, deleteSchool }; 