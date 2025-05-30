import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, UserPlus, Home, BookOpen, Award, UserCircle, LogOut, Settings, Newspaper, ShieldCheck, Crown  } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { logOut } from '../slices/authSlice';
import { useDispatch } from 'react-redux';
import helloIcon from '../../public/images/av1.svg';
const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  console.log(user);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logOut());
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại 🖐",
      className: "bg-green-500 text-white",
    });
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
              <Award className="h-10 w-10 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold text-gradient-primary">GrantHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" icon={<Home className="h-5 w-5 mr-1" />}>Trang chủ</NavLink>
            <NavLink to="/schools" icon={<BookOpen className="h-5 w-5 mr-1" />}>Trường học</NavLink>
            <NavLink to="/scholarships" icon={<Award className="h-5 w-5 mr-1" />}>Học bổng</NavLink>
            <NavLink to="/blog" icon={<Newspaper className="h-5 w-5 mr-1" />}>Blog</NavLink>
          </div>

          <div className="flex items-center space-x-3">
            { user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full flex items-center">
                    <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors ">
                      <AvatarImage src={user.profileImage || helloIcon} alt={user.name || 'User'} />
                      <AvatarFallback>{user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                    {user.isPremium && (
                      <Crown className="absolute bottom-7 z-[-1] left-1/2 -translate-x-1/2 h-5 w-5 text-yellow-400 fill-yellow-400" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none flex items-center">
                        {user.firstName + ' ' + user.lastName || 'Người dùng'}
                        {user.isPremium && <Crown className="ml-2 mb-2 h-4 w-4 text-yellow-400 fill-yellow-400" />}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user._id}`)}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                     <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Quản trị</span>
                    </DropdownMenuItem>
                  )}
                  {!user.isVip && (
                    <DropdownMenuItem onClick={() => navigate('/vip-subscription')} className="text-primary hover:!text-primary focus:!text-primary focus:!bg-primary/10">
                      <Award className="mr-2 h-4 w-4" />
                      <span>Nâng Cấp VIP</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  <LogIn className="mr-2 h-5 w-5" /> Đăng nhập
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                  <UserPlus className="mr-2 h-5 w-5" /> Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="flex items-center text-md font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;