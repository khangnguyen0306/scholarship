import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCircle, CalendarDays, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data - replace with API call
const mockPostsData = {
  'post1': { 
    id: 'post1', 
    title: 'Bí quyết viết luận xin học bổng ấn tượng', 
    author: 'Nguyễn Lan Anh', 
    authorAvatar: 'author_lan_anh.jpg',
    date: '2025-05-15', 
    category: 'Kỹ năng Viết Luận',
    tags: ['học bổng', 'viết luận', 'essay', 'du học'],
    image: 'blog_essay_writing_large.jpg', 
    content: `
      <p class="mb-4 text-lg leading-relaxed">Luận văn là một trong những yếu tố quan trọng nhất quyết định sự thành công của hồ sơ xin học bổng. Một bài luận ấn tượng không chỉ thể hiện khả năng viết lách mà còn phản ánh con người, đam mê và mục tiêu của bạn. Dưới đây là những bí quyết giúp bạn chinh phục thử thách này.</p>
      
      <h2 class="text-2xl font-semibold text-primary mt-6 mb-3">1. Hiểu rõ đề bài và mục đích của học bổng</h2>
      <p class="mb-4 leading-relaxed">Trước khi đặt bút viết, hãy đọc kỹ yêu cầu của đề bài luận và tìm hiểu về giá trị cốt lõi, mục tiêu của chương trình học bổng. Bài luận của bạn cần phải trả lời đúng trọng tâm câu hỏi và thể hiện sự phù hợp của bạn với học bổng đó.</p>
      
      <img  alt="Người đang suy nghĩ về ý tưởng viết luận" class="my-6 rounded-lg shadow-md w-full max-h-96 object-cover" src="https://images.unsplash.com/photo-1580974852861-c381510bc98a" />

      <h2 class="text-2xl font-semibold text-primary mt-6 mb-3">2. Kể câu chuyện của riêng bạn</h2>
      <p class="mb-4 leading-relaxed">Đừng cố gắng trở thành một người khác. Hãy là chính mình và kể câu chuyện độc đáo của bạn. Những trải nghiệm cá nhân, những thử thách bạn đã vượt qua, những thành tựu bạn đạt được – tất cả đều có thể trở thành chất liệu quý giá cho bài luận. Hãy cho hội đồng tuyển sinh thấy được con người thật của bạn.</p>
      
      <h2 class="text-2xl font-semibold text-primary mt-6 mb-3">3. Cấu trúc bài luận rõ ràng, mạch lạc</h2>
      <p class="mb-4 leading-relaxed">Một bài luận tốt cần có cấu trúc logic với mở bài thu hút, thân bài phát triển ý tưởng một cách thuyết phục và kết bài đọng lại ấn tượng. Sử dụng các đoạn văn ngắn, câu văn rõ nghĩa và các từ nối hợp lý để bài viết trôi chảy hơn.</p>
      
      <ul class="list-disc list-inside mb-4 pl-4 space-y-1 leading-relaxed">
        <li><strong>Mở bài:</strong> Giới thiệu chủ đề và luận điểm chính một cách hấp dẫn.</li>
        <li><strong>Thân bài:</strong> Phát triển các ý chính, đưa ra dẫn chứng, ví dụ cụ thể. Mỗi đoạn nên tập trung vào một ý.</li>
        <li><strong>Kết bài:</strong> Tóm tắt lại những điểm chính và khẳng định lại mục tiêu, khát vọng của bạn.</li>
      </ul>

      <h2 class="text-2xl font-semibold text-primary mt-6 mb-3">4. Chú trọng ngôn ngữ và văn phong</h2>
      <p class="mb-4 leading-relaxed">Sử dụng ngôn ngữ trang trọng, lịch sự nhưng vẫn tự nhiên và chân thành. Tránh dùng từ ngữ sáo rỗng, văn nói hoặc viết tắt. Hãy thể hiện sự tự tin và nhiệt huyết của bạn qua từng câu chữ.</p>

      <h2 class="text-2xl font-semibold text-primary mt-6 mb-3">5. Đọc lại và chỉnh sửa kỹ lưỡng</h2>
      <p class="mb-4 leading-relaxed">Sau khi hoàn thành bản nháp, hãy dành thời gian đọc lại và chỉnh sửa cẩn thận. Kiểm tra lỗi chính tả, ngữ pháp, dấu câu và sự mạch lạc của bài viết. Bạn cũng có thể nhờ thầy cô, bạn bè hoặc người có kinh nghiệm đọc góp ý để bài luận hoàn thiện hơn.</p>
      
      <p class="mt-6 text-lg font-semibold">Chúc bạn thành công trên hành trình chinh phục học bổng mơ ước!</p>
    `
  },
  // Add more posts
};


const BlogPostPage = () => {
  const { postId } = useParams();
  const post = mockPostsData[postId];

  if (!post) {
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
        <Button variant="outline" asChild className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Blog
          </Link>
        </Button>

        <Card className="overflow-hidden glass-card shadow-xl">
          <CardHeader className="p-0 relative">
            <img  
              alt={post.title} 
              class="w-full h-64 md:h-96 object-cover"
             src="https://images.unsplash.com/photo-1688649102455-5e8d7e3fde0f" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-sm font-semibold uppercase text-accent mb-2"
              >
                {post.category}
              </motion.span>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-white shadow-text"
              >
                {post.title}
              </motion.h1>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={`https://avatar.vercel.sh/${post.author}.png`} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <article 
              className="prose dark:prose-invert max-w-none prose-lg prose-img:rounded-xl prose-headings:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
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
          <CardFooter>
            {/* Placeholder for comments or related posts */}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BlogPostPage;