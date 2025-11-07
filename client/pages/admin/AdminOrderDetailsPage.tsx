import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { mockUsers } from '../../data/mockData';
import { User, MapPin, Truck, Printer } from 'lucide-react';

const AdminOrderDetailsPage: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            api.getOrderById(id).then(setOrder);
        }
    }, [id]);

    if (!order) return <p className="dark:text-white">Loading...</p>;

    // FIX: Filter riders by `role_id` (3 for rider) instead of the non-existent `role` property.
    const riders = mockUsers.filter(u => u.role_id === 3);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Order Details #{order.id}</h1>
                <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                    <Printer size={16}/> Print Receipt
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Order Summary</h2>
                    <div className="space-y-3 mb-6 text-gray-700 dark:text-gray-300">
                        {order.items?.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p>{item.quantity} x {item.menu_item?.name}</p>
                                    {item.add_ons && item.add_ons.length > 0 && (
                                        <p className="text-sm text-gray-500 pl-2">
                                            {/* FIX: The 'name' property is on the nested 'add_on' object. */}
                                            {item.add_ons.map(ao => `+ ${ao.add_on?.name}`).join(', ')}
                                        </p>
                                    )}
                                </div>
                                <p>${(item.unit_price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t dark:border-gray-700 mt-4 pt-4 space-y-2 dark:text-gray-300">
                         <div className="flex justify-between"><p>Subtotal</p><p>${order.subtotal.toFixed(2)}</p></div>
                         <div className="flex justify-between"><p>Tax</p><p>${order.tax_amount.toFixed(2)}</p></div>
                         <div className="flex justify-between"><p>Delivery Charge</p><p>${order.delivery_charge.toFixed(2)}</p></div>
                         <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 dark:text-white dark:border-gray-700"><p>Total</p><p>${order.total_amount.toFixed(2)}</p></div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                         <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Status</h2>
                         <select defaultValue={order.status} className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                             {(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'] as OrderStatus[]).map(s => (
                                 <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>
                             ))}
                         </select>
                         <button className="w-full mt-3 bg-orange-500 text-white font-bold py-2 rounded-lg">Update Status</button>
                    </div>

                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center gap-2"><User /> Customer Details</h2>
                        <p className="font-medium dark:text-gray-200">{order.user ? `${order.user.firstName} ${order.user.lastName}` : ''}</p>
                        {order.delivery_address && <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><MapPin size={14}/>{order.delivery_address.full_address}</p>}
                    </div>
                    
                    {order.order_type === 'delivery' && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center gap-2"><Truck /> Rider Assignment</h2>
                             <select defaultValue={order.rider_id || ""} className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Unassigned</option>
                                {/* FIX: Display rider's full name from firstName and lastName. */}
                                {riders.map(r => <option key={r.id} value={r.id}>{`${r.firstName} ${r.lastName}`}</option>)}
                             </select>
                             <button className="w-full mt-3 bg-blue-500 text-white font-bold py-2 rounded-lg">Assign Rider</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailsPage;