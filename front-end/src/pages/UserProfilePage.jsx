import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3, Shield, Award, FileText, Gift, BarChartHorizontalBig } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useGetUserByIdQuery, useUpdateProfileMutation } from '../services/UserAPI';
import {useGetCertificateTypesQuery} from "../services/CertificateAPI"
import UserIcon from "../../public/images/av1.svg"
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

// Hàm map dữ liệu điểm từ mảng sang object phẳng
function mapGradesToState(grades10 = [], grades11 = [], grades12 = []) {
  const subjectMap = {
    "Toán": "math", "Văn": "literature", "Vật lý": "physics", "Hóa học": "chemistry", "Sinh": "biology",
    "Lịch": "history", "Địa": "geography", "GDCD": "civic", "Tin": "informatics",
    "Công nghệ": "technology", "Anh": "english", "Thể dục": "pe", "Quốc phòng": "defense"
  };
  const grades = {};
  
  // Khởi tạo tất cả các môn với giá trị rỗng
  Object.values(subjectMap).forEach(subject => {
    grades[`${subject}_10`] = '';
    grades[`${subject}_11`] = '';
    grades[`${subject}_12`] = '';
  });

  // Cập nhật điểm từ dữ liệu
  grades10.forEach(item => { 
    if(subjectMap[item.subject]) {
      grades[`${subjectMap[item.subject]}_10`] = item.score;
    }
  });
  grades11.forEach(item => { 
    if(subjectMap[item.subject]) {
      grades[`${subjectMap[item.subject]}_11`] = item.score;
    }
  });
  grades12.forEach(item => { 
    if(subjectMap[item.subject]) {
      grades[`${subjectMap[item.subject]}_12`] = item.score;
    }
  });

  return grades;
}

// Hàm map dữ liệu điểm từ object phẳng sang mảng
function mapGradesToArray(grades) {
  const subjectMap = {
    "math": "Toán", "literature": "Văn", "physics": "Vật lý", "chemistry": "Hóa học", "biology": "Sinh",
    "history": "Lịch", "geography": "Địa", "civic": "GDCD", "informatics": "Tin",
    "technology": "Công nghệ", "english": "Anh", "pe": "Thể dục", "defense": "Quốc phòng"
  };
  
  const grades10 = [];
  const grades11 = [];
  const grades12 = [];

  Object.entries(grades).forEach(([key, value]) => {
    if (!value && value !== 0) return; // Chỉ bỏ qua giá trị rỗng, giữ lại 0
    const [subject, year] = key.split('_');
    const gradeObj = {
      subject: subjectMap[subject],
      score: parseFloat(value)
    };
    if (year === '10') grades10.push(gradeObj);
    if (year === '11') grades11.push(gradeObj);
    if (year === '12') grades12.push(gradeObj);
  });

  return { grades10, grades11, grades12 };
}

