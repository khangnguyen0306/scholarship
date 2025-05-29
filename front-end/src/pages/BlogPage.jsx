import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search, Edit, PlusCircle, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';

const mockPosts = [
  { id: 'post1', title: 'Bí quyết viết luận xin học bổng ấn tượng', author: 'Nguyễn Lan Anh', date: '2025-05-15', excerpt: 'Luận văn là một phần quan trọng trong hồ sơ xin học bổng. Bài viết này sẽ chia sẻ những bí quyết giúp bạn...', image: 'blog_essay_writing.jpg', category: 'Kỹ năng' },
  { id: 'post2', title: 'Top 5 sai lầm thường gặp khi phỏng vấn học bổng', author: 'Trần Minh Đức', date: '2025-05-10', excerpt: 'Phỏng vấn học bổng có thể là một thử thách. Tránh những sai lầm phổ biến này để tăng cơ hội thành công của bạn.', image: 'blog_interview_mistakes.jpg', category: 'Phỏng vấn' },
  { id: 'post3', title: 'Làm thế nào để chọn trường đại học phù hợp ở nước ngoài?', author: 'Lê Thu Trang', date: '2025-05-01', excerpt: 'Chọn trường đại học là một quyết định lớn. Cân nhắc các yếu tố sau để đưa ra lựa chọn tốt nhất cho tương lai của bạn.', image: 'blog_choosing_university.jpg', category: 'Du học' },
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user;

  const filteredPosts = mockPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-gradient-primary">Blog Chia Sẻ Kinh Nghiệm</h1>
        <p className="text-lg text-muted-foreground">Khám phá các bài viết, mẹo và hướng dẫn hữu ích cho hành trình săn học bổng của bạn.</p>
      </motion.div>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="pl-10 py-3 text-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isAuthenticated && user?.isVip && (
          <Button asChild className="w-full md:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
            <Link to="/blog/new-post">
              <PlusCircle className="mr-2 h-5 w-5" /> Viết Bài Mới
            </Link>
          </Button>
        )}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)"}}
            >
              <Card className="h-full flex flex-col overflow-hidden glass-card hover:border-primary transition-all duration-300">
                <CardHeader className="p-0">
                  <img  alt={post.title} class="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1504983875-d3b163aba9e6" />
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <span className="text-xs font-semibold uppercase text-primary mb-1">{post.category}</span>
                  <CardTitle className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-3 flex-grow">{post.excerpt}</CardDescription>
                  <div className="text-xs text-muted-foreground">
                    <span>Bởi {post.author}</span> | <span>{post.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/blog/${post.id}`}>Đọc Thêm</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <img  alt="No posts found" class="mx-auto h-40 w-40 mb-4 text-muted-foreground" src="https://images.unsplash.com/photo-1504983875-d3b163aba9e6" />
          <p className="text-xl text-muted-foreground">Không tìm thấy bài viết nào.</p>
        </motion.div>
      )}
      
      {isAuthenticated && !user?.isVip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 p-6 bg-primary/10 dark:bg-primary/20 rounded-lg text-center"
        >
          <h3 className="text-xl font-semibold mb-2 text-primary flex items-center justify-center">
            <Shield className="mr-2 h-6 w-6" /> Muốn chia sẻ kinh nghiệm của bạn?
          </h3>
          <p className="text-muted-foreground mb-4">Nâng cấp lên tài khoản VIP để có thể đăng bài trên blog của chúng tôi và tiếp cận nhiều độc giả hơn!</p>
          <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
            <Link to="/vip-subscription">
              <Edit className="mr-2 h-4 w-4" /> Nâng Cấp VIP Ngay
            </Link>
          </Button>
        </motion.div>
      )}
       {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 p-6 bg-primary/10 dark:bg-primary/20 rounded-lg text-center"
        >
          <h3 className="text-xl font-semibold mb-2 text-primary flex items-center justify-center">
            <Shield className="mr-2 h-6 w-6" /> Tham gia cộng đồng chia sẻ!
          </h3>
          <p className="text-muted-foreground mb-4">Đăng nhập và nâng cấp VIP để chia sẻ kiến thức, kinh nghiệm của bạn với hàng ngàn người dùng khác!</p>
          <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
            <Link to="/login">
              Đăng Nhập & Nâng Cấp
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default BlogPage;