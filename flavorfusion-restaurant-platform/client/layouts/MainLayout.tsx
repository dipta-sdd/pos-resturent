
'use client';

import React, { useEffect } from 'react';
// FIX: Split react-router-dom imports to resolve "no exported member" errors.
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingCart from '../components/common/FloatingCart';
import { useSettings } from '../contexts/SettingsContext';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = settings.restaurantName;
  }, [settings.restaurantName]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] dark:bg-gray-900">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default MainLayout;