const UserProfilePage = () => {
  const { userId } = useParams();
  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);
  const { data: certificateTypes } = useGetCertificateTypesQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const userData = user?.data;
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
    grades: {
      math_10: '', physics_10: '', chemistry_10: '', literature_10: '', english_10: '',
      math_11: '', physics_11: '', chemistry_11: '', literature_11: '', english_11: '',
      math_12: '', physics_12: '', chemistry_12: '', literature_12: '', english_12: '',
    },
    certificates: []
  });

  useEffect(() => {
    if (userData) {
      setProfileData(prev => ({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        profileImage: userData.profileImage || '',
        grades: mapGradesToState(userData.grades10, userData.grades11, userData.grades12) || prev.grades,
        certificates: userData.certificates?.map(cert => ({
          ...cert,
          date: cert.date ? new Date(cert.date).toISOString().split('T')[0] : ''
        })) || []
      }));
    }
  }, [userData]);

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
    const [subject, year] = name.split('_');
    
    setProfileData(prev => {
      const newGrades = { ...prev.grades };
      newGrades[name] = value ? parseFloat(value) : '';
      return {
        ...prev,
        grades: newGrades
      };
    });
  };
  
  const handleCertificateChange = (e) => {
    const { name, value } = e.target;
    const [typeId, field] = name.split('.');
    
    setProfileData(prev => {
      const existingCert = prev.certificates.find(c => c.certificateType === typeId);
      const newCertificates = [...prev.certificates];
      
      if (existingCert) {
        // Cập nhật chứng chỉ hiện có
        const index = newCertificates.findIndex(c => c.certificateType === typeId);
        newCertificates[index] = { 
          ...existingCert, 
          [field]: field === 'score' ? parseFloat(value) : value 
        };
      } else {
        // Thêm chứng chỉ mới
        newCertificates.push({
          certificateType: typeId,
          [field]: field === 'score' ? parseFloat(value) : value
        });
      }
      
      return {
        ...prev,
        certificates: newCertificates
      };
    });
  };

  const handleSaveProfile = async () => {
    try {
      const { grades, ...rest } = profileData;
      const { grades10, grades11, grades12 } = mapGradesToArray(grades);
      
      // Lọc bỏ các chứng chỉ không có điểm hoặc ngày
      const validCertificates = profileData.certificates.filter(cert => 
        cert.score && cert.date
      );
      
      const updateData = {
        ...rest,
        grades10: grades10.filter(grade => grade.score !== ''),
        grades11: grades11.filter(grade => grade.score !== ''),
        grades12: grades12.filter(grade => grade.score !== ''),
        certificates: validCertificates
      };

      await updateProfile(updateData).unwrap();
      setIsEditing(false);
      window.location.reload()
      toast({ title: "Hồ sơ đã được cập nhật!" });
    } catch (error) {
      toast({ 
        title: "Lỗi khi cập nhật hồ sơ", 
        description: error.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        variant: "destructive"
      });
    }
  };

  const academicSubjects = {
    'Lớp 10': ['math_10', 'physics_10', 'chemistry_10', 'literature_10', 'english_10'],
    'Lớp 11': ['math_11', 'physics_11', 'chemistry_11', 'literature_11', 'english_11'],
    'Lớp 12': ['math_12', 'physics_12', 'chemistry_12', 'literature_12', 'english_12'],
  };

  const subjectLabels = {
    math: 'Toán', physics: 'Lý', chemistry: 'Hóa', literature: 'Văn', english: 'Anh',
    biology: 'Sinh', history: 'Sử', geography: 'Địa', civic: 'GDCD', informatics: 'Tin',
    technology: 'Công nghệ', pe: 'Thể dục', defense: 'Quốc phòng'
  };

  return (
    isLoading ? <div>Loading...</div> :
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
              <AvatarImage 
                src={profileData.profileImage || UserIcon} 
                alt={`${profileData.firstName} ${profileData.lastName}`}
                onError={(e) => {
                  e.target.src = UserIcon;
                }}
              />
              <AvatarFallback className="text-4xl">
                {profileData.firstName ? profileData.firstName.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            {isEditing ? (
              <div className="space-y-4 w-full max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Tên</Label>
                    <Input id="firstName" name="firstName" value={profileData.firstName} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Họ</Label>
                    <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" name="address" value={profileData.address} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="profileImage">URL ảnh đại diện</Label>
                  <Input id="profileImage" name="profileImage" value={profileData.profileImage} onChange={handleInputChange} />
                </div>
              </div>
            ) : (
              <>
                <CardTitle className="text-3xl font-bold">{profileData.firstName + ' ' + profileData.lastName}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">{profileData.email}</CardDescription>
                {profileData.phone && <CardDescription className="text-muted-foreground">{profileData.phone}</CardDescription>}
                {profileData.address && <CardDescription className="text-muted-foreground">{profileData.address}</CardDescription>}
              </>
            )}
            {userData?.isPremium && (
              <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-yellow-900">
                <Shield className="h-4 w-4 mr-1" /> Thành viên VIP
              </span>
            )}
          </CardHeader>
          <CardContent className="text-center pb-6">
            {isEditing ? (
              <div className="flex gap-2 justify-center">
                <Button onClick={handleSaveProfile}>Lưu thay đổi</Button>
                <Button variant="outline" onClick={() => { setIsEditing(false); setProfileData(userData);}}>Hủy</Button>
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
                {[10, 11, 12].map(year => (
                  <div key={year} className="mb-4 p-4 border rounded-md">
                    <h4 className="font-medium mb-2 text-primary">Lớp {year}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {Object.entries(subjectLabels).map(([key, label]) => (
                        <div key={key} className="space-y-1">
                          <Label htmlFor={`${key}_${year}`}>{label}</Label>
                          <Input
                            id={`${key}_${year}`}
                            name={`${key}_${year}`}
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="VD: 8.5"
                            value={profileData.grades[`${key}_${year}`] || ''}
                            onChange={handleGradeChange}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Chứng chỉ</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {certificateTypes?.data?.map(certType => {
                    const cert = profileData.certificates.find(c => c.certificateType === certType._id) || {};
                    return (
                      <div key={certType._id} className="space-y-4 p-4 border rounded-md">
                        <h4 className="font-medium text-primary">{certType.name}</h4>
                        <div className="space-y-2">
                          <div>
                            <Label htmlFor={`${certType._id}.score`}>Điểm</Label>
                            <Input
                              id={`${certType._id}.score`}
                              name={`${certType._id}.score`}
                              type="number"
                              min="0"
                              max={certType.name === 'IELTS' ? '9' : '990'}
                              step="0.5"
                              placeholder="VD: 7.0"
                              value={cert.score || ''}
                              onChange={handleCertificateChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${certType._id}.date`}>Ngày cấp</Label>
                            <Input
                              id={`${certType._id}.date`}
                              name={`${certType._id}.date`}
                              type="date"
                              value={cert.date || ''}
                              onChange={handleCertificateChange}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {userData?.isPremium && !isEditing && (
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

      {!userData?.isPremium && !isEditing && (
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