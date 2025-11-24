'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order, OrderStatus } from '../../../../types';
import { api } from '../../../../services/api';
import { useSettings } from '../@/contexts/SettingsContext';
import { HelpCircle, Printer, CreditCard, Home, CheckCircle, XCircle, RefreshCw, Truck } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    let colorClasses, text, Icon;

    switch (status) {
        case 'delivered':
            colorClasses = 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
            text = 'Completed';
            Icon = CheckCircle;
            break;
        case 'cancelled':
            colorClasses = 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
            text = 'Cancelled';
            Icon = XCircle;
            break;
        default:
            colorClasses = 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
            text = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            Icon = RefreshCw;
            break;
    }

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${colorClasses}`}>
            <div className={`w-2 h-2 rounded-full ${status === 'delivered' ? 'bg-green-500' : status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <span>{text}</span>
        </div>
    );
};

const OrderDetailsSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-32"></div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                    <div className="space-y-6">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                <div className="flex-grow space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-64"></div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-32"></div>
            </div>
        </div>
    </div>
);


const OrderDetailsPage: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const id = params?.id as string;
    const { settings } = useSettings();

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            api.getOrderById(id).then(orderData => {
                setOrder(orderData);
                setIsLoading(false);
            });
        }
    }, [id]);

    const breadcrumbs = [
        { name: 'Dashboard', path: '/customer' },
        { name: 'Orders', path: '/customer/orders' },
        { name: `Order #${id}`, path: `/customer/orders/${id}` }
    ];

    if (isLoading) return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <OrderDetailsSkeleton />
            </div>
        </>
    );

    if (!order) return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <p className="dark:text-white text-center py-20">Order not found.</p>
            </div>
        </>
    );

    const isInProgress = !['delivered', 'cancelled'].includes(order.status);
    const mockTip = 6.00; // Mock data as per image, not in schema
    const finalTotal = order.total_amount + mockTip; // Adjust total for mock tip

    const breadcrumbsWithId = [
        { name: 'Dashboard', path: '/customer' },
        { name: 'Orders', path: '/customer/orders' },
        { name: `#${order.id}`, path: `/customer/orders/${order.id}` }
    ];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbsWithId} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Order Receipt</h1>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <HelpCircle size={18} /> Get Help
                        </button>
                        {isInProgress && (
                            <Link href={`/track-order/${order.id}`} className="flex items-center gap-2 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                                <Truck size={18} /> Track Order
                            </Link>
                        )}
                        <button onClick={() => window.print()} className="flex items-center gap-2 py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                            <Printer size={18} /> Print Receipt
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Info Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</h3>
                                    <p className="font-semibold text-gray-800 dark:text-white mt-1">#{order.id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</h3>
                                    <p className="font-semibold text-gray-800 dark:text-white mt-1">{order.created_at ? new Date(order.created_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Status</h3>
                                    <div className="mt-1 flex justify-center sm:justify-start">
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Item Summary Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Item Summary</h2>
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="grid grid-cols-10 gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b pb-3 dark:border-gray-700">
                                    <div className="col-span-5">Item</div>
                                    <div className="col-span-1 text-center">Qty</div>
                                    <div className="col-span-2 text-right">Unit Price</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>
                                {/* Items */}
                                {order.items?.map(item => (
                                    <div key={item.id} className="grid grid-cols-10 gap-4 items-center">
                                        <div className="col-span-5 flex items-center gap-4">
                                            <img src={item.menu_item?.image_url || ''} alt={item.menu_item?.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white">{item.menu_item?.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.variant?.name}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-1 text-center text-gray-600 dark:text-gray-300">{item.quantity}</div>
                                        <div className="col-span-2 text-right text-gray-600 dark:text-gray-300">{settings.currencySymbol}{item.unit_price.toFixed(2)}</div>
                                        <div className="col-span-2 text-right font-semibold text-gray-800 dark:text-white">{settings.currencySymbol}{(item.unit_price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Cost Breakdown */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cost Breakdown</h2>
                            <div className="space-y-3 text-gray-600 dark:text-gray-300">
                                <div className="flex justify-between"><p>Subtotal</p><p>{settings.currencySymbol}{order.subtotal.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>Tax ({settings.taxRatePercent}%)</p><p>{settings.currencySymbol}{order.tax_amount.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>Delivery Charge</p><p>{settings.currencySymbol}{order.delivery_charge.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>Tip</p><p>{settings.currencySymbol}{mockTip.toFixed(2)}</p></div>
                                {order.discount_amount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><p>Discount</p><p>-{settings.currencySymbol}{order.discount_amount.toFixed(2)}</p></div>}
                                <div className="!mt-6 border-t dark:border-gray-700 pt-4 flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                                    <p>Total</p>
                                    <p className="text-orange-500">{settings.currencySymbol}{finalTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        {/* Payment */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Payment</h2>
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} className="text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">Visa ending in 1234</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount charged: {settings.currencySymbol}{finalTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        {/* Delivery Address */}
                        {order.delivery_address && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delivery Address</h2>
                                <div className="flex items-start gap-3">
                                    <Home size={20} className="text-gray-500 dark:text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{order.user?.first_name} {order.user?.last_name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.delivery_address.full_address}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetailsPage;
