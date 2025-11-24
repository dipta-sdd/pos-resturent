'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '../common/Breadcrumb';
import { Plus, Trash2, UploadCloud, X, Search } from 'lucide-react';
import { AddOn, Category, ItemVariant, MenuItem, LaravelErrorResponse } from '@/types';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

const AdminMenuItemManagement: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const router = useRouter();
    const isNew = !id;

    const [item, setItem] = useState<MenuItem | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allAddOns, setAllAddOns] = useState<AddOn[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState(false);

    const [addOnSearch, setAddOnSearch] = useState('');
    const [isAddOnDropdownOpen, setIsAddOnDropdownOpen] = useState(false);
    const addOnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [cats, addons] = await Promise.all([
                api.getCategories(),
                api.getAddOns(),
            ]);
            setCategories(cats);
            setAllAddOns(addons.data);

            if (isNew) {
                setItem({
                    id: Date.now(),
                    name: '',
                    description: '',
                    category_id: cats[0]?.id || 1,
                    is_active: true,
                    is_featured: false,
                    image_url: null,
                    variants: [{ id: Date.now(), menu_item_id: 0, name: 'Regular', price: 0, is_active: true, created_at: new Date(), updated_at: new Date() }],
                    add_ons: [],
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            } else {
                const menuItem = await api.getMenuItemById(parseInt(id!));
                setItem(menuItem);
                if (menuItem?.image_url) {
                    setImagePreview(menuItem.image_url);
                }
            }
        };
        fetchData();
    }, [id, isNew]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (addOnRef.current && !addOnRef.current.contains(event.target as Node)) {
                setIsAddOnDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setItem(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setItem(prev => prev ? { ...prev, [name]: checked } : null);
    };

    const handleVariantChange = (variantId: number, field: 'name' | 'price', value: string | number) => {
        setItem(prev => {
            if (!prev) return null;
            const newVariants = prev.variants.map(v =>
                v.id === variantId ? { ...v, [field]: value } : v
            );
            return { ...prev, variants: newVariants };
        });
    };

    const addVariant = () => {
        setItem(prev => {
            if (!prev) return null;
            const newVariant: ItemVariant = {
                id: Date.now(),
                menu_item_id: prev.id,
                name: '',
                price: 0,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            };
            return { ...prev, variants: [...prev.variants, newVariant] };
        });
    };

    const removeVariant = (variantId: number) => {
        setItem(prev => {
            if (!prev || prev.variants.length <= 1) return prev;
            const newVariants = prev.variants.filter(v => v.id !== variantId);
            return { ...prev, variants: newVariants };
        });
    };

    const handleAddOnSelect = (addOn: AddOn) => {
        setItem(prev => {
            if (!prev) return null;
            const currentAddOns = prev.add_ons || [];
            if (!currentAddOns.find(a => a.id === addOn.id)) {
                return { ...prev, add_ons: [...currentAddOns, addOn] };
            }
            return prev;
        });
        setAddOnSearch('');
        setIsAddOnDropdownOpen(false);
    };

    const handleAddOnRemove = (addOnId: number) => {
        setItem(prev => {
            if (!prev) return null;
            return { ...prev, add_ons: prev.add_ons?.filter(a => a.id !== addOnId) };
        });
    };

    const filteredAddOns = allAddOns.filter(a =>
        a.name.toLowerCase().includes(addOnSearch.toLowerCase()) &&
        !item?.add_ons?.some(sa => sa.id === a.id)
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!item) return;
        setIsSaving(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append('name', item.name);
            formData.append('description', item.description || '');
            formData.append('category_id', String(item.category_id));
            formData.append('is_active', item.is_active ? '1' : '0');
            formData.append('is_featured', item.is_featured ? '1' : '0');

            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Variants
            item.variants.forEach((variant, index) => {
                formData.append(`variants[${index}][name]`, variant.name);
                formData.append(`variants[${index}][price]`, String(variant.price));
                formData.append(`variants[${index}][is_active]`, variant.is_active ? '1' : '0');
            });

            // Add-ons (if backend supports syncing add-ons via this endpoint, otherwise might need separate calls)
            // Assuming backend doesn't handle add-ons in create/update menu item yet based on controller code.
            // But if it did:
            // item.add_ons?.forEach((addon, index) => {
            //     formData.append(`add_ons[${index}]`, String(addon.id));
            // });

            if (isNew) {
                await api.createMenuItem(formData);
                toast.success('Menu item created successfully');
            } else {
                await api.updateMenuItem(item.id, formData);
                toast.success('Menu item updated successfully');
            }
            router.push('/dashboard/menu');
        } catch (error: any) {
            console.error('Error saving item:', error);
            if (error.response?.data) {
                const backendErrors: LaravelErrorResponse = error.response.data;
                setErrors(api.normalizeErrors(backendErrors));
                toast.error('Please fix the validation errors');
            } else {
                toast.error('Failed to save menu item');
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (!item) return <div>Loading...</div>;

    const breadcrumbs = [
        { name: 'Menu Management', path: '/dashboard/menu' },
        { name: isNew ? 'New Item' : 'Edit Item', path: `/dashboard/menu/${isNew ? 'new' : `edit/${id}`}` },
    ];

    return (
        <div>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="flex justify-between items-center my-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{isNew ? 'Create Menu Item' : 'Edit Menu Item'}</h1>
                <div>
                    <button onClick={() => router.push('/dashboard/menu')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 mr-2">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Item'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                            <input type="text" name="name" value={item.name} onChange={handleInputChange} className={`mt-1 block w-full border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.name ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'}`} />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea name="description" value={item.description || ''} onChange={handleInputChange} rows={4} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Variants</h3>
                        <div className="space-y-4">
                            {item.variants.map((variant, index) => (
                                <div key={variant.id} className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-6">
                                        <label className="block text-xs text-gray-500">Variant Name</label>
                                        <input type="text" value={variant.name} onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)} placeholder="e.g., Small, Large" className={`mt-1 block w-full border rounded-md p-2 shadow-sm dark:bg-gray-700 dark:text-white ${errors[`variants.${index}.name`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                                        {errors[`variants.${index}.name`] && <p className="mt-1 text-xs text-red-500">{errors[`variants.${index}.name`]}</p>}
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-xs text-gray-500">Price</label>
                                        <input type="number" value={variant.price} onChange={(e) => handleVariantChange(variant.id, 'price', parseFloat(e.target.value) || 0)} className={`mt-1 block w-full border rounded-md p-2 shadow-sm dark:bg-gray-700 dark:text-white ${errors[`variants.${index}.price`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                                        {errors[`variants.${index}.price`] && <p className="mt-1 text-xs text-red-500">{errors[`variants.${index}.price`]}</p>}
                                    </div>
                                    <div className="col-span-2 pt-5">
                                        {item.variants.length > 1 && (
                                            <button onClick={() => removeVariant(variant.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addVariant} className="mt-4 text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-700">
                            <Plus size={16} /> Add Variant
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Add-ons</h3>
                        <div ref={addOnRef}>
                            <div className="flex flex-wrap gap-2 items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md min-h-[44px]">
                                {item.add_ons?.map(addOn => (
                                    <div key={addOn.id} className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-200 text-sm font-semibold flex items-center gap-2 pl-3 pr-1 py-1 rounded-full">
                                        {addOn.name}
                                        <button onClick={() => handleAddOnRemove(addOn.id)} className="p-1 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        value={addOnSearch}
                                        onChange={e => setAddOnSearch(e.target.value)}
                                        onFocus={() => setIsAddOnDropdownOpen(true)}
                                        placeholder={item.add_ons?.length ? "" : "Search for add-ons..."}
                                        className="bg-transparent focus:outline-none w-full p-1 text-sm dark:text-white"
                                    />
                                </div>
                            </div>
                            {isAddOnDropdownOpen && (
                                <div className="relative">
                                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredAddOns.length > 0 ? filteredAddOns.map(addOn => (
                                            <li key={addOn.id} onMouseDown={() => handleAddOnSelect(addOn)} className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200 flex justify-between">
                                                <span>{addOn.name}</span>
                                                <span className="text-gray-500 dark:text-gray-400">(+${addOn.price.toFixed(2)})</span>
                                            </li>
                                        )) : (
                                            <li className="p-3 text-sm text-gray-500 dark:text-gray-400">No add-ons found.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Image</h3>
                        <div className="aspect-square rounded-md border-2 border-dashed dark:border-gray-600 flex items-center justify-center relative group overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <button onClick={() => fileInputRef.current?.click()} className="text-white font-semibold">Change</button>
                                    </div>
                                </>
                            ) : (
                                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                    <UploadCloud size={48} />
                                    <span className="mt-2 text-sm font-semibold">Upload Image</span>
                                </button>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Organization</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select name="category_id" value={item.category_id} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Available</span>
                                <input type="checkbox" name="is_active" checked={item.is_active} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Featured</span>
                                <input type="checkbox" name="is_featured" checked={item.is_featured} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMenuItemManagement;
