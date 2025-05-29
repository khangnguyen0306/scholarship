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
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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

export const AdminOverview = () => (
  <div>
    <motion.h1 
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      className="text-3xl font-bold mb-8 text-gradient-primary"
    >
      Tổng Quan Hệ Thống
    </motion.h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="Người Dùng Đã Đăng Ký" value="12,500" icon={<Users className="h-8 w-8 text-purple-500" />} trend="+5% tháng này" />
      <StatCard title="Trường Học Trong Hệ Thống" value="150" icon={<University className="h-8 w-8 text-blue-500" />} trend="+2 trường mới" />
      <StatCard title="Học Bổng Khả Dụng" value="780" icon={<GraduationCap className="h-8 w-8 text-green-500" />} trend="+30 học bổng mới" />
      <StatCard title="Lượt Truy Cập Hôm Nay" value="5,678" icon={<BarChart2 className="h-8 w-8 text-yellow-500" />} trend="Ổn định" />
      <StatCard title="Đơn Xin Học Bổng (Tuần)" value="320" icon={<Briefcase className="h-8 w-8 text-indigo-500" />} trend="+15% so với tuần trước" />
      <StatCard title="Tài Khoản VIP" value="850" icon={<Award className="h-8 w-8 text-pink-500" />} trend="+50 VIP mới" />
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
  </div>
);

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

// MOCK DATA
const initialUsers = [
  { id: 'usr001', name: 'Nguyễn Văn An', email: 'an.nv@example.com', role: 'user', joinedDate: '2024-01-15', isVip: true, applications: 5 },
  { id: 'usr002', name: 'Trần Thị Bình', email: 'binh.tt@example.com', role: 'user', joinedDate: '2024-02-20', isVip: false, applications: 2 },
  { id: 'usr003', name: 'Lê Văn Cường', email: 'cuong.lv@example.com', role: 'admin', joinedDate: '2023-12-01', isVip: true, applications: 0 },
];
const initialSchools = [
  { id: 'sch001', name: 'Đại học Bách Khoa Hà Nội', location: 'Hà Nội', website: 'hust.edu.vn', scholarshipsCount: 15 },
  { id: 'sch002', name: 'Đại học Kinh Tế Quốc Dân', location: 'Hà Nội', website: 'neu.edu.vn', scholarshipsCount: 10 },
  { id: 'sch003', name: 'RMIT University Vietnam', location: 'TP.HCM', website: 'rmit.edu.vn', scholarshipsCount: 25 },
];
const initialScholarships = [
  { id: 'schol001', name: 'Học bổng Tài năng Trẻ', schoolId: 'sch001', schoolName: 'Đại học Bách Khoa Hà Nội', amount: '50% học phí', deadline: '2025-09-30', field: 'Kỹ thuật' },
  { id: 'schol002', name: 'Học bổng Doanh nhân Tương lai', schoolId: 'sch002', schoolName: 'Đại học Kinh Tế Quốc Dân', amount: 'Toàn phần', deadline: '2025-08-15', field: 'Kinh doanh' },
  { id: 'schol003', name: 'Creative Innovators Scholarship', schoolId: 'sch003', schoolName: 'RMIT University Vietnam', amount: '$10,000', deadline: '2025-10-01', field: 'Thiết kế, Truyền thông' },
];

