import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Image as ImageIcon, FileText, Tag } from 'lucide-react';
import { useCreateBlogMutation } from '@/services/BlogAPi';
import { useToast } from '@/components/ui/use-toast';

const categories = [
  'Kỹ năng',
  'Phỏng vấn',
  'Du học',
  'Học bổng',
  'Kinh nghiệm',
  'Khác',
];

const NewBlogPostPage = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const validateForm = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên bài viết.');
      return false;
    }
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết.');
      return false;
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const blogData = {
        name,
        title,
        content,
        category,
        image: image || undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      const result = await createBlog(blogData).unwrap();
      
      toast({
        title: "Thành công!",
        description: "Bài viết đã được đăng thành công.",
        variant: "default",
      });
     
      navigate(`/blog/${result.data._id}`);
      window.location.reload();
    } catch (err) {
      console.error('Error creating blog:', err);
      const errorMessage = err.data?.message || 'Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.';
      setError(errorMessage);
      toast({
        title: "Lỗi!",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Tạo Bài Viết Mới
          </CardTitle>
          <CardDescription>Chia sẻ kinh nghiệm, kiến thức hoặc câu chuyện của bạn với cộng đồng.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && <div className="text-red-600 font-semibold">{error}</div>}
            <div>
              <Label htmlFor="name">Tên bài viết *</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Nhập tên bài viết..." 
                className="mt-1"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor="title">Tiêu đề bài viết *</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Nhập tiêu đề..." 
                className="mt-1"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Ảnh đại diện (URL)</Label>
              <div className="flex items-center gap-4 mt-1">
                <Input 
                  id="image" 
                  value={image} 
                  onChange={e => setImage(e.target.value)} 
                  placeholder="Dán link ảnh..." 
                  disabled={isLoading}
                />
                {image && <img src={image} alt="preview" className="h-16 w-16 object-cover rounded-md border" />}
              </div>
            </div>
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <div className="flex items-center gap-2 mt-1">
                <Tag className="h-5 w-5 text-primary" />
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Ví dụ: học bổng, du học, kinh nghiệm..."
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="content">Nội dung bài viết *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Chia sẻ kinh nghiệm, kiến thức hoặc câu chuyện của bạn..."
                rows={10}
                className="mt-1"
                disabled={isLoading}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/blog')} 
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <ArrowLeft className="h-5 w-5" /> Quay lại
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang đăng...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" /> Đăng Bài
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewBlogPostPage; 