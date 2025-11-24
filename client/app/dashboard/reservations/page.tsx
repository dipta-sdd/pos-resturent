'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../../services/api';
import { Reservation } from '../../../types';
import { Check, X, Search, ArrowUp, ArrowDown } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
}

type SortableKeys = keyof Reservation | 'guest_name';
const ITEMS_PER_PAGE = 10;

const AdminReservationManagement: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({ key: 'reservation_time', direction: 'descending' });

    useEffect(() => {
        setLoading(true);
        api.getAllReservations().then(data => {
            setReservations(data);
            setLoading(false);
        });
    }, []);

    const filteredReservations = useMemo(() => {
        return reservations
            .filter(res => {
                if (statusFilter && res.status !== statusFilter) return false;
                const searchLower = searchTerm.toLowerCase();
                const guestName = res.user ? `${res.user.first_name} ${res.user.last_name}`.toLowerCase() : '';
                return guestName.includes(searchLower);
            });
    }, [reservations, searchTerm, statusFilter]);

    const sortedReservations = useMemo(() => {
        let sortableItems = [...filteredReservations];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                if (sortConfig.key === 'guest_name') {
                    aValue = a.user ? `${a.user.first_name} ${a.user.last_name}` : '';
                    bValue = b.user ? `${b.user.first_name} ${b.user.last_name}` : '';
                } else {
                    aValue = a[sortConfig.key as keyof Reservation];
                    bValue = b[sortConfig.key as keyof Reservation];
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredReservations, sortConfig]);

    const paginatedReservations = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedReservations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedReservations, currentPage]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1 opacity-60" /> : <ArrowDown className="h-4 w-4 ml-1 opacity-60" />;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Reservation Management</h1>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md border-b dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by guest name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestSort('guest_name')} className="flex items-center">Guest Name {getSortIcon('guest_name')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestSort('reservation_time')} className="flex items-center">Date & Time {getSortIcon('reservation_time')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestSort('num_guests')} className="flex items-center">Guests {getSortIcon('num_guests')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Table</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestSort('status')} className="flex items-center">Status {getSortIcon('status')}</button>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div></td></tr>
                            ))
                        ) : paginatedReservations.length > 0 ? paginatedReservations.map(res => (
                            <tr key={res.id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{res.user ? `${res.user.first_name} ${res.user.last_name}` : 'N/A'}</td>
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
                        )) : (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">No reservations found.</td></tr>
                        )}
                    </tbody>
                    <Pagination colSpan={6} currentPage={currentPage} totalPages={Math.ceil(sortedReservations.length / ITEMS_PER_PAGE)} onPageChange={setCurrentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={sortedReservations.length} />
                </table>
            </div>
        </div>
    );
};

export default AdminReservationManagement;
