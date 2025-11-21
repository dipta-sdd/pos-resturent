'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Order } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { useSettings } from '../../../contexts/SettingsContext';

const RiderHistoryPage: React.FC = () => {
    const [history, setHistory] = useState<Order[]>([]);
    const { user } = useAuth();
    const { settings } = useSettings();

    useEffect(() => {
        if (user) {
            api.getRiderDeliveryHistory(user.id).then(setHistory);
        }
    }, [user]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Delivery History</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Address</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Earnings</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {history.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{order.id}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(order.created_at || new Date()).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{order.delivery_address?.full_address}</td>
                                <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">{settings.currencySymbol}{(order.delivery_charge || 5.00).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RiderHistoryPage;
