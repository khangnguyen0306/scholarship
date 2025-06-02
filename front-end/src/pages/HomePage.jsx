import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Star, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGetSchoolsQuery } from '../services/SchoolAPI';

const HomePage = () => {
  const { data: schools } = useGetSchoolsQuery({ limit: 10 });
  // console.log(schools);
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const features = [
    { title: "Tìm kiếm thông minh", description: "Dễ dàng tìm học bổng phù hợp với điểm số và chứng chỉ của bạn.", icon: <Search className="h-10 w-10 text-primary" /> },
    { title: "Đa dạng trường học", description: "Khám phá hàng ngàn trường đại học trong và ngoài nước.", icon: <img  alt="University building icon" class="h-10 w-10 text-primary" src="https://images.unsplash.com/photo-1686829613628-3e4ebe6f27e7" /> },
    { title: "Gợi ý cá nhân hóa", description: "Nhận đề xuất học bổng dựa trên hồ sơ và sở thích của bạn (VIP).", icon: <Star className="h-10 w-10 text-primary" /> },
  ];

  return (
    <div className="space-y-16 py-8">
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center py-16 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 dark:from-primary/20 dark:via-accent/20 dark:to-purple-900/20 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-gradient-primary">Mở Khóa Tương Lai</span> Của Bạn
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            GrantHub giúp bạn tìm kiếm và nộp đơn vào các học bổng phù hợp nhất từ khắp nơi trên thế giới.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 shadow-lg">
              <Link to="/scholarships">
                Tìm Học Bổng Ngay <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
         
          </motion.div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary/30 rounded-full"
              style={{
                width: Math.random() * 50 + 20,
                height: Math.random() * 50 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "mirror",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </motion.section>

      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Tại Sao Chọn <span className="text-gradient-primary">GrantHub</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.custom
              key={feature.title}
              custom={index}
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="h-full hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glass-card">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-md">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.custom>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 bg-secondary/50 dark:bg-secondary/20 rounded-xl shadow-lg">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h2 
              className="text-4xl font-bold mb-6 text-gradient-primary"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Sẵn sàng để bắt đầu?
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Tạo tài khoản miễn phí ngay hôm nay và khám phá thế giới cơ hội học bổng đang chờ đón bạn. Đừng bỏ lỡ cơ hội học tập tại ngôi trường mơ ước!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 shadow-lg">
                <Link to="/register">
                  Đăng Ký Miễn Phí <UserPlus className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
          <motion.div 
            className="relative h-80"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img   
              alt="Students celebrating graduation" 
              class="w-full h-full object-cover rounded-lg shadow-2xl"
              src="https://images.unsplash.com/photo-1460025192174-e298958d7bb5" />
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6">Top Trường Nổi Bật</h2>
        {schools?.data?.length > 0 && (
          <div className="flex overflow-x-auto gap-6 py-4 hide-scrollbar">
            {schools.data.map((school) => (
              <Link to={`/schools/${school._id}`} key={school._id} className="min-w-[260px] max-w-xs flex-shrink-0">
                <Card className="h-full hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glass-card">
                  <CardHeader className="items-center text-center pb-2">
                    {school.logo ? (
                      <img src={school.logo} alt={school.name} className="h-20 w-20 object-contain mx-auto mb-2 rounded-full bg-white border" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-primary">{school.name.charAt(0)}</div>
                    )}
                    <CardTitle className="text-lg line-clamp-2 ">{school.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-sm text-muted-foreground mb-1 text-blue-500 font-bold">{school.nationality}</CardDescription>
                    <div className="text-xs text-gray-500 line-clamp-2">{school.address}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

