import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import FloatingCart from "../components/common/FloatingCart";

const CustomerDashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default CustomerDashboardLayout;
