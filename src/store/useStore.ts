import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ChatMessage, Order, Document, ExporterDetails } from '../types';

interface AppState {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  // Documents
  documents: Document[];
  addDocument: (document: Document) => void;
  
  // Exporter Details
  exporterDetails: ExporterDetails | null;
  updateExporterDetails: (details: ExporterDetails) => void;
  
  // UI State
  isChatOpen: boolean;
  toggleChat: () => void;
  
  // Analytics
  getAnalytics: () => {
    totalProducts: number;
    countriesServed: number;
    avgDutyRate: number;
    complianceScore: number;
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Products
      products: [],
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      
      // Chat
      chatMessages: [],
      addChatMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      clearChat: () => set({ chatMessages: [] }),
      
      // Orders
      orders: [],
      addOrder: (order) =>
        set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        })),
      
      // Documents
      documents: [],
      addDocument: (document) =>
        set((state) => ({ documents: [...state.documents, document] })),
      
      // Exporter Details
      exporterDetails: null,
      updateExporterDetails: (details) => set({ exporterDetails: details }),
      
      // UI State
      isChatOpen: false,
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      
      // Analytics
      getAnalytics: () => {
        const state = get();
        const products = state.products;
        const totalProducts = products.length;
        const countriesServed = new Set(products.map(p => p.destination_country)).size;
        const avgDutyRate = products.length > 0 
          ? products.reduce((acc, p) => acc + parseFloat(p.duty_rate.replace('%', '')), 0) / products.length
          : 0;
        const complianceScore = state.documents.length > 0 
          ? Math.min(100, (state.documents.length / Math.max(products.length, 1)) * 100)
          : 0;
        
        return {
          totalProducts,
          countriesServed,
          avgDutyRate,
          complianceScore,
        };
      },
    }),
    {
      name: 'crosswise-store',
      partialize: (state) => ({
        products: state.products,
        orders: state.orders,
        documents: state.documents,
        exporterDetails: state.exporterDetails,
      }),
    }
  )
);