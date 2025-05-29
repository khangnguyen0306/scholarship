import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.model.js";
import Blog from "../models/Blog.model.js";
import mongoose from "mongoose";

// Tạo comment mới
export const createComment = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ status: 403, message: "Chỉ user VIP mới được bình luận" });
  }
  const { blogId, content } = req.body;
  if (!blogId || !content) {
    return res.status(400).json({ status: 400, message: "BlogId và nội dung là bắt buộc" });
  }
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ status: 400, message: "BlogId không hợp lệ" });
  }
  const blog = await Blog.findById(blogId);
  if (!blog) return res.status(404).json({ status: 404, message: "Không tìm thấy blog" });
  const comment = await Comment.create({ blog: blogId, author: req.user._id, content });
  blog.comments.push(comment._id);
  await blog.save();
  res.status(201).json({ status: 201, message: "Tạo bình luận thành công", data: comment });
});

// Lấy tất cả comment của 1 blog
export const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ status: 400, message: "BlogId không hợp lệ" });
  }
  const comments = await Comment.find({ blog: blogId })
    .populate('author', 'firstName lastName profileImage isPremium')
    .sort({ createdAt: 1 });
  res.json({ status: 200, message: "Lấy bình luận thành công", data: comments });
});

// Sửa comment
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ status: 403, message: "Chỉ user VIP mới được sửa bình luận" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "ID không hợp lệ" });
  }
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ status: 404, message: "Không tìm thấy bình luận" });
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ status: 403, message: "Bạn chỉ có thể sửa bình luận của mình" });
  }
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ status: 400, message: "Nội dung là bắt buộc" });
  }
  comment.content = content;
  await comment.save();
  res.json({ status: 200, message: "Cập nhật bình luận thành công", data: comment });
});

// Xóa comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ status: 403, message: "Chỉ user VIP mới được xóa bình luận" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "ID không hợp lệ" });
  }
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ status: 404, message: "Không tìm thấy bình luận" });
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ status: 403, message: "Bạn chỉ có thể xóa bình luận của mình" });
  }
  await comment.deleteOne();
  // Xóa khỏi blog.comments
  await Blog.findByIdAndUpdate(comment.blog, { $pull: { comments: comment._id } });
  res.json({ status: 200, message: "Xóa bình luận thành công" });
}); 