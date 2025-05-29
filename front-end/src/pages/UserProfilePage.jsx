import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3, Shield, Award, FileText, Gift, BarChartHorizontalBig } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { selectCurrentUser } from '../slices/authSlice';
import { useSelector } from 'react-redux';

// Mock data for submitted applications and recommended scholarships
const mockSubmittedApplications = [
  { id: 'app1', scholarshipName: 'Học bổng Toàn phần VinUniversity', status: 'Đang xét duyệt', date: '2025-03-15', link: '/scholarships/s1' },
  { id: 'app2', scholarshipName: 'Học bổng Tài năng RMIT', status: 'Đã nộp', date: '2025-02-20', link: '/scholarships/s2_1' }, // Assuming s2_1 is RMIT
];

const mockRecommendedScholarships = [
    { id: 'rec1', name: 'Học bổng Phát triển Bền vững Fulbright', university: 'Fulbright University Vietnam', matchPercentage: 92, link: '/scholarships/s_fulbright_dev' },
    { id: 'rec2', name: 'Học bổng Lãnh đạo Trẻ AIT', university: 'Asian Institute of Technology', matchPercentage: 88, link: '/scholarships/s_ait_leader' },
    { id: 'rec3', name: 'Học bổng Sáng tạo Swinburne', university: 'Swinburne University of Technology Vietnam', matchPercentage: 85, link: '/scholarships/s_swin_creative' },
];


