import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { useGetBlogsQuery } from '@/services/BlogAPi';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector(selectCurrentUser);
  const { data: blogs, isLoading, error } = useGetBlogsQuery();

  const filteredPosts = blogs?.data?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.author?.firstName + ' ' + post.author?.lastName).toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="h-10 w-96 mx-auto mb-4 bg-muted animate-pulse rounded-md" />
          <div className="h-6 w-2/3 mx-auto bg-muted animate-pulse rounded-md" />
        </div>
        <div className="mb-8">
          <div className="h-12 w-full mb-4 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full">
              <CardHeader className="p-0">
                <div className="w-full h-48 bg-muted animate-pulse" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-4 w-20 mb-2 bg-muted animate-pulse rounded-md" />
                <div className="h-6 w-3/4 mb-2 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-full mb-2 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Có lỗi xảy ra</h1>
        <p className="text-muted-foreground mb-4">Không thể tải danh sách bài viết. Vui lòng thử lại sau.</p>
        <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
      </div>
    );
  }

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
        {user?.isPremium && ( 
          <Button asChild className="w-auto min-w-[180px] bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
            <Link to="/blog/new-post" className='flex items-center justify-center'>
              <PlusCircle className="mr-2 h-5 w-5" /> <span>Viết Bài Mới</span>
            </Link>
          </Button>
        )}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            >
              <Card className="h-full flex flex-col overflow-hidden glass-card hover:border-primary transition-all duration-300">
                <CardHeader className="p-0">
                  <img 
                    alt={post.title} 
                    className="w-full h-48 object-cover" 
                    src={post.image || "https://images.unsplash.com/photo-1504983875-d3b163aba9e6"} 
                  />
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <span className="text-xs font-semibold uppercase text-primary mb-1">{post.category}</span>
                  <CardTitle className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                    <Link to={`/blog/${post._id}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-3 flex-grow">
                    {post.content.substring(0, 150)}...
                  </CardDescription>
                  <div className="text-xs text-muted-foreground">
                    <span>Bởi {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Anonymous'}</span> | <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/blog/${post._id}`}>Đọc Thêm</Link>
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
          <img alt="No posts found" className="mx-auto h-40 w-40 mb-4 text-muted-foreground" src="https://images.unsplash.com/photo-1504983875-d3b163aba9e6" />
          <p className="text-xl text-muted-foreground">Không tìm thấy bài viết nào.</p>
        </motion.div>
      )}

      {!user?.isPremium && (
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
              <Shield className="mr-2 h-4 w-4" /> Nâng Cấp VIP Ngay
            </Link>
          </Button>
        </motion.div>
      )}
      {!user && (
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