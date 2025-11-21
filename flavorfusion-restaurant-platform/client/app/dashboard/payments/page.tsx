'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { PaymentMethod, PaymentMethodType } from '../../../types';
import { Plus, Edit, Trash2, CreditCard, Banknote, Globe, Landmark, Wallet, Check, X } from 'lucide-react';

const PaymentTypeIcon = ({ type }: { type: PaymentMethodType }) => {
    switch (type) {
        case 'cash': return <Banknote size={20} className="text-green-600" />;
        case 'card': return <CreditCard size={20} className="text-blue-600" />;
        case 'online': return <Globe size={20} className="text-purple-600" />;
        case 'bank': return <Landmark size={20} className="text-gray-600" />;
        default: return <Wallet size={20} className="text-orange-600" />;
    }
};

const AdminPaymentManagement: React.FC = () => {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentMethod, setCurrentMethod] = useState<Partial<PaymentMethod>>({});

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        setLoading(true);
        const data = await api.getAllPaymentMethods();
        setMethods([...data]); // Copy array to trigger re-render
        setLoading(false);
    };

    const openModal = (method?: PaymentMethod) => {
        if (method) {
            setCurrentMethod(method);
        } else {
            setCurrentMethod({
                name: '',
                type: 'cash',
                is_active: true
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentMethod({});
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMethod.name || !currentMethod.type) return;

        await api.savePaymentMethod(currentMethod);
        loadMethods();
        closeModal();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this payment method?')) {
            await api.deletePaymentMethod(id);
            loadMethods();
        }
    };

    const handleChange = (field: keyof PaymentMethod, value: any) => {
        setCurrentMethod(prev => ({ ...prev, [field]: value }));
    };

    const toggleActive = async (method: PaymentMethod) => {
        await api.savePaymentMethod({ ...method, is_active: !method.is_active });
        loadMethods();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Payment Methods</h1>
                <button onClick={() => openModal()} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2">
                    <Plus size={20} /> Add New Method
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
                        ) : methods.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No payment methods found.</td></tr>
                        ) : (
                            methods.map(method => (
                                <tr key={method.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                                                <PaymentTypeIcon type={method.type} />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{method.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                                            {method.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleActive(method)}
                                            className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full transition-colors ${method.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}
                                        >
                                            {method.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(method)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(method.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{currentMethod.id ? 'Edit Method' : 'Add Payment Method'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentMethod.name || ''}
                                    onChange={e => handleChange('name', e.target.value)}
                                    className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="e.g. Stripe, Cash"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                <select
                                    value={currentMethod.type || 'others'}
                                    onChange={e => handleChange('type', e.target.value)}
                                    className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="online">Online / Digital Wallet</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="isActive"
                                    type="checkbox"
                                    checked={currentMethod.is_active !== false}
                                    onChange={e => handleChange('is_active', e.target.checked)}
                                    className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Active</label>
                            </div>

                            <div className="mt-6 flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentManagement;
