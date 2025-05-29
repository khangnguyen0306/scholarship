import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLoginUserMutation } from '../../services/AuthAPI';
import { useDispatch } from 'react-redux';
import { setUser, setToken, setAvatar } from '../../slices/authSlice';
import helloIcon from '../../../public/images/av1.svg'
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading: loadingLogin }] = useLoginUserMutation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const navigateByRole = {
    'student': '/',
    'admin': '/admin',
  }


  // useEffect(() => {

  //   const savedEmail = Cookies.get("rememberEmail");
  //   const savedPassword = Cookies.get("rememberPassword");

  //   if (savedEmail && savedPassword) {
  //     form.setFieldsValue({
  //       login_identifier: savedEmail,
  //       password: savedPassword,
  //     });
  //     setRememberMe(true);
  //   }
  // }, [form]);


  const handleLoginSuccess = (data) => {
    console.log(data)
    switch (data.role) {
      case "admin":
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 50);
        break;
      case "student":
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 50);
        break;
      default:
        break;
    }

    //   const avatar = data.data.avatar; // check for change
    dispatch(setUser(data));
    dispatch(setToken(data.token));
    dispatch(setAvatar(data.profileImage))
    // remember me
    // if (rememberMe) {
    //   Cookies.set("rememberEmail", email, { expires: 1 });
    //   Cookies.set("rememberPassword", password, { expires: 1 });
    // }

    toast({
      title: (
        <div className="flex items-center justify-between w-full">
          <img
            src={data.profileImage || helloIcon}
            alt="avatar"
            className="w-10 h-10 rounded-full border object-cover shadow"
          />
          <div className='ml-6 mt-3'>
            <p className="font-bold text-md text-white">Chào mừng</p>
            <p className="font-bold text-lg text-white">{data.firstName} {data.lastName}</p>
          </div>
        </div>
      ),
      description: "Đăng nhập thành công!",
      duration: 3000,
      // Nếu thư viện toast của bạn hỗ trợ, thêm className hoặc position:
      className: "top-4 right-4 fixed z-[9999] max-w-xs bg-green-400 text-white border border-primary/20 shadow-lg",
      // Hoặc dùng position: "top-right" nếu thư viện hỗ trợ
    });
  };

  const handleLoginFailure = (error) => {
    toast({
      title: "Lỗi đăng nhập",
      description: error.error.message,
      className: "top-4 right-4 fixed z-[9999] max-w-xs bg-red-400 text-white border border-primary/20 shadow-lg",
      variant: "destructive",
    });

  };

  const handleSubmit = async (e) => {
    console.log(email, password)
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await loginUser({ email: email, password: password });
      // console.log(result)
      if (result.data) {
        handleLoginSuccess(result.data.data);

      } else {
        handleLoginFailure(result.error.data);
      }
    } catch (error) {
      console.log(error)
      // Xử lý lỗi ngoài mong đợi (ví dụ: lỗi mạng)
      toast({
        title: "Lỗi đăng nhập",
        description: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      console.error("Unexpected login error:", error);
    }
    setIsLoading(false);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // Simulate API call
  //   await new Promise(resolve => setTimeout(resolve, 1000));

  //   // Basic validation for demo
  //   if (email === 'user@example.com' && password === 'password') {
  //     login({ id: '1', name: 'Người Dùng Demo', email: email, role: 'user' }); // Add role
  //     toast({
  //       title: "Đăng nhập thành công!",
  //       description: "Chào mừng bạn trở lại.",
  //     });
  //     navigate('/');
  //   } else if (email === 'admin@example.com' && password === 'password') {
  //     login({ id: '2', name: 'Quản Trị Viên', email: email, role: 'admin' }); // Add role
  //     toast({
  //       title: "Đăng nhập quản trị thành công!",
  //       description: "Chào mừng Quản Trị Viên.",
  //     });
  //     navigate('/admin');
  //   }
  //   else {
  //     toast({
  //       title: "Đăng nhập thất bại",
  //       description: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
  //       variant: "destructive",
  //     });
  //   }
  //   setIsLoading(false);
  // };

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
              <LogIn className="h-10 w-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gradient-primary">Đăng Nhập</CardTitle>
            <CardDescription>Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</CardDescription>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
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
              <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300" disabled={isLoading}>
                {loadingLogin ? 'Đang xử lý...' : 'Đăng Nhập'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Button variant="link" asChild className="text-primary p-0 h-auto">
                <Link to="/register">Đăng ký ngay</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
