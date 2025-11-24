'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Order, OrderStatus as ApiOrderStatus } from '../../../types';
import { useAuth } from '@/components//AuthContext';
import { api } from '../../../services/api';
import { Search, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';

type DisplayStatus = 'In Progress' | 'Completed' | 'Cancelled';
const filterOptions: ('All' | DisplayStatus)[] = ['All', 'In Progress', 'Completed', 'Cancelled'];

const getDisplayStatus = (status: ApiOrderStatus): DisplayStatus => {
    if (['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(status)) {
        return 'In Progress';
    }
    if (status === 'delivered') {
        return 'Completed';
    }
    return 'Cancelled';
};

const StatusBadge: React.FC<{ status: DisplayStatus }> = ({ status }) => {
    const colorClasses = {
        'Completed': 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400',
        'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400',
        'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400',
    }[status];

    return (
        <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const displayStatus = getDisplayStatus(order.status);
    const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const itemImages = order.items?.slice(0, 4).map(item => item.menu_item?.image_url).filter(Boolean) as string[] || [];

    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            {/* Card Header */}
            <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-200 dark:border-gray-700/50">
                <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <StatusBadge status={displayStatus} />
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex items-center gap-4">
                    {itemImages.length > 0 && (
                        <div className="flex -space-x-4">
                            {itemImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Item ${index + 1}`}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800"
                                />
                            ))}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {order.items && order.items.length > 0 ? `${order.items[0].menu_item?.name}${itemCount > 1 ? `, and ${itemCount - 1} more` : ''}` : 'Order details unavailable'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{itemCount} items</p>
                    </div>
                </div>
                <div className="mt-6 sm:mt-0 text-left sm:text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-white">${order.total_amount.toFixed(2)}</p>
                </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl flex justify-end gap-3">
                <Link href={`/customer/orders/${order.id}`} className="font-semibold text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-4 py-2 rounded-lg transition-colors">
                    View Details
                </Link>
                <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Reorder
                </button>
            </div>
        </div>
    );
};

const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPaginationItems = () => {
        const items: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) items.push(i);
        } else {
            items.push(1);
            if (currentPage > 3) items.push('...');
            if (currentPage > 2) items.push(currentPage - 1);
            if (currentPage > 1 && currentPage < totalPages) items.push(currentPage);
            if (currentPage < totalPages - 1) items.push(currentPage + 1);
            if (currentPage < totalPages - 2) items.push('...');
            items.push(totalPages);
        }
        return Array.from(new Set(items));
    };

    return (
        <div className="flex items-center justify-between mt-8">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={16} /> Previous
            </button>
            <div className="hidden sm:flex items-center gap-2">
                {getPaginationItems().map((item, index) => (
                    typeof item === 'number' ? (
                        <button key={index} onClick={() => onPageChange(item)} className={`w-10 h-10 text-sm font-medium rounded-md ${currentPage === item ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            {item}
                        </button>
                    ) : <span key={index} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">...</span>
                ))}
            </div>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Next <ChevronRight size={16} />
            </button>
        </div>
    );
};

const OrderHistorySkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4 mb-8"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full md:w-1/3"></div>
            <div className="flex items-center gap-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-20"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-28"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
            </div>
        </div>
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700/50">
                    <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700/50">
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                        </div>
                        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="pt-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800"></div>
                                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </div>
                        </div>
                        <div className="space-y-2 text-right">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto"></div>
                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="text-center py-16">
        <ClipboardList className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No Orders Found</h3>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">It looks like you haven't placed any orders yet.</p>
        <div className="mt-6">
            <Link href="/menu" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Browse Menu
            </Link>
        </div>
    </div>
);


const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<typeof filterOptions[number]>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useAuth();
    const ITEMS_PER_PAGE = 5;

    const breadcrumbs = [
        { name: 'Dashboard', path: '/customer' },
        { name: 'Order History', path: '/customer/orders' },
    ];

    useEffect(() => {
        setLoading(true);
        if (user) {
            setTimeout(() => { // Simulate network delay
                api.getCustomerOrders(user.id).then(fetchedOrders => {
                    setOrders(fetchedOrders);
                    setLoading(false);
                });
            }, 1000);
        } else {
            setLoading(false);
        }
    }, [user]);

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                if (activeFilter === 'All') return true;
                return getDisplayStatus(order.status) === activeFilter;
            })
            .filter(order =>
                String(order.id).toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [orders, activeFilter, searchTerm]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredOrders, currentPage]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    const handleFilterChange = (filter: typeof filterOptions[number]) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <>
                <Breadcrumb crumbs={breadcrumbs} />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <OrderHistorySkeleton />
                </div>
            </>
        );
    }

    if (orders.length === 0) {
        return (
            <>
                <Breadcrumb crumbs={breadcrumbs} />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <EmptyState />
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Order History</h1>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-auto md:flex-grow max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-300 dark:border-gray-600">
                        {filterOptions.map(filter => (
                            <button
                                key={filter}
                                onClick={() => handleFilterChange(filter)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === filter ? 'bg-orange-500 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {paginatedOrders.length > 0 ? (
                    <div className="space-y-6">
                        {paginatedOrders.map(order => <OrderCard key={order.id} order={order} />)}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No orders match your search or filter.
                    </div>
                )}

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </>
    );
};

export default OrderHistoryPage;
