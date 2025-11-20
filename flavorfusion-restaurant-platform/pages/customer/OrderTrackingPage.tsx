
import React, { useState, useEffect } from 'react';
// FIX: Split react-router-dom imports to resolve "no exported member" errors.
import { useParams, Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { ChefHat, Bike, Home, Check, Phone, Star } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';

// New status configuration based on the design
const statusSteps: OrderStatus[] = ['confirmed', 'preparing', 'out_for_delivery'];
const statusDetails: { [key: string]: { icon: React.ElementType, title: string, time: string } } = {
    confirmed: { icon: Check, title: 'Order Confirmed', time: '11:30 AM' },
    preparing: { icon: ChefHat, title: 'In the Kitchen', time: '11:35 AM' },
    out_for_delivery: { icon: Bike, title: 'Out for Delivery', time: '11:50 AM' },
    delivered: { icon: Home, title: 'Delivered', time: '12:05 PM' },
    arriving: { icon: Home, title: 'Arriving Soon', time: '' }
};


const OrderTrackingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (id) {
                setLoading(true);
                const fetchedOrder = await api.getOrderById(id);
                // Force a status for demo that allows progress
                if (fetchedOrder) {
                    fetchedOrder.status = 'confirmed';
                }
                setOrder(fetchedOrder);
                setLoading(false);
            }
        };
        fetchOrder();

        const allStatusesForSim: OrderStatus[] = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
        
        const interval = setInterval(() => {
            setOrder(prevOrder => {
                if (!prevOrder || prevOrder.status === 'delivered') {
                    clearInterval(interval);
                    return prevOrder;
                }
                const currentIndex = allStatusesForSim.indexOf(prevOrder.status);
                const nextStatus = allStatusesForSim[currentIndex + 1];
                return nextStatus ? { ...prevOrder, status: nextStatus } : prevOrder;
            });
        }, 10000); // Slower interval for a more realistic feel

        return () => clearInterval(interval);
    }, [id]);

    const breadcrumbs = id ? [{ name: 'Track Order', path: `/track-order/${id}` }] : [];
    
    if (loading) {
        return <div className="text-center py-20 dark:text-white">Loading order details...</div>;
    }

    if (!order) {
        return <div className="text-center py-20 dark:text-white">Order not found.</div>;
    }

    const currentStatusIndex = statusSteps.indexOf(order.status);
    const isDelivered = order.status === 'delivered';

    return (
        <div className="bg-[#F9F5F0] dark:bg-gray-900">
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Column: Status */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                            Your Order is on its Way!
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                            Arriving in approximately: <span className="font-semibold text-orange-600">15 minutes</span>
                        </p>

                        <div className="mt-12">
                            {statusSteps.map((status, index) => {
                                const detail = statusDetails[status];
                                const isCompleted = isDelivered || index <= currentStatusIndex;
                                return (
                                    <div key={status} className="flex">
                                        <div className="flex flex-col items-center mr-6">
                                            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-colors duration-500 ${isCompleted ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                                                <detail.icon size={24} />
                                            </div>
                                            {index < statusSteps.length - 1 && (
                                                <div className={`w-0.5 flex-grow mt-2 transition-colors duration-500 ${isCompleted ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                            )}
                                        </div>
                                        <div className="pb-16 pt-1">
                                            <h3 className={`text-lg font-semibold ${isCompleted ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{detail.title}</h3>
                                            <p className={`text-sm ${isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>{isCompleted ? detail.time : ''}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Final Step: Arriving/Delivered */}
                            <div className="flex items-start">
                                <div className="flex flex-col items-center mr-6">
                                      <div className={`w-12 h-12 rounded-full flex items-center flex-shrink-0 justify-center transition-colors duration-500 ${isDelivered ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                                        {isDelivered ? <statusDetails.delivered.icon size={24} /> : <statusDetails.arriving.icon size={24} />}
                                    </div>
                                </div>
                                <div className="pt-1">
                                    <h3 className={`text-lg font-semibold ${isDelivered ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {isDelivered ? statusDetails.delivered.title : statusDetails.arriving.title}
                                    </h3>
                                    <p className={`text-sm ${isDelivered ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                                        {isDelivered ? statusDetails.delivered.time : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link 
                            to={`/customer/orders/${id}`} 
                            className="mt-auto bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center"
                        >
                            View Order Details
                        </Link>
                    </div>

                    {/* Right Column: Map & Rider */}
                    <div className="space-y-8">
                        <div className="rounded-2xl overflow-hidden shadow-xl aspect-video relative">
                            <img src="https://images.unsplash.com/photo-1509477632128-2a14c3327263?q=80&w=1920&auto=format&fit=crop" alt="Delivery map" className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            {/* SVG for map pin - simplistic version */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                               <svg viewBox="0 0 100 125" className="w-24 h-24 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M50 0C27.9 0 10 17.9 10 40C10 57.2 32.8 90.6 45.1 106.3C47.6 109.5 52.4 109.5 54.9 106.3C67.2 90.6 90 57.2 90 40C90 17.9 72.1 0 50 0Z" fill="white" fillOpacity="0.8"/>
                                  <path d="M50 15C42.8 15 37 20.8 37 28C37 35.2 42.8 41 50 41C57.2 41 63 35.2 63 28C63 20.8 57.2 15 50 15Z" fill="#3B82F6"/>
                                </svg>
                            </div>
                        </div>
                        
                        {order.rider && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex items-center gap-6">
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-400">Order #{order.id}</p>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                                        Your rider, {order.rider.firstName}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1 text-yellow-500">
                                        <Star size={16} fill="currentColor" />
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">4.8</span>
                                    </div>
                                    <button className="mt-4 bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                        <Phone size={16}/> Contact Rider
                                    </button>
                                </div>
                                <img src={order.rider.avatar_url || 'https://i.imgur.com/CR1N22g.png'} alt={order.rider.firstName} className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage;
