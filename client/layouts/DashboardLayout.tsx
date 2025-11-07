


import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { UserRole } from '../types';
import { 
    LayoutDashboard, User, Utensils, ClipboardList, BarChart2, Settings, ChevronLeft, ChevronRight, LogOut, Car, HandCoins, BookUser, 
    Home, History, Star, Wallet, Truck, UtensilsCrossed, FileText, Banknote, Users, Moon, Sun, Megaphone, Receipt
} from 'lucide-react';

const commonLinks = [
    { to: 'profile', text: 'Profile Settings', icon: User },
];

const roleLinks = {
    customer: [
        { to: '/customer/dashboard', text: 'Dashboard', icon: Home },
        { to: '/customer/orders', text: 'Order History', icon: History },
        { to: '/customer/reservations', text: 'My Reservations', icon: BookUser },
    ],
    staff: [
        { to: '/pos/dashboard', text: 'POS Dashboard', icon: LayoutDashboard },
        { to: '/pos/shift-summary', text: 'Shift Summary', icon: HandCoins },
    ],
    rider: [
        { to: '/rider/dashboard', text: 'Dashboard', icon: Truck },
        { to: '/rider/history', text: 'Delivery History', icon: History },
        { to: '/rider/earnings', text: 'Earnings', icon: Wallet },
        { to: '/rider/profile', text: 'Profile', icon: User },
        { to: '/rider/settings', text: 'Settings', icon: Settings },
    ],
    admin: [
        { to: '/admin/dashboard', text: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/menu', text: 'Menu Management', icon: Utensils },
        { to: '/admin/orders', text: 'Order Management', icon: ClipboardList },
        { to: '/admin/reservations', text: 'Reservations', icon: BookUser },
        { to: '/admin/users', text: 'User Management', icon: Users },
        { to: '/admin/expenses', text: 'Expenses', icon: Banknote },
        { to: '/admin/payouts', text: 'Payouts', icon: Receipt },
        { to: '/admin/communications', text: 'Communications', icon: Megaphone },
        { to: '/admin/reports', text: 'Reports', icon: BarChart2 },
        { to: '/admin/settings', text: 'Settings', icon: Settings },
    ],
};

const FlavorFusionLogo = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g transform="rotate(45 50 50)">
      <rect x="15" y="15" width="70" height="70" rx="8" fill="#F28500"/>
      <path d="M50 15 L15 50 L50 85 Z" fill="#1F2937"/>
    </g>
  </svg>
);


const Sidebar: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
    const location = useLocation();
    const { role, user, logout } = useAuth();
    const { settings } = useSettings();
    const navigate = useNavigate();
    
    const links = role ? roleLinks[role] : [];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!role) return null;

    return (
        <aside className={`bg-gray-800 dark:bg-gray-900 text-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex items-center gap-3 text-2xl font-bold p-4 h-16 border-b border-gray-700 dark:border-gray-800 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <FlavorFusionLogo />
                {!isCollapsed && <span>{settings.restaurantName}</span>}
            </div>

            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${location.pathname.startsWith(link.to) ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'}`}
                    >
                        <link.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span>{link.text}</span>}
                    </Link>
                ))}
            </nav>
            
            <div className="p-4 border-t border-gray-700 dark:border-gray-800">
                 <button onClick={handleLogout} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-700 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                     <LogOut className="h-5 w-5 flex-shrink-0" />
                     {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};


const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getProfileLink = (role: UserRole | undefined | null) => {
      if (!role) return '/';
      switch(role) {
          case 'admin': return '/admin/settings';
          case 'staff': return '/pos/dashboard';
          case 'rider': return '/rider/profile';
          default: return '/';
      }
  }

  const userName = user ? `${user.firstName} ${user.lastName}` : '';
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
             <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
            <div className="flex items-center gap-4">
                 <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                </button>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{userName}</span>
                <Link to={getProfileLink(role)}>
                    <img src={user?.avatar_url || 'https://picsum.photos/seed/avatar/100'} alt="User Avatar" className="h-10 w-10 rounded-full object-cover"/>
                </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;