import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Award, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const VipSubscriptionPage = () => {
  const { toast } = useToast();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const handleSubscribe = (planName) => {
    // In a real app, this would redirect to Stripe Checkout or similar
    // For demo, simulate successful subscription
    
    if (user) {
      updateUser({ ...user, isVip: true }); // Update user state to reflect VIP status
      toast({
        title: `Đăng ký ${planName} thành công!`,
        description: "Cảm ơn bạn đã trở thành thành viên VIP. Tận hưởng các đặc quyền!",
        className: "bg-green-500 text-white",
      });
      navigate('/profile');
    } else {
        toast({
            title: "Lỗi đăng ký",
            description: "Vui lòng đăng nhập để đăng ký gói VIP.",
            variant: "destructive",
        });
        navigate('/login');
    }
  };

  const plans = [
    {
      name: "Gói Tháng",
      price: "199.000 VNĐ",
      period: "/tháng",
      features: [
        "Nộp đơn không giới hạn",
        "Gợi ý học bổng cá nhân hóa",
        "Đăng bài trên Blog",
        "Hỗ trợ ưu tiên",
      ],
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      color: "from-yellow-400 to-orange-500",
      buttonText: "Đăng Ký Gói Tháng"
    },
    {
      name: "Gói Năm (Tiết Kiệm 20%)",
      price: "1.990.000 VNĐ",
      period: "/năm",
      features: [
        "Tất cả quyền lợi Gói Tháng",
        "Truy cập sớm các học bổng mới",
        "Huy hiệu VIP nổi bật",
        "Ưu đãi đặc biệt từ đối tác",
      ],
      icon: <Award className="h-8 w-8 text-purple-400" />,
      color: "from-purple-500 to-pink-500",
      buttonText: "Đăng Ký Gói Năm"
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold mb-4">
          Trở Thành <span className="text-gradient-primary">Thành Viên VIP</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Mở khóa toàn bộ tiềm năng của ScholarSeeker với các gói VIP của chúng tôi. Nhận lợi thế cạnh tranh trong hành trình săn học bổng!
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            whileHover={{ y: -10 }}
          >
            <Card className={`h-full flex flex-col overflow-hidden shadow-2xl border-2 ${index === 1 ? 'border-primary' : 'border-border'} glass-card`}>
              <CardHeader className={`bg-gradient-to-br ${plan.color} text-primary-foreground p-8 text-center`}>
                <div className="mx-auto mb-4 p-3 bg-white/20 rounded-full inline-block">
                  {plan.icon}
                </div>
                <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                <p className="text-4xl font-extrabold mt-2">
                  {plan.price} <span className="text-lg font-normal">{plan.period}</span>
                </p>
              </CardHeader>
              <CardContent className="p-8 flex-grow">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-8 pt-0 mt-auto">
                <Button 
                  size="lg" 
                  className={`w-full text-lg py-3 bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity duration-300 text-primary-foreground`}
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={user?.isVip} // Disable if already VIP
                >
                  {user?.isVip ? "Bạn Đã Là VIP" : plan.buttonText}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center mt-16"
      >
        <p className="text-muted-foreground">
          Có câu hỏi? <Button variant="link" asChild><Link to="/contact">Liên hệ với chúng tôi</Link></Button>
        </p>
      </motion.div>
    </div>
  );
};

export default VipSubscriptionPage;