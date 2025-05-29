import React from 'react';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useVerifyEmailMutation } from '../../services/AuthAPI';
import { useToast } from '@/components/ui/use-toast';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const { token } = useParams();
    console.log(token);
    const { toast } = useToast();
    const handleVerifyEmail = async () => {
        const response = await verifyEmail(token);
        if (response.error) {
            toast({
                title: "Lỗi xác thực email",
                description: response.error.data.error.message,
            });
        } else {
            toast({
                title: "Xác thực email thành công",
                description: "Email của bạn đã được xác thực",
                className: "bg-green-500 text-white",
            });
            navigate('/login');
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 bg-gradient-to-br from-blue-50 to-white">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full flex flex-col items-center">
                <MailCheck className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-center">Xác thực Email của bạn</h2>
                <p className="text-center text-muted-foreground mb-6">
                    Nhấn vào nút xác thực để xác thực
                </p>
                <Button loading={isLoading} className="w-full mb-2" onClick={handleVerifyEmail}>Xác thực</Button>
            </div>
        </div>
    );
};

export default VerifyEmail;