const UserProfilePage = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatarUrl: '',
    // Placeholder for academic info
    grades: {
      math_10: '', physics_10: '', chemistry_10: '', literature_10: '', english_10: '',
      math_11: '', physics_11: '', chemistry_11: '', literature_11: '', english_11: '',
      math_12: '', physics_12: '', chemistry_12: '', literature_12: '', english_12: '',
    },
    certificates: { sat: '', ielts: '', toeic: '' }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
        grades: user.grades || profileData.grades,
        certificates: user.certificates || profileData.certificates,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">Vui lòng đăng nhập để xem trang hồ sơ.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Đăng Nhập</Link>
        </Button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      grades: { ...prev.grades, [name]: value }
    }));
  };
  
  const handleCertificateChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      certificates: { ...prev.certificates, [name]: value }
    }));
  };

  const handleSaveProfile = () => {
    updateUser(profileData); // Update user in AuthContext and localStorage
    setIsEditing(false);
    toast({ title: "Hồ sơ đã được cập nhật!" });
  };
  
  const academicSubjects = {
    'Lớp 10': ['math_10', 'physics_10', 'chemistry_10', 'literature_10', 'english_10'],
    'Lớp 11': ['math_11', 'physics_11', 'chemistry_11', 'literature_11', 'english_11'],
    'Lớp 12': ['math_12', 'physics_12', 'chemistry_12', 'literature_12', 'english_12'],
  };
  const subjectLabels = {
    math: 'Toán', physics: 'Lý', chemistry: 'Hóa', literature: 'Văn', english: 'Anh'
  };
  const certificateLabels = {
    sat: 'SAT', ielts: 'IELTS', toeic: 'TOEIC'
  };


  return (
    <div className="container mx-auto py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden glass-card">
          <div className="h-40 bg-gradient-to-r from-primary to-accent" />
          <CardHeader className="flex flex-col items-center text-center -mt-16">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg mb-4">
              <AvatarImage src={profileData.avatarUrl || `https://avatar.vercel.sh/${profileData.email}.png`} alt={profileData.name} />
              <AvatarFallback className="text-4xl">{profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            {isEditing ? (
              <Input name="name" value={profileData.name} onChange={handleInputChange} className="text-3xl font-bold text-center mb-2 w-1/2 mx-auto" />
            ) : (
              <CardTitle className="text-3xl font-bold">{profileData.name}</CardTitle>
            )}
            <CardDescription className="text-lg text-muted-foreground">{profileData.email}</CardDescription>
            {user.isVip && (
              <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-yellow-900">
                <Shield className="h-4 w-4 mr-1" /> Thành viên VIP
              </span>
            )}
          </CardHeader>
          <CardContent className="text-center pb-6">
            {isEditing ? (
              <div className="flex gap-2 justify-center">
                <Button onClick={handleSaveProfile}>Lưu thay đổi</Button>
                <Button variant="outline" onClick={() => { setIsEditing(false); setProfileData(user);}}>Hủy</Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Chỉnh sửa hồ sơ
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {isEditing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <BarChartHorizontalBig className="mr-3 h-6 w-6 text-primary" /> Thông Tin Học Vấn & Chứng Chỉ
              </CardTitle>
              <CardDescription>Cập nhật điểm số và chứng chỉ để nhận đề xuất học bổng chính xác hơn (chỉ dành cho VIP).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Bảng điểm (Lớp 10-12)</h3>
                {Object.entries(academicSubjects).map(([gradeLevel, subjects]) => (
                  <div key={gradeLevel} className="mb-4 p-4 border rounded-md">
                    <h4 className="font-medium mb-2 text-primary">{gradeLevel}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {subjects.map(subjectKey => (
                        <div key={subjectKey} className="space-y-1">
                          <Label htmlFor={subjectKey}>{subjectLabels[subjectKey.split('_')[0]]}</Label>
                          <Input type="number" id={subjectKey} name={subjectKey} placeholder="Điểm" value={profileData.grades[subjectKey] || ''} onChange={handleGradeChange} min="0" max="10" step="0.1" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Chứng chỉ khác</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(certificateLabels).map(([certKey, certLabel]) => (
                     <div key={certKey} className="space-y-1">
                      <Label htmlFor={certKey}>{certLabel}</Label>
                      <Input type="text" id={certKey} name={certKey} placeholder="Điểm/Chứng nhận" value={profileData.certificates[certKey] || ''} onChange={handleCertificateChange} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {user.isVip && !isEditing && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Gift className="mr-3 h-6 w-6 text-primary" /> Đề Xuất Học Bổng Dành Riêng Cho Bạn
              </CardTitle>
              <CardDescription>Dựa trên hồ sơ và điểm số của bạn, đây là những học bổng có thể phù hợp.</CardDescription>
            </CardHeader>
            <CardContent>
              {mockRecommendedScholarships.length > 0 ? (
                <ul className="space-y-4">
                  {mockRecommendedScholarships.map(rec => (
                    <li key={rec.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-background/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <Link to={rec.link} className="font-semibold text-lg text-primary hover:underline">{rec.name}</Link>
                          <p className="text-sm text-muted-foreground">{rec.university}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600">{rec.matchPercentage}% Phù hợp</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Vui lòng cập nhật đầy đủ thông tin học vấn (điểm số, chứng chỉ) để nhận đề xuất.
                  <Button variant="link" onClick={() => setIsEditing(true)}>Cập nhật ngay</Button>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-3 h-6 w-6 text-primary" /> Đơn Học Bổng Đã Gửi
            </CardTitle>
            <CardDescription>Theo dõi trạng thái các đơn xin học bổng của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockSubmittedApplications.length > 0 ? (
              <ul className="space-y-4">
                {mockSubmittedApplications.map(app => (
                  <li key={app.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-background/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={app.link} className="font-semibold text-lg text-primary hover:underline">{app.scholarshipName}</Link>
                        <p className="text-sm text-muted-foreground">Ngày nộp: {app.date}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        app.status === 'Đang xét duyệt' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300' :
                        app.status === 'Đã nộp' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">Bạn chưa gửi đơn xin học bổng nào.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {!user.isVip && !isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-primary-foreground p-6 glass-card border-none">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Award className="mr-3 h-7 w-7" /> Nâng Cấp Lên VIP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Mở khóa các tính năng độc quyền như đề xuất học bổng cá nhân hóa, khả năng nộp đơn không giới hạn và đăng bài trên blog!</p>
              <Button variant="secondary" asChild className="bg-white text-purple-600 hover:bg-gray-100">
                <Link to="/vip-subscription">Tìm Hiểu Thêm Về VIP</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfilePage;