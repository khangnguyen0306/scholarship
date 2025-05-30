import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, BookOpen, Award, ArrowLeft, DollarSign, Loader2 } from 'lucide-react';
import { useGetSchoolByIdQuery } from '../../services/SchoolAPI';

// Mock data - replace with API call in a real app
// const mockSchoolsData = {
//   '1': { 
//     id: '1', 
//     name: 'Đại học Bách Khoa Hà Nội', 
//     location: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 
//     logo: 'hust_logo.png', 
//     bannerImage: 'school_banner_hust.jpg',
//     description: 'Đại học Bách khoa Hà Nội là một trong những trường đại học kỹ thuật hàng đầu và lớn nhất tại Việt Nam. Trường nổi tiếng với chất lượng đào tạo cao, cơ sở vật chất hiện đại và đội ngũ giảng viên giàu kinh nghiệm. HUST cung cấp đa dạng các chương trình đào tạo từ đại học đến sau đại học trong nhiều lĩnh vực kỹ thuật, công nghệ và quản lý.',
//     established: 1956,
//     website: 'https://www.hust.edu.vn',
//     contactEmail: 'info@hust.edu.vn',
//     scholarships: [
//       { id: 's1_1', name: 'Học bổng Tài năng Kỹ thuật HUST', amount: '50% - 100% học phí', field: 'Kỹ thuật', deadline: '2025-09-30' },
//       { id: 's1_2', name: 'Học bổng Nghiên cứu Khoa học', amount: 'Hỗ trợ kinh phí dự án', field: 'Nghiên cứu', deadline: '2025-10-15' },
//     ]
//   },
//   '2': { 
//     id: '2', 
//     name: 'Đại học Quốc Gia TP.HCM', 
//     location: 'Linh Trung, Thủ Đức, TP. Hồ Chí Minh', 
//     logo: 'vnu_hcm_logo.png',
//     bannerImage: 'school_banner_vnu.jpg',
//     description: 'Đại học Quốc gia Thành phố Hồ Chí Minh là một hệ thống đại học đa ngành, đa lĩnh vực, giữ vai trò đầu tàu trong hệ thống giáo dục đại học Việt Nam. VNU-HCM bao gồm nhiều trường đại học thành viên và viện nghiên cứu, cung cấp các chương trình đào tạo chất lượng cao và đóng góp quan trọng vào sự phát triển kinh tế - xã hội của đất nước.',
//     established: 1995,
//     website: 'https://vnuhcm.edu.vn',
//     contactEmail: 'banqhda@vnuhcm.edu.vn',
//     scholarships: [
//       { id: 's2_1', name: 'Học bổng Ươm mầm Tài năng VNU-HCM', amount: 'Toàn phần', field: 'Nhiều ngành', deadline: '2025-08-31' },
//       { id: 's2_2', name: 'Học bổng Phát triển Bền vững', amount: '30.000.000 VNĐ', field: 'Môi trường, Xã hội', deadline: '2025-11-01' },
//     ]
//   },
//   // Add more schools as needed
// };

const SchoolDetailPage = () => {
  const { schoolId } = useParams();
  const { data: school, isLoading, error } = useGetSchoolByIdQuery(schoolId);
  const schoolData = school?.data;
  if (error) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Không tìm thấy thông tin trường</h1>
        <Button asChild className="mt-4">
          <Link to="/schools">Quay lại danh sách trường</Link>
        </Button>
      </div>
    );
  }

  return (
    isLoading ? <div>
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    </div> :
      <div className="container mx-auto py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="outline" asChild className="mb-6">
            <Link to="/schools">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
            </Link>
          </Button>

          <Card className="overflow-hidden glass-card shadow-xl">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary to-accent">
              <img
                alt={`${schoolData.name} banner`}
                class="w-full h-full object-cover opacity-80"
                src={schoolData.image} />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                <motion.h1
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-white text-center shadow-text"
                >
                  {schoolData.name}
                </motion.h1>
              </div>
            </div>

            <CardContent className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-primary mb-3">Giới thiệu về trường</h2>
                  <p className="text-muted-foreground leading-relaxed">{schoolData.description}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-primary mb-3">Thông tin chung</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      <span><strong>Địa chỉ:</strong> {schoolData.address}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      <span><strong>Năm thành lập:</strong> {schoolData.foundedYear}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      <span><strong>Website:</strong> <a href={schoolData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{schoolData.website}</a></span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-primary"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                      <span><strong>Email:</strong> <a href={`mailto:${schoolData.email}`} className="text-primary hover:underline">{schoolData.email}</a></span>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <Card className="bg-primary/5 dark:bg-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary flex items-center">
                      <img
                        alt={`${schoolData.name} logo`}
                        class="h-10 w-10 mr-3 object-contain"
                        src={schoolData.logo} />
                      <span>{schoolData.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      <a href={schoolData.website} target="_blank" rel="noopener noreferrer">
                        Truy cập Website Trường
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </aside>
            </CardContent>
          </Card>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gradient-primary flex items-center ">
                <Award className="mr-3 h-8 w-8" /> Các Học Bổng Hiện Có 
              </CardTitle>
              <CardDescription className="ml-12">Khám phá các cơ hội học bổng từ {schoolData.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              {schoolData.scholarships && schoolData.scholarships.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {schoolData.scholarships.map(scholarship => (
                    <Card key={scholarship.id} className="hover:shadow-lg transition-shadow duration-300 bg-background/70">
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">{scholarship.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-destructive">
                          <strong className='mr-2'>Hạn nộp: </strong> {new Date(scholarship.deadline).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                          <strong className='mr-2'>Giá trị: </strong> {scholarship.value}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                          <strong className='mr-2'>Lĩnh vực: </strong>  {scholarship.field}
                        </p>

                        <p className="text-sm">
                          <strong className='mr-2'>Mô tả :</strong>
                          {scholarship.description.length > 300
                            ? scholarship.description.slice(0, 300) + '...'
                            : scholarship.description}
                        </p>
                      </CardContent>
                      <div className="p-6 pt-0">
                        <Button asChild className="w-full">
                          <Link to={`/scholarships/${scholarship._id}`}>Xem Chi Tiết</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Trường này hiện chưa có thông tin học bổng nào.</p>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </div>
  );
};

export default SchoolDetailPage;