import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.model.js";
import Auth from "../models/Auth.model.js";
import mongoose from "mongoose";

// Tạo blog mới
export const createBlog = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ status: 403, message: "Chỉ user VIP mới được đăng blog" });
  }
  const { name, title, content, tags } = req.body;
  if (!name || !title || !content) {
    return res.status(400).json({ status: 400, message: "Tên bài viết, tiêu đề và nội dung là bắt buộc" });
  }
  const blog = await Blog.create({ author: req.user._id, name, title, content, tags });
  res.status(201).json({ status: 201, message: "Tạo blog thành công", data: blog });
});

// Lấy tất cả blog (có phân trang)
export const getAllBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const total = await Blog.countDocuments();
  const blogs = await Blog.find()
    .populate('author', 'firstName lastName profileImage isPremium')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({ status: 200, message: "Lấy danh sách blog thành công", data: blogs, total });
});

// Lấy blog theo id
export const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "ID không hợp lệ" });
  }
  const blog = await Blog.findById(id)
    .populate('author', 'firstName lastName profileImage isPremium')
    .populate({ path: 'comments', populate: { path: 'author', select: 'firstName lastName profileImage isPremium' } });
  if (!blog) return res.status(404).json({ status: 404, message: "Không tìm thấy blog" });
  res.json({ status: 200, message: "Lấy blog thành công", data: blog });
});

// Sửa blog
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ status: 403, message: "Chỉ user VIP mới được sửa blog" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "ID không hợp lệ" });
  }
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ status: 404, message: "Không tìm thấy blog" });
  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ status: 403, message: "Bạn chỉ có thể sửa blog của mình" });
  }
  const { name, title, content, tags } = req.body;
  if (!name && !title && !content && !tags) {
    return res.status(400).json({ status: 400, message: "Cần nhập ít nhất một trường để cập nhật" });
  }
  if (name) blog.name = name;
  if (title) blog.title = title;
  if (content) blog.content = content;
  if (tags) blog.tags = tags;
  await blog.save();
  res.json({ status: 200, message: "Cập nhật blog thành công", data: blog });
});

// Xóa blog
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ status: 403, message: "Chỉ user VIP mới được xóa blog" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "ID không hợp lệ" });
  }
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ status: 404, message: "Không tìm thấy blog" });
  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ status: 403, message: "Bạn chỉ có thể xóa blog của mình" });
  }
  await blog.deleteOne();
  res.json({ status: 200, message: "Xóa blog thành công" });
}); 