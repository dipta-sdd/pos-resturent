'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../services/api';
import { Address } from '../../types';
import { ArrowRight, Pencil, Plus, ShoppingCart, Lock, Banknote, CreditCard } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';

const OrderSummary: React.FC<{
    tipAmount: number;
    onTipChange: (type: '10' | '15' | '20' | 'custom', value: number) => void;
    customTip: string;
    onCustomTipChange: (value: string) => void;
    tipSelection: string | null;
    isPlacingOrder: boolean;
    deliveryFee: number;
    taxes: number;
}> = ({ tipAmount, onTipChange, customTip, onCustomTipChange, tipSelection, isPlacingOrder, deliveryFee, taxes }) => {
    const { cartItems, cartTotal } = useCart();
    const total = cartTotal + deliveryFee + taxes + tipAmount;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/60 h-fit lg:sticky top-28">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 -mr-2">
                {cartItems.map(item => (
                    <div key={`${item.variant.id}-${item.customization_notes}`} className="flex items-center gap-4">
                        <img src={item.menuItem.image_url || ''} alt={item.menuItem.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{item.menuItem.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.variant.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">x {item.quantity}</p>
                        </div>
                        {/* FIX: Use price from the variant */}
                        <p className="font-semibold text-gray-800 dark:text-gray-100">${(item.variant.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 space-y-3 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between"><p>Subtotal</p><p>${cartTotal.toFixed(2)}</p></div>
                <div className="flex justify-between"><p>Delivery Fee</p><p>${deliveryFee.toFixed(2)}</p></div>
                <div className="flex justify-between"><p>Taxes</p><p>${taxes.toFixed(2)}</p></div>
            </div>

            {/* Tip Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Add a tip</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Optional</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {(['10%', '15%', '20%'] as const).map(p => {
                        const isSelected = tipSelection === p;
                        return (
                            <button type="button" key={p} onClick={() => onTipChange(p.replace('%', '') as any, cartTotal * (parseInt(p) / 100))} className={`py-2 px-1 text-center rounded-lg border-2 transition-colors ${isSelected ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-700/50 border-transparent hover:border-gray-300 dark:hover:border-gray-500'}`}>
                                {p}
                            </button>
                        )
                    })}
                    <input
                        type="text"
                        value={customTip}
                        onChange={(e) => onCustomTipChange(e.target.value)}
                        placeholder="$"
                        className={`py-2 px-3 text-center rounded-lg border-2 transition-colors w-full ${tipSelection === 'custom' ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-700/50 border-transparent hover:border-gray-300 dark:hover:border-gray-500'} placeholder-gray-400 focus:outline-none focus:ring-0`}
                    />
                </div>
                <div className="flex justify-between mt-4 text-gray-600 dark:text-gray-300"><p>Tip Amount</p><p>${tipAmount.toFixed(2)}</p></div>
            </div>

            <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
            </div>

            <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full mt-6 bg-orange-500 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-orange-600 transition-colors text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 disabled:bg-orange-400 disabled:cursor-not-allowed"
            >
                {isPlacingOrder ? (
                    'Placing Order...'
                ) : (
                    <>
                        Confirm Order <ArrowRight size={22} />
                    </>
                )}
            </button>
        </div>
    );
};

const CheckoutSkeleton: React.FC = () => (
    <div className="animate-pulse container mx-auto px-4 py-8">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-12"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
                <div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                    </div>
                </div>
                <div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-2xl">
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                                <div className="flex-grow space-y-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div></div>
                                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 mt-6 pt-6 space-y-3">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-xl mt-10"></div>
                </div>
            </div>
        </div>
    </div>
);

const EmptyCart: React.FC = () => (
    <div className="text-center py-20 container mx-auto">
        <ShoppingCart className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
        <h1 className="mt-6 text-3xl font-bold text-gray-800 dark:text-white">Your Cart is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link
            href="/menu"
            className="mt-8 inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
        >
            Browse Menu
        </Link>
    </div>
);

const AddressEditor = ({ initialAddress, onSave, onCancel }: {
    initialAddress?: Partial<Address>;
    onSave: (addressData: { label: string, full_address: string, city: string | null; zip_code: string | null; }) => void;
    onCancel: () => void;
}) => {
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
        if (!street || !city || !state || !zip) {
            alert("Please fill out all address fields.");
            return;
        }
        const full_address = `${street}, ${city}, ${state} ${zip}`;
        onSave({ label, full_address, city, zip_code: zip });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-2 border-orange-400 dark:border-orange-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Address</h3>
            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label (e.g., Home, Work)</label>
                        <input id="label" type="text" value={label} onChange={e => setLabel(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                        <input id="street" type="text" value={street} onChange={e => setStreet(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                        <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Province</label>
                        <input id="state" type="text" value={state} onChange={e => setState(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP / Postal Code</label>
                        <input id="zip" type="text" value={zip} onChange={e => setZip(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
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

const CheckoutPage: React.FC = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'pay_now'>('pay_now');
    const [tipSelection, setTipSelection] = useState<string | null>('custom');
    const [customTip, setCustomTip] = useState('4.54');
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const deliveryFee = 3.00;
    const taxes = 2.25;
    const tipAmount = parseFloat(customTip) || 0;

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        api.getCustomerAddresses(user.id).then(fetchedAddresses => {
            setAddresses(fetchedAddresses);
            const defaultAddress = fetchedAddresses.find(a => a.is_default);
            setSelectedAddressId(defaultAddress ? defaultAddress.id : (fetchedAddresses[0]?.id || null));
            setIsLoading(false);
        });
    }, [user]);

    const handleTipChange = (type: '10' | '15' | '20' | 'custom', value: number) => {
        setTipSelection(type + '%');
        setCustomTip(value.toFixed(2));
    };

    const handleCustomTipChange = (value: string) => {
        setTipSelection('custom');
        const sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        setCustomTip(sanitizedValue);
    };

    const handleSaveNewAddress = (addressData: { label: string, full_address: string, city: string | null, zip_code: string | null }) => {
        if (!user) return;
        const newAddress: Address = {
            id: Date.now(),
            user_id: user.id,
            ...addressData,
            is_default: addresses.length === 0,
        };
        setAddresses(prev => [...prev, newAddress]);
        setSelectedAddressId(newAddress.id);
        setIsAddingAddress(false);
    };

    const handleCancelAddAddress = () => {
        setIsAddingAddress(false);
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to place an order.");
            router.push('/login');
            return;
        }
        if (!selectedAddressId) {
            alert("Please select or add a delivery address.");
            return;
        }
        if (isPlacingOrder) return;

        setIsPlacingOrder(true);

        const orderData = {
            user_id: user.id,
            user: user,
            order_type: 'delivery' as const,
            subtotal: cartTotal,
            tax_amount: taxes,
            discount_amount: 0,
            delivery_charge: deliveryFee,
            total_amount: cartTotal + taxes + deliveryFee + tipAmount,
            special_instructions: null,
            delivery_address_id: selectedAddressId,
            delivery_address: addresses.find(a => a.id === selectedAddressId),
            table_id: null, rider_id: null, staff_id: null,
            items: cartItems.map(item => ({
                id: Math.random(),
                order_id: 0,
                item_variant_id: item.variant.id,
                quantity: item.quantity,
                unit_price: item.variant.price,
                customization_notes: item.customization_notes || null,
                created_at: null,
                updated_at: null,
                menu_item: item.menuItem,
                variant: item.variant
            })),
            payments: [],
        };

        try {
            const response = await api.placeOrder(orderData);
            if (response.success) {
                clearCart();
                router.push(`/order-confirmation/${response.order.id}`);
            } else {
                alert("There was an issue placing your order. Please try again.");
                setIsPlacingOrder(false);
            }
        } catch (error) {
            console.error("Failed to place order:", error);
            alert("An error occurred while placing the order. Please try again.");
            setIsPlacingOrder(false);
        }
    };

    if (isLoading) return <CheckoutSkeleton />;

    if (cartItems.length === 0) {
        return <EmptyCart />;
    }

    const breadcrumbs = [
        { name: 'Cart', path: '/checkout' },
        { name: 'Checkout', path: '/checkout' },
    ];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="bg-[#FEFBF6] dark:bg-gray-900">
                <form onSubmit={handlePlaceOrder}>
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-8">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-10">
                                {/* Delivery Address */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Delivery Address</h2>
                                    <div className="space-y-4">
                                        {addresses.map(address => (
                                            <label key={address.id} className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${selectedAddressId === address.id ? 'border-orange-500 bg-orange-500/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-1 flex-shrink-0">
                                                        <input type="radio" name="delivery_address" value={address.id} checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} className="form-radio h-5 w-5 text-orange-500 border-gray-300 dark:border-gray-600 focus:ring-orange-500 dark:bg-gray-700 dark:checked:bg-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{address.full_address}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{address.label}</p>
                                                    </div>
                                                </div>
                                                <button type="button" className="text-gray-400 hover:text-orange-500"><Pencil size={18} /></button>
                                            </label>
                                        ))}
                                        {isAddingAddress ? (
                                            <AddressEditor
                                                onSave={handleSaveNewAddress}
                                                onCancel={handleCancelAddAddress}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingAddress(true)}
                                                className="w-full flex items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors font-semibold">
                                                <Plus size={20} /> Add a new address
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Payment Method</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div onClick={() => setPaymentMethod('cod')} className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                            <Banknote className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                                            <span className="font-semibold text-gray-800 dark:text-white">Cash on Delivery</span>
                                        </div>
                                        <div onClick={() => setPaymentMethod('pay_now')} className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'pay_now' ? 'border-orange-500 bg-orange-500/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                            <CreditCard className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                                            <span className="font-semibold text-gray-800 dark:text-white">Pay Now</span>
                                        </div>
                                    </div>
                                    {paymentMethod === 'pay_now' && (
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pay with Credit or Debit Card</label>
                                            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                                                {/* Placeholder for a real payment element like Stripe */}
                                                <p className="text-gray-400 dark:text-gray-500">Card details input field</p>
                                            </div>
                                            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-3">
                                                <Lock size={12} /> Your payment information is secure.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="lg:col-span-1">
                                <OrderSummary
                                    tipAmount={tipAmount}
                                    onTipChange={handleTipChange}
                                    customTip={customTip}
                                    onCustomTipChange={handleCustomTipChange}
                                    tipSelection={tipSelection}
                                    isPlacingOrder={isPlacingOrder}
                                    deliveryFee={deliveryFee}
                                    taxes={taxes}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CheckoutPage;
