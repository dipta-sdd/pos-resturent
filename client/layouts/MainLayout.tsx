import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingCart from '../components/common/FloatingCart';
import { useSettings } from '../contexts/SettingsContext';

const MainLayout: React.FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = settings.restaurantName;
  }, [settings.restaurantName]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] dark:bg-gray-950">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default MainLayout;