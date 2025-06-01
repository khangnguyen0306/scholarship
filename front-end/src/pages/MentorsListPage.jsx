import React from 'react';
import { useGetMentorsQuery } from '@/services/UserAPI';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Star } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import avatar from '../../public/images/av1.svg';
import { Link } from 'react-router-dom';

const MentorsListPage = () => {
    const { data, isLoading, error } = useGetMentorsQuery('approved');
    const mentors = data?.data || [];

    if (isLoading) return <div className="text-center py-10">Đang tải danh sách mentor...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Lỗi tải danh sách mentor.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-gradient-primary">Mentor nổi bật</h1>
            <p className="text-lg text-muted-foreground text-center mb-10">Khám phá và kết nối với các mentor hàng đầu, được đánh giá cao bởi cộng đồng.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {mentors.length === 0 && <div className="col-span-full text-center">Chưa có mentor nào.</div>}
                {mentors.map((mentor) => (
                    <Link to={`/mentors/${mentor._id}`} key={mentor._id} className="block h-full">
                        <Card className="hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glass-card relative h-full cursor-pointer">
                            <CardHeader className="flex flex-col text-left items-start bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg pb-2">
                                <div className="relative self-center">
                                    <Avatar className="h-20 w-20 mb-2 border-2 border-primary">
                                        <AvatarImage src={mentor.profileImage || avatar} alt={mentor.firstName + ' ' + mentor.lastName} />
                                        <AvatarFallback>{mentor.firstName ? mentor.firstName.charAt(0).toUpperCase() : 'M'}</AvatarFallback>
                                    </Avatar>
                                    {mentor.isPremium && (
                                        <Crown className="absolute -top-2 -right-2 h-7 w-7 text-yellow-400 fill-yellow-400 drop-shadow-lg" title="Mentor VIP" />
                                    )}
                                </div>
                                <CardTitle className="text-xl mt-2  flex items-center gap-2">
                                    {mentor.firstName} {mentor.lastName}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500 ">{mentor.email}</CardDescription>
                                {mentor.mentorProfile?.major && (
                                    <div className="text-sm text-primary font-medium mt-1">Chuyên ngành: {mentor.mentorProfile.major}</div>
                                )}
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pt-2 pb-4">
                                {mentor.mentorProfile?.bio && (
                                    <div className="text-xs text-gray-600 text-center mb-2 line-clamp-3 min-h-[48px]">{mentor.mentorProfile.bio}</div>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        {mentor.avgRating > 0 ? mentor.avgRating : 'Chưa có'}
                                    </span>
                                    <span className="text-xs text-gray-500">({mentor.ratingCount || 0} đánh giá)</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MentorsListPage; 