import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Award,
  BarChart2,
  Settings,
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  School as University,
  GraduationCap,
  UserCog,
  DollarSign,
  CalendarDays,
  Briefcase,
  CheckCircle,
  XCircle,
  ShieldCheck,
  User
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBlockUserMutation, useCreateUserMutation, useEditUserMutation, useGetAllUsersQuery } from '../../services/UserAPI';
import { useCreateSchoolMutation, useDeleteSchoolMutation, useGetSchoolsQuery, useUpdateSchoolMutation } from '../../services/SchoolAPI';
import { useCreateScholarshipMutation, useDeleteScholarshipMutation, useGetScholarshipsQuery, useUpdateScholarshipMutation } from '../../services/ScholarshipAPI';
import { useGetScholarshipRequirementsQuery, useCreateScholarshipRequirementsMutation, useUpdateScholarshipRequirementsMutation, useDeleteScholarshipRequirementsMutation } from '../../services/ScholarRequirement';
import { useGetAllApplicationsQuery, useGetApplicationDetailQuery } from '../../services/ApplicationAPI';

import { useGetMentorsQuery, useApproveMentorMutation, useRejectMentorMutation } from '../../services/UserAPI';
import { useGetCertificateTypesQuery } from '../../services/CertificateAPI';

const AdminDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
 

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  const navItems = [
    { path: '/admin/overview', label: 'Tổng Quan', icon: <BarChart2 className="h-5 w-5" /> },
    { path: '/admin/manage-users', label: 'Quản Lý Người Dùng', icon: <UserCog className="h-5 w-5" /> },
    { path: '/admin/manage-schools', label: 'Quản Lý Trường', icon: <University className="h-5 w-5" /> },
    { path: '/admin/manage-scholarships', label: 'Quản Lý Học Bổng', icon: <GraduationCap className="h-5 w-5" /> },
    { path: '/admin/manage-requirements', label: 'Quản Lý Yêu Cầu', icon: <CheckCircle className="h-5 w-5" /> },
    { path: '/admin/manage-applications', label: 'Quản Lý Hồ Sơ', icon: <Briefcase className="h-5 w-5" /> },
    { path: '/admin/manage-mentors', label: 'Quản Lý Mentor', icon: <User className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'Cài Đặt', icon: <Settings className="h-5 w-5" /> },

  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-10rem)] gap-6">
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-72 bg-card p-6 rounded-lg shadow-xl glass-card"
      >
        <h2 className="text-3xl font-bold mb-8 text-gradient-primary flex items-center">
          <ShieldCheck className="h-8 w-8 mr-3" /> Admin Panel
        </h2>
        <nav className="space-y-3">
          {navItems.map(item => (
            <Button
              key={item.path}
              asChild
              variant={location.pathname.startsWith(item.path) ? 'default' : 'ghost'}
              className={`w-full justify-start text-md py-3 ${location.pathname.startsWith(item.path) ? 'bg-primary/90 text-primary-foreground' : 'hover:bg-primary/10'}`}
            >
              <Link to={item.path} className="flex items-center">
                {item.icon && React.cloneElement(item.icon, { className: 'mr-3 h-5 w-5' })}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 bg-card p-6 sm:p-8 rounded-lg shadow-xl glass-card overflow-auto"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export const AdminOverview = () =>{
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const premiumUserCount = users?.data?.filter(user => user.isPremium)?.length || 0;
  const userCount = users?.data?.length || 0;
  const {data: school}= useGetSchoolsQuery()
  const schoolCount = school?.data?.length
  const {data: scholarship } = useGetScholarshipsQuery()
  const scholarshipCount = scholarship?.data?.length
  const {data: scholarRequirement} = useGetScholarshipRequirementsQuery()
  const scholarRequirementConut = scholarRequirement?.data?.length

  // Tính doanh thu theo tháng và năm
  const calculateRevenue = () => {
    if (!users?.data) return { monthly: 0, yearly: 0 };
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    
    // Lọc người dùng VIP và tính doanh thu
    const monthlyRevenue = users.data
      .filter(user => user.isPremium)
      .filter(user => {
        const updateDate = new Date(user.updatedAt);
        return updateDate.getMonth() === currentMonth && 
               updateDate.getFullYear() === currentYear;
      })
      .length * 199000;

    const yearlyRevenue = users.data
      .filter(user => user.isPremium)
      .filter(user => {
        const updateDate = new Date(user.updatedAt);
        return updateDate.getFullYear() === currentYear;
      })
      .length * 199000;

    return {
      monthly: monthlyRevenue.toLocaleString('vi-VN'),
      yearly: yearlyRevenue.toLocaleString('vi-VN')
    };
  };

  const revenue = calculateRevenue();
  
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-gradient-primary"
      >
        Tổng Quan Hệ Thống
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Người Dùng Đã Đăng Ký" value={userCount} icon={<Users className="h-8 w-8 text-purple-500" />}  />
        <StatCard title="Trường Học Trong Hệ Thống" value={schoolCount} icon={<University className="h-8 w-8 text-blue-500" />}  />
        <StatCard title="Học Bổng Khả Dụng" value={scholarshipCount} icon={<GraduationCap className="h-8 w-8 text-green-500" />} />
        <StatCard title="Đơn Xin Học Bổng (Tuần)" value={scholarRequirementConut} icon={<Briefcase className="h-8 w-8 text-indigo-500" />} />
        <StatCard title="Tài Khoản VIP" value={premiumUserCount} icon={<Award className="h-8 w-8 text-pink-500" />}  />
      </div>
      <Card className="mt-8 p-6 glass-card">
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Theo dõi các hoạt động mới nhất trên hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="text-sm text-muted-foreground">Người dùng <span className="font-semibold text-primary">NgocAnh23</span> vừa nâng cấp VIP.</li>
            <li className="text-sm text-muted-foreground">Trường <span className="font-semibold text-primary">Đại học FPT</span> vừa thêm 2 học bổng mới.</li>
            <li className="text-sm text-muted-foreground">Có 15 đơn xin học bổng mới cho <span className="font-semibold text-primary">Học bổng Tài Năng Trẻ</span>.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-8 p-6 glass-card">
        <CardHeader>
          <CardTitle>Thống kê doanh thu</CardTitle>
          <CardDescription>Doanh thu từ việc nâng cấp tài khoản VIP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Doanh thu tháng {new Date().getMonth() + 1}</h3>
              <p className="text-2xl font-bold text-primary">{revenue.monthly} VNĐ</p>
              <p className="text-sm text-muted-foreground mt-2">
                Số tài khoản VIP mới: {users?.data?.filter(user => {
                  const updateDate = new Date(user.updatedAt);
                  return user.isPremium && 
                         updateDate.getMonth() === new Date().getMonth() && 
                         updateDate.getFullYear() === new Date().getFullYear();
                }).length || 0}
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Doanh thu năm {new Date().getFullYear()}</h3>
              <p className="text-2xl font-bold text-primary">{revenue.yearly} VNĐ</p>
              <p className="text-sm text-muted-foreground mt-2">
                Tổng số tài khoản VIP: {premiumUserCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 

const StatCard = ({ title, value, icon, trend }) => (
  <motion.div whileHover={{ y: -5 }} className="w-full">
    <Card className="hover:shadow-2xl transition-shadow duration-300 bg-background/70 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{value}</div>
        {trend && <p className="text-xs text-muted-foreground pt-1">{trend}</p>}
      </CardContent>
    </Card>
  </motion.div>
);
// Shared Form Dialog Component
const CrudFormDialog = ({ open, onOpenChange, entity, onSave, formFields, entityName, currentData = null }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (currentData) {
      setFormData(currentData);
    } else {
      // Initialize form data with default values or empty strings
      const initialData = formFields.reduce((acc, field) => {
        acc[field.id] = field.type === 'checkbox' ? false : field.defaultValue || '';
        return acc;
      }, {});
      setFormData(initialData);
    }
    setErrors({});
  }, [currentData, formFields, open]); // Reset form when dialog opens or currentData changes

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: undefined }));
  }

  const validate = () => {
    const newErrors = {};
    formFields.forEach(field => {
      if (field.required && (!formData[field.id] || (Array.isArray(formData[field.id]) && formData[field.id].length === 0))) {
        newErrors[field.id] = `${field.label} là bắt buộc.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // Hiển thị toast lỗi tổng hợp
      const missingFields = formFields.filter(field => field.required && (!formData[field.id] || (Array.isArray(formData[field.id]) && formData[field.id].length === 0))).map(field => field.label);
      toast({
        title: 'Vui lòng nhập đầy đủ các trường bắt buộc!',
        description: missingFields.length ? `Thiếu: ${missingFields.join(', ')}` : undefined,
        className: 'bg-red-500 text-white'
      });
      return;
    }
    let data = { ...formData };
    // Chuyển benefits textarea thành array
    if (typeof data.benefits === 'string') {
      data.benefits = data.benefits.split('\n').map(s => s.trim()).filter(Boolean);
    }
    // Chuyển requirements select-multiple thành array
    if (Array.isArray(data.requirements)) {
      // đã là array
    } else if (typeof data.requirements === 'string') {
      data.requirements = [data.requirements];
    } else if (e.target.requirements && e.target.requirements.selectedOptions) {
      data.requirements = Array.from(e.target.requirements.selectedOptions).map(opt => opt.value);
    }
    onSave(data);
    onOpenChange(false); // Close dialog after save
    // toast({
    //   title: `${currentData ? 'Cập nhật' : 'Thêm mới'} ${entityName} thành công!`,
    //   className: "bg-green-500 text-white"
    // });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[70vw] max-h-[90vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle>{currentData ? `Sửa ${entityName}` : `Thêm ${entityName} Mới`}</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho {entityName.toLowerCase()} bên dưới. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {formFields.map(field => (
            <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
              <Label htmlFor={field.id} className="text-right col-span-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</Label>
              {field.type === 'textarea' ? (
                <>
                  <Textarea id={field.id} value={formData[field.id] || ''} onChange={handleChange} className="col-span-3" placeholder={field.placeholder} />
                  {errors[field.id] && <div className="col-span-4 text-red-500 text-xs mt-1 ml-[25%]">{errors[field.id]}</div>}
                </>
              ) : field.type === 'checkbox' ? (
                <>
                  <Checkbox id={field.id} checked={!!formData[field.id]} onCheckedChange={(checked) => handleSelectChange(field.id, checked)} className="col-span-3" />
                  {errors[field.id] && <div className="col-span-4 text-red-500 text-xs mt-1 ml-[25%]">{errors[field.id]}</div>}
                </>
              ) : field.type === 'select' ? (
                <>
                  <select id={field.id} value={formData[field.id] || ''} onChange={handleChange} className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="" disabled>{field.placeholder || "Chọn một tùy chọn"}</option>
                    {(field.options || []).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors[field.id] && <div className="col-span-4 text-red-500 text-xs mt-1 ml-[25%]">{errors[field.id]}</div>}
                </>
              ) : field.type === 'select-multiple' ? (
                <>
                  <select id={field.id} multiple value={formData[field.id] || []} onChange={e => {
                    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    setFormData(prev => ({ ...prev, [field.id]: selected }));
                    setErrors(prev => ({ ...prev, [field.id]: undefined }));
                  }} className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {(field.options || []).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors[field.id] && <div className="col-span-4 text-red-500 text-xs mt-1 ml-[25%]">{errors[field.id]}</div>}
                </>
              ) : (
                <>
                  <Input id={field.id} type={field.type} value={formData[field.id] || ''} onChange={handleChange} className="col-span-3" placeholder={field.placeholder} />
                  {errors[field.id] && <div className="col-span-4 text-red-500 text-xs mt-1 ml-[25%]">{errors[field.id]}</div>}
                </>
              )}
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit">{currentData ? 'Lưu thay đổi' : `Thêm ${entityName}`}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Manage Users Page
export const ManageUsersPage = () => {
  // const [users, setUsers] = useState(initialUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  // console.log(editingUser)
  const { toast } = useToast();
  const { data: users, isLoading, error, refetch } = useGetAllUsersQuery();
  const [editUser, { isLoading: isEditing }] = useEditUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const userFormFields = [
    { id: 'firstName', label: 'Tên', type: 'text', placeholder: 'Nguyễn Văn A' },
    { id: 'lastName', label: 'Họ', type: 'text', placeholder: 'Nguyễn Văn A' },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { id: 'role', label: 'Vai trò', type: 'select', options: [{ value: 'student', label: 'student' }, { value: 'admin', label: 'admin' }], placeholder: "Chọn vai trò" },
    { id: 'isPremium', label: 'Tài khoản VIP', type: 'checkbox' },
  ];



  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        const res = await editUser({ ...userData, id: userData._id });
        if (res.data.success === true) {
          toast({
            title: res.data.message,
            className: "bg-green-500 text-white"
          });
        }
        refetch();
      } else {
        const res = await createUser(userData);
        if (res.data.success === true) {
          toast({
            title: res.data.message,
            className: "bg-green-500 text-white"
          });
        }
        refetch();
      }
    } catch (error) {
      toast({
        title: error.data.message,
        className: "bg-red-500 text-white"
      });
      console.log(error)
    }
  };

  const handleDeleteUser = async (userId) => {
    // console.log(userId)
    try {
      const res = await blockUser(userId);
      // console.log(res)
      toast({
        title: res.data.message,
        className: "bg-green-500 text-white"
      });
      refetch();
    } catch (error) {
      toast({
        title: error.data.message,
        className: "bg-red-500 text-white"
      });
      console.log(error)
    }
  };

  return (

    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-primary">Quản Lý Người Dùng</h1>
        <Button onClick={() => { setEditingUser(null); setIsFormOpen(true); }} className="bg-gradient-to-r from-primary to-accent">
          <PlusCircle className="mr-2 h-5 w-5" /> Thêm Người Dùng
        </Button>
      </div>
      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>VIP</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Hoạt động</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading && <TableCell colSpan={7} className="text-center">Loading...</TableCell>}
          {error && <TableCell colSpan={7} className="text-center">Error: {error.message}</TableCell>}
          <TableBody>
            {users?.data?.filter(user => user.role !== 'admin').map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span></TableCell>
                <TableCell>{user.isPremium ? <CheckCircle className="text-green-500 h-5 w-5" /> : <XCircle className="text-red-500 h-5 w-5" />}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{!user.isBlocked ? <CheckCircle className="text-green-500 h-5 w-5" /> : <XCircle className="text-red-500 h-5 w-5" />}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsFormOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Người dùng "{user.name}" sẽ bị xóa vĩnh viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteUser(user._id)} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <CrudFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        entity={editingUser}
        onSave={handleSaveUser}
        formFields={userFormFields}
        entityName="Người Dùng"
        currentData={editingUser}
      />
    </div>
  );
};


// Manage Schools Page
export const ManageSchoolsPage = () => {
  // const [schools, setSchools] = useState(initialSchools);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const { toast } = useToast();
  const { data: schools, isLoading, error, refetch } = useGetSchoolsQuery();
  const [createSchool, { isLoading: isCreating }] = useCreateSchoolMutation();
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();
  const [deleteSchool, { isLoading: isDeleting }] = useDeleteSchoolMutation();

  const schoolFormFields = [
    { id: 'name', label: 'Tên Trường', type: 'text', placeholder: 'Đại học Quốc Tế' },
    { id: 'address', label: 'Địa chỉ', type: 'text', placeholder: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội' },
    { id: 'website', label: 'Website', type: 'text', placeholder: 'https://hust.edu.vn' },
    { id: 'description', label: 'Mô tả', type: 'textarea', placeholder: 'Trường đại học kỹ thuật hàng đầu Việt Nam.' },
    { id: 'logo', label: 'Logo', type: 'text', placeholder: 'https://domain.com/logo.png' },
    { id: 'image', label: 'Ảnh bìa', type: 'text', placeholder: 'https://domain.com/image.png' },
    { id: 'foundedYear', label: 'Năm thành lập', type: 'number', placeholder: '1956' },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'contact@hust.edu.vn' },
    { id: 'nationality', label: 'Quốc tịch', type: 'text', placeholder: 'Việt Nam' },
  ];

  const handleSaveSchool = async (schoolData) => {
    console.log(schoolData)
    try {
      if (editingSchool) {
        const res = await updateSchool({ ...schoolData, id: schoolData._id });
        if (res.data.success === true) {
          toast({
            title: res.data.message,
            className: "bg-green-500 text-white"
          });
        }
        refetch();
      } else {
        const res = await createSchool(schoolData);
        if (res.data.success === true) {
          toast({
            title: res.data.message,
            className: "bg-green-500 text-white"
          });
        }
        refetch();
      }
    } catch (error) {
      toast({
        title: error.data.message,
        className: "bg-red-500 text-white"
      });
      console.log(error)
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    try {
      const res = await deleteSchool(schoolId);
      toast({
        title: res.data.message,
        className: "bg-green-500 text-white"
      });
      refetch();
    } catch (error) {
      toast({
        title: error.data.message,
        className: "bg-red-500 text-white"
      });
      console.log(error)
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-primary">Quản Lý Trường Học</h1>
        <Button onClick={() => { setEditingSchool(null); setIsFormOpen(true); }} className="bg-gradient-to-r from-primary to-accent">
          <PlusCircle className="mr-2 h-5 w-5" /> Thêm Trường Mới
        </Button>
      </div>
      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Tên Trường</TableHead>
              <TableHead>Quốc tịch</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số học bổng</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableCell colSpan={7} className="text-center">Loading...</TableCell>}
            {error && <TableCell colSpan={7} className="text-center">Error: {error.message}</TableCell>}
            {schools?.data?.map((school) => (
              <TableRow key={school.id}>
                <TableCell className="font-medium"><img src={school.logo} alt={school.name} className="w-10 h-10 rounded-full" /></TableCell>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell>{school.nationality}</TableCell>
                <TableCell><a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{school.website}</a></TableCell>
                <TableCell>{school.email}</TableCell>
                <TableCell>{school.scholarshipCount}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingSchool(school); setIsFormOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Trường "{school.name}" và tất cả học bổng liên quan sẽ bị xóa.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteSchool(school._id)} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <CrudFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        entity={editingSchool}
        onSave={handleSaveSchool}
        formFields={schoolFormFields}
        entityName="Trường Học"
        currentData={editingSchool}
      />
    </div>
  );
};

// Manage Scholarships Page
export const ManageScholarshipsPage = () => {
  // const [scholarships, setScholarships] = useState(initialScholarships);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const { toast } = useToast();
  const { data: schools, isLoading: isLoadingSchools, error: errorSchools, refetch: refetchSchools } = useGetSchoolsQuery();
  const { data: scholarships, isLoading: isLoadingScholarships, error: errorScholarships, refetch: refetchScholarships } = useGetScholarshipsQuery();
  const { data: scholarshipRequirements, isLoading: isLoadingScholarshipRequirements, error: errorScholarshipRequirements, refetch: refetchScholarshipRequirements } = useGetScholarshipRequirementsQuery();
  const [createScholarship, { isLoading: isCreating }] = useCreateScholarshipMutation();
  const [updateScholarship, { isLoading: isUpdating }] = useUpdateScholarshipMutation();
  const [deleteScholarship, { isLoading: isDeleting }] = useDeleteScholarshipMutation();

  // Get school options for the form
  // const schoolOptions = schools?.data?.map(school => ({ value: school._id, label: school.name }));

  const scholarshipFormFields = [
    { id: 'school', label: 'Trường', type: 'select', options: schools?.data?.map(school => ({ value: school._id, label: school.name })) || [], placeholder: 'Chọn trường học' },
    { id: 'name', label: 'Tên Học Bổng', type: 'text', placeholder: 'Học bổng ABC' },
    { id: 'value', label: 'Giá trị', type: 'text', placeholder: 'VD: 100% học phí, 50.000.000 VNĐ' },
    { id: 'field', label: 'Lĩnh vực', type: 'text', placeholder: 'Kỹ thuật, Kinh tế,...' },
    { id: 'location', label: 'Địa điểm', type: 'text', placeholder: 'Hà Nội, TP.HCM,...' },
    { id: 'deadline', label: 'Hạn nộp', type: 'date' },
    { id: 'description', label: 'Mô tả', type: 'textarea', placeholder: 'Mô tả chi tiết về học bổng...' },
    { id: 'detail', label: 'Chi tiết', type: 'textarea', placeholder: 'Thông tin chi tiết về học bổng...' },
    { id: 'benefits', label: 'Lợi ích', type: 'textarea', placeholder: 'Liệt kê các lợi ích, mỗi lợi ích một dòng.' },
    { id: 'applicationMethod', label: 'Cách nộp', type: 'text', placeholder: 'Hướng dẫn nộp đơn...' },
    {
      id: 'requirements', label: 'Yêu cầu', type: 'select', options: (
        scholarshipRequirements?.data?.map(r => ({
          value: r._id,
          label: [
            r.minGPA ? `GPA ≥ ${r.minGPA}` : null,
            ...(r.minCertificateScores?.length ? r.minCertificateScores.map(mcs => `${mcs.certificateName} ≥ ${mcs.minScore}`) : []),
            r.requiredCertificates?.length ? r.requiredCertificates.map(c => c.name).join(', ') : null,
            r.otherConditions ? r.otherConditions : null
          ].filter(Boolean).join(' | ')
        })) || []
      ), placeholder: 'Chọn yêu cầu học bổng'
    },
  ];

  const handleSaveScholarship = async (scholarshipData) => {
    console.log(scholarshipData)
    try {
      if (editingScholarship) {
        const res = await updateScholarship({ ...scholarshipData, id: scholarshipData._id });
        if (res.data && res.data.status === 201) {
          toast({
            title: res.data.message,
            className: "bg-green-500 text-white"
          });
        }
        if (res.error && res.error.status == 400) {
          let msg = res.error.data.message;
          if (Array.isArray(res.error.data.missingFields)) {
            msg = `Thiếu các trường: ${res.error.data.missingFields.join(', ')}`;
          }
          toast({
            title: msg,
            className: "bg-red-500 text-white"
          });
        }
        refetchScholarships();
      } else {
        const res = await createScholarship(scholarshipData);
        console.log(res)
        if (res.data && res.data.status === 201) {
          toast({
            title: res.data.message,
            className: "bg-green-500 text-white"
          });
        }
        if (res.error && res.error.status === 400) {
          let msg = res.error.data.message;
          if (Array.isArray(res.error.data.missingFields)) {
            msg = `Thiếu các trường: ${res.error.data.missingFields.join(', ')}`;
          }
          toast({
            title: msg,
            className: "bg-red-500 text-white"
          });
        }
        refetchScholarships();
      }
    } catch (error) {
      console.log(error)
      toast({
        title: error?.error?.data?.message || 'Có lỗi xảy ra!',
        className: "bg-red-500 text-white"
      });
      console.log(error)
    }
  };

  const handleDeleteScholarship = async (scholarshipId) => {
    try {
      const res = await deleteScholarship(scholarshipId);
      toast({
        title: res.data.message,
        className: "bg-green-500 text-white"
      });
      refetchScholarships();
    } catch (error) {
      toast({
        title: error.data.message,
        className: "bg-red-500 text-white"
      });
      console.log(error)
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-primary">Quản Lý Học Bổng</h1>
        <Button onClick={() => { setEditingScholarship(null); setIsFormOpen(true); }} className="bg-gradient-to-r from-primary to-accent">
          <PlusCircle className="mr-2 h-5 w-5" /> Thêm Học Bổng
        </Button>
      </div>
      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Học Bổng</TableHead>
              <TableHead>Trường</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Hạn nộp</TableHead>
              <TableHead>Lĩnh vực</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingScholarships || isLoadingScholarshipRequirements || isLoadingSchools && <TableCell colSpan={7} className="text-center">Loading...</TableCell>}
            {errorScholarships || errorScholarshipRequirements && <TableCell colSpan={7} className="text-center">Error: {errorScholarships.message}</TableCell>}
            {scholarships?.data?.map((scholarship) => (
              <TableRow key={scholarship._id}>
                <TableCell className="font-medium">{scholarship.name}</TableCell>
                <TableCell>{scholarship.school.name}</TableCell>
                <TableCell>{scholarship.value}</TableCell>
                <TableCell>{new Date(scholarship.deadline).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{scholarship.field}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingScholarship(scholarship); setIsFormOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Học bổng "{scholarship.name}" sẽ bị xóa vĩnh viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteScholarship(scholarship._id)} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <CrudFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        entity={editingScholarship}
        onSave={handleSaveScholarship}
        formFields={scholarshipFormFields}
        entityName="Học Bổng"
        currentData={editingScholarship}
      />
    </div>
  );
};

export const ManageApplicationsPage = () => {
  const { data, isLoading, error, refetch } = useGetAllApplicationsQuery();

  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-primary">Quản Lý Hồ Sơ Đã Nộp</h1>
        <Button onClick={refetch} className="bg-gradient-to-r from-primary to-accent">Làm mới</Button>
      </div>
      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học bổng</TableHead>
              <TableHead>Người nộp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày nộp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableCell colSpan={5} className="text-center">Loading...</TableCell>}
            {error && <TableCell colSpan={5} className="text-center">Error: {error.message}</TableCell>}
            {data?.data?.map(app => (
              <TableRow key={app._id}>
                <TableCell>
                  <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/admin/application/${app._id}`)}>{app.scholarshipName}</span>
                </TableCell>
                <TableCell>{app.studentName}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>{new Date(app.createdAt).toLocaleDateString('vi-VN')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// Trang chi tiết đơn nộp
export const ApplicationDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetApplicationDetailQuery(id);
  const app = data?.data;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!app) return <div>Không tìm thấy đơn nộp</div>;
  return (
    <div className="w-full min-h-screen mt-0 p-6 bg-white rounded-none shadow-none">
      <h2 className="text-2xl font-bold mb-4 text-gradient-primary">Chi Tiết Đơn Nộp</h2>
      <div className="mb-4">
        <strong>Học bổng:</strong> {app.scholarship?.name}
      </div>
      <div className="mb-4">
        <strong>Trường:</strong> {app.scholarship?.school?.name}
        {app.scholarship?.school?.logo && (
          <img src={app.scholarship.school.logo} alt="logo" className="w-10 h-10 rounded-full inline-block ml-2 align-middle" />
        )}
      </div>
      <div className="mb-4">
        <strong>Người nộp:</strong> {app.student?.firstName} {app.student?.lastName}
      </div>
      <div className="mb-4">
        <strong>Email:</strong> {app.student?.email}
      </div>
      <div className="mb-4">
        <strong>Trạng thái:</strong> {app.status}
      </div>
      <div className="mb-4">
        <strong>Ngày nộp:</strong> {new Date(app.createdAt).toLocaleDateString('vi-VN')}
      </div>
      <div className="mb-4">
        <strong>Giá trị học bổng:</strong> {app.scholarship?.value}
      </div>
      <div className="mb-4">
        <strong>Lĩnh vực:</strong> {app.scholarship?.field}
      </div>
      <div className="mb-4">
        <strong>Địa điểm:</strong> {app.scholarship?.location}
      </div>
      <div className="mb-4">
        <strong>Hạn nộp:</strong> {app.scholarship?.deadline && new Date(app.scholarship.deadline).toLocaleDateString('vi-VN')}
      </div>
      <div className="mb-4">
        <strong>Mô tả:</strong> {app.scholarship?.description}
      </div>
      <div className="mb-4">
        <strong>Chi tiết:</strong> {app.scholarship?.detail}
      </div>
      <div className="mb-4">
        <strong>Lợi ích:</strong>
        <ul className="list-disc ml-6">
          {app.scholarship?.benefits?.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Phương thức nộp:</strong> {app.scholarship?.applicationMethod}
      </div>
      <div className="mb-4">
        <strong>Bài luận:</strong> {app.essay}
      </div>
      <div className="mb-4">
        <strong>Tài liệu đính kèm:</strong>
        <ul className="list-disc ml-6">
          {app.documents?.map((doc, i) => <li key={i}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{doc.name}</a></li>)}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Bảng điểm lớp 10:</strong>
        <ul className="list-disc ml-6">
          {app.profileSnapshot?.grades10?.map((g, i) => <li key={i}>{g.subject}: {g.score}</li>)}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Bảng điểm lớp 11:</strong>
        <ul className="list-disc ml-6">
          {app.profileSnapshot?.grades11?.map((g, i) => <li key={i}>{g.subject}: {g.score}</li>)}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Bảng điểm lớp 12:</strong>
        <ul className="list-disc ml-6">
          {app.profileSnapshot?.grades12?.map((g, i) => <li key={i}>{g.subject}: {g.score}</li>)}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Chứng chỉ:</strong>
        <ul className="list-disc ml-6">
          {app.profileSnapshot?.certificates?.map((c, i) => <li key={i}>ID: {c.certificateType?.name || c.certificateType} - Điểm: {c.score} - Ngày: {c.date && new Date(c.date).toLocaleDateString('vi-VN')}</li>)}
        </ul>
      </div>
    </div>
  );
};

export const AdminSettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "ScholarSeeker",
    maintenanceMode: false,
    defaultEmail: "admin@scholarseeker.com",
    maxUploadSize: 10, // MB
  });

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSliderChange = (value) => {
    setSettings(prev => ({ ...prev, maxUploadSize: value[0] }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Here you would typically save settings to a backend/DB
    console.log("Settings saved:", settings);
    toast({ title: "Cài đặt đã được lưu!" });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gradient-primary">Cài Đặt Hệ Thống</h1>
      <Card className="glass-card p-6">
        <form onSubmit={handleSaveSettings} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Tên Trang Web</Label>
              <Input id="siteName" value={settings.siteName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultEmail">Email Quản Trị Mặc Định</Label>
              <Input id="defaultEmail" type="email" value={settings.defaultEmail} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUploadSize">Kích Thước Upload Tối Đa (MB): {settings.maxUploadSize}MB</Label>
            <Slider
              id="maxUploadSize"
              defaultValue={[settings.maxUploadSize]}
              max={100}
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="maintenanceMode" checked={settings.maintenanceMode} onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))} />
            <Label htmlFor="maintenanceMode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Bật Chế Độ Bảo Trì
            </Label>
          </div>

          {settings.maintenanceMode && (
            <div className="space-y-2 p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
              <Label htmlFor="maintenanceMessage">Thông Báo Bảo Trì</Label>
              <Textarea id="maintenanceMessage" placeholder="Trang web đang được bảo trì. Vui lòng quay lại sau." />
              <p className="text-xs text-yellow-700 dark:text-yellow-400">Khi bật, chỉ admin mới có thể truy cập trang web.</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">Lưu Cài Đặt</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export const ManageRequirementsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const { toast } = useToast();
  const { data: requirements, isLoading, error, refetch } = useGetScholarshipRequirementsQuery();
  const { data: scholarships } = useGetScholarshipsQuery();
  const { data: certificateTypes } = useGetCertificateTypesQuery();
  const [createRequirement] = useCreateScholarshipRequirementsMutation();
  const [updateRequirement] = useUpdateScholarshipRequirementsMutation();
  const [deleteRequirement] = useDeleteScholarshipRequirementsMutation();

  const [formData, setFormData] = useState({
    scholarship: '',
    minGPA: '',
    requiredCertificates: [''],
    minCertificateScores: [{ certificateType: '', minScore: '' }],
    otherConditions: ''
  });

  useEffect(() => {
    if (editingRequirement) {
      setFormData({
        scholarship: editingRequirement.scholarship,
        minGPA: editingRequirement.minGPA || '',
        requiredCertificates: editingRequirement.requiredCertificates?.length ? [editingRequirement.requiredCertificates[0]] : [''],
        minCertificateScores: editingRequirement.minCertificateScores?.length ? 
          [{
            certificateType: editingRequirement.minCertificateScores[0].certificateType,
            minScore: editingRequirement.minCertificateScores[0].minScore
          }] : 
          [{ certificateType: '', minScore: '' }],
        otherConditions: editingRequirement.otherConditions || ''
      });
    }
  }, [editingRequirement]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.scholarship) {
        toast({
          title: 'Vui lòng chọn học bổng!',
          className: "bg-red-500 text-white"
        });
        return;
      }

      const dataToSend = {
        ...formData,
        minGPA: formData.minGPA ? parseFloat(formData.minGPA) : undefined,
        requiredCertificates: formData.requiredCertificates[0] ? [formData.requiredCertificates[0]] : [],
        minCertificateScores: formData.minCertificateScores[0].certificateType && formData.minCertificateScores[0].minScore ? 
          [{
            certificateType: formData.minCertificateScores[0].certificateType,
            minScore: parseFloat(formData.minCertificateScores[0].minScore)
          }] : []
      };

      if (editingRequirement) {
        const res = await updateRequirement({ ...dataToSend, id: editingRequirement._id });
        if (res.data.status === 200) {
          toast({
            title: res.data.message,
            className: "bg-green-500 text-white"
          });
        }
      } else {
        const res = await createRequirement(dataToSend);
        if (res.data.status === 201) {
          toast({
            title: res.data.message,
            className: "bg-green-500 text-white"
          });
        }
      }
      setIsFormOpen(false);
      setEditingRequirement(null);
      setFormData({
        scholarship: '',
        minGPA: '',
        requiredCertificates: [''],
        minCertificateScores: [{ certificateType: '', minScore: '' }],
        otherConditions: ''
      });
      refetch();
    } catch (error) {
      toast({
        title: error.data?.message || 'Có lỗi xảy ra!',
        className: "bg-red-500 text-white"
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteRequirement(id);
      if (res.data.status === 200) {
        toast({
          title: res.data.message,
          className: "bg-green-500 text-white"
        });
        refetch();
      }
    } catch (error) {
      toast({
        title: error.data?.message || 'Có lỗi xảy ra!',
        className: "bg-red-500 text-white"
      });
    }
  };

  const updateCertificateScore = (field, value) => {
    setFormData(prev => ({
      ...prev,
      minCertificateScores: [{
        ...prev.minCertificateScores[0],
        [field]: value
      }]
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-primary">Quản Lý Yêu Cầu Học Bổng</h1>
        <Button 
          onClick={() => {
            setEditingRequirement(null);
            setFormData({
              scholarship: '',
              minGPA: '',
              requiredCertificates: [''],
              minCertificateScores: [{ certificateType: '', minScore: '' }],
              otherConditions: ''
            });
            setIsFormOpen(true);
          }} 
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Thêm Yêu Cầu Mới
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRequirement ? 'Sửa Yêu Cầu' : 'Thêm Yêu Cầu Mới'}</DialogTitle>
            <DialogDescription>
              {editingRequirement ? 'Cập nhật thông tin yêu cầu' : 'Điền thông tin yêu cầu cho học bổng'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scholarship">Học bổng *</Label>
              <select
                id="scholarship"
                value={formData.scholarship}
                onChange={(e) => setFormData(prev => ({ ...prev, scholarship: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="">Chọn học bổng</option>
                {scholarships?.data?.map(sch => (
                  <option key={sch._id} value={sch._id}>{sch.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minGPA">GPA tối thiểu</Label>
              <Input
                id="minGPA"
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                value={formData.minGPA}
                onChange={(e) => setFormData(prev => ({ ...prev, minGPA: e.target.value }))}
                placeholder="VD: 3.0"
              />
            </div>

            <div className="space-y-2">
              <Label>Chứng chỉ bắt buộc</Label>
              <select
                value={formData.requiredCertificates[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  requiredCertificates: [e.target.value]
                }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Chọn chứng chỉ bắt buộc</option>
                {certificateTypes?.data?.map(cert => (
                  <option key={cert._id} value={cert._id}>{cert.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Điểm chứng chỉ tối thiểu</Label>
              <div className="flex gap-2 items-center">
                <select
                  value={formData.minCertificateScores[0].certificateType}
                  onChange={(e) => updateCertificateScore('certificateType', e.target.value)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Chọn chứng chỉ</option>
                  {certificateTypes?.data?.map(cert => (
                    <option key={cert._id} value={cert._id}>{cert.name}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.minCertificateScores[0].minScore}
                  onChange={(e) => updateCertificateScore('minScore', e.target.value)}
                  placeholder="Điểm"
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherConditions">Điều kiện khác</Label>
              <Textarea
                id="otherConditions"
                value={formData.otherConditions}
                onChange={(e) => setFormData(prev => ({ ...prev, otherConditions: e.target.value }))}
                placeholder="Nhập các điều kiện khác nếu có"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsFormOpen(false);
                setEditingRequirement(null);
              }}>
                Hủy
              </Button>
              <Button type="submit">{editingRequirement ? 'Lưu thay đổi' : 'Thêm yêu cầu'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>GPA tối thiểu</TableHead>
              <TableHead>Chứng chỉ tối thiểu</TableHead>
              <TableHead>Chứng chỉ bắt buộc</TableHead>
              <TableHead>Điều kiện khác</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableCell colSpan={5} className="text-center">Loading...</TableCell>}
            {error && <TableCell colSpan={5} className="text-center">Error: {error.message}</TableCell>}
            {requirements?.data?.map((requirement) => (
              <TableRow key={requirement._id}>
                <TableCell className="font-medium">{requirement.minGPA || 'Không yêu cầu'}</TableCell>
                <TableCell>
                  {requirement.minCertificateScores?.map((cert, index) => (
                    <div key={index} className="mb-1">
                      <span className="font-medium">{cert.certificateName}</span>: {cert.minScore}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {requirement.requiredCertificates?.map((cert, index) => (
                    <div key={index} className="mb-1">
                      <span className="font-medium">{cert.name}</span>
                    </div>
                  ))}
                </TableCell>
                <TableCell>{requirement.otherConditions || 'Không có'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setEditingRequirement(requirement);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Yêu cầu này sẽ bị xóa vĩnh viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(requirement._id)} 
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export const ManageMentorsPage = () => {
  const { data, isLoading, error, refetch } = useGetMentorsQuery();
  const [approveMentor] = useApproveMentorMutation();
  const [rejectMentor] = useRejectMentorMutation();
  const { toast } = useToast();
  const [rejectDialog, setRejectDialog] = useState({ open: false, mentor: null, reason: '' });
  const navigate = useNavigate();

  const handleApprove = async (id) => {
    try {
      await approveMentor(id).unwrap();
      toast({ title: 'Duyệt mentor thành công!', className: 'bg-green-500 text-white' });
      refetch();
    } catch (err) {
      toast({ title: 'Lỗi duyệt mentor', description: err?.data?.message || 'Lỗi không xác định', className: 'bg-red-500 text-white' });
    }
  };
  const handleReject = async () => {
    try {
      await rejectMentor({ id: rejectDialog.mentor._id, reason: rejectDialog.reason }).unwrap();
      toast({ title: 'Từ chối mentor thành công!', className: 'bg-green-500 text-white' });
      setRejectDialog({ open: false, mentor: null, reason: '' });
      refetch();
    } catch (err) {
      toast({ title: 'Lỗi từ chối mentor', description: err?.data?.message || 'Lỗi không xác định', className: 'bg-red-500 text-white' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gradient-primary mb-6">Quản Lý Mentor</h1>
      <Card className="glass-card p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Chuyên ngành</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableCell colSpan={5} className="text-center">Đang tải...</TableCell>}
            {error && <TableCell colSpan={5} className="text-center">Lỗi: {error.message}</TableCell>}
            {data?.data?.map((mentor) => (
              <TableRow key={mentor._id}>
                <TableCell>
                  <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/admin/mentor/${mentor._id}`)}
                  >
                    {mentor.firstName} {mentor.lastName}
                  </span>
                </TableCell>
                <TableCell>{mentor.email}</TableCell>
                <TableCell>{mentor.mentorProfile?.major}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${mentor.mentorStatus === 'approved' ? 'bg-green-100 text-green-700' : mentor.mentorStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{mentor.mentorStatus}</span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {mentor.mentorStatus === 'pending' && (
                    <>
                      <Button size="sm" variant="success" onClick={() => handleApprove(mentor._id)}>Duyệt</Button>
                      <Button size="sm" variant="destructive" onClick={() => setRejectDialog({ open: true, mentor, reason: '' })}>Từ chối</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={rejectDialog.open} onOpenChange={open => setRejectDialog(d => ({ ...d, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối mentor</DialogTitle>
            <DialogDescription>Nhập lý do từ chối mentor <b>{rejectDialog.mentor?.firstName} {rejectDialog.mentor?.lastName}</b></DialogDescription>
          </DialogHeader>
          <Textarea value={rejectDialog.reason} onChange={e => setRejectDialog(d => ({ ...d, reason: e.target.value }))} placeholder="Nhập lý do từ chối..." />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, mentor: null, reason: '' })}>Hủy</Button>
            <Button variant="destructive" onClick={handleReject}>Từ chối</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboardPage;

