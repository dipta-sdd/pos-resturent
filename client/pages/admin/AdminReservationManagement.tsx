

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Reservation } from '../../types';
import { Calendar, User, Check, X } from 'lucide-react';

const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
}

const AdminReservationManagement: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        api.getAllReservations().then(setReservations);
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Reservation Management</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Guest Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Guests</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Table</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {reservations.map(res => (
                            <tr key={res.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{res.user ? `${res.user.firstName} ${res.user.lastName}` : 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(res.reservation_time).toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{res.num_guests}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{res.table ? res.table.name_or_number : 'Not Assigned'}</td>
                                <td className="px-6 py-4 text-sm"><span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(res.status)}`}>{res.status}</span></td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    {res.status === 'pending' && (
                                        <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-2"><Check size={18} /></button>
                                    )}
                                    <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><X size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReservationManagement;