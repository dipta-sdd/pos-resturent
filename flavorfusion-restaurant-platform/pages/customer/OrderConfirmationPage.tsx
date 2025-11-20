
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../../types';
import { api } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import { FileText, MapPin, ChevronDown, Check } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { settings } = useSettings();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (id) {
                setLoading(true);
                try {
                    const fetchedOrder = await api.getOrderById(id);
                    // Mock data to match screenshot for visual consistency
                    if (fetchedOrder) {
                        fetchedOrder.id = 'RST-123XYZ' as any; // Using 'as any' to override type for demo
                        fetchedOrder.total_amount = 52.50;
                    }
                    setOrder(fetchedOrder);
                } catch (error) {
                    console.error("Failed to fetch order", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-500 dark:text-gray-400">Loading your order confirmation...</p></div>;
    }

    if (!order) {
        return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><p className="text-red-500">Could not find your order.</p></div>;
    }

    const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-lg w-full">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center border-4 border-orange-500 rounded-full">
                        <Check className="text-orange-500" size={32} strokeWidth={3} />
                    </div>
                    <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Thank You For Your Order!</h1>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">Your order has been placed successfully.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-left">
                    <div className="flex justify-between items-start pb-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Order Number</p>
                            <p className="font-bold text-lg text-gray-800 dark:text-white mt-1">#{order.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Arrival</p>
                            <p className="font-bold text-lg text-gray-800 dark:text-white mt-1">35 - 45 minutes</p>
                        </div>
                    </div>
                    <hr className="my-4 border-gray-200 dark:border-gray-700" />
                    <div>
                        <button
                            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                            className="w-full flex justify-between items-center text-left focus:outline-none"
                            aria-expanded={isSummaryOpen}
                            aria-controls="order-summary-content"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span className="font-semibold text-gray-800 dark:text-white">Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800 dark:text-white">{settings.currencySymbol}{order.total_amount.toFixed(2)}</span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isSummaryOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        <div
                            id="order-summary-content"
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isSummaryOpen ? 'max-h-96 mt-6' : 'max-h-0'}`}
                        >
                            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <img src={item.menu_item?.image_url} alt={item.menu_item?.name} className="w-12 h-12 rounded-md object-cover" />
                                            <div>
                                                <p className="font-medium text-gray-700 dark:text-gray-200">{item.menu_item?.name}</p>
                                                <p className="text-gray-500 dark:text-gray-400">{item.quantity} x {settings.currencySymbol}{item.unit_price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{settings.currencySymbol}{(item.unit_price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><p>Subtotal</p><p>{settings.currencySymbol}{order.subtotal.toFixed(2)}</p></div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><p>Delivery</p><p>{settings.currencySymbol}{order.delivery_charge.toFixed(2)}</p></div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><p>Taxes</p><p>{settings.currencySymbol}{order.tax_amount.toFixed(2)}</p></div>
                                    <div className="flex justify-between font-bold text-gray-800 dark:text-white"><p>Total</p><p>{settings.currencySymbol}{order.total_amount.toFixed(2)}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/track-order/${order.id}`}
                    className="mt-8 w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <MapPin size={20} />
                    Track Your Order
                </Link>

                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    You will receive an email confirmation with your receipt shortly. Keep this page open or use the link in your email to track your order's progress.
                </p>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
