import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMentorsQuery } from '../../services/UserAPI';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, BookOpen, Award, Info, Languages, CheckCircle, XCircle } from 'lucide-react';

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-1">
    {icon && <span className="text-primary">{icon}</span>}
    <span className="font-medium min-w-[120px] text-muted-foreground">{label}:</span>
    <span className="text-base">{value || <span className="text-gray-400">(Chưa cập nhật)</span>}</span>
  </div>
);

const MentorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMentorsQuery();

  // Tìm mentor theo id
  const mentor = data?.data?.find(m => m._id === id);

  if (isLoading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error.message}</div>;
  if (!mentor) return <div className="text-center py-10 text-gray-500">Không tìm thấy mentor</div>;

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">← Quay lại</Button>
      <Card className="glass-card p-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-accent text-white py-6 px-8">
          <div className="flex items-center gap-4">
            <User className="h-10 w-10 bg-white/20 rounded-full p-2" />
            <div>
              <CardTitle className="text-2xl font-bold text-white mb-1">{mentor.firstName} {mentor.lastName}</CardTitle>
              <div className="flex items-center gap-2 text-sm">
                {mentor.mentorStatus === 'approved' && <CheckCircle className="h-4 w-4 text-green-300" />}
                {mentor.mentorStatus === 'pending' && <Info className="h-4 w-4 text-yellow-200" />}
                {mentor.mentorStatus === 'rejected' && <XCircle className="h-4 w-4 text-red-300" />}
                <span className="capitalize">{mentor.mentorStatus === 'approved' ? 'Đã duyệt' : mentor.mentorStatus === 'pending' ? 'Chờ duyệt' : 'Bị từ chối'}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 grid gap-6">
          <section>
            <h3 className="font-semibold text-lg mb-2 text-primary flex items-center gap-2"><Info className="h-5 w-5" /> Thông tin cá nhân</h3>
            <div className="flex flex-col gap-x-8 gap-y-2">
                <InfoRow icon={<User className="h-4 w-4" />} label="Họ tên" value={mentor.firstName + ' ' + mentor.lastName} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={mentor.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Số điện thoại" value={mentor.mentorProfile?.phone} />
            </div>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2 text-primary flex items-center gap-2"><BookOpen className="h-5 w-5" /> Hồ sơ mentor</h3>
            <div className="flex flex-col gap-x-8 gap-y-2">
              <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Chuyên ngành" value={mentor.mentorProfile?.major} />
              <InfoRow icon={<Award className="h-4 w-4" />} label="Kinh nghiệm" value={mentor.mentorProfile?.experience} />
              <InfoRow icon={<Languages className="h-4 w-4" />} label="Ngôn ngữ" value={mentor.mentorProfile?.languages?.join(', ')} />
            </div>
            <div className="mt-2">
              <span className="font-medium text-muted-foreground">Giới thiệu:</span>
              <div className="bg-muted rounded p-3 mt-1 text-base min-h-[40px]">{mentor.mentorProfile?.bio || <span className="text-gray-400">(Chưa cập nhật)</span>}</div>
            </div>
          </section>
          <section>
            <h3 className="font-semibold text-lg mb-2 text-primary flex items-center gap-2"><Award className="h-5 w-5" /> Bằng cấp</h3>
            {mentor.mentorProfile?.degrees?.length ? (
              <ul className="list-disc ml-6 space-y-1">
                {mentor.mentorProfile.degrees.map((deg, i) => (
                  <li key={i} className="text-base">{deg.name} - {deg.institution} ({deg.year})</li>
                ))}
              </ul>
            ) : <div className="text-gray-400">(Chưa cập nhật)</div>}
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorDetailPage; 