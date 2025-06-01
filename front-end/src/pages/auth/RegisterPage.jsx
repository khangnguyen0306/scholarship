import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, GraduationCap, Languages } from 'lucide-react';
import { useRegisterMentorMutation, useRegisterUserMutation } from '../../services/AuthAPI';

const RegisterPage = () => {
  // State cho student
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State cho mentor
  const [mentorFirstName, setMentorFirstName] = useState('');
  const [mentorLastName, setMentorLastName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorPassword, setMentorPassword] = useState('');
  const [mentorConfirmPassword, setMentorConfirmPassword] = useState('');
  const [mentorMajor, setMentorMajor] = useState('');
  const [mentorExperience, setMentorExperience] = useState('');
  const [mentorBio, setMentorBio] = useState('');
  const [mentorPhone, setMentorPhone] = useState('');
  const [mentorDegrees, setMentorDegrees] = useState([{ name: '', institution: '', year: '' }]);
  const [mentorLanguages, setMentorLanguages] = useState(['']);
  const [mentorShowPassword, setMentorShowPassword] = useState(false);
  const [mentorShowConfirmPassword, setMentorShowConfirmPassword] = useState(false);
  const [mentorLoading, setMentorLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [registerUser] = useRegisterUserMutation();
  const [registerMentor] = useRegisterMentorMutation(); // Sẽ thay bằng mutation riêng nếu có

  // Xử lý đăng ký student giữ nguyên
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Lỗi đăng ký", description: "Mật khẩu xác nhận không khớp.", variant: "destructive" });
      return;
    }
    try {
      setIsLoading(true);
      const response = await registerUser({ firstName, lastName, email, password });
      if (response.error) {
        toast({ title: "Đăng ký thất bại!", description: response.error.data.error.message, variant: "destructive" });
      } else {
        toast({ title: "Đăng ký thành công!", description: `Chào mừng ${firstName} ${lastName}! Tài khoản của bạn đã được tạo.`, className: "bg-green-500 text-white" });
        navigate('/login');
      }
    } catch (error) {
      toast({ title: "Đăng ký thất bại!", description: "Vui lòng kiểm tra lại thông tin đăng ký.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  // Xử lý đăng ký mentor
  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    // Validate các trường bắt buộc
    if (!mentorFirstName || !mentorLastName || !mentorEmail || !mentorPassword || !mentorConfirmPassword) {
      toast({ title: "Lỗi đăng ký", description: "Vui lòng điền đầy đủ thông tin bắt buộc.", variant: "destructive" });
      return;
    }
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mentorEmail)) {
      toast({ title: "Lỗi đăng ký", description: "Email không hợp lệ.", variant: "destructive" });
      return;
    }
    // Validate password
    if (mentorPassword.length < 8) {
      toast({ title: "Lỗi đăng ký", description: "Mật khẩu phải có ít nhất 8 ký tự.", variant: "destructive" });
      return;
    }
    if (mentorPassword !== mentorConfirmPassword) {
      toast({ title: "Lỗi đăng ký", description: "Mật khẩu xác nhận không khớp.", variant: "destructive" });
      return;
    }
    // Validate phone nếu có
    if (mentorPhone && (!/^\d{8,}$/.test(mentorPhone))) {
      toast({ title: "Lỗi đăng ký", description: "Số điện thoại không hợp lệ (chỉ nhập số, tối thiểu 8 ký tự).", variant: "destructive" });
      return;
    }
    // Validate degrees
    for (let i = 0; i < mentorDegrees.length; i++) {
      const d = mentorDegrees[i];
      if ((d.year && (isNaN(Number(d.year)) || Number(d.year) < 1900 || Number(d.year) > 2100))) {
        toast({ title: "Lỗi đăng ký", description: `Năm bằng cấp ở dòng ${i + 1} không hợp lệ (1900-2100).`, variant: "destructive" });
        return;
      }
    }
    // Validate languages
    for (let i = 0; i < mentorLanguages.length; i++) {
      if (mentorLanguages[i] && mentorLanguages[i].trim() === '') {
        toast({ title: "Lỗi đăng ký", description: `Ngôn ngữ ở dòng ${i + 1} không được để trống nếu đã nhập.`, variant: "destructive" });
        return;
      }
    }
    try {
      setMentorLoading(true);
      const degrees = mentorDegrees.filter(d => d.name || d.institution || d.year);
      const languages = mentorLanguages.filter(l => l);
      const mentorProfile = { major: mentorMajor, experience: mentorExperience, bio: mentorBio, phone: mentorPhone, degrees, languages };
      // Gọi mutation đăng ký mentor (cần tạo mutation riêng cho mentor)
      // console.log(mentorProfile);
      const response = await registerMentor({
        firstName: mentorFirstName,
        lastName: mentorLastName,
        email: mentorEmail,
        password: mentorPassword,
        mentorProfile
      });
      console.log(response);
      if (response.error) {
        toast({ title: "Đăng ký mentor thất bại!", description: response.error.data.error.message, variant: "destructive" });
      } else {
        toast({ title: "Đăng ký mentor thành công!", description: `Chào mừng ${mentorFirstName} ${mentorLastName}! Hồ sơ của bạn sẽ được admin duyệt trước khi sử dụng.`, className: "bg-green-500 text-white" });
        navigate('/login');
      }
    } catch (error) {
      toast({ title: "Đăng ký mentor thất bại!", description: "Vui lòng kiểm tra lại thông tin đăng ký.", variant: "destructive" });
    }
    setMentorLoading(false);
  };

  // Thêm/xóa degree
  const handleAddDegree = () => setMentorDegrees([...mentorDegrees, { name: '', institution: '', year: '' }]);
  const handleRemoveDegree = (idx) => setMentorDegrees(mentorDegrees.filter((_, i) => i !== idx));
  const handleDegreeChange = (idx, field, value) => {
    const newDegrees = [...mentorDegrees];
    newDegrees[idx][field] = value;
    setMentorDegrees(newDegrees);
  };
  // Thêm/xóa language
  const handleAddLanguage = () => setMentorLanguages([...mentorLanguages, '']);
  const handleRemoveLanguage = (idx) => setMentorLanguages(mentorLanguages.filter((_, i) => i !== idx));
  const handleLanguageChange = (idx, value) => {
    const newLanguages = [...mentorLanguages];
    newLanguages[idx] = value;
    setMentorLanguages(newLanguages);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-[40vw] shadow-2xl glass-card">
          <CardHeader className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }} className="mx-auto mb-4 p-3 bg-primary/20 rounded-full inline-block">
              <UserPlus className="h-10 w-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gradient-primary">Tạo Tài Khoản</CardTitle>
            <CardDescription>Tham gia ScholarSeeker và bắt đầu hành trình tìm kiếm học bổng của bạn!</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="w-full flex mb-4">
                <TabsTrigger value="student" className="w-1/2">Đăng ký học sinh</TabsTrigger>
                <TabsTrigger value="mentor" className="w-1/2">Đăng ký mentor</TabsTrigger>
              </TabsList>
              <TabsContent value="student">
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
              </TabsContent>
              <TabsContent value="mentor">
                <form onSubmit={handleMentorSubmit} className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="relative w-1/2">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="mentorFirstName" type="text" placeholder="Họ" value={mentorFirstName} onChange={e => setMentorFirstName(e.target.value)} required className="pl-10" />
                    </div>
                    <div className="relative w-1/2">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="mentorLastName" type="text" placeholder="Tên" value={mentorLastName} onChange={e => setMentorLastName(e.target.value)} required className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="mentorEmail" type="email" placeholder="nhapemail@example.com" value={mentorEmail} onChange={e => setMentorEmail(e.target.value)} required className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorPassword">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="mentorPassword" type={mentorShowPassword ? "text" : "password"} placeholder="Ít nhất 8 ký tự" value={mentorPassword} onChange={e => setMentorPassword(e.target.value)} required className="pl-10 pr-10" />
                      <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" onClick={() => setMentorShowPassword(prev => !prev)} tabIndex={-1}>
                        {mentorShowPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorConfirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="mentorConfirmPassword" type={mentorShowConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" value={mentorConfirmPassword} onChange={e => setMentorConfirmPassword(e.target.value)} required className="pl-10 pr-10" />
                      <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" onClick={() => setMentorShowConfirmPassword(prev => !prev)} tabIndex={-1}>
                        {mentorShowConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorMajor">Chuyên ngành</Label>
                    <Input id="mentorMajor" type="text" placeholder="Chuyên ngành" value={mentorMajor} onChange={e => setMentorMajor(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorExperience">Kinh nghiệm</Label>
                    <Input id="mentorExperience" type="text" placeholder="Kinh nghiệm" value={mentorExperience} onChange={e => setMentorExperience(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorBio">Giới thiệu bản thân</Label>
                    <Input id="mentorBio" type="text" placeholder="Giới thiệu bản thân" value={mentorBio} onChange={e => setMentorBio(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorPhone">Số điện thoại</Label>
                    <Input id="mentorPhone" type="text" placeholder="Số điện thoại" value={mentorPhone} onChange={e => setMentorPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bằng cấp</Label>
                    {mentorDegrees.map((degree, idx) => (
                      <div key={idx} className="flex space-x-2 mb-2">
                        <Input placeholder="Tên bằng cấp" value={degree.name} onChange={e => handleDegreeChange(idx, 'name', e.target.value)} className="w-1/3" />
                        <Input placeholder="Trường/Đơn vị cấp" value={degree.institution} onChange={e => handleDegreeChange(idx, 'institution', e.target.value)} className="w-1/3" />
                        <Input placeholder="Năm" value={degree.year} onChange={e => handleDegreeChange(idx, 'year', e.target.value)} className="w-1/4" />
                        <Button type="button" variant="destructive" onClick={() => handleRemoveDegree(idx)} disabled={mentorDegrees.length === 1}>X</Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={handleAddDegree}>+ Thêm bằng cấp</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Ngôn ngữ sử dụng</Label>
                    {mentorLanguages.map((lang, idx) => (
                      <div key={idx} className="flex space-x-2 mb-2">
                        <Input placeholder="Ngôn ngữ" value={lang} onChange={e => handleLanguageChange(idx, e.target.value)} className="w-2/3" />
                        <Button type="button" variant="destructive" onClick={() => handleRemoveLanguage(idx)} disabled={mentorLanguages.length === 1}>X</Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={handleAddLanguage}>+ Thêm ngôn ngữ</Button>
                  </div>
                  <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300" disabled={mentorLoading}>
                    {mentorLoading ? 'Đang xử lý...' : 'Đăng ký mentor'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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
