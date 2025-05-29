
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const mockSchools = [
  { id: '1', name: 'Đại học Bách Khoa Hà Nội', location: 'Hà Nội, Việt Nam', logo: 'hust_logo.png', description: 'Trường đại học kỹ thuật hàng đầu Việt Nam.', scholarshipsCount: 15 },
  { id: '2', name: 'Đại học Quốc Gia TP.HCM', location: 'TP. Hồ Chí Minh, Việt Nam', logo: 'vnu_hcm_logo.png', description: 'Một trong hai đại học quốc gia của Việt Nam.', scholarshipsCount: 22 },
  { id: '3', name: 'Đại học RMIT Việt Nam', location: 'TP. Hồ Chí Minh & Hà Nội', logo: 'rmit_logo.png', description: 'Trường đại học quốc tế với nhiều cơ sở.', scholarshipsCount: 10 },
  { id: '4', name: 'Đại học Fulbright Việt Nam', location: 'TP. Hồ Chí Minh, Việt Nam', logo: 'fulbright_logo.png', description: 'Trường đại học tư thục không vì lợi nhuận.', scholarshipsCount: 8 },
];

const SchoolsListPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSchools = mockSchools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-gradient-primary">Danh Sách Trường Học</h1>
        <p className="text-lg text-muted-foreground">Khám phá các trường đại học hàng đầu trong và ngoài nước.</p>
      </motion.div>

      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Tìm kiếm trường học theo tên hoặc địa điểm..."
            className="pl-10 py-3 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)"}}
            >
              <Card className="h-full flex flex-col overflow-hidden glass-card hover:border-primary transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <img  
                      alt={`${school.name} logo`} 
                      class="max-h-32 max-w-xs object-contain p-4"
                     src="https://images.unsplash.com/photo-1689624291716-0fd576982b4a" />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                      {school.scholarshipsCount} học bổng
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <CardTitle className="text-xl font-semibold mb-2 text-foreground">{school.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-1">{school.location}</CardDescription>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{school.description}</p>
                  <Button asChild className="w-full mt-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                    <Link to={`/schools/${school.id}`}>Xem Chi Tiết</Link>
                  </Button>
                </CardContent>
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
          <img  alt="No results found" class="mx-auto h-40 w-40 mb-4 text-muted-foreground" src="https://images.unsplash.com/photo-1682624400764-d2c9eaeae972" />
          <p className="text-xl text-muted-foreground">Không tìm thấy trường học nào phù hợp.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SchoolsListPage;
