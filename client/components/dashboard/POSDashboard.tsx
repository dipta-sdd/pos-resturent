'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Utensils, Flag } from 'lucide-react';
import { api } from '@/services/api';
import { Order, Table } from '@/types';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'preparing': return 'border-yellow-500';
        case 'ready': return 'border-green-500';
        case 'confirmed': return 'border-blue-500';
        default: return 'border-gray-300 dark:border-gray-600';
    }
}

const getTableStatusColor = (status: string) => {
    switch (status) {
        case 'available': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
        case 'occupied': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
        case 'reserved': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
        default: return 'bg-gray-200 dark:bg-gray-700';
    }
}

const POSDashboard: React.FC = () => {
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [tables, setTables] = useState<Table[]>([]);

    useEffect(() => {
        api.getActiveOrders().then(setActiveOrders);
        api.getTables().then(setTables);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">POS Dashboard</h1>
                <div className="flex gap-4">
                    <Link href="/dashboard/pos-terminal/new-takeaway" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">New Takeaway</Link>
                    <Link href="/dashboard/pos-terminal/new-dinein" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">New Dine-In</Link>
                </div>
            </div>

            {/* Active Orders */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Active Orders</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {activeOrders.map(order => (
                        <Link href={`/dashboard/pos-terminal/${order.id}`} key={order.id} className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${getStatusColor(order.status)} hover:shadow-lg transition-shadow`}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-lg dark:text-white">Order #{order.id}</h3>
                                <span className="text-sm font-semibold capitalize text-gray-600 dark:text-gray-300">{order.order_type}</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Customer: {order.user ? `${order.user.first_name} ${order.user.last_name}` : ''}</p>
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                                <span className="flex items-center gap-1"><Clock size={14} /> {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                                <span className="font-bold text-base text-gray-800 dark:text-white">${order.total_amount.toFixed(2)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Table Layout */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Table Layout</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {tables.map(table => (
                        <div key={table.id} className={`p-4 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform ${getTableStatusColor(table.status)}`}>
                            <p className="font-bold text-lg">{table.name_or_number}</p>
                            <p className="text-sm">Capacity: {table.capacity}</p>
                            <p className="text-xs font-semibold capitalize mt-2">{table.status}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default POSDashboard;
