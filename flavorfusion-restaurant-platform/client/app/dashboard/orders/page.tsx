'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { mockOrders } from '../../../data/mockData';
import { Order } from '../../../types';
import { Eye, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';
import Pagination from '../../../components/common/Pagination';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'preparing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
}

type SortableKeys = keyof Order | 'customer';

const AdminOrderManagement: React.FC = () => {
    const { settings } = useSettings();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({ key: 'created_at', direction: 'descending' });
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setLoading(true);
        setTimeout(() => { // Simulate API call
            setOrders(mockOrders);
            setLoading(false);
        }, 500);
    }, []);

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                if (statusFilter && order.status !== statusFilter) {
                    return false;
                }
                const searchLower = searchTerm.toLowerCase();
                const customerName = order.user ? `${order.user.firstName} ${order.user.lastName}`.toLowerCase() : '';
                return (
                    String(order.id).includes(searchLower) ||
                    customerName.includes(searchLower)
                );
            });
    }, [orders, searchTerm, statusFilter]);

    const sortedOrders = useMemo(() => {
        let sortableItems = [...filteredOrders];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                if (sortConfig.key === 'customer') {
                    aValue = a.user ? `${a.user.firstName} ${a.user.lastName}` : '';
                    bValue = b.user ? `${b.user.firstName} ${b.user.lastName}` : '';
                } else {
                    aValue = a[sortConfig.key as keyof Order];
                    bValue = b[sortConfig.key as keyof Order];
                }

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredOrders, sortConfig]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedOrders, currentPage]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1 opacity-60" /> : <ArrowDown className="h-4 w-4 ml-1 opacity-60" />;
    };

    const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Order Management</h1>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md border-b dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
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
                                <button onClick={() => requestSort('id')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Order ID {getSortIcon('id')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestSort('customer')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Customer {getSortIcon('customer')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestSort('created_at')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Created At {getSortIcon('created_at')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestSort('updated_at')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Updated At {getSortIcon('updated_at')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestSort('total_amount')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Total {getSortIcon('total_amount')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={8} className="px-6 py-4">
                                        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                                    </td>
                                </tr>
                            ))
                        ) : paginatedOrders.length > 0 ? paginatedOrders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-500">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.updated_at ? new Date(order.updated_at).toLocaleString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{settings.currencySymbol}{order.total_amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{order.order_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/dashboard/orders/${order.id}`} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 flex items-center justify-end gap-1">
                                        <Eye size={16} /> Details
                                    </Link>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <Pagination
                        colSpan={8}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        totalItems={sortedOrders.length}
                    />
                </table>
            </div>
        </div>
    );
};

export default AdminOrderManagement;
