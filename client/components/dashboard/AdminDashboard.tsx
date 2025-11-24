'use client';

import React from 'react';
import { DollarSign, ClipboardList, Users, Utensils } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';

const data = [
    { name: 'Mon', Sales: 4000, Expenses: 2400 },
    { name: 'Tue', Sales: 3000, Expenses: 1398 },
    { name: 'Wed', Sales: 2000, Expenses: 9800 },
    { name: 'Thu', Sales: 2780, Expenses: 3908 },
    { name: 'Fri', Sales: 1890, Expenses: 4800 },
    { name: 'Sat', Sales: 2390, Expenses: 3800 },
    { name: 'Sun', Sales: 3490, Expenses: 4300 },
];

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string }) => {
    const { settings } = useSettings();
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="text-white" size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {title === 'Total Sales' ? settings.currencySymbol : ''}{value}
                </p>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const { theme } = useTheme();
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Sales" value="12,345" icon={DollarSign} color="bg-green-500" />
                <StatCard title="Total Orders" value="350" icon={ClipboardList} color="bg-blue-500" />
                <StatCard title="Total Customers" value="120" icon={Users} color="bg-yellow-500" />
                <StatCard title="Menu Items" value="45" icon={Utensils} color="bg-red-500" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Weekly Performance</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4A5568' : '#E2E8F0'} />
                        <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#A0AEC0' : '#4A5568' }} />
                        <YAxis tick={{ fill: theme === 'dark' ? '#A0AEC0' : '#4A5568' }} />
                        <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }} />
                        <Legend wrapperStyle={{ color: theme === 'dark' ? '#A0AEC0' : '#000000' }} />
                        <Bar dataKey="Sales" fill="#8884d8" />
                        <Bar dataKey="Expenses" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;
