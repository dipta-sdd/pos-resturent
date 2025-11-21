'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { Notification } from '../../../types';
import { Bell, Tag, Truck } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';

const getIconForNotification = (title: string) => {
    if (title.toLowerCase().includes('order')) {
        return <Truck className="text-blue-500" />;
    }
    if (title.toLowerCase().includes('offer')) {
        return <Tag className="text-green-500" />;
    }
    return <Bell className="text-gray-500" />;
}

const NotificationsHistoryPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            api.getNotifications(user.id).then(setNotifications);
        }
    }, [user]);

    const breadcrumbs = [
        { name: 'Dashboard', path: '/customer' },
        { name: 'Notifications', path: '/customer/notifications' },
    ];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notifications</h1>
                    <button className="text-sm font-semibold text-orange-500 hover:text-orange-700">Mark all as read</button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <ul className="divide-y dark:divide-gray-700">
                        {notifications.map(notification => (
                            <li key={notification.id} className={`p-4 flex items-start gap-4 ${!notification.is_read ? 'bg-orange-50 dark:bg-orange-500/10' : ''}`}>
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full mt-1">
                                    {getIconForNotification(notification.title)}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-semibold text-gray-800 dark:text-white">{notification.title}</h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(notification.created_at).toLocaleString()}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                                </div>
                                {!notification.is_read && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>}
                            </li>
                        ))}
                        {notifications.length === 0 && (
                            <p className="p-6 text-center text-gray-500 dark:text-gray-400">You have no notifications.</p>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NotificationsHistoryPage;