// Shared Form Dialog Component
const CrudFormDialog = ({ open, onOpenChange, entity, onSave, formFields, entityName, currentData = null }) => {
  const [formData, setFormData] = useState({});
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
  }, [currentData, formFields, open]); // Reset form when dialog opens or currentData changes

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false); // Close dialog after save
    toast({ title: `${currentData ? 'Cập nhật' : 'Thêm mới'} ${entityName} thành công!` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentData ? `Sửa ${entityName}` : `Thêm ${entityName} Mới`}</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho {entityName.toLowerCase()} bên dưới. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {formFields.map(field => (
            <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
              <Label htmlFor={field.id} className="text-right col-span-1">{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea id={field.id} value={formData[field.id] || ''} onChange={handleChange} className="col-span-3" placeholder={field.placeholder} />
              ) : field.type === 'checkbox' ? (
                <Checkbox id={field.id} checked={!!formData[field.id]} onCheckedChange={(checked) => handleSelectChange(field.id, checked)} className="col-span-3" />
              ) : field.type === 'select' ? (
                 <select id={field.id} value={formData[field.id] || ''} onChange={handleChange} className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="" disabled>{field.placeholder || "Chọn một tùy chọn"}</option>
                    {field.options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                 </select>
              ) : (
                <Input id={field.id} type={field.type} value={formData[field.id] || ''} onChange={handleChange} className="col-span-3" placeholder={field.placeholder} />
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
  const [users, setUsers] = useState(initialUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { toast } = useToast();

  const userFormFields = [
    { id: 'name', label: 'Tên', type: 'text', placeholder: 'Nguyễn Văn A' },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { id: 'role', label: 'Vai trò', type: 'select', options: [{value: 'user', label: 'User'}, {value: 'admin', label: 'Admin'}], placeholder: "Chọn vai trò" },
    { id: 'isVip', label: 'Tài khoản VIP', type: 'checkbox' },
  ];

  const handleSaveUser = (userData) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
      setEditingUser(null);
    } else {
      setUsers([...users, { ...userData, id: `usr${Date.now()}`, joinedDate: new Date().toISOString().split('T')[0], applications: 0 }]);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({ title: "Xóa người dùng thành công!", variant: "destructive" });
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
              <TableHead>Đơn đã nộp</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span></TableCell>
                <TableCell>{user.isVip ? <CheckCircle className="text-green-500 h-5 w-5"/> : <XCircle className="text-red-500 h-5 w-5"/>}</TableCell>
                <TableCell>{new Date(user.joinedDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{user.applications}</TableCell>
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
                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
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
  const [schools, setSchools] = useState(initialSchools);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const { toast } = useToast();

  const schoolFormFields = [
    { id: 'name', label: 'Tên Trường', type: 'text', placeholder: 'Đại học Quốc Tế' },
    { id: 'location', label: 'Địa điểm', type: 'text', placeholder: 'TP. Hồ Chí Minh' },
    { id: 'website', label: 'Website', type: 'text', placeholder: 'www.example.edu.vn' },
    { id: 'description', label: 'Mô tả', type: 'textarea', placeholder: 'Mô tả ngắn về trường...' },
    { id: 'logoUrl', label: 'Link Logo', type: 'text', placeholder: 'https://link.to/logo.png' },
  ];

  const handleSaveSchool = (schoolData) => {
    if (editingSchool) {
      setSchools(schools.map(s => s.id === editingSchool.id ? { ...s, ...schoolData } : s));
      setEditingSchool(null);
    } else {
      setSchools([...schools, { ...schoolData, id: `sch${Date.now()}`, scholarshipsCount: 0 }]);
    }
  };

  const handleDeleteSchool = (schoolId) => {
    setSchools(schools.filter(s => s.id !== schoolId));
    toast({ title: "Xóa trường học thành công!", variant: "destructive" });
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
              <TableHead>Tên Trường</TableHead>
              <TableHead>Địa điểm</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Số học bổng</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id}>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell>{school.location}</TableCell>
                <TableCell><a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{school.website}</a></TableCell>
                <TableCell>{school.scholarshipsCount}</TableCell>
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
                        <AlertDialogAction onClick={() => handleDeleteSchool(school.id)} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
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
  const [scholarships, setScholarships] = useState(initialScholarships);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const { toast } = useToast();
  
  // Get school options for the form
  const schoolOptions = initialSchools.map(school => ({ value: school.id, label: school.name }));

  const scholarshipFormFields = [
    { id: 'name', label: 'Tên Học Bổng', type: 'text', placeholder: 'Học bổng ABC' },
    { id: 'schoolId', label: 'Trường', type: 'select', options: schoolOptions, placeholder: "Chọn trường học" },
    { id: 'amount', label: 'Giá trị', type: 'text', placeholder: 'VD: 100% học phí, 50.000.000 VNĐ' },
    { id: 'deadline', label: 'Hạn nộp', type: 'date' },
    { id: 'field', label: 'Lĩnh vực', type: 'text', placeholder: 'Kỹ thuật, Kinh tế,...' },
    { id: 'description', label: 'Mô tả', type: 'textarea', placeholder: 'Mô tả chi tiết về học bổng...' },
    { id: 'requirements', label: 'Yêu cầu', type: 'textarea', placeholder: 'Liệt kê các yêu cầu, mỗi yêu cầu một dòng.' },
  ];

  const handleSaveScholarship = (scholarshipData) => {
    const schoolName = initialSchools.find(s => s.id === scholarshipData.schoolId)?.name || 'Không rõ';
    if (editingScholarship) {
      setScholarships(scholarships.map(s => s.id === editingScholarship.id ? { ...s, ...scholarshipData, schoolName } : s));
      setEditingScholarship(null);
    } else {
      setScholarships([...scholarships, { ...scholarshipData, id: `schol${Date.now()}`, schoolName }]);
    }
  };

  const handleDeleteScholarship = (scholarshipId) => {
    setScholarships(scholarships.filter(s => s.id !== scholarshipId));
    toast({ title: "Xóa học bổng thành công!", variant: "destructive" });
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
            {scholarships.map((scholarship) => (
              <TableRow key={scholarship.id}>
                <TableCell className="font-medium">{scholarship.name}</TableCell>
                <TableCell>{scholarship.schoolName}</TableCell>
                <TableCell>{scholarship.amount}</TableCell>
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
                        <AlertDialogAction onClick={() => handleDeleteScholarship(scholarship.id)} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
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
    toast({ title: "Cài đặt đã được lưu!"});
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


export default AdminDashboardPage;
