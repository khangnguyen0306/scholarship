import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Image as ImageIcon, FileText, Tag } from 'lucide-react';

const categories = [
  'Kỹ năng',
  'Phỏng vấn',
  'Du học',
  'Học bổng',
  'Kinh nghiệm',
  'Khác',
];

const NewBlogPostPage = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng nhập tiêu đề và nội dung.');
      return;
    }
    // TODO: Gửi dữ liệu lên API
    // Hiện tại chỉ quay lại trang blog
    navigate('/blog');
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
              <Label htmlFor="title">Tiêu đề bài viết</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="image">Ảnh đại diện (URL)</Label>
              <div className="flex items-center gap-4 mt-1">
                <Input id="image" value={image} onChange={e => setImage(e.target.value)} placeholder="Dán link ảnh..." />
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
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="content">Nội dung bài viết</Label>
              <Textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Chia sẻ kinh nghiệm, kiến thức hoặc câu chuyện của bạn..."
                rows={10}
                className="mt-1"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Button type="button" variant="outline" onClick={() => navigate('/blog')} className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" /> Quay lại
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Đăng Bài
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewBlogPostPage; 