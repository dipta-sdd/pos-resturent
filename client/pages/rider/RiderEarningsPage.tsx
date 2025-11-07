import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { Wallet } from 'lucide-react';

const earningsData = [
  { name: 'Mon', earnings: 45 }, { name: 'Tue', earnings: 60 },
  { name: 'Wed', earnings: 55 }, { name: 'Thu', earnings: 75 },
  { name: 'Fri', earnings: 90 }, { name: 'Sat', earnings: 120 },
  { name: 'Sun', earnings: 110 },
];

const payoutHistory = [
    {id: 1, date: '2023-10-20', amount: 350.50, status: 'Completed'},
    {id: 2, date: '2023-10-13', amount: 325.00, status: 'Completed'},
];

const RiderEarningsPage: React.FC = () => {
    const { theme } = useTheme();
    const { settings } = useSettings();
    const tickColor = theme === 'dark' ? '#A0AEC0' : '#4A5568';
    const gridColor = theme === 'dark' ? '#4A5568' : '#E2E8F0';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Earnings & Payouts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Current Balance</h2>
                    <Wallet size={24} />
                </div>
                <p className="text-4xl font-bold mt-2">{settings.currencySymbol}85.75</p>
            </div>
            <button className="mt-4 w-full bg-white text-green-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100">
                Request Payout
            </button>
        </div>
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">This Week's Earnings</h2>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={earningsData}>
                    <XAxis dataKey="name" tick={{ fill: tickColor }} />
                    <YAxis tick={{ fill: tickColor }}/>
                    <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }}/>
                    <Bar dataKey="earnings" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Payout History</h2>
         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payoutHistory.map(payout => (
                    <tr key={payout.id}>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{payout.date}</td>
                        <td className="px-6 py-4 text-sm"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{payout.status}</span></td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-800 dark:text-white">{settings.currencySymbol}{payout.amount.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default RiderEarningsPage;