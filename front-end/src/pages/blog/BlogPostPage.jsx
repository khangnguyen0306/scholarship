import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetBlogByIdQuery } from '@/services/BlogAPi';

const BlogPostPage = () => {
  const { postId } = useParams();
  const { data: response, isLoading, error } = useGetBlogByIdQuery(postId);
  const post = response?.data;

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
        <Button variant="outline" asChild className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Blog
          </Link>
        </Button>

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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {post.title}
              </h1>
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
              <div className="whitespace-pre-wrap">{post.content}</div>
            </article>

            {post.tags && post.tags.length > 0 && (
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
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.map(comment => (
                    <div key={comment._id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author?.profileImage} alt={comment.author?.firstName} />
                          <AvatarFallback>{comment.author?.firstName?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{comment.author?.firstName} {comment.author?.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
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