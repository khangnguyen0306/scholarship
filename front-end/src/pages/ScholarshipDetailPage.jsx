import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, DollarSign, MapPin, CalendarDays, User, Mail, FileText, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with API call
const mockScholarshipsData = {
  's1': { id: 's1', name: 'Học bổng Toàn phần VinUniversity', university: 'VinUniversity', universityId: 'vinuni', amount: 'Toàn phần học phí và sinh hoạt phí', field: 'Tất cả các ngành tại VinUniversity', location: 'Hà Nội, Việt Nam', deadline: '2025-12-31', description: 'Học bổng danh giá nhất của VinUniversity, dành cho những ứng viên xuất sắc với thành tích học tập vượt trội, tiềm năng lãnh đạo và đóng góp cho cộng đồng.', requirements: ['GPA 3.8+/4.0', 'IELTS 7.5+ hoặc tương đương', 'Bài luận xuất sắc', 'Thư giới thiệu', 'Hoạt động ngoại khóa nổi bật'], benefits: ['Toàn bộ học phí', 'Trợ cấp sinh hoạt hàng tháng', 'Vé máy bay khứ hồi (nếu là sinh viên quốc tế)', 'Cơ hội thực tập tại Vingroup'], howToApply: 'Nộp hồ sơ trực tuyến qua cổng tuyển sinh của VinUniversity. Vòng phỏng vấn sẽ được tổ chức cho các ứng viên tiềm năng.', requiresVipToApply: true },
  's1_1': { id: 's1_1', name: 'Học bổng Tài năng Kỹ thuật HUST', university: 'Đại học Bách Khoa Hà Nội', universityId: '1', amount: '50% - 100% học phí', field: 'Kỹ thuật', location: 'Hà Nội, Việt Nam', deadline: '2025-09-30', description: 'Dành cho sinh viên có thành tích xuất sắc trong lĩnh vực kỹ thuật, khuyến khích tài năng trẻ phát triển.', requirements: ['Điểm thi THPT Quốc Gia cao', 'Giải thưởng học sinh giỏi cấp tỉnh/thành phố trở lên'], benefits: ['Giảm học phí', 'Ưu tiên tham gia các dự án nghiên cứu'], howToApply: 'Nộp hồ sơ theo hướng dẫn của phòng Công tác Sinh viên.', requiresVipToApply: false },
  's1_2': { id: 's1_2', name: 'Học bổng Nghiên cứu Khoa học HUST', university: 'Đại học Bách Khoa Hà Nội', universityId: '1', amount: 'Hỗ trợ kinh phí dự án', field: 'Nghiên cứu', location: 'Hà Nội, Việt Nam', deadline: '2025-10-15', description: 'Hỗ trợ sinh viên thực hiện các đề tài nghiên cứu khoa học có tính sáng tạo và ứng dụng cao.', requirements: ['Đề cương nghiên cứu chi tiết', 'Có giảng viên hướng dẫn'], benefits: ['Kinh phí thực hiện đề tài', 'Công bố bài báo khoa học'], howToApply: 'Nộp đề cương cho Khoa/Viện chuyên ngành.', requiresVipToApply: false },
   's2_1': { id: 's2_1', name: 'Học bổng Ươm mầm Tài năng VNU-HCM', university: 'Đại học Quốc Gia TP.HCM', universityId: '2', amount: 'Toàn phần', field: 'Nhiều ngành', location: 'TP.HCM', deadline: '2025-08-31', description: 'Học bổng danh giá của VNU-HCM nhằm thu hút và bồi dưỡng những sinh viên có tố chất và thành tích học tập xuất sắc.', requirements: ['Học sinh giỏi quốc gia hoặc thủ khoa đầu vào các trường thành viên', 'Bài luận thể hiện khát vọng cống hiến'], benefits: ['Miễn học phí toàn khóa', 'Sinh hoạt phí hàng tháng', 'Tham gia các chương trình phát triển kỹ năng đặc biệt'], howToApply: 'Theo dõi thông báo tuyển sinh của VNU-HCM và các trường thành viên.', requiresVipToApply: true },
};


