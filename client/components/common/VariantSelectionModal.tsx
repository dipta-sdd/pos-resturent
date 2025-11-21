import React from 'react';
import { MenuItem, ItemVariant } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { X } from 'lucide-react';

interface VariantSelectionModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (variant: ItemVariant) => void;
}

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({ item, onClose, onAddToCart }) => {
  const { settings } = useSettings();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm relative transform transition-all"
           role="dialog"
           aria-modal="true"
           aria-labelledby="variant-modal-title"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close variant selection"
        >
          <X size={24} />
        </button>
        <div className="text-center">
            <h2 id="variant-modal-title" className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Select an Option for</h2>
            <h3 className="text-lg font-semibold text-orange-500 mb-6">{item.name}</h3>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 -mr-2">
          {item.variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => onAddToCart(variant)}
              className="w-full text-left flex justify-between items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">{variant.name}</span>
              <span className="font-bold text-gray-900 dark:text-white">{settings.currencySymbol}{variant.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VariantSelectionModal;
