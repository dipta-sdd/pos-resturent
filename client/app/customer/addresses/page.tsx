'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useAuth } from '@/components//AuthContext';
import { Address } from '@/types';
import { Plus, Edit, Trash2, Home, Briefcase, MapPin } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';

// FIX: Extracted props to an interface and used React.FC to solve typing issues with the `key` prop.
interface AddressEditorProps {
    initialAddress?: Partial<Address>;
    onSave: (addressData: { label: string; full_address: string; city: string | null; zip_code: string | null; }) => void;
    onCancel: () => void;
}

const AddressEditor: React.FC<AddressEditorProps> = ({ initialAddress, onSave, onCancel }) => {
    const [label, setLabel] = useState(initialAddress?.label || 'Home');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    useEffect(() => {
        if (initialAddress?.full_address) {
            const parts = initialAddress.full_address.split(',').map(p => p.trim());
            if (parts.length >= 3) {
                const lastPart = parts[parts.length - 1].split(' ');
                const zipCode = lastPart.pop() || '';
                const stateAbbr = lastPart.join(' ');

                setStreet(parts.slice(0, parts.length - 2).join(', '));
                setCity(parts[parts.length - 2]);
                setState(stateAbbr);
                setZip(zipCode);
            } else {
                setStreet(initialAddress.full_address);
            }
        }
    }, [initialAddress]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const full_address = `${street}, ${city}, ${state} ${zip}`;
        onSave({ label, full_address, city, zip_code: zip });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-2 border-orange-400">
            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Label</label>
                        <input id="label" type="text" value={label} onChange={e => setLabel(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                        <input id="street" type="text" value={street} onChange={e => setStreet(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                        <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Province</label>
                        <input id="state" type="text" value={state} onChange={e => setState(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP / Postal Code</label>
                        <input id="zip" type="text" value={zip} onChange={e => setZip(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save Address</button>
                </div>
            </form>
        </div>
    );
};

// FIX: Extracted props to an interface and used React.FC to solve typing issues with the `key` prop.
interface AddressCardProps {
    address: Address;
    onEdit: () => void;
    onDelete: () => void;
    onSetDefault: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete, onSetDefault }) => {
    const getIcon = (label: string) => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('home')) return <Home className="w-8 h-8 text-orange-500" />;
        if (lowerLabel.includes('work')) return <Briefcase className="w-8 h-8 text-orange-500" />;
        return <MapPin className="w-8 h-8 text-orange-500" />;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                        {getIcon(address.label)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{address.label}</h3>
                            {address.is_default && (
                                <span className="text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-200/20 dark:text-orange-300 px-2 py-0.5 rounded-md">Default</span>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{address.full_address}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-semibold">
                    {!address.is_default && (
                        <button onClick={onSetDefault} className="bg-orange-500 text-white py-1 px-3 rounded-md hover:bg-orange-600">Set as Default</button>
                    )}
                    <button onClick={onEdit} className="text-gray-600 dark:text-gray-300 hover:text-orange-500 flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </button>
                    <button onClick={onDelete} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};


const ManageAddressesPage: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const breadcrumbs = [
        { name: 'Dashboard', path: '/customer' },
        { name: 'Manage Addresses', path: '/customer/addresses' },
    ];

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            api.getCustomerAddresses(user.id).then(fetchedAddresses => {
                setAddresses(fetchedAddresses);
                setIsLoading(false);
            });
        }
    }, [user]);

    // FIX: Update function signature and object creation to include city and zip_code for the new address.
    const handleSave = (addressData: { label: string, full_address: string, city: string | null, zip_code: string | null }) => {
        if (!user) return;

        if (editingId === 'new') {
            // Mock adding a new address
            const newAddress: Address = {
                id: Date.now(),
                user_id: user.id,
                label: addressData.label,
                full_address: addressData.full_address,
                city: addressData.city,
                zip_code: addressData.zip_code,
                is_default: addresses.length === 0, // Make first address default
            };
            setAddresses(prev => [...prev, newAddress]);
        } else {
            // Mock updating an existing address
            setAddresses(prev => prev.map(addr =>
                addr.id === editingId ? { ...addr, ...addressData } : addr
            ));
        }
        setEditingId(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
        }
    };

    const handleSetDefault = (id: number) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            is_default: addr.id === id
        })));
    };


    if (isLoading) {
        return (
            <>
                <Breadcrumb crumbs={breadcrumbs} />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="dark:text-white">Loading addresses...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Manage Addresses</h1>
                        <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">Add, edit, or remove your saved delivery locations.</p>
                    </div>
                    <button
                        onClick={() => setEditingId('new')}
                        disabled={editingId !== null}
                        className="flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={20} /> Add New Address
                    </button>
                </div>

                <div className="space-y-6">
                    {editingId === 'new' && (
                        <AddressEditor onSave={handleSave} onCancel={() => setEditingId(null)} />
                    )}

                    {addresses.map(address =>
                        editingId === address.id
                            ? <AddressEditor key={address.id} initialAddress={address} onSave={handleSave} onCancel={() => setEditingId(null)} />
                            : <AddressCard key={address.id} address={address} onEdit={() => setEditingId(address.id)} onDelete={() => handleDelete(address.id)} onSetDefault={() => handleSetDefault(address.id)} />
                    )}
                </div>
            </div>
        </>
    );
};

export default ManageAddressesPage;
