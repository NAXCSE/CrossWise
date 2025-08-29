import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { queryGeminiAPI } from '../../services/geminiApi';
import { v4 as uuidv4 } from 'uuid';

const ChatBot = () => {
  const { isChatOpen, toggleChat, addChatMessage, chatMessages, addProduct } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: uuidv4(),
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await queryGeminiAPI(inputValue);
      
      const botMessage = {
        id: uuidv4(),
        type: 'assistant' as const,
        content: `I found the following information for your product:
        
Product: ${aiResponse.product_name}
HS Code: ${aiResponse.hs_code}
Destination: ${aiResponse.destination_country}
Duty Rate: ${aiResponse.duty_rate}
Estimated Price: $${aiResponse.base_price}
Export Incentives: ${aiResponse.incentive_info}

Would you like me to add this product to your catalog?`,
        timestamp: new Date(),
      };

      addChatMessage(botMessage);
      setPendingProduct(aiResponse);
    } catch (error) {
      const errorMessage = {
        id: uuidv4(),
        type: 'assistant' as const,
        content: 'I apologize, but I encountered an error processing your request. Please try again with more specific product and destination country details.',
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAddProduct = () => {
    if (pendingProduct) {
      const product = {
        id: uuidv4(),
        ...pendingProduct,
        total_price: pendingProduct.base_price * (1 + parseFloat(pendingProduct.duty_rate.replace('%', '')) / 100),
        created_at: new Date(),
      };
      
      addProduct(product);
      
      const confirmMessage = {
        id: uuidv4(),
        type: 'assistant' as const,
        content: `Great! I've added "${product.product_name}" to your product catalog. You can view it on the Product page.`,
        timestamp: new Date(),
      };
      
      addChatMessage(confirmMessage);
      setPendingProduct(null);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={toggleChat}
          className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-orange-500 text-white p-4 rounded-t-lg">
              <h3 className="font-semibold">HS Code Assistant</h3>
              <p className="text-sm opacity-90">Ask me about product classification and compliance</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-gray-500 text-sm">
                  Hello! I'm your AI assistant for HS code classification and export compliance. 
                  Try asking: "What's the HS code for cotton t-shirts to USA?"
                </div>
              )}
              
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {pendingProduct && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <button
                    onClick={confirmAddProduct}
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors w-full"
                  >
                    Add to Product Catalog
                  </button>
                </div>
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing your query...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about HS codes, duties, or compliance..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;