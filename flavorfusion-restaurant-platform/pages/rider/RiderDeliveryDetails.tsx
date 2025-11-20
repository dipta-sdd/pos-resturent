import React, { useState, useEffect } from 'react';
// FIX: Split react-router-dom imports to resolve "no exported member" errors.
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Order } from '../../types';
import { MapPin, Phone, CheckCircle, Package } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const RiderDeliveryDetails: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const [order, setOrder] = useState<Order | null>(null);
    const { settings } = useSettings();

    useEffect(() => {
        if (id) {
            api.getOrderById(id).then(setOrder);
        }
    }, [id]);

    if (!order) {
        return <div className="dark:text-white text-center p-10">Loading delivery details...</div>;
    }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Delivery Details: #{order.id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="bg-gray-300 dark:bg-gray-700 h-80 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Map Area</p>
            </div>
            {/* Delivery Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button className="bg-blue-500 text-white font-bold p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600">
                    <Package size={20}/> Mark as Picked Up
                </button>
                <button className="bg-green-500 text-white font-bold p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600">
                    <CheckCircle size={20}/> Mark as Delivered
                </button>
            </div>
        </div>

        <div className="space-y-6">
            {/* Pickup Details */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="font-bold text-lg mb-2 dark:text-white">Pickup From</h2>
                <p className="font-semibold text-gray-700 dark:text-gray-200">{settings.restaurantName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{settings.restaurantAddress}</p>
                <button className="mt-2 w-full text-sm text-orange-500 font-semibold flex items-center justify-center gap-1"><Phone size={14}/> Call Restaurant</button>
            </div>

             {/* Delivery Details */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="font-bold text-lg mb-2 dark:text-white">Deliver To</h2>
                <p className="font-semibold text-gray-700 dark:text-gray-200">{order.user ? `${order.user.firstName} ${order.user.lastName}` : ''}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.delivery_address?.full_address}</p>
                <button className="mt-2 w-full text-sm text-orange-500 font-semibold flex items-center justify-center gap-1"><Phone size={14}/> Call Customer</button>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="font-bold text-lg mb-2 dark:text-white">Order Items</h2>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {order.items?.map(item => (
                        <li key={item.id} className="flex justify-between">
                            {/* FIX: Use `item.menu_item.name` to display the item name, as `menu_item_name` does not exist on the OrderItem type. */}
                            <span>{item.quantity}x {item.menu_item?.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDeliveryDetails;
