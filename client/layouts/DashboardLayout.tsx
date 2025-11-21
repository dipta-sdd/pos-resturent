
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { Role } from '../types';
import {
  LayoutDashboard, User, Utensils, ClipboardList, BarChart2, Settings, ChevronLeft, ChevronRight, LogOut, Car, HandCoins, BookUser,
  Home, History, Star, Wallet, Truck, UtensilsCrossed, FileText, Banknote, Users, Moon, Sun, Megaphone, Receipt, Menu, X, Tag, CreditCard
} from 'lucide-react';

// Define all possible navigation links in a single source of truth.
// The order determines precedence for duplicate paths (e.g., /dashboard).
const allNavLinks: ({ to: string; text: string; icon: React.ElementType; permission: keyof Role; })[] = [
  // Admin links (highest priority for duplicates)
  { to: '/dashboard', text: 'Dashboard', icon: LayoutDashboard, permission: 'can_view_dashboard' },
  { to: '/dashboard/menu', text: 'Menu Management', icon: Utensils, permission: 'can_manage_products' },
  { to: '/dashboard/orders', text: 'Order Management', icon: ClipboardList, permission: 'can_view_sales_history' },
  { to: '/dashboard/reservations', text: 'Reservations', icon: BookUser, permission: 'can_manage_reservations' },
  { to: '/dashboard/promotions', text: 'Promotions', icon: Tag, permission: 'can_manage_promotions' },
  { to: '/dashboard/users', text: 'User Management', icon: Users, permission: 'can_manage_staff' },
  { to: '/dashboard/expenses', text: 'Expenses', icon: Banknote, permission: 'can_manage_expenses' },
  { to: '/dashboard/payouts', text: 'Payouts', icon: Receipt, permission: 'can_manage_payouts' },
  { to: '/dashboard/communications', text: 'Communications', icon: Megaphone, permission: 'can_send_communications' },
  { to: '/dashboard/reports', text: 'Reports', icon: BarChart2, permission: 'can_view_reports' },
  { to: '/dashboard/payments', text: 'Payment Methods', icon: CreditCard, permission: 'can_manage_payment_methods' },
  { to: '/dashboard/settings', text: 'Settings', icon: Settings, permission: 'can_manage_shop_settings' },

  // Staff links
  { to: '/dashboard/pos', text: 'POS Dashboard', icon: LayoutDashboard, permission: 'can_use_pos' },
  { to: '/dashboard/shift-summary', text: 'Shift Summary', icon: HandCoins, permission: 'can_view_sales_history' },

  // Rider links
  { to: '/dashboard', text: 'Dashboard', icon: Truck, permission: 'can_view_dashboard' },
  { to: '/dashboard/delivery-history', text: 'Delivery History', icon: History, permission: 'can_view_dashboard' },
  { to: '/dashboard/earnings', text: 'Earnings', icon: Wallet, permission: 'can_view_dashboard' },
  { to: '/dashboard/rider-profile', text: 'Profile', icon: User, permission: 'can_view_rider_profile' },
  { to: '/dashboard/rider-settings', text: 'Rider Settings', icon: Settings, permission: 'can_view_dashboard' },
];


const FlavorFusionLogo = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g transform="rotate(45 50 50)">
      <rect x="15" y="15" width="70" height="70" rx="8" fill="#F28500" />
      <path d="M50 15 L15 50 L50 85 Z" fill="#1F2937" />
    </g>
  </svg>
);


interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const pathname = usePathname();
  const { permissions, logout } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();

  const links = useMemo(() => {
    if (!permissions) return [];

    // Filter all possible links based on the user's permissions.
    const permittedLinks = allNavLinks.filter(link => (permissions as any)[link.permission]);

    // De-duplicate links by their 'to' path, ensuring the first one found (highest priority) is kept.
    const uniqueLinksMap = new Map();
    for (const item of permittedLinks) {
      if (!uniqueLinksMap.has(item.to)) {
        uniqueLinksMap.set(item.to, item);
      }
    }
    const uniqueLinks = Array.from(uniqueLinksMap.values());

    return uniqueLinks;
  }, [permissions]);


  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!permissions) return null;

  return (
    <aside className={`fixed inset-y-0 left-0 bg-gray-800 dark:bg-gray-900 text-white flex flex-col w-64
            transition-transform duration-300 ease-in-out z-40
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:transition-all lg:duration-300
            ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 dark:border-gray-800 flex-shrink-0">
        <Link href="/" className={`flex items-center gap-3 text-2xl font-bold ${isCollapsed ? 'lg:hidden' : ''}`}>
          <FlavorFusionLogo />
          <span>{settings.restaurantName}</span>
        </Link>
        <Link href="/" className={`hidden ${isCollapsed ? 'lg:flex items-center justify-center' : ''}`}>
          <FlavorFusionLogo />
        </Link>
        <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 -mr-2">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-grow p-4 space-y-2 overflow-y-auto scrollbar-thin ">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.to) && (link.to !== '/dashboard' || pathname === '/dashboard' || pathname === '/dashboard/pos');
          return (
            <Link
              key={link.to}
              href={link.to}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'} ${isCollapsed ? 'lg:justify-center' : ''}`}
              title={isCollapsed ? link.text : ''}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              <span className={isCollapsed ? 'lg:hidden' : ''}>{link.text}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700 dark:border-gray-800 flex-shrink-0">
        <button onClick={handleLogout} title={isCollapsed ? 'Logout' : ''} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-700 ${isCollapsed ? 'lg:justify-center' : 'justify-start'}`}>
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className={isCollapsed ? 'lg:hidden' : ''}>Logout</span>
        </button>
      </div>
    </aside>
  );
};


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, permissions } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getProfileLink = (permissions: Role | null) => {
    if (!permissions) return '/dashboard';
    if (permissions.can_manage_shop_settings) return '/dashboard/settings';
    if (permissions.can_view_rider_profile) return '/dashboard/rider-profile';
    if (permissions.can_use_pos) return '/dashboard'; // Staff fallback
    return '/dashboard'; // General fallback
  }

  const userName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden text-gray-500 dark:text-gray-300">
                <Menu size={24} />
              </button>
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block text-gray-500 dark:text-gray-300">
                {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
              </button>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{userName}</span>
              <Link href={getProfileLink(permissions)}>
                <img src={user?.avatar_url || 'https://picsum.photos/seed/avatar/100'} alt="User Avatar" className="h-10 w-10 rounded-full object-cover" />
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
