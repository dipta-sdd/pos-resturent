'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Promotion } from '../../../types';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useSettings } from '@/components//SettingsContext';

const AdminPromotionsManagement: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentPromo, setCurrentPromo] = useState<Partial<Promotion>>({});
    const { settings } = useSettings();

    useEffect(() => {
        loadPromotions();
    }, []);

    const loadPromotions = async () => {
        setLoading(true);
        const data = await api.getAllPromotions();
        setPromotions(data);
        setLoading(false);
    };

    const openModal = (promo?: Promotion) => {
        if (promo) {
            setCurrentPromo(promo);
        } else {
            setCurrentPromo({
                code: '',
                description: '',
                discount_type: 'percentage',
                discount_value: 0,
                start_date: new Date(),
                end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default 1 month
                is_active: true,
                usage_limit: 100,
                used_count: 0
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentPromo({});
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPromo.code || !currentPromo.discount_value) return;

        if (currentPromo.id) {
            await api.updatePromotion(currentPromo.id, currentPromo);
        } else {
            await api.createPromotion(currentPromo);
        }
        loadPromotions();
        closeModal();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
            await api.deletePromotion(id);
            loadPromotions();
        }
    };

    // Helper for input handling
    const handleChange = (field: keyof Promotion, value: any) => {
        setCurrentPromo(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Promotions & Coupons</h1>
                <button onClick={() => openModal()} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2">
                    <Plus size={20} /> Create Promotion
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Validity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usage</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                        ) : promotions.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No promotions found.</td></tr>
                        ) : (
                            promotions.map(promo => (
                                <tr key={promo.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center text-orange-500">
                                                <Tag size={20} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">{promo.code}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{promo.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                                            {promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `${settings.currencySymbol}${promo.discount_value} OFF`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${promo.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
                                            {promo.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(promo.start_date).toLocaleDateString()} - {new Date(promo.end_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {promo.used_count} / {promo.usage_limit === null ? '∞' : promo.usage_limit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(promo)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(promo.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{currentPromo.id ? 'Edit Promotion' : 'New Promotion'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Promo Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentPromo.code}
                                        onChange={e => handleChange('code', e.target.value.toUpperCase())}
                                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="e.g. SAVE20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                    <select
                                        value={currentPromo.is_active ? 'active' : 'inactive'}
                                        onChange={e => handleChange('is_active', e.target.value === 'active')}
                                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <input
                                    type="text"
                                    value={currentPromo.description || ''}
                                    onChange={e => handleChange('description', e.target.value)}
                                    className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discount Type</label>
                                    <select
                                        value={currentPromo.discount_type}
                                        onChange={e => handleChange('discount_type', e.target.value)}
                                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ({settings.currencySymbol})</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Value</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={currentPromo.discount_value}
                                        onChange={e => handleChange('discount_value', parseFloat(e.target.value))}
                                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={currentPromo.start_date ? new Date(currentPromo.start_date).toISOString().split('T')[0] : ''}
                                        onChange={e => handleChange('start_date', new Date(e.target.value))}
                                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={currentPromo.end_date ? new Date(currentPromo.end_date).toISOString().split('T')[0] : ''}
                                        onChange={e => handleChange('end_date', new Date(e.target.value))}
                                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Usage Limit (Optional)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={currentPromo.usage_limit || ''}
                                    onChange={e => handleChange('usage_limit', e.target.value ? parseInt(e.target.value) : null)}
                                    placeholder="Unlimited if empty"
                                    className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save Promotion</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPromotionsManagement;
