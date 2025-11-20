


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

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
import PrivacyPolicyPage from '../pages/public/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/public/TermsOfServicePage';


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

// Dashboard Pages (formerly staff, rider, admin)
import DashboardHomePage from '../pages/dashboard/DashboardHomePage';
import POSDashboard from '../pages/staff/POSDashboard';
import POSOrderManagement from '../pages/dashboard/POSOrderManagement';
import POSShiftSummary from '../pages/dashboard/POSShiftSummary';
import RiderDeliveryDetails from '../pages/dashboard/RiderDeliveryDetails';
import RiderHistoryPage from '../pages/dashboard/RiderHistoryPage';
import RiderEarningsPage from '../pages/dashboard/RiderEarningsPage';
import RiderProfilePage from '../pages/dashboard/RiderProfilePage';
import RiderSettingsPage from '../pages/dashboard/RiderSettingsPage';
import AdminMenuManagement from '../pages/dashboard/AdminMenuManagement';
import AdminMenuItemManagement from '../pages/dashboard/AdminMenuItemManagement'; // Import new component
import AdminOrderManagement from '../pages/dashboard/AdminOrderManagement';
import AdminUserManagement from '../pages/dashboard/AdminUserManagement';
import AdminReports from '../pages/dashboard/AdminReports';
import AdminSettings from '../pages/dashboard/AdminSettings';
import AdminExpenseManagement from '../pages/dashboard/AdminExpenseManagement';
import AdminOrderDetailsPage from '../pages/dashboard/AdminOrderDetailsPage';
import AdminPaymentManagement from '../pages/dashboard/AdminPaymentManagement';
import AdminExpenseCategoryManagement from '../pages/dashboard/AdminExpenseCategoryManagement';
import AdminReservationManagement from '../pages/dashboard/AdminReservationManagement';
import AdminPayoutManagement from '../pages/dashboard/AdminPayoutManagement';
import AdminCommunicationsPage from '../pages/dashboard/AdminCommunicationsPage';
import AdminPromotionsManagement from '../pages/dashboard/AdminPromotionsManagement';


// This guard protects dashboard routes for any authenticated user with a non-customer role.
const DashboardLayoutRoute = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'customer') {
    return <Navigate to="/customer/dashboard" replace />;
  }
  
  // Any role other than customer can access the dashboard layout.
  // Specific page access is controlled by PermissionGuard.
  return <DashboardLayout />;
};

// This guard protects individual routes based on specific permissions.
const PermissionGuard = ({ element, permission }: { element: React.ReactElement, permission: keyof Role }) => {
    const { permissions } = useAuth();
    if (!permissions || !(permissions as any)[permission]) {
        return <Navigate to="/dashboard" replace />;
    }
    return element;
}

// This guard protects routes and wraps them in the CustomerDashboardLayout
const CustomerDashboardGuard = () => {
    const { isAuthenticated, role } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // If user has a non-customer role, redirect them away from customer dashboard
    if (role && role !== 'customer') {
        return <Navigate to="/dashboard" replace />;
    }
    return <CustomerDashboardLayout />;
};


const AppRouter: React.FC = () => {
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
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
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
      
      {/* Unified Dashboard Routes for Staff, Rider, and Admin */}
      <Route path="/dashboard" element={<DashboardLayoutRoute />}>
        <Route index element={<DashboardHomePage />} />
        
        {/* Staff/POS Features */}
        <Route path="pos" element={<PermissionGuard permission="can_use_pos" element={<POSDashboard />} />} />
        <Route path="pos-terminal/:id" element={<PermissionGuard permission="can_use_pos" element={<POSOrderManagement />} />} />
        <Route path="shift-summary" element={<PermissionGuard permission="can_view_sales_history" element={<POSShiftSummary />} />} />

        {/* Rider Features */}
        <Route path="delivery/:id" element={<PermissionGuard permission="can_view_dashboard" element={<RiderDeliveryDetails />} />} />
        <Route path="delivery-history" element={<PermissionGuard permission="can_view_dashboard" element={<RiderHistoryPage />} />} />
        <Route path="earnings" element={<PermissionGuard permission="can_view_dashboard" element={<RiderEarningsPage />} />} />
        <Route path="rider-profile" element={<PermissionGuard permission="can_view_rider_profile" element={<RiderProfilePage />} />} />
        <Route path="rider-settings" element={<PermissionGuard permission="can_view_dashboard" element={<RiderSettingsPage />} />} />

        {/* Admin & Shared Features */}
        <Route path="menu" element={<PermissionGuard permission="can_manage_products" element={<AdminMenuManagement />} />} />
        <Route path="menu/new" element={<PermissionGuard permission="can_manage_products" element={<AdminMenuItemManagement />} />} />
        <Route path="menu/edit/:id" element={<PermissionGuard permission="can_manage_products" element={<AdminMenuItemManagement />} />} />
        <Route path="orders" element={<PermissionGuard permission="can_view_sales_history" element={<AdminOrderManagement />} />} />
        <Route path="orders/:id" element={<PermissionGuard permission="can_view_sales_history" element={<AdminOrderDetailsPage />} />} />
        <Route path="users" element={<PermissionGuard permission="can_manage_staff" element={<AdminUserManagement />} />} />
        <Route path="expenses" element={<PermissionGuard permission="can_manage_expenses" element={<AdminExpenseManagement />} />} />
        <Route path="expenses/categories" element={<PermissionGuard permission="can_manage_expenses" element={<AdminExpenseCategoryManagement />} />} />
        <Route path="reports" element={<PermissionGuard permission="can_view_reports" element={<AdminReports />} />} />
        <Route path="settings" element={<PermissionGuard permission="can_manage_shop_settings" element={<AdminSettings />} />} />
        <Route path="payments" element={<PermissionGuard permission="can_manage_payment_methods" element={<AdminPaymentManagement />} />} />
        <Route path="reservations" element={<PermissionGuard permission="can_manage_reservations" element={<AdminReservationManagement />} />} />
        <Route path="payouts" element={<PermissionGuard permission="can_manage_payouts" element={<AdminPayoutManagement />} />} />
        <Route path="communications" element={<PermissionGuard permission="can_send_communications" element={<AdminCommunicationsPage />} />} />
        <Route path="promotions" element={<PermissionGuard permission="can_manage_promotions" element={<AdminPromotionsManagement />} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;