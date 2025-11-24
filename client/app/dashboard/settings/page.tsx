'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/components//SettingsContext';
import { Settings } from '../../../types';
import { CheckCircle } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [formData, setFormData] = useState<Settings>(settings);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const currencySymbols: { [key: string]: string } = {
        BDT: '৳',
        USD: '$',
        EUR: '€',
        GBP: '£',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const keys = name.split('.');

        const processedValue = (e.target as HTMLInputElement).type === 'number' ? parseFloat(value) || 0 : value;

        if (name === 'currencyCode') {
            const symbol = currencySymbols[value] || value;
            setFormData(prev => ({
                ...prev,
                currencyCode: value,
                currencySymbol: symbol
            }));
            return;
        }

        if (keys.length > 1) {
            // Handle nested objects like socials.facebook
            setFormData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...(prev[keys[0] as keyof Settings] as object),
                    [keys[1]]: processedValue,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: processedValue,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (saveStatus !== 'idle') return;

        setSaveStatus('saving');
        // Simulate async save
        setTimeout(() => {
            updateSettings(formData);
            setSaveStatus('success');
            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
        }, 500);
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Restaurant Settings</h1>
            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    {/* Restaurant Information */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Restaurant Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Name</label>
                                <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                                <input type="email" name="restaurantEmail" value={formData.restaurantEmail} onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <input type="tel" name="restaurantPhone" value={formData.restaurantPhone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                <input type="text" name="restaurantAddress" value={formData.restaurantAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Social Media Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Facebook URL</label>
                                <input type="text" name="socials.facebook" value={formData.socials.facebook || ''} onChange={handleChange} placeholder="https://facebook.com/yourpage" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter (X) URL</label>
                                <input type="text" name="socials.twitter" value={formData.socials.twitter || ''} onChange={handleChange} placeholder="https://twitter.com/yourhandle" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram URL</label>
                                <input type="text" name="socials.instagram" value={formData.socials.instagram || ''} onChange={handleChange} placeholder="https://instagram.com/yourprofile" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Financial Settings */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Financial Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                                <select name="currencyCode" value={formData.currencyCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="BDT">BDT</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency Symbol</label>
                                <input type="text" name="currencySymbol" value={formData.currencySymbol} onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax Rate (%)</label>
                                <input type="number" name="taxRatePercent" value={formData.taxRatePercent} onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Operational Settings */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Operational Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Fee</label>
                                <input type="number" step="0.01" name="deliveryChargeFlat" value={formData.deliveryChargeFlat} onChange={handleChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enable Tipping</label>
                                <div className="mt-2 flex items-center">
                                    <input type="checkbox" defaultChecked className="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Allow customers to add a tip</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-4 mt-8">
                        {saveStatus === 'success' && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 transition-opacity duration-300">
                                <CheckCircle size={20} />
                                <span className="font-semibold">Settings saved!</span>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 dark:disabled:bg-orange-800 disabled:cursor-not-allowed"
                            disabled={saveStatus === 'saving'}
                        >
                            {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
