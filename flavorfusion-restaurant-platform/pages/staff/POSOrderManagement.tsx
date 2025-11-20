import React, { useState, useEffect } from 'react';
// FIX: Split react-router-dom imports to resolve "no exported member" errors.
import { useParams } from 'react-router-dom';
import { MenuItem, Category, Order, OrderItem, ItemVariant } from '../../types';
import { api } from '../../services/api';
import { mockMenuItems } from '../../data/mockData';
import { PlusCircle, Trash2, CreditCard, DollarSign, X } from 'lucide-react';
import VariantSelectionModal from '../../components/common/VariantSelectionModal';

const POSOrderManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [variantModalItem, setVariantModalItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    api.getMenuItems().then(items => {
        setMenu(items);
        if (items.length > 0) setActiveCategory(items[0].category_id);
    });
    api.getCategories().then(setCategories);
    // If editing an order, fetch its items
    if (id && id !== 'new-dinein' && id !== 'new-takeaway') {
        api.getOrderById(id).then(order => {
            if (order && order.items) setOrderItems(order.items);
        });
    }
  }, [id]);
  
  const addItemToOrderWithVariant = (item: MenuItem, variant: ItemVariant) => {
    setOrderItems(prevItems => {
        const existing = prevItems.find(i => i.item_variant_id === variant.id);
        if (existing) {
            return prevItems.map(i => i.item_variant_id === variant.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        
        const newOrderItem: OrderItem = {
          id: Date.now(), // Temporary ID for client-side operations
          order_id: 0, // Placeholder for a new order
          item_variant_id: variant.id,
          quantity: 1,
          unit_price: variant.price,
          customization_notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          add_ons: [],
          menu_item: item,
          variant: variant
        };
        return [...prevItems, newOrderItem];
    });
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.variants && item.variants.length > 1) {
      setVariantModalItem(item);
    } else if (item.variants && item.variants.length === 1) {
      addItemToOrderWithVariant(item, item.variants[0]);
    } else {
      console.error('Item has no variants and cannot be added:', item.name);
    }
  };

  const handleVariantSelected = (variant: ItemVariant) => {
    if (variantModalItem) {
      addItemToOrderWithVariant(variantModalItem, variant);
    }
    setVariantModalItem(null);
  };
  
  const removeItemFromOrder = (itemId: number) => {
      setOrderItems(prev => prev.filter(i => i.id !== itemId));
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const filteredMenu = menu.filter(item => activeCategory ? item.category_id === activeCategory : true);

  return (
    <>
      {variantModalItem && (
        <VariantSelectionModal 
          item={variantModalItem}
          onClose={() => setVariantModalItem(null)}
          onAddToCart={handleVariantSelected}
        />
      )}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] -m-6">
          {/* Left: Menu */}
          <div className="w-full lg:w-3/5 bg-gray-50 dark:bg-gray-900 p-4 flex flex-col overflow-hidden">
              <div className="mb-4 flex-shrink-0">
                  <h2 className="text-xl font-bold mb-2 dark:text-white">Categories</h2>
                  <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`py-2 px-4 rounded-full text-sm font-semibold ${activeCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800 dark:text-gray-200'}`}>
                              {cat.name}
                          </button>
                      ))}
                  </div>
              </div>
              <div className="flex-grow overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredMenu.map(item => (
                          <div key={item.id} onClick={() => handleItemClick(item)} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center cursor-pointer hover:shadow-lg transition-shadow">
                              <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover rounded-md mb-2" />
                              <h3 className="font-semibold text-sm dark:text-white">{item.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">${item.variants?.[0]?.price.toFixed(2)}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
          
          {/* Right: Order Ticket */}
          <div className="w-full lg:w-2/5 bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg overflow-hidden">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 dark:text-white dark:border-gray-700 flex-shrink-0">Order #{id}</h2>
              <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                  {orderItems.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Add items from the menu</p>
                  ) : orderItems.map(item => (
                      <div key={item.id} className="flex items-center mb-3">
                          <div className="flex-grow">
                              <p className="font-semibold dark:text-white">{item.menu_item?.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.variant?.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{item.quantity} x ${item.unit_price.toFixed(2)}</p>
                          </div>
                          <p className="font-bold w-20 text-right dark:text-white">${(item.quantity * item.unit_price).toFixed(2)}</p>
                          <button onClick={() => removeItemFromOrder(item.id)} className="ml-3 text-red-500 hover:text-red-700">
                              <Trash2 size={18} />
                          </button>
                      </div>
                  ))}
              </div>
              <div className="border-t pt-4 mt-auto dark:border-gray-700 flex-shrink-0">
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <div className="flex justify-between"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
                      <div className="flex justify-between"><p>Tax (8%)</p><p>${tax.toFixed(2)}</p></div>
                      <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2 dark:text-white dark:border-gray-600"><p>Total</p><p>${total.toFixed(2)}</p></div>
                  </div>
                   <div className="mt-4 grid grid-cols-2 gap-3">
                      <button className="bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"><CreditCard size={20}/> Card</button>
                      <button className="bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"><DollarSign size={20}/> Cash</button>
                  </div>
                  <button className="w-full mt-3 bg-orange-500 text-white font-bold py-3 rounded-lg">Send Order to Kitchen</button>
              </div>
          </div>
      </div>
    </>
  );
};

export default POSOrderManagement;
