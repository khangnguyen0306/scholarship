import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, DollarSign, MapPin, CalendarDays, User, Mail, FileText, CheckCircle, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetScholarshipByIdQuery } from '../../services/ScholarshipAPI';
import { useGetScholarshipRequirementsQuery } from '../../services/ScholarshipRequirementAPI';
import Certy from './Certy';
import { useCreateApplicationMutation } from '../../services/ApplicationAPI';

// Mock data - replace with API call
// const mockScholarshipsData = {
//   's1': { id: 's1', name: 'Học bổng Toàn phần VinUniversity', university: 'VinUniversity', universityId: 'vinuni', amount: 'Toàn phần học phí và sinh hoạt phí', field: 'Tất cả các ngành tại VinUniversity', location: 'Hà Nội, Việt Nam', deadline: '2025-12-31', description: 'Học bổng danh giá nhất của VinUniversity, dành cho những ứng viên xuất sắc với thành tích học tập vượt trội, tiềm năng lãnh đạo và đóng góp cho cộng đồng.', requirements: ['GPA 3.8+/4.0', 'IELTS 7.5+ hoặc tương đương', 'Bài luận xuất sắc', 'Thư giới thiệu', 'Hoạt động ngoại khóa nổi bật'], benefits: ['Toàn bộ học phí', 'Trợ cấp sinh hoạt hàng tháng', 'Vé máy bay khứ hồi (nếu là sinh viên quốc tế)', 'Cơ hội thực tập tại Vingroup'], howToApply: 'Nộp hồ sơ trực tuyến qua cổng tuyển sinh của VinUniversity. Vòng phỏng vấn sẽ được tổ chức cho các ứng viên tiềm năng.', requiresVipToApply: true },
//   's1_1': { id: 's1_1', name: 'Học bổng Tài năng Kỹ thuật HUST', university: 'Đại học Bách Khoa Hà Nội', universityId: '1', amount: '50% - 100% học phí', field: 'Kỹ thuật', location: 'Hà Nội, Việt Nam', deadline: '2025-09-30', description: 'Dành cho sinh viên có thành tích xuất sắc trong lĩnh vực kỹ thuật, khuyến khích tài năng trẻ phát triển.', requirements: ['Điểm thi THPT Quốc Gia cao', 'Giải thưởng học sinh giỏi cấp tỉnh/thành phố trở lên'], benefits: ['Giảm học phí', 'Ưu tiên tham gia các dự án nghiên cứu'], howToApply: 'Nộp hồ sơ theo hướng dẫn của phòng Công tác Sinh viên.', requiresVipToApply: false },
//   's1_2': { id: 's1_2', name: 'Học bổng Nghiên cứu Khoa học HUST', university: 'Đại học Bách Khoa Hà Nội', universityId: '1', amount: 'Hỗ trợ kinh phí dự án', field: 'Nghiên cứu', location: 'Hà Nội, Việt Nam', deadline: '2025-10-15', description: 'Hỗ trợ sinh viên thực hiện các đề tài nghiên cứu khoa học có tính sáng tạo và ứng dụng cao.', requirements: ['Đề cương nghiên cứu chi tiết', 'Có giảng viên hướng dẫn'], benefits: ['Kinh phí thực hiện đề tài', 'Công bố bài báo khoa học'], howToApply: 'Nộp đề cương cho Khoa/Viện chuyên ngành.', requiresVipToApply: false },
//   's2_1': { id: 's2_1', name: 'Học bổng Ươm mầm Tài năng VNU-HCM', university: 'Đại học Quốc Gia TP.HCM', universityId: '2', amount: 'Toàn phần', field: 'Nhiều ngành', location: 'TP.HCM', deadline: '2025-08-31', description: 'Học bổng danh giá của VNU-HCM nhằm thu hút và bồi dưỡng những sinh viên có tố chất và thành tích học tập xuất sắc.', requirements: ['Học sinh giỏi quốc gia hoặc thủ khoa đầu vào các trường thành viên', 'Bài luận thể hiện khát vọng cống hiến'], benefits: ['Miễn học phí toàn khóa', 'Sinh hoạt phí hàng tháng', 'Tham gia các chương trình phát triển kỹ năng đặc biệt'], howToApply: 'Theo dõi thông báo tuyển sinh của VNU-HCM và các trường thành viên.', requiresVipToApply: true },
// };


