import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Check, X } from 'lucide-react';
import { useAcceptConnectionRequestMutation, useGetConnectionRequestsQuery, useRejectConnectionRequestMutation } from '../services/UserAPI';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
const MentorRequestsPage = () => {
    const { data, isLoading, error, refetch } = useGetConnectionRequestsQuery();
    const [acceptMentorRequest, { isLoading: acceptLoading }] = useAcceptConnectionRequestMutation();
    const [rejectMentorRequest, { isLoading: rejectLoading }] = useRejectConnectionRequestMutation();
    const [rejectReason, setRejectReason] = useState('');
    const requests = data?.data || [];
    const { toast } = useToast();
    const navigate = useNavigate();
    const handleAccept = async (id) => {
        try {
            const response = await acceptMentorRequest(id);
            // console.log(response);
            if (response.error) {
                toast({
                    title: 'Lỗi chấp nhận yêu cầu',
                    description: response.error.data.error.message,
                    variant: 'destructive',
                });
            } else {
                refetch();
                toast({
                    title: 'Thành công',
                    description: 'Yêu cầu kết nối đã được chấp nhận',
                    className: 'bg-green-500 text-white',
                });
                navigate('/chat');
            }


        } catch (error) {
            console.log(error);
        };
    };
    const handleReject = async (id) => {
        // console.log(id)
        try {
            const response = await rejectMentorRequest({ id: id.toString(), reason: rejectReason });
            console.log(response);
            if (response.error) {
                toast({
                    title: 'Lỗi',
                    description: response.error.data.error.message,
                    variant: 'destructive',
                });
            } else {
                setRejectReason('');
                refetch();
                toast({
                    title: 'Thành công',
                    description: 'Yêu cầu kết nối đã được từ chối',
                    className: 'bg-green-500 text-white',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 w-full">
            <h1 className="text-3xl font-bold mb-8 text-center text-gradient-primary flex items-center justify-center gap-2">
                <MessageCircle className="h-7 w-7 text-primary" /> Yêu cầu kết nối
            </h1>
            {isLoading ? (
                <div className="text-center py-10">Đang tải yêu cầu...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">Lỗi tải yêu cầu.</div>
            ) : requests.length === 0 ? (
                <div className="text-center text-gray-400">Chưa có yêu cầu kết nối nào.</div>
            ) : (
                <div className="space-y-6">
                    {requests.map((req) => (
                        <Card key={req._id} className="shadow-md">
                            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {req.studentId?.firstName} {req.studentId?.lastName}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-500">{req.studentId?.email}</CardDescription>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 md:mt-0">Ngày gửi: {new Date(req.createdAt).toLocaleDateString('vi-VN')}</div>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-0 pb-4">
                                <div className="mb-2 md:mb-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{req.status === 'pending' ? 'Đang chờ' : req.status === 'accepted' ? 'Đã chấp nhận' : 'Đã từ chối'}</span>
                                </div>
                                {req.status === 'pending' && (
                                    <div className="flex flex-col md:flex-row gap-2 items-center">
                                        <Button size="sm" className='bg-green-500 text-white hover:bg-green-600' disabled={acceptLoading} onClick={() => handleAccept(req._id)}>
                                            <Check className="h-4 w-4 mr-1" /> Chấp nhận
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <Input
                                                placeholder="Lý do từ chối (nếu có)"
                                                value={rejectReason}
                                                onChange={e => setRejectReason(e.target.value)}
                                                className="h-8 text-xs w-[50vw]"
                                            />
                                            <Button size="sm" variant="destructive" disabled={rejectLoading} onClick={() => handleReject(req._id)}>
                                                <X className="h-4 w-4 mr-2" />Từ chối
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentorRequestsPage; 