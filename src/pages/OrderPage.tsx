import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Package, MapPin, Calculator, FileText, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const OrderPage = () => {
  const { products, addOrder } = useStore();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shippingTerms, setShippingTerms] = useState<'DDP' | 'DAP'>('DDP');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const calculateOrderTotal = () => {
    if (!selectedProduct) return { subtotal: 0, duty: 0, total: 0 };
    
    const subtotal = selectedProduct.base_price * quantity;
    const dutyRate = parseFloat(selectedProduct.duty_rate.replace('%', '')) / 100;
    const duty = shippingTerms === 'DDP' ? subtotal * dutyRate : 0;
    const total = subtotal + duty;
    
    return { subtotal, duty, total };
  };

  const { subtotal, duty, total } = calculateOrderTotal();

  const handleCreateOrder = async () => {
    if (!selectedProduct || !shippingAddress.trim()) return;

    setIsCreating(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const order = {
      id: uuidv4(),
      product: selectedProduct,
      quantity,
      shipping_terms: shippingTerms,
      shipping_address: shippingAddress,
      subtotal,
      duty_amount: duty,
      total_amount: total,
      status: 'pending' as const,
      created_at: new Date(),
    };

    addOrder(order);
    setIsCreating(false);
    
    // Reset form
    setSelectedProductId('');
    setQuantity(1);
    setShippingAddress('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Order</h1>
          <p className="text-gray-600">Generate orders with accurate duty calculations and compliance data</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Choose a product...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.product_name} - {product.destination_country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-gray-50 rounded-lg"
                >
                  <h3 className="font-medium text-gray-900 mb-3">Product Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">HS Code:</span>
                      <div className="font-medium">{selectedProduct.hs_code}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duty Rate:</span>
                      <div className="font-medium">{selectedProduct.duty_rate}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Unit Price:</span>
                      <div className="font-medium">${selectedProduct.base_price.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Destination:</span>
                      <div className="font-medium">{selectedProduct.destination_country}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Shipping Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Terms</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <div className={`border-2 rounded-lg p-4 transition-colors ${
                        shippingTerms === 'DDP' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                      }`}>
                        <input
                          type="radio"
                          name="shipping_terms"
                          value="DDP"
                          checked={shippingTerms === 'DDP'}
                          onChange={(e) => setShippingTerms(e.target.value as 'DDP')}
                          className="sr-only"
                        />
                        <div className="font-medium text-gray-900">DDP</div>
                        <div className="text-sm text-gray-600">Delivered Duty Paid</div>
                      </div>
                    </label>
                    
                    <label className="cursor-pointer">
                      <div className={`border-2 rounded-lg p-4 transition-colors ${
                        shippingTerms === 'DAP' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                      }`}>
                        <input
                          type="radio"
                          name="shipping_terms"
                          value="DAP"
                          checked={shippingTerms === 'DAP'}
                          onChange={(e) => setShippingTerms(e.target.value as 'DAP')}
                          className="sr-only"
                        />
                        <div className="font-medium text-gray-900">DAP</div>
                        <div className="text-sm text-gray-600">Delivered at Place</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter complete shipping address"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {selectedProduct ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({quantity} × ${selectedProduct.base_price.toFixed(2)})</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duty ({selectedProduct.duty_rate})</span>
                    <span className="font-medium">${duty.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-orange-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>{selectedProduct.product_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedProduct.destination_country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-4 h-4" />
                      <span>HS Code: {selectedProduct.hs_code}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select a product to see order summary</p>
              )}
            </motion.div>

            {/* Create Order Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <button
                onClick={handleCreateOrder}
                disabled={!selectedProduct || !shippingAddress.trim() || isCreating}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Order...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Order</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link
                to="/product"
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Add More Products</span>
              </Link>
              
              <Link
                to="/documents"
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Documents</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;