'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MenuItem, AddOn, ItemVariant } from '../../../../types';
import { api } from '../../../../services/api';
import { useCart } from '../../../../contexts/CartContext';
import { useSettings } from '../../../../contexts/SettingsContext';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import Breadcrumb from '../../../../components/common/Breadcrumb';

const MenuItemDetailPage: React.FC = () => {
    const params = useParams();
    const id = params?.id as string;
    const { addItem } = useCart();
    const { settings } = useSettings();

    const [item, setItem] = useState<MenuItem | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            if (id) {
                setLoading(true);
                const fetchedItem = await api.getMenuItemById(parseInt(id, 10));
                setItem(fetchedItem);
                if (fetchedItem?.variants?.length) {
                    setSelectedVariant(fetchedItem.variants[0]);
                }
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleAddOnToggle = (addOn: AddOn) => {
        setSelectedAddOns(prev =>
            prev.find(a => a.id === addOn.id)
                ? prev.filter(a => a.id !== addOn.id)
                : [...prev, addOn]
        );
    };

    const handleAddToCart = () => {
        if (item && selectedVariant) {
            addItem(item, selectedVariant, quantity, selectedAddOns, notes);
            alert(`${quantity} x ${item.name} (${selectedVariant.name}) added to cart!`);
        }
    };

    if (loading) return <div className="text-center py-20 dark:text-white">Loading...</div>;
    if (!item) return <div className="text-center py-20 dark:text-white">Item not found.</div>;

    const breadcrumbs = [
        { name: 'Menu', path: '/menu' },
        { name: item.name, path: `/menu/${item.id}` }
    ];

    const totalAddOnPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    const itemPrice = selectedVariant?.price ?? 0;
    const totalPrice = (itemPrice + totalAddOnPrice) * quantity;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="container mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div>
                        <img src={item.image_url || ''} alt={item.name} className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square" />
                    </div>
                    <div className="dark:text-white">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{item.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">{item.description}</p>

                        {item.variants && item.variants.length > 1 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3">Options</h3>
                                <div className="flex flex-wrap gap-3">
                                    {item.variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 border rounded-lg transition-colors ${selectedVariant?.id === variant.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-orange-400'}`}
                                        >
                                            <span className="font-medium">{variant.name}</span>
                                            <span className="text-sm ml-2">{settings.currencySymbol}{variant.price.toFixed(2)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {item.add_ons && item.add_ons.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3">Add-ons</h3>
                                <div className="space-y-2">
                                    {item.add_ons.map(addOn => (
                                        <label key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700">
                                            <div>
                                                <span className="font-medium">{addOn.name}</span>
                                                <span className="text-gray-500 dark:text-gray-400 ml-2">+{settings.currencySymbol}{addOn.price.toFixed(2)}</span>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedAddOns.some(a => a.id === addOn.id)}
                                                onChange={() => handleAddOnToggle(addOn)}
                                                className="h-5 w-5 rounded text-orange-500 focus:ring-orange-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">Special Instructions</h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Any special requests?"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-xl font-semibold">Quantity</h3>
                            <div className="flex items-center border rounded-lg dark:border-gray-600">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><Minus size={16} /></button>
                                <span className="px-4 text-lg font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><Plus size={16} /></button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{settings.currencySymbol}{totalPrice.toFixed(2)}</span>
                            <button onClick={handleAddToCart} className="w-full sm:w-auto bg-orange-500 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuItemDetailPage;
