
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, KeyRound } from 'lucide-react';
import { useForgotPasswordMutation } from '../../services/AuthAPI';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [forgotPassword, { isLoading: loadingForgotPassword }] = useForgotPasswordMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    try {
      const result = await forgotPassword(email);
      console.log(result)
      if (result.data) {
        toast({
          title: "Yêu cầu đã được gửi",
          description: `Nếu email ${email} tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.`,
        });
        setEmail('');
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Lỗi",
        description: error.error.message,
      });
    }

    setIsLoading(false);

  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl glass-card">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="mx-auto mb-4 p-3 bg-primary/20 rounded-full inline-block"
            >
              <KeyRound className="h-10 w-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gradient-primary">Quên Mật Khẩu</CardTitle>
            <CardDescription>Đừng lo lắng! Nhập email của bạn để đặt lại mật khẩu.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nhapemail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300" disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Nhớ mật khẩu rồi?{' '}
              <Button variant="link" asChild className="text-primary p-0 h-auto">
                <Link to="/login">Đăng nhập</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
