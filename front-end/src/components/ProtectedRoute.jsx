import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button'; // Import Button for CTA

const ProtectedRoute = ({ children, allowedRoles, isPremium = false }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user;
  const location = useLocation();
  const { toast } = useToast();

  if (!isAuthenticated) {
    toast({
      title: "Yêu cầu đăng nhập",
      description: "Bạn cần đăng nhập để truy cập trang này.",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
     toast({
      title: "Không có quyền truy cập",
      description: "Bạn không có quyền truy cập trang này.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  if (isPremium && !user?.isPremium) {  
    toast({
      title: "Yêu Cầu Tài Khoản VIP",
      description: "Tính năng này chỉ dành cho thành viên VIP.",
      variant: "destructive",
      action: <Button asChild onClick={() => toast.dismiss()}><Link to="/vip-subscription">Nâng Cấp Ngay</Link></Button>
    });
    // Redirect to VIP subscription page or a relevant page
    return <Navigate to="/vip-subscription" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;