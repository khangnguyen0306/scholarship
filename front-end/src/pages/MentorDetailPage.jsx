import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery } from '@/services/UserAPI';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Crown, Star, ArrowLeft, Send, CrownIcon } from 'lucide-react';
import avatar from '../../public/images/av1.svg';
import { Button } from '@/components/ui/button';
import { useCreateConnectionRequestMutation, useGetRatingQuery } from '../services/UserAPI';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
const MentorDetailPage = () => {
    const { mentorId } = useParams();
    const { toast } = useToast();
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetUserByIdQuery(mentorId);
    const { data: ratingData, isLoading: ratingLoading, error: ratingError } = useGetRatingQuery(mentorId);
    const [createConnectionRequest, { isLoading: connectionRequestLoading, error: connectionRequestError }] = useCreateConnectionRequestMutation();
    const mentor = data?.data;
    const rating = ratingData?.ratings;
    console.log(rating);

    const handleCreateConnectionRequest = async () => {
        if (user?.isPremium) {
            const response = await createConnectionRequest({ mentorId });
            console.log(response);
            if (response.error) {
                toast({
                    title: 'Lỗi',
                    description: response.error.data.error.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Thành công',
                    description: 'Gửi yêu cầu kết nối thành công',
                    className: 'bg-green-500 text-white',
                });
            }
        } else {
            navigate('/vip-subscription');
        }
    };
    if (isLoading) return <div className="text-center py-10">Đang tải thông tin mentor...</div>;
    if (error || !mentor) return <div className="text-center py-10 text-red-500">Không tìm thấy mentor.</div>;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-background/50 py-8">
            <Link to="/mentors" className="inline-flex items-center mb-6 text-primary hover:underline">
                <ArrowLeft className="mr-2 h-5 w-5" /> Quay lại danh sách mentor
            </Link>
            <Card className="shadow-xl glass-card w-full ">
                <CardHeader className="flex flex-col items-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg pb-2">
                    {user?.role === 'student' && (
                        <div className="self-end pb-6">
                            {user && user?.isPremium ? (
                                <Button disabled={connectionRequestLoading} onClick={handleCreateConnectionRequest} size="lg" className="bg-gradient-to-r from-primary to-accent text-white font-bold px-8 py-4 text-lg shadow-lg hover:opacity-90 transition-all duration-300">
                                    Gửi yêu cầu kết nối   <Send className='ml-2' />
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-primary to-accent text-white font-bold px-8 py-4 text-lg shadow-lg hover:opacity-90 transition-all duration-300"
                                    onClick={() => navigate('/vip-subscription')}
                                >
                                    Đăng ký thành viên VIP để gửi yêu cầu kết nối <CrownIcon color='yellow' className='ml-2 ' />
                                </Button>
                            )}
                        </div>
                    )}
                    <div className="relative">
                        <Avatar className="h-28 w-28 mb-2 border-2 border-primary">
                            <AvatarImage src={mentor.profileImage || avatar} alt={mentor.firstName + ' ' + mentor.lastName} />
                            <AvatarFallback>{mentor.firstName ? mentor.firstName.charAt(0).toUpperCase() : 'M'}</AvatarFallback>
                        </Avatar>
                        {mentor.isPremium && (
                            <Crown className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 fill-yellow-400 drop-shadow-lg" title="Mentor VIP" />
                        )}
                    </div>
                    <CardTitle className="text-2xl mt-2 text-center flex items-center gap-2">
                        {mentor.firstName} {mentor.lastName}
                    </CardTitle>
                    <CardDescription className="text-md text-gray-500 text-center">{mentor.email}</CardDescription>
                    {mentor.mentorProfile?.major && (
                        <div className="text-md text-primary font-medium mt-1">Chuyên ngành: {mentor.mentorProfile.major}</div>
                    )}
                    <div className="flex items-center gap-2 mt-2 mb-4">
                        <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            {mentor.avgRating > 0 ? mentor.avgRating : 'Chưa có'}
                        </span>
                        <span className="text-xs text-gray-500">({mentor.ratingCount || 0} đánh giá)</span>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center pt-2 pb-4">
                    {mentor.mentorProfile?.degrees && mentor.mentorProfile.degrees.length > 0 && (
                        <div className="text-sm text-gray-700 mb-2 w-full">
                            {mentor.mentorProfile?.bio && (
                                <div className="text-sm text-gray-600 text-left  mb-4 whitespace-pre-line">Giới thiệu: {mentor.mentorProfile.bio}</div>
                            )}
                            {mentor.mentorProfile?.experience && (
                                <div className="text-sm text-gray-700 mb-2"><b>Kinh nghiệm:</b> {mentor.mentorProfile.experience}</div>
                            )}
                            <b>Bằng cấp:</b>
                            <ul className="list-disc ml-6 mt-1">
                                {mentor.mentorProfile.degrees.map((deg, idx) => (
                                    <li key={idx}>{deg.name} - {deg.institution} ({deg.year})</li>
                                ))}
                            </ul>

                        </div>
                    )}
                    {mentor.mentorProfile?.languages && mentor.mentorProfile.languages.length > 0 && (
                        <div className="text-sm text-gray-700 mb-2 w-full">
                            <b>Ngôn ngữ:</b> {mentor.mentorProfile.languages.join(', ')}
                        </div>
                    )}
                    {mentor.phone && (
                        <div className="text-sm text-gray-700 mb-2"><b>Số điện thoại:</b> {mentor.phone}</div>
                    )}
                    {ratingLoading && <div className="text-center py-10">Đang tải đánh giá...</div>}
                    {ratingError && <div className="text-center py-10 text-red-500">Lỗi tải đánh giá.</div>}
                    {rating && rating.length > 0 ? (
                        <div className="w-full mt-6">
                            <h3 className="text-lg font-bold mb-3 text-primary">Đánh giá gần nhất</h3>
                            <div className="space-y-4">
                                {rating.map((r) => (
                                    <div key={r._id} className="border rounded-lg p-4 bg-background/80 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-primary">{r.studentId?.firstName} {r.studentId?.lastName}</span>
                                            <span className="text-xs text-gray-500">({r.studentId?.email})</span>
                                            <span className="flex items-center gap-1 ml-auto text-yellow-500 font-semibold">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                {r.stars}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-700 mb-1">{r.comment || <span className="italic text-gray-400">(Không có nội dung)</span>}</div>
                                        <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full mt-6 text-center text-gray-400">Chưa có đánh giá nào</div>
                    )}
                </CardContent>

            </Card>
        </div>
    );
};

export default MentorDetailPage; 