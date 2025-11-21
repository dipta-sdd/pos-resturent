'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToggleLeft, ToggleRight, MapPin, Clock, Check, X } from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';

const RiderDashboard: React.FC = () => {
    const [isOnline, setIsOnline] = useState(false);
    const [deliveries, setDeliveries] = useState<Order[]>([]);
    const { settings } = useSettings();

    useEffect(() => {
        if (isOnline) {
            api.getRiderDeliveries(3).then(setDeliveries); // Using mock rider ID 3
        } else {
            setDeliveries([]);
        }
    }, [isOnline]);

    const activeDelivery = deliveries.find(d => d.status === 'out_for_delivery');
    const newRequests = deliveries.filter(d => d.status === 'preparing' || d.status === 'confirmed');


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rider Dashboard</h1>
                <div className="flex items-center gap-3">
                    <span className={`font-semibold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                    <button onClick={() => setIsOnline(!isOnline)}>
                        {isOnline ? <ToggleRight size={40} className="text-green-500" /> : <ToggleLeft size={40} className="text-gray-400" />}
                    </button>
                </div>
            </div>

            {!isOnline && (
                <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2 dark:text-white">You are Offline</h2>
                    <p className="text-gray-500 dark:text-gray-400">Go online to receive new delivery requests.</p>
                </div>
            )}

            {isOnline && (
                <div className="space-y-8">
                    {/* New Delivery Requests */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 dark:text-white">New Delivery Requests</h2>
                        {newRequests.length > 0 ? newRequests.map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
                                <div>
                                    <p className="font-bold dark:text-white">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={14} /> {order.delivery_address?.full_address}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock size={14} /> 10 min pickup</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"><X size={20} /></button>
                                    <button className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"><Check size={20} /></button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 dark:text-gray-400">No new requests right now.</p>}
                    </div>

                    {/* Active Delivery */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Active Delivery</h2>
                        {activeDelivery ? (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg dark:text-white">Delivering Order #{activeDelivery.id}</p>
                                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={16} /> To: {activeDelivery.delivery_address?.full_address}</p>
                                    </div>
                                    <span className="font-bold text-xl dark:text-white">{settings.currencySymbol}{activeDelivery.total_amount.toFixed(2)}</span>
                                </div>
                                <Link href={`/dashboard/delivery/${activeDelivery.id}`} className="mt-4 w-full block text-center bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">
                                    View Details
                                </Link>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">You have no active deliveries.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiderDashboard;