const ScholarshipDetailPage = () => {
  const { scholarshipId } = useParams();
  const { data: scholarship, isLoading, error } = useGetScholarshipByIdQuery(scholarshipId);

  const scholarshipData = scholarship?.data || {};
  const requirementId = scholarshipData?.requirements && scholarshipData.requirements.length > 0 ? scholarshipData.requirements[0] : null;

  const { data: requirementData, isLoading: isLoadingRequirement, error: errorRequirement } =
    useGetScholarshipRequirementsQuery(requirementId, { skip: !requirementId });


  const user = useSelector(selectCurrentUser);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', essay: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState([{ name: '', url: '' }]);
  const [createApplication, { isLoading: isLoadingCreateApplication, error: errorCreateApplication }] = useCreateApplicationMutation();
  // Pre-fill form if user is logged in - MUST be at top level
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.firstName + ' ' + user.lastName || '', email: user.email || '' }));
    }
  }, [user]);

  if (error) {
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

  const handleDocumentChange = (idx, field, value) => {
    setDocuments(docs =>
      docs.map((doc, i) => i === idx ? { ...doc, [field]: value } : doc)
    );
  };

  const handleAddDocument = () => {
    setDocuments(docs => [...docs, { name: '', url: '' }]);
  };

  const handleRemoveDocument = (idx) => {
    setDocuments(docs => docs.filter((_, i) => i !== idx));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Lỗi", description: "Bạn cần đăng nhập để nộp đơn.", variant: "destructive" });
      navigate('/login', { state: { from: `/scholarships/${scholarshipId}` } });
      return;
    }
    if (scholarshipData.requiresVipToApply && !user.isPremium) {
      toast({
        title: "Yêu Cầu Tài Khoản VIP",
        description: "Học bổng này yêu cầu tài khoản VIP để nộp đơn. Vui lòng nâng cấp.",
        variant: "destructive",
        action: <Button onClick={() => navigate('/vip-subscription')}>Nâng Cấp Ngay</Button>
      });
      return;
    }
    setIsSubmitting(true);
    const application = {
      name: formData.name,
      email: formData.email,
      essay: formData.essay,
      documents: documents,
      scholarshipId: scholarshipId
    }
    try {
      const response = await createApplication(application);
      console.log("aaaaa",response);
      if (response.error) {
        toast({
          title: "Lỗi",
          description: `${response.error.data.message}`,
          variant: "destructive",
        });
      } else{
        toast({
        title: "Nộp đơn thành công!",
        description: `Đơn xin học bổng "${scholarshipData.name}" của bạn đã được gửi.`,
        action: <CheckCircle className="text-green-500" />,
      });
      }
     
      setFormData(prev => ({ ...prev, essay: '' }));
      setDocuments([{ name: '', url: '' }]);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi nộp đơn. Vui lòng thử lại.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }


  };


  return (
    isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    ) : (
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
                {
                  <div className="flex items-center gap-2 justify-between" >
                    <div>
                      <p className="text-2xl font-bold">{scholarshipData.name}</p>
                      <p className="text-sm text-gray-200">{scholarshipData.value}</p>
                    </div>
                    <img width={100} height={100} src={scholarshipData.school.logo} alt={scholarshipData.school.name} />
                  </div>
                }
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg"
              >
                Cung cấp bởi: <Link to={`/schools/${scholarshipData.school._id}`} className="hover:underline font-semibold">{scholarshipData.school.name}</Link>
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
                      <InfoItem icon={<DollarSign />} label="Giá trị" value={scholarshipData.value} />
                      <InfoItem icon={<BookOpen />} label="Lĩnh vực" value={scholarshipData.field} />
                      <InfoItem icon={<MapPin />} label="Địa điểm" value={scholarshipData.location} />
                      <InfoItem icon={<CalendarDays />} label="Hạn nộp đơn" value={new Date(scholarshipData.deadline).toLocaleDateString('vi-VN')} className="text-destructive font-semibold" />

                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">Mô tả chi tiết</h3>
                        <p className="text-muted-foreground leading-relaxed">{scholarshipData.description}</p>
                      </div>
                      {scholarship.benefits && (
                        <div>
                          <h3 className="text-xl font-semibold text-primary mb-2">Quyền lợi</h3>
                          <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            {scholarshipData.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                          </ul>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">Cách thức ứng tuyển</h3>
                        <p className="text-muted-foreground leading-relaxed">{scholarshipData.applicationMethod}</p>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="requirements">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h3 className="text-xl font-semibold text-primary mb-3">Yêu cầu học bổng</h3>
                    {!requirementId && <div>Không có yêu cầu nào.</div>}
                    {isLoadingRequirement && <div>Đang tải yêu cầu...</div>}
                    {errorRequirement && <div>Lỗi khi tải yêu cầu.</div>}
                    {requirementData && (
                      <div>
                        <div>GPA {'>='}{requirementData.data.minGPA}</div>
                        {requirementData.data.minCertificateScores.map((certificate, i) => <div key={i}>
                          <Certy id={certificate.certificateType} minScore={certificate.minScore} />
                        </div>)}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="apply">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    {!user ? (
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
                    ) : !user.isPremium ? (
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
                        {/* Tài liệu bổ sung */}
                        <div className="space-y-2">
                          <Label>Tài liệu bổ sung (có thể thêm nhiều)</Label>
                          {documents.map((doc, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                              <Input
                                placeholder="Tên tài liệu (VD: Bảng điểm, Chứng chỉ IELTS...)"
                                value={doc.name}
                                onChange={e => handleDocumentChange(idx, 'name', e.target.value)}
                                className="flex-1"
                                required
                              />
                              <Input
                                placeholder="Đường dẫn tài liệu (Google Drive, Dropbox...)"
                                value={doc.url}
                                onChange={e => handleDocumentChange(idx, 'url', e.target.value)}
                                className="flex-1"
                                required
                              />
                              {documents.length > 1 && (
                                <Button type="button" variant="destructive" onClick={() => handleRemoveDocument(idx)}>
                                  Xóa
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button type="button" variant="outline" onClick={handleAddDocument}>
                            Thêm tài liệu
                          </Button>
                          <div className="text-xs text-yellow-600 mt-1">
                            * Đường dẫn tài liệu phải được mở public (ai có link đều xem được).
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
    )
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