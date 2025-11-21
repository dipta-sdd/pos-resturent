'use client';

import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import { mockMenuItems, mockOrders } from '../../../data/mockData';

const salesData = [
    { name: 'Jan', Sales: 4000 }, { name: 'Feb', Sales: 3000 },
    { name: 'Mar', Sales: 5000 }, { name: 'Apr', Sales: 4500 },
    { name: 'May', Sales: 6000 }, { name: 'Jun', Sales: 5500 },
];

const profitLossData = [
    { name: 'Jan', Profit: 1600, Loss: 0 }, { name: 'Feb', Profit: 1602, Loss: 0 },
    { name: 'Mar', Profit: 0, Loss: 4800 }, { name: 'Apr', Profit: 600, Loss: 0 },
    { name: 'May', Profit: 1200, Loss: 0 }, { name: 'Jun', Profit: 1700, Loss: 0 },
];


const orderTypeData = [
    { name: 'Delivery', value: mockOrders.filter(o => o.order_type === 'delivery').length },
    { name: 'Dine-In', value: mockOrders.filter(o => o.order_type === 'dine-in').length },
    { name: 'Takeaway', value: mockOrders.filter(o => o.order_type === 'takeaway').length },
]
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const topItemsData = mockMenuItems.slice(0, 5).map(item => ({
    name: item.name,
    sales: Math.floor(Math.random() * 100) + 20
})).sort((a, b) => b.sales - a.sales);


const AdminReports: React.FC = () => {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#A0AEC0' : '#4A5568';
    const gridColor = theme === 'dark' ? '#4A5568' : '#E2E8F0';
    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#2D3748' : '#FFFFFF',
        border: `1px solid ${gridColor}`
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h1>
                <div className="flex items-center gap-4">
                    <label htmlFor="date-range" className="dark:text-white">Date Range:</label>
                    <input type="date" className="p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <span className="dark:text-white">to</span>
                    <input type="date" className="p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Sales Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor }} />
                            <YAxis tick={{ fill: tickColor }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ color: tickColor }} />
                            <Bar dataKey="Sales" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Profit & Loss</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={profitLossData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor }} />
                            <YAxis tick={{ fill: tickColor }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ color: tickColor }} />
                            <Area type="monotone" dataKey="Profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                            <Area type="monotone" dataKey="Loss" stackId="1" stroke="#ffc658" fill="#ffc658" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Types</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={orderTypeData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                                {orderTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ color: tickColor }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Expense Report</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={[{ name: 'Ingredients', value: 350 }, { name: 'Payroll', value: 2400 }, { name: 'Utilities', value: 220 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label>
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ color: tickColor }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Top Selling Items</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="py-2 text-left text-gray-600 dark:text-gray-300">Item</th>
                                    <th className="py-2 text-right text-gray-600 dark:text-gray-300">Units Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topItemsData.map(item => (
                                    <tr key={item.name} className="border-b dark:border-gray-700">
                                        <td className="py-2 text-gray-800 dark:text-gray-100">{item.name}</td>
                                        <td className="py-2 text-right text-gray-800 dark:text-gray-100">{item.sales}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
