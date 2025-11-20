

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Payout } from '../../types';
import { Check, X } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

const getStatusColor = (status: Payout['status']) => {
    switch (status) {
        case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
}

const AdminPayoutManagement: React.FC = () => {
    const [payouts, setPayouts] = useState<Payout[]>([]);

    useEffect(() => {
        api.getPayouts().then(setPayouts);
    }, []);

    const getUserName = (userId: number) => {
        const user = mockUsers.find(u => u.id === userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown Rider';
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Payout Requests</h1>
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rider</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Request Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {payouts.map(payout => (
                            <tr key={payout.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{getUserName(payout.user_id)}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(payout.requested_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800 dark:text-gray-200">${payout.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>{payout.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    {payout.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"><Check size={16} /></button>
                                            <button className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"><X size={16} /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPayoutManagement;