const ScholarshipDetailPage = () => {
  const { scholarshipId } = useParams();
  const scholarship = mockScholarshipsData[scholarshipId];
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', essay: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form if user is logged in - MUST be at top level
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [isAuthenticated, user]);

  if (!scholarship) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Không tìm thấy thông tin học bổng</h1>
        <Button asChild className="mt-4">
          <Link to="/scholarships">Quay lại danh sách học bổng</Link>
        </Button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({ title: "Lỗi", description: "Bạn cần đăng nhập để nộp đơn.", variant: "destructive" });
      navigate('/login', { state: { from: `/scholarships/${scholarshipId}` } });
      return;
    }
    if (scholarship.requiresVipToApply && !user.isVip) {
        toast({ 
            title: "Yêu Cầu Tài Khoản VIP", 
            description: "Học bổng này yêu cầu tài khoản VIP để nộp đơn. Vui lòng nâng cấp.", 
            variant: "destructive",
            action: <Button onClick={() => navigate('/vip-subscription')}>Nâng Cấp Ngay</Button>
        });
        return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Nộp đơn thành công!",
      description: `Đơn xin học bổng "${scholarship.name}" của bạn đã được gửi.`,
      action: <CheckCircle className="text-green-500" />,
    });
    // Reset form, prefill if user logged in (already handled by useEffect)
    setFormData(prev => ({...prev, essay: ''})); 
    setIsSubmitting(false);
  };
  

  return (
    <div className="container mx-auto py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="outline" asChild className="mb-6">
          <Link to="/scholarships">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Link>
        </Button>

        <Card className="overflow-hidden glass-card shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              {scholarship.name}
            </motion.h1>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg"
            >
              Cung cấp bởi: <Link to={`/schools/${scholarship.universityId}`} className="hover:underline font-semibold">{scholarship.university}</Link>
            </motion.p>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
                <TabsTrigger value="details">Chi Tiết Học Bổng</TabsTrigger>
                <TabsTrigger value="requirements">Yêu Cầu</TabsTrigger>
                <TabsTrigger value="apply">Nộp Đơn</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className="space-y-6">
                    <InfoItem icon={<DollarSign />} label="Giá trị" value={scholarship.amount} />
                    <InfoItem icon={<BookOpen />} label="Lĩnh vực" value={scholarship.field} />
                    <InfoItem icon={<MapPin />} label="Địa điểm" value={scholarship.location} />
                    <InfoItem icon={<CalendarDays />} label="Hạn nộp đơn" value={new Date(scholarship.deadline).toLocaleDateString('vi-VN')} className="text-destructive font-semibold" />
                    
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Mô tả chi tiết</h3>
                      <p className="text-muted-foreground leading-relaxed">{scholarship.description}</p>
                    </div>
                    {scholarship.benefits && (
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">Quyền lợi</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          {scholarship.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                        </ul>
                      </div>
                    )}
                     <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">Cách thức ứng tuyển</h3>
                        <p className="text-muted-foreground leading-relaxed">{scholarship.howToApply}</p>
                      </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="requirements">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <h3 className="text-xl font-semibold text-primary mb-3">Điều kiện ứng tuyển</h3>
                  {scholarship.requirements && scholarship.requirements.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {scholarship.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Chưa có thông tin yêu cầu cụ thể.</p>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="apply">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  {!isAuthenticated ? (
                     <Card className="border-destructive bg-destructive/10 p-6 text-center">
                      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                      <CardTitle className="text-destructive">Bạn cần đăng nhập</CardTitle>
                      <CardDescription className="text-destructive/80 mt-2 mb-4">
                        Vui lòng đăng nhập hoặc đăng ký tài khoản để có thể nộp đơn xin học bổng này.
                      </CardDescription>
                      <div className="flex gap-4 justify-center">
                        <Button asChild>
                          <Link to="/login" state={{ from: `/scholarships/${scholarshipId}` }}>Đăng Nhập</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/register">Đăng Ký</Link>
                        </Button>
                      </div>
                    </Card>
                  ) : scholarship.requiresVipToApply && !user.isVip ? (
                      <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-6 text-center">
                        <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <CardTitle className="text-yellow-700 dark:text-yellow-400">Yêu Cầu Tài Khoản VIP</CardTitle>
                        <CardDescription className="text-yellow-600 dark:text-yellow-500 mt-2 mb-4">
                          Học bổng này chỉ dành cho thành viên VIP. Nâng cấp tài khoản để nộp đơn và nhận nhiều đặc quyền khác!
                        </CardDescription>
                        <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          <Link to="/vip-subscription">Nâng Cấp VIP Ngay</Link>
                        </Button>
                      </Card>
                  ) : (
                      <form onSubmit={handleSubmitApplication} className="space-y-6">
                        <h3 className="text-xl font-semibold text-primary mb-3">Form Đăng Ký Học Bổng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Họ và tên</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input id="name" placeholder="Nguyễn Văn A" value={formData.name} onChange={handleInputChange} required className="pl-10" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input id="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} required className="pl-10" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="essay">Bài luận (nếu có)</Label>
                          <div className="relative">
                             <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Textarea id="essay" placeholder="Viết bài luận của bạn tại đây..." value={formData.essay} onChange={handleInputChange} rows={8} className="pl-10" />
                          </div>
                        </div>
                        <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90" disabled={isSubmitting}>
                          {isSubmitting ? 'Đang gửi...' : 'Nộp Đơn Ngay'}
                        </Button>
                      </form>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, className = "text-muted-foreground" }) => (
  <div className="flex items-start">
    <span className="text-primary mr-3 mt-1 flex-shrink-0">{React.cloneElement(icon, { className: "h-5 w-5" })}</span>
    <div>
      <p className="font-semibold text-foreground">{label}</p>
      <p className={className}>{value}</p>
    </div>
  </div>
);

export default ScholarshipDetailPage;