import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Order, OrderStatus as ApiOrderStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Search, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';

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
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};

const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
    return (
        <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{order.id}</td>
            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</td>
            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">${order.total_amount.toFixed(2)}</td>
            <td className="px-6 py-4"><StatusBadge status={getDisplayStatus(order.status)} /></td>
            <td className="px-6 py-4 text-right">
                <Link to={`/customer/orders/${order.id}`} className="font-semibold text-orange-600 dark:text-orange-400 hover:underline">
                    View Details
                </Link>
            </td>
        </tr>
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
        <div className="flex items-center justify-between mt-6">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/12"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/6"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/12"></div>
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
            <Link to="/menu" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
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
    const ITEMS_PER_PAGE = 10;

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
                // FIX: Convert numeric ID to string before calling toLowerCase.
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
        return <OrderHistorySkeleton />;
    }
    
    if (orders.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
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

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">View Details</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map(order => <OrderRow key={order.id} order={order} />)
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    No orders match your search or filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default OrderHistoryPage;