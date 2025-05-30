import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Provider, useSelector } from 'react-redux';
import { store } from '../store';
import SettingsPage from './pages/SettingsPage';
import VerifyEmail from './pages/auth/VerifyEmail';
// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const SchoolsListPage = lazy(() => import('@/pages/schools/SchoolsListPage'));
const SchoolDetailPage = lazy(() => import('@/pages/schools/SchoolDetailPage'));
const ScholarshipsListPage = lazy(() => import('@/pages/scholarships/ScholarshipsListPage'));
const ScholarshipDetailPage = lazy(() => import('@/pages/scholarships/ScholarshipDetailPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const VipSubscriptionPage = lazy(() => import('@/pages/VipSubscriptionPage'));
const BlogPage = lazy(() => import('@/pages/blog/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/blog/BlogPostPage'));

const NewPostPage = lazy(() => {
  // This is a placeholder. In a real app, you'd import a real component.
  // For now, it resolves to a simple div.
  // In a real app, you'd create a proper NewPostPage.jsx component
  return Promise.resolve({
    default: () => (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gradient-primary mb-6">Tạo Bài Viết Mới</h1>
        <p className="text-muted-foreground">Giao diện tạo bài viết mới sẽ được triển khai ở đây. Chỉ thành viên VIP mới có thể truy cập trang này.</p>
        {/* Add form elements for title, content, category, etc. */}
      </div>
    )
  });
});

const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));

// Correctly lazy load Admin sub-components
const AdminOverview = lazy(async () => {
  const module = await import('@/pages/AdminDashboardPage');
  return { default: module.AdminOverview || (() => <div>Admin Overview Placeholder</div>) };
});
const ManageSchoolsPage = lazy(async () => {
  const module = await import('@/pages/AdminDashboardPage');
  return { default: module.ManageSchoolsPage || (() => <div>Manage Schools Placeholder</div>) };
});
const ManageScholarshipsPage = lazy(async () => {
  const module = await import('@/pages/AdminDashboardPage');
  return { default: module.ManageScholarshipsPage || (() => <div>Manage Scholarships Placeholder</div>) };
});
const ManageUsersPage = lazy(async () => {
  const module = await import('@/pages/AdminDashboardPage');
  return { default: module.ManageUsersPage || (() => <div>Manage Users Placeholder</div>) };
});
const AdminSettingsPage = lazy(async () => {
  const module = await import('@/pages/AdminDashboardPage');
  return { default: module.AdminSettingsPage || (() => <div>Admin Settings Placeholder</div>) };
});


const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="verify-email/:token" element={<VerifyEmail />} />
              <Route path="schools" element={<SchoolsListPage />} />
              <Route path="schools/:schoolId" element={<SchoolDetailPage />} />

              <Route path="scholarships" element={<ScholarshipsListPage />} />
              <Route path="scholarships/:scholarshipId" element={<ScholarshipDetailPage />} />

              <Route path="profile/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
              <Route path="vip-subscription" element={<VipSubscriptionPage />} />

              <Route path="blog" element={<BlogPage />} />
              <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route
                path="blog/new-post"
                element={
                  <ProtectedRoute isPremium={true}>
                    <NewPostPage />
                  </ProtectedRoute>
                }
              />
              <Route path="blog/:postId" element={<BlogPostPage />} />

              {/* Admin Routes */}
              <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<AdminOverview />} />
                <Route path="manage-schools" element={<ManageSchoolsPage />} />
                <Route path="manage-scholarships" element={<ManageScholarshipsPage />} />
                <Route path="manage-users" element={<ManageUsersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Fallback for non-matched routes */}
              <Route path="*" element={<div className="text-center py-10"><h1>404 - Trang không tồn tại</h1><Button asChild className="mt-4"><Link to="/">Về trang chủ</Link></Button></div>} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;