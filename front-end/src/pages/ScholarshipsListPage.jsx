import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, DollarSign, BookOpen, MapPin, Percent, UploadCloud, Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockScholarships = [
  { id: 's1', name: 'Học bổng Toàn phần VinUniversity', university: 'VinUniversity', amount: 'Toàn phần', field: 'Nhiều ngành', location: 'Hà Nội, Việt Nam', deadline: '2025-12-31', requiredGPA: 3.8, requiredIELTS: 7.5 },
  { id: 's2', name: 'Học bổng Tài năng RMIT', university: 'Đại học RMIT Việt Nam', amount: '50% học phí', field: 'Kinh doanh, Công nghệ', location: 'TP. HCM & Hà Nội', deadline: '2025-10-15', requiredGPA: 3.5, requiredIELTS: 7.0 },
  { id: 's3', name: 'Học bổng Fulbright', university: 'Đại học Fulbright Việt Nam', amount: 'Hỗ trợ tài chính', field: 'Nhiều ngành', location: 'TP. HCM, Việt Nam', deadline: '2025-11-30', requiredGPA: 3.6, requiredSAT: 1400 },
  { id: 's4', name: 'Học bổng Chính phủ Úc (AAS)', university: 'Các trường ĐH Úc', amount: 'Toàn phần', field: 'Ưu tiên', location: 'Úc', deadline: '2025-04-30', requiredGPA: 3.0, requiredIELTS: 6.5 },
];

const subjects = ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Sử", "Địa", "Ngoại ngữ", "GDCD"];

const ScholarshipsListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [grades, setGrades] = useState(
    Array(3).fill(null).map(() => 
      subjects.reduce((acc, subject) => ({ ...acc, [subject]: '' }), {})
    )
  );
  const [certificates, setCertificates] = useState({ ielts: '', sat: '', toeic: '' });
  const [matchedScholarships, setMatchedScholarships] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleGradeChange = (yearIndex, subject, value) => {
    const newGrades = [...grades];
    newGrades[yearIndex][subject] = value;
    setGrades(newGrades);
  };

  const handleCertificateChange = (type, value) => {
    setCertificates(prev => ({ ...prev, [type]: value }));
  };

  const calculateAverageGPA = () => {
    let totalPoints = 0;
    let count = 0;
    grades.forEach(year => {
      subjects.forEach(subject => {
        const grade = parseFloat(year[subject]);
        if (!isNaN(grade) && grade >= 0 && grade <= 10) {
          totalPoints += grade;
          count++;
        }
      });
    });
    return count > 0 ? (totalPoints / count / 10 * 4).toFixed(2) : 0; // Convert to 4.0 scale
  };

  const handleAdvancedSearch = async () => {
    setIsCalculating(true);
    setMatchedScholarships([]); // Clear previous results
    
    const userGPA = parseFloat(calculateAverageGPA());
    const userIELTS = parseFloat(certificates.ielts) || 0;
    const userSAT = parseInt(certificates.sat) || 0;

    // Simulate API call & matching logic
    await new Promise(resolve => setTimeout(resolve, 1500));

    const matches = mockScholarships.map(scholarship => {
      let matchScore = 0;
      let criteriaMet = 0;
      let totalCriteria = 0;

      if (scholarship.requiredGPA) {
        totalCriteria++;
        if (userGPA >= scholarship.requiredGPA) {
          matchScore += 30; // Weight for GPA
          criteriaMet++;
        } else if (userGPA >= scholarship.requiredGPA * 0.9) { // Close match
          matchScore += 15;
        }
      }
      if (scholarship.requiredIELTS) {
        totalCriteria++;
        if (userIELTS >= scholarship.requiredIELTS) {
          matchScore += 30; // Weight for IELTS
          criteriaMet++;
        } else if (userIELTS >= scholarship.requiredIELTS * 0.9) {
          matchScore += 15;
        }
      }
      if (scholarship.requiredSAT) {
        totalCriteria++;
        if (userSAT >= scholarship.requiredSAT) {
          matchScore += 30; // Weight for SAT
          criteriaMet++;
        } else if (userSAT >= scholarship.requiredSAT * 0.9) {
          matchScore += 15;
        }
      }
      // Add more criteria like TOEIC, specific subject scores if needed

      // Basic name match
      if (searchTerm && scholarship.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        matchScore += 10;
      }
      
      // Normalize score to percentage (max 100)
      const maxPossibleScore = totalCriteria * 30 + (searchTerm ? 10 : 0); // Adjust if more criteria added
      const percentage = maxPossibleScore > 0 ? Math.min(100, Math.round((matchScore / maxPossibleScore) * 100)) : 0;

      return { ...scholarship, matchPercentage: percentage };
    }).filter(s => s.matchPercentage > 0) // Only show if some match
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    setMatchedScholarships(matches);
    setIsCalculating(false);
    if (matches.length === 0) {
      toast({ title: "Không tìm thấy kết quả", description: "Không có học bổng nào phù hợp với tiêu chí của bạn." });
    } else {
      toast({ title: "Tìm kiếm hoàn tất!", description: `Tìm thấy ${matches.length} học bổng phù hợp.` });
    }
  };
  
  const filteredScholarships = searchTerm && matchedScholarships.length === 0 
    ? mockScholarships.filter(scholarship => 
        scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.university.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : matchedScholarships.length > 0 ? matchedScholarships : mockScholarships;


  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-gradient-primary">Danh Sách Học Bổng</h1>
        <p className="text-lg text-muted-foreground">Tìm kiếm cơ hội học bổng phù hợp với bạn từ hàng ngàn lựa chọn.</p>
      </motion.div>

      <div className="mb-8">
        <Label htmlFor="search-scholarship-name">Tìm kiếm theo tên</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            id="search-scholarship-name"
            type="text"
            placeholder="Nhập tên học bổng, trường..."
            className="pl-10 py-3 text-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card className="mb-8 p-6 bg-primary/5 dark:bg-primary/10 glass-card">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl mb-2 text-gradient-primary flex items-center">
            <Brain className="mr-3 h-7 w-7" /> Tìm Kiếm Nâng Cao
          </CardTitle>
          <CardDescription>Nhập điểm số và chứng chỉ để tìm học bổng phù hợp nhất. Kết quả sẽ được sắp xếp theo mức độ phù hợp (%).</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            {[10, 11, 12].map((year, yearIndex) => (
              <div key={year}>
                <h4 className="text-lg font-semibold mb-2 text-primary">Điểm lớp {year}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {subjects.map(subject => (
                    <div key={subject} className="space-y-1">
                      <Label htmlFor={`grade-${year}-${subject}`}>{subject}</Label>
                      <Input 
                        id={`grade-${year}-${subject}`}
                        type="number" 
                        min="0" max="10" step="0.1" 
                        placeholder="VD: 8.5"
                        value={grades[yearIndex][subject]}
                        onChange={(e) => handleGradeChange(yearIndex, subject, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h4 className="text-lg font-semibold mb-2 text-primary">Chứng chỉ (nếu có)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ielts">IELTS</Label>
                  <Input id="ielts" type="number" step="0.5" placeholder="VD: 7.5" value={certificates.ielts} onChange={(e) => handleCertificateChange('ielts', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sat">SAT</Label>
                  <Input id="sat" type="number" placeholder="VD: 1400" value={certificates.sat} onChange={(e) => handleCertificateChange('sat', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="toeic">TOEIC</Label>
                  <Input id="toeic" type="number" placeholder="VD: 900" value={certificates.toeic} onChange={(e) => handleCertificateChange('toeic', e.target.value)} />
                </div>
              </div>
            </div>
            <Button onClick={handleAdvancedSearch} size="lg" className="w-full md:w-auto text-md py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90" disabled={isCalculating}>
              {isCalculating ? 'Đang tính toán...' : <> <Percent className="mr-2 h-5 w-5" /> Tìm Học Bổng Phù Hợp</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)"}}
            >
              <Card className="h-full flex flex-col overflow-hidden glass-card hover:border-primary transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-primary">{scholarship.name}</CardTitle>
                    {scholarship.matchPercentage !== undefined && (
                      <span className="text-sm font-bold px-2 py-1 rounded-md bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                        {scholarship.matchPercentage}% Phù hợp
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">{scholarship.university}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span>Giá trị: {scholarship.amount}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Lĩnh vực: {scholarship.field}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <span>Địa điểm: {scholarship.location}</span>
                  </div>
                  <p className="text-sm text-destructive">Hạn nộp: {new Date(scholarship.deadline).toLocaleDateString('vi-VN')}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                    <Link to={`/scholarships/${scholarship.id}`}>Xem Chi Tiết & Nộp Đơn</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
         <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <img  alt="No scholarships found icon" class="mx-auto h-40 w-40 mb-4 text-muted-foreground" src="https://images.unsplash.com/photo-1582079767681-eaa6975406c7" />
          <p className="text-xl text-muted-foreground">Không tìm thấy học bổng nào. Hãy thử tìm kiếm theo tên hoặc điều chỉnh bộ lọc nâng cao.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ScholarshipsListPage;