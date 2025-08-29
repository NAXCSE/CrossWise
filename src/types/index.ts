export interface Product {
  id: string;
  product_name: string;
  hs_code: string;
  duty_rate: string;
  base_price: number;
  destination_country: string;
  incentive_info: string;
  total_price?: number;
  created_at: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Order {
  id: string;
  product: Product;
  quantity: number;
  shipping_terms: 'DDP' | 'DAP';
  shipping_address: string;
  subtotal: number;
  duty_amount: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed';
  created_at: Date;
}

export interface Document {
  id: string;
  type: 'commercial_invoice' | 'packing_list' | 'shipping_bill' | 'letter_of_undertaking' | 'certificate_of_origin';
  product_id: string;
  generated_at: Date;
  content: Record<string, any>;
}

export interface ExporterDetails {
  iec: string;
  ad_code: string;
  gst_lut: string;
  company_name: string;
  company_address: string;
  pan: string;
}