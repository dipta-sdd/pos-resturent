'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { DollarSign, CreditCard, HandCoins } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start gap-4">
        <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-500 p-3 rounded-lg">
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-200 mt-1">{value}</p>
        </div>
    </div>
);


const POSShiftSummary: React.FC = () => {
    const { user } = useAuth();
    const userName = user ? `${user.first_name} ${user.last_name}` : '';
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Shift Summary</h1>
                    <p className="text-gray-500 dark:text-gray-400">For {userName}</p>
                </div>
                <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">End Shift</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Sales" value="$1,250.75" icon={DollarSign} />
                <StatCard title="Card Payments" value="$980.25" icon={CreditCard} />
                <StatCard title="Cash Payments" value="$270.50" icon={DollarSign} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Transactions</h2>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Payment Method</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Mock data */}
                        <tr>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#103</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">7:05 PM</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Card</td>
                            <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">$51.00</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#102</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">12:32 PM</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Cash</td>
                            <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">$21.50</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default POSShiftSummary;
