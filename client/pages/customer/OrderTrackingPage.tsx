

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { Package, ChefHat, Bike, CheckCircle } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';

const statuses: OrderStatus[] = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const statusInfo = {
    'pending': { icon: Package, text: 'Pending Confirmation' },
    'confirmed': { icon: Package, text: 'Order Confirmed' },
    'preparing': { icon: ChefHat, text: 'Preparing Your Food' },
    'ready': { icon: ChefHat, text: 'Ready for Pickup' },
    'out_for_delivery': { icon: Bike, text: 'Out for Delivery' },
    'delivered': { icon: CheckCircle, text: 'Delivered' },
    'cancelled': { icon: CheckCircle, text: 'Cancelled' }
};

const OrderTrackingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (id) {
                const fetchedOrder = await api.getOrderById(id);
                setOrder(fetchedOrder);
            }
        };
        fetchOrder();
        
        // Simulate real-time updates
        const interval = setInterval(() => {
            setOrder(prevOrder => {
                if (!prevOrder || prevOrder.status === 'delivered') {
                    clearInterval(interval);
                    return prevOrder;
                }
                const currentIndex = statuses.indexOf(prevOrder.status);
                const nextStatus = statuses[currentIndex + 1];
                return nextStatus ? { ...prevOrder, status: nextStatus } : prevOrder;
            });
        }, 8000);

        return () => clearInterval(interval);
    }, [id]);

    const breadcrumbs = id ? [{ name: `Track Order #${id}`, path: `/track-order/${id}` }] : [];

    if (!order) {
        return <div className="text-center py-20 dark:text-white">Loading order details...</div>;
    }

    const currentStatusIndex = statuses.indexOf(order.status);

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-center mb-4 dark:text-white">Tracking Order {order.id}</h1>
                <p className="text-center text-gray-600 dark:text-gray-400 text-lg mb-12">Estimated Delivery: <span className="font-semibold text-orange-500">25-35 minutes</span></p>

                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center">
                        {statuses.map((status, index) => {
                            const isActive = index <= currentStatusIndex;
                            const Info = statusInfo[status] || statusInfo['pending'];
                            return (
                            <React.Fragment key={status}>
                                <div className="flex flex-col items-center text-center">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                        <Info.icon size={24} />
                                    </div>
                                    <p className={`mt-2 font-semibold ${isActive ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>{Info.text}</p>
                                </div>
                                {index < statuses.length - 1 && (
                                    <div className={`flex-1 h-1 ${isActive ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                )}
                            </React.Fragment>
                        )})}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-16 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Summary</h2>
                    {order.items?.map(item => (
                        <div key={item.id} className="flex justify-between py-2 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">
                            <span>{item.quantity} x {item.menu_item?.name}</span>
                            <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold pt-4 text-lg dark:text-white">
                        <span>Total</span>
                        <span>${order.total_amount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderTrackingPage;