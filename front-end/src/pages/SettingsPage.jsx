import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentUser } from '../slices/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useChangePasswordMutation } from '../services/AuthAPI';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const user = useSelector(selectCurrentUser);
    const { toast } = useToast();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = () => {
        dispatch(logOut());
        navigate('/login');
    }

    const [changePassword, { isLoading: loadingChangePassword }] = useChangePasswordMutation();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast({ title: 'Vui lòng nhập đầy đủ thông tin', variant: 'destructive' });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ title: 'Mật khẩu mới không khớp', variant: 'destructive' });
            return;
        }
        setLoading(true);
        try {
            const res = await changePassword({
                email: user.email,
                oldPassword,
                newPassword,
            })
            console.log(res);
            if (res?.data) {
                toast({
                    title: 'Đổi mật khẩu thành công vui lòng đăng nhập lại!',
                    description: res?.data?.data?.message,
                    variant: 'success'
                });
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setLoading(false);
                handleLogOut();
            }
            else {
                toast({
                    title: 'Đổi mật khẩu thất bại',
                    description: res?.error?.data?.error?.message,
                    variant: 'destructive'
                });
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            
            setLoading(false);
        }

    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Mật khẩu cũ</label>
                    <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Mật khẩu mới</label>
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Xác nhận mật khẩu mới</label>
                    <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                </Button>
            </form>
        </div>
    );
};

export default SettingsPage; 