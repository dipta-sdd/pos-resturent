'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useAuth } from '@/components//AuthContext';
import { CustomerPaymentMethod } from '@/types';
import { Plus, Edit, Trash2, Star, CreditCard } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';

const ManagePaymentMethodsPage: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState<CustomerPaymentMethod[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentMethod, setCurrentMethod] = useState<CustomerPaymentMethod | Partial<CustomerPaymentMethod> | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            api.getCustomerPaymentMethods(user.id).then(setPaymentMethods);
        }
    }, [user]);

    const openModal = (method?: CustomerPaymentMethod) => {
        setCurrentMethod(method || { type: 'Card', last4: '', expiry_date: '', is_default: false });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentMethod(null);
    };

    const handleSave = () => {
        console.log('Saving payment method:', currentMethod);
        closeModal();
    };

    const breadcrumbs = [
        { name: 'Dashboard', path: '/customer' },
        { name: 'Payment Methods', path: '/customer/payments' },
    ];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Payment Methods</h1>
                    <button onClick={() => openModal()} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2">
                        <Plus size={20} /> Add New Card
                    </button>
                </div>

                <div className="space-y-4">
                    {paymentMethods.map(method => (
                        <div key={method.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <CreditCard className="text-gray-500" size={24} />
                                <div>
                                    <p className="font-semibold dark:text-white">{method.card_brand} ending in {method.last4}</p>
                                    <p className="text-gray-600 dark:text-gray-400">Expires {method.expiry_date}</p>
                                </div>
                                {method.is_default && (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">
                                        <Star size={12} /> Default
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => openModal(method)} className="text-orange-500 hover:text-orange-700"><Edit size={20} /></button>
                                <button className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && currentMethod && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 dark:text-white">{'id' in currentMethod ? 'Edit' : 'Add'} Card</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
                                    <input type="text" placeholder="•••• •••• •••• 1234" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" defaultValue={currentMethod.expiry_date} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                                        <input type="text" placeholder="123" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input id="is_default_payment" type="checkbox" defaultChecked={currentMethod.is_default} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                    <label htmlFor="is_default_payment" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Set as default payment method</label>
                                </div>
                            </form>
                            <div className="mt-6 flex justify-end gap-4">
                                <button onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                                <button onClick={handleSave} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManagePaymentMethodsPage;
