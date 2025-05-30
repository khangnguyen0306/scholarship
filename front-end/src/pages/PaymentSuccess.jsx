import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useLazyGetPayOSPaymentQuery } from '../services/PaymentAPI';
import { useDispatch } from 'react-redux';
import { logOut } from '../slices/authSlice';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [getPayOSPayment] = useLazyGetPayOSPaymentQuery();
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  }

  useEffect(() => {
    const processPayment = async () => {
      try {
        const code = searchParams.get('code');
        const orderCode = searchParams.get('orderCode');
        const status = searchParams.get('status');

        if (!orderCode || !code || !status) {
          setPaymentStatus({ success: false, message: 'Thông tin thanh toán không hợp lệ' });
          setLoading(false);
          return;
        }
        // Gọi API để cập nhật trạng thái thanh toán
        const response = await getPayOSPayment({ code, orderCode, status });
        if (response.error.originalStatus == 200) {
          setPaymentStatus({ success: true, message: 'Thanh toán thành công! Tài khoản của bạn đã được nâng cấp lên VIP.' });
          toast({
            title: "Thanh toán thành công",
            description: "Tài khoản của bạn đã được nâng cấp lên VIP.",
            className: "bg-green-500 text-white",
          });
          handleLogout();
        } else {
          setPaymentStatus({ success: false, message: 'Có lỗi xảy ra khi xử lý thanh toán' });
          toast({
            title: "Lỗi thanh toán",
            description: "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, toast]);

  const handleContinue = () => {
    if (paymentStatus?.success) {
      navigate('/scholarships');
    } else {
      navigate('/vip-subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Đang xử lý thanh toán...</h2>
          <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          {paymentStatus?.success ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}

          <h1 className="text-3xl font-bold mb-4">
            {paymentStatus?.success ? 'Thanh Toán Thành Công!' : 'Thanh Toán Không Thành Công'}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            {paymentStatus?.message}
          </p>

          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full"
          >
            {paymentStatus?.success ? 'Tiếp tục khám phá' : 'Thử lại'}
          </Button>
        </div>
      </div>
    </div>
  );
}
