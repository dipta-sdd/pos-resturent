
import React from 'react';
// FIX: Split react-router-dom imports to resolve "no exported member" errors.
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import FloatingCart from '@/components/common/FloatingCart';

const CustomerDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default CustomerDashboardLayout;