import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Tag, Edit2, Trash2, Save, X, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetBlogByIdQuery, useDeleteBlogMutation, useUpdateBlogMutation } from '@/services/BlogAPi';
import { useGetCommentsByBlogIdQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } from '@/services/CommentAPI';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/slices/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BlogPostPage = () => {
  const { postId } = useParams();
  const { data: response, isLoading, error } = useGetBlogByIdQuery(postId);
  const { data: commentsResponse } = useGetCommentsByBlogIdQuery(postId);
  const post = response?.data;
  const comments = commentsResponse?.data || [];
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  const isOwner = currentUser && post?.author?._id === currentUser._id;

  const handleDelete = async () => {
    try {
      await deleteBlog(postId).unwrap();
      toast({
        title: "Xóa bài viết thành công",
        description: "Bài viết đã được xóa khỏi hệ thống.",
      });
      window.location.href = '/blog';
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setEditedData({
      title: post.title,
      content: post.content,
      tags: post.tags?.join(', ') || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const tags = editedData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await updateBlog({
        id: postId,
        ...editedData,
        tags,
      }).unwrap();

      toast({
        title: "Cập nhật thành công",
        description: "Bài viết đã được cập nhật.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      title: post.title,
      content: post.content,
      tags: post.tags?.join(', ') || '',
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createComment({
        blogId: postId,
        content: newComment.trim(),
      }).unwrap();
      setNewComment('');
      toast({
        title: "Thêm bình luận thành công",
        description: "Bình luận của bạn đã được đăng.",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm bình luận. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentContent.trim()) return;

    try {
      await updateComment({
        id: commentId,
        content: editingCommentContent.trim(),
        blogId: postId,
      }).unwrap();
      setEditingCommentId(null);
      setEditingCommentContent('');
      toast({
        title: "Cập nhật bình luận thành công",
        description: "Bình luận của bạn đã được cập nhật.",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bình luận. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({
        id: commentId,
        blogId: postId,
      }).unwrap();
      toast({
        title: "Xóa bình luận thành công",
        description: "Bình luận đã được xóa.",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bình luận. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="h-8 w-32 mb-8 bg-muted animate-pulse rounded-md" />
        <Card className="overflow-hidden glass-card shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="h-8 w-3/4 mb-4 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-1/2 mb-8 bg-muted animate-pulse rounded-md" />
            <div className="space-y-4">
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
        <Button asChild className="mt-4">
          <Link to="/blog">Quay lại trang Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Blog
            </Link>
          </Button>
          
          {isOwner && !isEditing && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit2 className="mr-2 h-4 w-4" /> Chỉnh sửa
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Xóa
              </Button>
            </div>
          )}
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa bài viết này?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Card className="overflow-hidden glass-card shadow-xl">
          <CardHeader className="p-6 md:p-8 border-b">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {post.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={editedData.title}
                    onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Tiêu đề bài viết"
                    className="text-3xl font-bold"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" /> Hủy
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" /> Lưu
                    </Button>
                  </div>
                </div>
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {post.title}
                </h1>
              )}
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author?.profileImage} alt={post.author?.firstName} />
                  <AvatarFallback>{post.author?.firstName?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {post.author?.isPremium ? 'Premium Member' : 'Member'}
                  </p>
                </div>
              </div>
            </motion.div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <article className="prose dark:prose-invert max-w-none prose-lg">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedData.content}
                    onChange={(e) => setEditedData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Nội dung bài viết"
                    className="min-h-[300px]"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (phân cách bằng dấu phẩy)</label>
                    <Input
                      value={editedData.tags}
                      onChange={(e) => setEditedData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Ví dụ: học bổng, du học, scholarship"
                    />
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{post.content}</div>
              )}
            </article>

            {post.tags && post.tags.length > 0 && !isEditing && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-primary" /> Thẻ (Tags)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Button key={tag} variant="outline" size="sm" asChild>
                      <Link to={`/blog/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}>{tag}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-6 md:p-8 border-t">
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-4">Bình luận</h3>
              
              {currentUser && (
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex gap-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" className="self-end">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}

              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment._id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author?.profileImage} alt={comment.author?.firstName} />
                          <AvatarFallback>{comment.author?.firstName?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{comment.author?.firstName} {comment.author?.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        {currentUser && (currentUser._id === comment.author?._id || isOwner) && (
                          <div className="flex gap-2">
                            {editingCommentId === comment._id ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateComment(comment._id)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditingCommentContent('');
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditingCommentContent(comment.content);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {editingCommentId === comment._id ? (
                        <Textarea
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-sm">{comment.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BlogPostPage;