
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, Category, OrderItem, ItemVariant, PaymentMethod } from '../../types';
import { api } from '../../services/api';
import { Trash2, CreditCard, DollarSign, ChevronLeft, Layers, Plus, Minus, Utensils, ShoppingBag, Receipt, Wallet, Globe, Landmark, X, Loader, MonitorSmartphone } from 'lucide-react';
import VariantSelectionModal from '../../components/common/VariantSelectionModal';

interface LocalPayment {
    methodId: number;
    name: string;
    amount: number;
    type: string;
}

interface ActiveTab {
    internalId: string;
    orderId?: number | 'new'; // 'new' or existing ID
    label: string;
    items: OrderItem[];
    orderType: 'dine-in' | 'takeaway';
    discount: number;
    tip: number;
    payments: LocalPayment[];
    tenderAmount: string;
    activeCategory: number | null;
}

const getPaymentTypeIcon = (type: string) => {
    switch (type) {
        case 'cash': return <DollarSign size={20} />;
        case 'card': return <CreditCard size={20} />;
        case 'online': return <Globe size={20} />;
        case 'bank': return <Landmark size={20} />;
        default: return <Wallet size={20} />;
    }
};

const POSOrderManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Reference Data (Shared)
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs State
  const [tabs, setTabs] = useState<ActiveTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // UI State
  const [variantModalItem, setVariantModalItem] = useState<MenuItem | null>(null);
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileTab, setMobileTab] = useState<'menu' | 'order'>('menu');

  // Helper to generate unique IDs for tabs
  const generateTabId = () => `tab-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Initialize Data and First Tab
  useEffect(() => {
    const initialize = async () => {
        try {
            const [menuItems, cats, methods] = await Promise.all([
                api.getMenuItems(),
                api.getCategories(),
                api.getAllPaymentMethods()
            ]);
            
            setMenu(menuItems);
            setCategories(cats);
            setPaymentMethods(methods.filter(m => m.is_active));

            // Initial Tab Setup
            const initialTabId = generateTabId();
            let initialTab: ActiveTab = {
                internalId: initialTabId,
                label: 'New Order',
                items: [],
                orderType: 'dine-in',
                discount: 0,
                tip: 0,
                payments: [],
                tenderAmount: '',
                activeCategory: cats.length > 0 ? cats[0].id : null,
                orderId: 'new'
            };

            if (id && id !== 'new-dinein' && id !== 'new-takeaway') {
                const existingOrder = await api.getOrderById(id);
                if (existingOrder) {
                    initialTab = {
                        ...initialTab,
                        orderId: existingOrder.id,
                        label: `Order #${existingOrder.id}`,
                        items: existingOrder.items || [],
                        orderType: existingOrder.order_type === 'delivery' ? 'takeaway' : existingOrder.order_type as any,
                        discount: existingOrder.discount_amount || 0,
                    };
                }
            } else if (id === 'new-takeaway') {
                initialTab.orderType = 'takeaway';
            }

            setTabs([initialTab]);
            setActiveTabId(initialTabId);
            setLoading(false);

        } catch (error: any) {
            console.error("Failed to initialize POS", error);
            setLoading(false);
        }
    };

    initialize();
  }, [id]);

  // Derived State for Active Tab
  const activeTab = tabs.find(t => t.internalId === activeTabId) || tabs[0];
  
  // Safe guard if tabs array becomes empty (shouldn't happen with logic below)
  if (!activeTab && !loading) {
      // Fallback create new tab
      const newId = generateTabId();
      const newTab: ActiveTab = {
          internalId: newId,
          label: 'New Order',
          items: [],
          orderType: 'dine-in',
          discount: 0,
          tip: 0,
          payments: [],
          tenderAmount: '',
          activeCategory: categories.length > 0 ? categories[0].id : null,
          orderId: 'new'
      };
      setTabs([newTab]);
      setActiveTabId(newId);
  }

  // ----------------------------------------------------------------------
  // Tab Management
  // ----------------------------------------------------------------------

  const updateActiveTab = (updates: Partial<ActiveTab>) => {
      setTabs(prev => prev.map(tab => 
          tab.internalId === activeTabId ? { ...tab, ...updates } : tab
      ));
  };

  const createNewTab = () => {
      const newId = generateTabId();
      const count = tabs.length + 1;
      const newTab: ActiveTab = {
          internalId: newId,
          label: `New Order ${count}`,
          items: [],
          orderType: 'dine-in',
          discount: 0,
          tip: 0,
          payments: [],
          tenderAmount: '',
          activeCategory: categories.length > 0 ? categories[0].id : null,
          orderId: 'new'
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newId);
      setMobileTab('menu');
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
      e.stopPropagation();
      if (tabs.length === 1) {
          // If closing the last tab, just reset it instead of removing
          const newId = generateTabId();
          const resetTab: ActiveTab = {
              internalId: newId,
              label: 'New Order',
              items: [],
              orderType: 'dine-in',
              discount: 0,
              tip: 0,
              payments: [],
              tenderAmount: '',
              activeCategory: categories.length > 0 ? categories[0].id : null,
              orderId: 'new'
          };
          setTabs([resetTab]);
          setActiveTabId(newId);
          return;
      }

      const tabIndex = tabs.findIndex(t => t.internalId === tabId);
      const newTabs = tabs.filter(t => t.internalId !== tabId);
      setTabs(newTabs);

      if (activeTabId === tabId) {
          // Switch to the nearest neighbor
          const newActiveIndex = Math.max(0, tabIndex - 1);
          setActiveTabId(newTabs[newActiveIndex].internalId);
      }
  };

  // ----------------------------------------------------------------------
  // Order Logic (Operates on Active Tab)
  // ----------------------------------------------------------------------

  const addItemToOrderWithVariant = (item: MenuItem, variant: ItemVariant) => {
    const currentItems = activeTab.items;
    const existing = currentItems.find(i => i.item_variant_id === variant.id);
    
    let newItems;
    if (existing) {
        newItems = currentItems.map(i => i.item_variant_id === variant.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
        const newOrderItem: OrderItem = {
            id: Date.now(),
            order_id: 0,
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
        newItems = [...currentItems, newOrderItem];
    }
    
    updateActiveTab({ items: newItems });
  };

  const updateItemQuantity = (itemId: number, change: number) => {
    const newItems = activeTab.items.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateActiveTab({ items: newItems });
  };

  const removeItemFromOrder = (itemId: number) => {
      const newItems = activeTab.items.filter(i => i.id !== itemId);
      updateActiveTab({ items: newItems });
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.variants && item.variants.length > 1) {
      setVariantModalItem(item);
    } else if (item.variants && item.variants.length === 1) {
      addItemToOrderWithVariant(item, item.variants[0]);
    } else {
      console.error('Item has no variants:', item.name);
    }
  };

  const handleVariantSelected = (variant: ItemVariant) => {
    if (variantModalItem) {
      addItemToOrderWithVariant(variantModalItem, variant);
    }
    setVariantModalItem(null);
  };

  // ----------------------------------------------------------------------
  // Payment Logic
  // ----------------------------------------------------------------------
  
  const filteredMenu = useMemo(() => {
      return menu.filter(item => activeTab?.activeCategory ? item.category_id === activeTab.activeCategory : true);
  }, [menu, activeTab?.activeCategory]);

  // Organize payment methods by type
  const paymentTypes = useMemo(() => {
      const types = new Set(paymentMethods.map(m => m.type));
      // Sort to ensure consistent order: Cash -> Card -> Others
      const typeOrder = ['cash', 'card', 'online', 'bank', 'others'];
      return Array.from(types).sort((a, b) => {
          // FIX: Cast to string to resolve "Argument of type 'unknown' is not assignable to parameter of type 'string'"
          return typeOrder.indexOf(a as string) - typeOrder.indexOf(b as string);
      });
  }, [paymentMethods]);

  // Calculations
  const subtotal = activeTab ? activeTab.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) : 0;
  const taxRate = 0.08;
  const appliedDiscount = activeTab ? Math.min(activeTab.discount, subtotal) : 0;
  const taxableAmount = subtotal - appliedDiscount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax + (activeTab?.tip || 0);
  const itemCount = activeTab ? activeTab.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const totalPaid = activeTab ? activeTab.payments.reduce((sum, p) => sum + p.amount, 0) : 0;
  const remaining = Math.max(0, total - totalPaid);
  const change = totalPaid > total ? totalPaid - total : 0;

  const handleAddPayment = (method: PaymentMethod) => {
    if (!activeTab) return;
    const amountToPay = activeTab.tenderAmount ? parseFloat(activeTab.tenderAmount) : remaining;
    const finalAmount = amountToPay || remaining;
    
    if (finalAmount <= 0 && remaining > 0) return;

    const newPayments = [...activeTab.payments, { methodId: method.id, name: method.name, amount: finalAmount, type: method.type }];
    updateActiveTab({ payments: newPayments, tenderAmount: '' });
  };

  const handlePaymentTypeClick = (type: string) => {
      const methodsOfType = paymentMethods.filter(m => m.type === type);
      if (methodsOfType.length === 1) {
          // If only one option, select it immediately
          handleAddPayment(methodsOfType[0]);
      } else if (methodsOfType.length > 1) {
          // If multiple options, open modal
          setSelectedPaymentCategory(type);
      }
  };

  const handleRemovePayment = (index: number) => {
      if (!activeTab) return;
      const newPayments = [...activeTab.payments];
      newPayments.splice(index, 1);
      updateActiveTab({ payments: newPayments });
  };

  const handleFinalizeOrder = async () => {
      if (isProcessing || !activeTab) return;
      setIsProcessing(true);

      const newOrderData = {
          user_id: 4, // Mock Customer ID
          status: 'confirmed',
          order_type: activeTab.orderType,
          subtotal: subtotal,
          tax_amount: tax,
          discount_amount: appliedDiscount,
          delivery_charge: 0,
          total_amount: total,
          special_instructions: null,
          delivery_address_id: null,
          table_id: null,
          rider_id: null,
          staff_id: 2,
          items: activeTab.items,
          payments: activeTab.payments.map((p, idx) => ({
              id: Date.now() + idx,
              payment_method_id: p.methodId,
              amount: p.amount,
              status: 'paid',
              payment_date: new Date()
          }))
      };

      try {
          await api.placeOrder(newOrderData);
          // Close current tab after success
          if (activeTabId) {
               const currentId = activeTabId;
               const newTabs = tabs.filter(t => t.internalId !== currentId);
               
               if (newTabs.length === 0) {
                   const newId = generateTabId();
                   const freshTab: ActiveTab = {
                       internalId: newId,
                       label: 'New Order',
                       items: [],
                       orderType: 'dine-in',
                       discount: 0,
                       tip: 0,
                       payments: [],
                       tenderAmount: '',
                       activeCategory: categories.length > 0 ? categories[0].id : null,
                       orderId: 'new'
                   };
                   setTabs([freshTab]);
                   setActiveTabId(newId);
               } else {
                   setTabs(newTabs);
                   setActiveTabId(newTabs[0].internalId);
               }
          }
      } catch (error: any) {
          console.error("Error finalizing order:", error);
          alert('Failed to finalize order. Please try again.');
      } finally {
          setIsProcessing(false);
      }
  };


  if (loading || !activeTab) return <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-500">Loading POS...</div>;

  return (
    <>
      {variantModalItem && (
        <VariantSelectionModal 
          item={variantModalItem}
          onClose={() => setVariantModalItem(null)}
          onAddToCart={handleVariantSelected}
        />
      )}

      {/* Specific Payment Method Selection Modal */}
      {selectedPaymentCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                  <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                      <h3 className="font-bold text-lg dark:text-white flex items-center gap-2 capitalize">
                          {getPaymentTypeIcon(selectedPaymentCategory)} Select {selectedPaymentCategory}
                      </h3>
                      <button onClick={() => setSelectedPaymentCategory(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full dark:text-gray-300">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-4 grid gap-3">
                      {paymentMethods.filter(m => m.type === selectedPaymentCategory).map(method => (
                          <button 
                              key={method.id}
                              onClick={() => {
                                  handleAddPayment(method);
                                  setSelectedPaymentCategory(null);
                              }}
                              className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-gray-700 dark:hover:border-gray-600 transition-all group"
                          >
                              <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400">{method.name}</span>
                              <span className="text-gray-400 group-hover:text-orange-500"><Plus size={18}/></span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}
      
      <div className="flex flex-col h-[calc(100vh-64px)] -m-6 bg-gray-100 dark:bg-gray-900 overflow-hidden">
          
          {/* Tab Bar */}
          <div className="flex items-center bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-2 pt-2 gap-1 overflow-x-auto flex-shrink-0 scrollbar-hide">
              {tabs.map(tab => (
                  <div 
                    key={tab.internalId}
                    onClick={() => { setActiveTabId(tab.internalId); setMobileTab('menu'); }}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-t-lg cursor-pointer min-w-[140px] max-w-[200px] transition-colors select-none ${
                        activeTabId === tab.internalId 
                        ? 'bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 font-bold shadow-sm' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                      <span className="truncate flex-grow text-sm">{tab.label}</span>
                      <button 
                        onClick={(e) => closeTab(e, tab.internalId)}
                        className={`p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 ${activeTabId === tab.internalId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                          <X size={14} />
                      </button>
                  </div>
              ))}
              <button 
                onClick={createNewTab}
                className="p-2 ml-1 mb-1 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-green-500 hover:text-white text-gray-600 dark:text-gray-300 transition-colors"
                title="New Order Tab"
              >
                  <Plus size={20} />
              </button>
          </div>

          <div className="flex flex-grow overflow-hidden relative">
              {/* Left: Menu Column */}
              <div className={`w-full lg:w-3/5 flex flex-col h-full transition-transform duration-300 absolute lg:relative z-10 lg:z-0 bg-gray-50 dark:bg-gray-900 ${mobileTab === 'menu' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                  {/* Categories Header */}
                  <div className="p-4 bg-white dark:bg-gray-800 shadow-sm z-10 flex-shrink-0">
                      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
                          {categories.map(cat => (
                              <button 
                                key={cat.id} 
                                onClick={() => updateActiveTab({ activeCategory: cat.id })} 
                                className={`py-2 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${activeTab.activeCategory === cat.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-orange-300'}`}
                              >
                                  {cat.name}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Menu Items Grid */}
                  <div className="flex-grow overflow-y-auto p-4 pb-28 lg:pb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {filteredMenu.map(item => (
                              <div key={item.id} onClick={() => handleItemClick(item)} className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-orange-200 dark:hover:border-orange-900 group h-full flex flex-col">
                                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                  </div>
                                  <h3 className="font-semibold text-sm dark:text-white leading-tight mb-1">{item.name}</h3>
                                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-auto">
                                    ${item.variants?.[0]?.price.toFixed(2)}
                                  </p>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Mobile Floating 'View Order' Button */}
                  <div className="lg:hidden absolute bottom-6 left-0 right-0 px-6 z-20">
                      <button 
                        onClick={() => setMobileTab('order')} 
                        className="w-full bg-gray-900 dark:bg-orange-600 text-white p-4 rounded-xl shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
                      >
                          <div className="flex items-center gap-3">
                              <div className="bg-white/20 px-3 py-1 rounded-lg font-bold text-sm">{itemCount}</div>
                              <span className="font-semibold">View Order</span>
                          </div>
                          <span className="font-bold text-lg">${total.toFixed(2)}</span>
                      </button>
                  </div>
              </div>
              
              {/* Right: Order Ticket Column */}
              <div className={`w-full lg:w-2/5 flex flex-col h-full absolute lg:relative z-20 lg:z-0 bg-white dark:bg-gray-800 shadow-2xl lg:shadow-none border-l dark:border-gray-700 transition-transform duration-300 ${mobileTab === 'order' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                  {/* Ticket Header */}
                  <div className="p-4 border-b dark:border-gray-700 flex flex-col gap-3 flex-shrink-0 bg-white dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setMobileTab('menu')} 
                                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold dark:text-white">{activeTab.label}</h2>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{activeTab.orderId === 'new' ? 'New Ticket' : `ID: ${activeTab.orderId}`}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             {activeTab.items.length > 0 && <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded">{activeTab.items.length} Items</span>}
                          </div>
                      </div>
                      
                      {/* Order Type Toggle */}
                      <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        <button 
                            onClick={() => updateActiveTab({ orderType: 'dine-in' })}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${activeTab.orderType === 'dine-in' ? 'bg-white dark:bg-gray-600 text-orange-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                        >
                            <Utensils size={16} /> Dine-In
                        </button>
                        <button 
                            onClick={() => updateActiveTab({ orderType: 'takeaway' })}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${activeTab.orderType === 'takeaway' ? 'bg-white dark:bg-gray-600 text-orange-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                        >
                            <ShoppingBag size={16} /> Takeout
                        </button>
                      </div>
                  </div>

                  {/* Order Items List */}
                  <div className="flex-grow overflow-y-auto p-4">
                      {activeTab.items.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                              <Layers size={48} className="mb-4 opacity-50" />
                              <p className="text-lg">Empty Ticket</p>
                              <p className="text-sm">Add items from the menu</p>
                              <button onClick={() => setMobileTab('menu')} className="lg:hidden mt-4 text-orange-500 font-semibold">Go to Menu</button>
                          </div>
                      ) : (
                          <div className="space-y-3">
                            {activeTab.items.map(item => (
                                <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                                    <img 
                                        src={item.menu_item?.image_url || 'https://via.placeholder.com/64'} 
                                        alt={item.menu_item?.name} 
                                        className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-gray-200 dark:bg-gray-600" 
                                    />
                                    <div className="flex-grow flex flex-col justify-between min-w-0">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold dark:text-white text-sm leading-tight line-clamp-1">{item.menu_item?.name}</p>
                                                <p className="font-bold dark:text-white text-sm whitespace-nowrap ml-2">${(item.quantity * item.unit_price).toFixed(2)}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                                                {item.variant?.name} (${item.unit_price.toFixed(2)})
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center bg-white dark:bg-gray-600 rounded border dark:border-gray-500 h-7">
                                                <button 
                                                    onClick={() => updateItemQuantity(item.id, -1)}
                                                    className="px-2 h-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-l transition-colors flex items-center"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="px-2 text-sm font-semibold text-gray-900 dark:text-white min-w-[1.5rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => updateItemQuantity(item.id, 1)}
                                                    className="px-2 h-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-r transition-colors flex items-center"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => removeItemFromOrder(item.id)} 
                                                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                          </div>
                      )}
                  </div>

                  {/* Footer Summary & Actions */}
                  <div className="border-t p-4 bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm flex-shrink-0 dark:border-gray-700">
                      <div className="space-y-2 text-gray-700 dark:text-gray-300 mb-4 text-sm">
                          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                          
                          <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Discount</span>
                              <div className="flex items-center w-24 relative">
                                   <span className="absolute left-2 text-gray-400 pointer-events-none">$</span>
                                   <input 
                                      type="number" 
                                      min="0"
                                      step="0.01"
                                      value={activeTab.discount || ''} 
                                      onChange={(e) => updateActiveTab({ discount: Math.max(0, parseFloat(e.target.value) || 0) })}
                                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm py-1 pl-5 pr-2 text-red-500"
                                      placeholder="0.00"
                                   />
                              </div>
                          </div>

                          <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Tip</span>
                              <div className="flex items-center w-24 relative">
                                   <span className="absolute left-2 text-gray-400 pointer-events-none">$</span>
                                   <input 
                                      type="number" 
                                      min="0"
                                      step="0.01"
                                      value={activeTab.tip || ''} 
                                      onChange={(e) => updateActiveTab({ tip: Math.max(0, parseFloat(e.target.value) || 0) })}
                                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm py-1 pl-5 pr-2"
                                      placeholder="0.00"
                                   />
                              </div>
                          </div>

                          <div className="flex justify-between"><span>Tax ({ (taxRate * 100).toFixed(0) }%)</span><span>${tax.toFixed(2)}</span></div>
                          
                          <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t pt-2 mt-2 border-gray-200 dark:border-gray-600">
                              <span>Total</span>
                              <span>${total.toFixed(2)}</span>
                          </div>
                          
                          {/* Payment Breakdown */}
                          {activeTab.payments.length > 0 && (
                              <div className="pt-2 mt-2 border-t border-dashed border-gray-300 dark:border-gray-600">
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Payments Applied:</p>
                                  <ul className="space-y-1">
                                      {activeTab.payments.map((p, i) => (
                                          <li key={i} className="flex justify-between text-xs items-center">
                                              <span className="flex items-center gap-1">
                                                  {getPaymentTypeIcon(p.type)} {p.name}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                  <span>${p.amount.toFixed(2)}</span>
                                                  <button onClick={() => handleRemovePayment(i)} className="text-red-500 hover:text-red-700"><X size={12}/></button>
                                              </div>
                                          </li>
                                      ))}
                                  </ul>
                                  <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                      <span>Total Paid</span>
                                      <span className="text-green-600 dark:text-green-400">${totalPaid.toFixed(2)}</span>
                                  </div>
                                   <div className="flex justify-between text-sm font-bold">
                                      <span>{remaining > 0 ? 'Remaining Due' : 'Change'}</span>
                                      <span className={remaining > 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}>
                                          ${remaining > 0 ? remaining.toFixed(2) : change.toFixed(2)}
                                      </span>
                                  </div>
                              </div>
                          )}
                      </div>
                       
                      {remaining > 0 && (
                          <>
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Tender Amount (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input 
                                        type="number" 
                                        value={activeTab.tenderAmount} 
                                        onChange={(e) => updateActiveTab({ tenderAmount: e.target.value })} 
                                        placeholder={remaining.toFixed(2)}
                                        className="w-full pl-7 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500"
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter') {
                                                // If enter is pressed, default to the first type if available
                                                if (paymentTypes.length > 0) handlePaymentTypeClick(paymentTypes[0]);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                                {paymentTypes.map((type) => (
                                    <button 
                                        key={type}
                                        onClick={() => handlePaymentTypeClick(type)}
                                        className="py-2 px-2 rounded-lg flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-1 transition-all text-xs border bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-gray-600 hover:border-orange-200 active:bg-orange-100"
                                    >
                                        {getPaymentTypeIcon(type)}
                                        <span className="capitalize font-medium">{type}</span>
                                    </button>
                                ))}
                            </div>
                          </>
                      )}

                      {remaining <= 0 && activeTab.items.length > 0 ? (
                          <button 
                            onClick={handleFinalizeOrder}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                              {isProcessing ? <Loader className="animate-spin" size={20} /> : <Receipt size={20} />}
                              {isProcessing ? 'Finalizing...' : 'Finalize Order'}
                          </button>
                      ) : (
                          <button 
                            disabled
                            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-4 rounded-xl shadow-none cursor-not-allowed flex items-center justify-center gap-2"
                          >
                              <Receipt size={20} /> {remaining > 0 ? 'Pay Remaining to Finish' : 'Add Items to Order'}
                          </button>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </>
  );
};

export default POSOrderManagement;
