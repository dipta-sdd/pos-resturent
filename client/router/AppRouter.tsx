

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import CustomerDashboardLayout from '../layouts/CustomerDashboardLayout';


// Public Pages
import HomePage from '../pages/public/HomePage';
import MenuPage from '../pages/public/MenuPage';
import MenuItemDetailPage from '../pages/public/MenuItemDetailPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import MakeReservationPage from '../pages/customer/MakeReservationPage';
import LegalPage from '../pages/public/LegalPage';


// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Customer Pages
import CheckoutPage from '../pages/customer/CheckoutPage';
import OrderConfirmationPage from '../pages/customer/OrderConfirmationPage';
import OrderTrackingPage from '../pages/customer/OrderTrackingPage';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import OrderHistoryPage from '../pages/customer/OrderHistoryPage';
import OrderDetailsPage from '../pages/customer/OrderDetailsPage';
import ReservationHistoryPage from '../pages/customer/ReservationHistoryPage';
import ProfileSettingsPage from '../pages/customer/ProfileSettingsPage';
import ReservationDetailsPage from '../pages/customer/ReservationDetailsPage';
import ManageAddressesPage from '../pages/customer/ManageAddressesPage';
import ManagePaymentMethodsPage from '../pages/customer/ManagePaymentMethodsPage';
import NotificationsHistoryPage from '../pages/customer/NotificationsHistoryPage';

// Staff Pages
import POSDashboard from '../pages/staff/POSDashboard';
import POSOrderManagement from '../pages/staff/POSOrderManagement';
import POSShiftSummary from '../pages/staff/POSShiftSummary';

// Rider Pages
import RiderDashboard from '../pages/rider/RiderDashboard';
import RiderDeliveryDetails from '../pages/rider/RiderDeliveryDetails';
import RiderHistoryPage from '../pages/rider/RiderHistoryPage';
import RiderEarningsPage from '../pages/rider/RiderEarningsPage';
import RiderProfilePage from '../pages/rider/RiderProfilePage';
import RiderSettingsPage from '../pages/rider/RiderSettingsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminMenuManagement from '../pages/admin/AdminMenuManagement';
import AdminOrderManagement from '../pages/admin/AdminOrderManagement';
import AdminUserManagement from '../pages/admin/AdminUserManagement';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminExpenseManagement from '../pages/admin/AdminExpenseManagement';
import AdminOrderDetailsPage from '../pages/admin/AdminOrderDetailsPage';
import AdminPaymentManagement from '../pages/admin/AdminPaymentManagement';
import AdminExpenseCategoryManagement from '../pages/admin/AdminExpenseCategoryManagement';
import AdminReservationManagement from '../pages/admin/AdminReservationManagement';
import AdminPayoutManagement from '../pages/admin/AdminPayoutManagement';
import AdminCommunicationsPage from '../pages/admin/AdminCommunicationsPage';


// This guard protects routes and wraps them in the DashboardLayout for staff, riders, and admins
const DashboardRouteGuard = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <DashboardLayout />;
};

// This guard protects routes and wraps them in the CustomerDashboardLayout
const CustomerDashboardGuard = () => {
    const { isAuthenticated, role } = useAuth();
    if (!isAuthenticated || role !== 'customer') {
        return <Navigate to="/login" replace />;
    }
    return <CustomerDashboardLayout />;
};


const AppRouter: React.FC = () => {
  const { role } = useAuth();

  const getHomeRedirect = () => {
      if (!role) return '/';
      switch(role) {
          case 'admin': return '/admin/dashboard';
          case 'staff': return '/pos/dashboard';
          case 'rider': return '/rider/dashboard';
          case 'customer': return '/customer/dashboard';
          default: return '/';
      }
  }

  return (
    <Routes>
      {/* Public Routes (using MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<MenuItemDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reserve" element={<MakeReservationPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
        <Route path="/track-order/:id" element={<OrderTrackingPage />} />
      </Route>
      
      {/* Customer Dashboard Routes (using CustomerDashboardLayout) */}
      <Route element={<CustomerDashboardGuard />}>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/orders" element={<OrderHistoryPage />} />
        <Route path="/customer/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/customer/reservations" element={<ReservationHistoryPage />} />
        <Route path="/customer/reservations/:id" element={<ReservationDetailsPage />} />
        <Route path="/customer/profile" element={<ProfileSettingsPage />} />
        <Route path="/customer/addresses" element={<ManageAddressesPage />} />
        <Route path="/customer/payments" element={<ManagePaymentMethodsPage />} />
        <Route path="/customer/notifications" element={<NotificationsHistoryPage />} />
      </Route>

      {/* Auth Routes (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      <Route path="/dashboard" element={<Navigate to={getHomeRedirect()} replace />} />


      {/* Staff Routes (using DashboardLayout) */}
      <Route element={<DashboardRouteGuard allowedRoles={['staff']} />}>
        <Route path="/pos/dashboard" element={<POSDashboard />} />
        <Route path="/pos/order/:id" element={<POSOrderManagement />} />
        <Route path="/pos/shift-summary" element={<POSShiftSummary />} />
      </Route>

      {/* Rider Routes (using DashboardLayout) */}
      <Route element={<DashboardRouteGuard allowedRoles={['rider']} />}>
        <Route path="/rider/dashboard" element={<RiderDashboard />} />
        <Route path="/rider/delivery/:id" element={<RiderDeliveryDetails />} />
        <Route path="/rider/history" element={<RiderHistoryPage />} />
        <Route path="/rider/earnings" element={<RiderEarningsPage />} />
        <Route path="/rider/profile" element={<RiderProfilePage />} />
        <Route path="/rider/settings" element={<RiderSettingsPage />} />
      </Route>

      {/* Admin Routes (using DashboardLayout) */}
      <Route element={<DashboardRouteGuard allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<AdminMenuManagement />} />
        <Route path="/admin/orders" element={<AdminOrderManagement />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/admin/expenses" element={<AdminExpenseManagement />} />
        <Route path="/admin/expenses/categories" element={<AdminExpenseCategoryManagement />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/payments" element={<AdminPaymentManagement />} />
        <Route path="/admin/reservations" element={<AdminReservationManagement />} />
        <Route path="/admin/payouts" element={<AdminPayoutManagement />} />
        <Route path="/admin/communications" element={<AdminCommunicationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;