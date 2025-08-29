import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { v4 as uuidv4 } from 'uuid';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct, chatMessages } = useStore();
  const [formData, setFormData] = useState({
    product_name: '',
    base_price: '',
    destination_country: '',
    hs_code: '',
    duty_rate: '',
    incentive_info: '',
  });

  // Check if there's recent AI data to pre-populate
  React.useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && lastMessage.type === 'assistant') {
      // Try to extract structured data from the last assistant message
      const content = lastMessage.content;
      if (content.includes('Product:') && content.includes('HS Code:')) {
        const productMatch = content.match(/Product: (.+)/);
        const destinationMatch = content.match(/Destination: (.+)/);
        const priceMatch = content.match(/Estimated Price: \$(.+)/);
        const incentiveMatch = content.match(/Export Incentives: (.+)/);

        if (productMatch) {
          setFormData(prev => ({
            ...prev,
            product_name: productMatch[1] || '',
            destination_country: destinationMatch?.[1] || '',
            base_price: priceMatch?.[1] || '',
            incentive_info: incentiveMatch?.[1] || '',
          }));
        }
      }
    }
  }, [chatMessages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = {
      id: uuidv4(),
      product_name: formData.product_name,
      hs_code: formData.hs_code,
      duty_rate: formData.duty_rate,
      base_price: parseFloat(formData.base_price),
      destination_country: formData.destination_country,
      incentive_info: formData.incentive_info,
      total_price: parseFloat(formData.base_price) * (1 + parseFloat(formData.duty_rate.replace('%', '')) / 100),
      created_at: new Date(),
    };

    addProduct(product);
    onClose();
    
    // Reset form
    setFormData({
      product_name: '',
      base_price: '',
      destination_country: '',
      hs_code: '',
      duty_rate: '',
      incentive_info: '',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg p-6 text-left shadow-xl max-w-lg w-full mx-4 z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.product_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination Country
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination_country}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination_country: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter destination country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HS Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hs_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, hs_code: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter HS code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duty Rate
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duty_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, duty_rate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter duty rate (e.g., 10%)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.base_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter price in USD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incentive Information
                  </label>
                  <textarea
                    value={formData.incentive_info}
                    onChange={(e) => setFormData(prev => ({ ...prev, incentive_info: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Enter applicable export incentives"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal;