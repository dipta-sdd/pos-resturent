import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../../types';
import { api } from '../../services/api';

const OrderDetailsPage: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            api.getOrderById(id).then(setOrder);
        }
    }, [id]);

    if (!order) return <p className="dark:text-white">Loading...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Order Details #{order.id}</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    <div><span className="font-semibold text-gray-900 dark:text-white">Order Date:</span> {order.created_at ? new Date(order.created_at).toLocaleString() : ''}</div>
                    <div><span className="font-semibold text-gray-900 dark:text-white">Status:</span> <span className="capitalize">{order.status}</span></div>
                    <div><span className="font-semibold text-gray-900 dark:text-white">Total Amount:</span> ${order.total_amount.toFixed(2)}</div>
                </div>

                <h2 className="text-xl font-semibold mb-4 dark:text-white">Items</h2>
                <div className="space-y-4 mb-6 text-gray-700 dark:text-gray-300">
                    {/* FIX: Check if order.items exists before mapping */ }
                    {order.items && order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                            <p>{item.quantity} x {item.menu_item?.name}</p>
                            <p>${(item.unit_price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment</h2>
                 <div className="flex justify-between font-bold pt-4 text-lg border-t dark:border-gray-700 dark:text-white">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                </div>
                
                 <div className="mt-8 text-center">
                    <Link to={`/track-order/${order.id}`} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600">
                        Track Order
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;