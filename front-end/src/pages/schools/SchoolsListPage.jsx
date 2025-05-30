import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useGetSchoolsQuery } from '../../services/SchoolAPI';


const NATIONALITIES = [
  { label: 'Việt Nam', value: 'Việt Nam' },
  { label: 'Mỹ', value: 'United States' },
  { label: 'Anh', value: 'United Kingdom' },
  { label: 'Úc', value: 'Australia' },
  { label: 'Nhật Bản', value: 'Japan' },
  { label: 'Hàn Quốc', value: 'Korea' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Khác', value: 'Other' },
];

const SchoolsListPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [nationality, setNationality] = React.useState('');
  const { data: schools, isLoading, error, refetch } = useGetSchoolsQuery({ search: searchTerm, nationality }, { skip: false });
  const schoolsData = schools?.data || [];

  // Xử lý search/filter khi thay đổi
  React.useEffect(() => {
    refetch();
  }, [searchTerm, nationality, refetch]);

  return (
    isLoading ? <div>Loading...</div> :
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

        <div className="mb-8 max-w-xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm trường học theo tên..."
              className="pl-10 py-3 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full md:w-1/3 py-3 px-4 border rounded text-lg text-muted-foreground"
            value={nationality}
            onChange={e => setNationality(e.target.value)}
          >
            <option value="">Tất cả quốc gia</option>
            {NATIONALITIES.map(n => (
              <option key={n.value} value={n.value}>{n.label}</option>
            ))}
          </select>
        </div>

        {schoolsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolsData.map((school, index) => (
              <motion.div
                key={school._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
              >
                <Card className="h-full flex flex-col overflow-hidden glass-card hover:border-primary transition-all duration-300">
                  <CardHeader className="p-0">
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        alt={`${school.name} logo`}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={school.image}
                      />
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                        {school.scholarshipsCount} học bổng
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <CardTitle className="text-xl font-semibold mb-2 text-foreground">{school.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-1">{school.nationality}</CardDescription>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{school.description}</p>
                    <Button asChild className="w-full mt-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                      <Link to={`/schools/${school._id}`}>Xem Chi Tiết</Link>
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
            <img alt="No results found" className="mx-auto h-40 w-40 mb-4 text-muted-foreground" src="https://images.unsplash.com/photo-1682624400764-d2c9eaeae972" />
            <p className="text-xl text-muted-foreground">Không tìm thấy trường học nào phù hợp.</p>
          </motion.div>
        )}
      </div>
  );
};

export default SchoolsListPage;
