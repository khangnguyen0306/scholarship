import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useRegisterUserMutation } from '../../services/AuthAPI';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registerUser, { isLoading: loadingRegister }] = useRegisterUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Lỗi đăng ký",
        description: "Mật khẩu xác nhận không khớp.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await registerUser({ firstName, lastName, email, password });
      console.log(response);
      if (response.error) {
        toast({
          title: "Đăng ký thất bại!",
          description: response.error.data.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Đăng ký thành công!",
          description: `Chào mừng ${firstName} ${lastName}! Tài khoản của bạn đã được tạo.`,
          className: "bg-green-500 text-white",
        });
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Đăng ký thất bại!",
        description: "Vui lòng kiểm tra lại thông tin đăng ký.",
        variant: "destructive",
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
              <UserPlus className="h-10 w-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gradient-primary">Tạo Tài Khoản</CardTitle>
            <CardDescription>Tham gia ScholarSeeker và bắt đầu hành trình tìm kiếm học bổng của bạn!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex space-x-2">
                <div className="relative w-1/2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Họ"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative w-1/2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Tên"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ít nhất 8 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
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

export default RegisterPage;
