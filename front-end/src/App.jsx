import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Provider, useSelector } from 'react-redux';
import { store } from '../store';
import SettingsPage from './pages/SettingsPage';

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
const NewBlogPostPage = lazy(() => import('@/pages/blog/NewBlogPostPage'));
const BlogPostPage = lazy(() => import('@/pages/blog/BlogPostPage'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'));


const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));

// Correctly lazy load Admin sub-components
const AdminOverview = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.AdminOverview };
});
const ManageSchoolsPage = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.ManageSchoolsPage };
});
const ManageScholarshipsPage = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.ManageScholarshipsPage };
});
const ManageUsersPage = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.ManageUsersPage };
});
const ManageApplicationsPage = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.ManageApplicationsPage };
});
const AdminSettingsPage = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.AdminSettingsPage };
});
const ApplicationDetailPage = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.ApplicationDetailPage };
});
const ManageRequirementsPage = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.ManageRequirementsPage };
});
const ManageMentorsPage = lazy(async () => {
  const module = await import('@/pages/admin/AdminDashboardPage');
  return { default: module.ManageMentorsPage };
});
const MentorDetailPage = lazy(() => import('@/pages/admin/MentorDetailPage'));


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
              <Route path="payment-success" element={<PaymentSuccess />} />

              <Route path="blog" element={<BlogPage />} />
              <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route
                path="blog/new-post"
                element={
                  <ProtectedRoute isPremium={true}>
                    <NewBlogPostPage />
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
                <Route path="manage-applications" element={<ManageApplicationsPage />} />
                <Route path="application/:id" element={<ApplicationDetailPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="manage-requirements" element={<ManageRequirementsPage />} />
                <Route path="manage-mentors" element={<ManageMentorsPage />} />
                <Route path="mentor/:id" element={<MentorDetailPage />} />
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