export type BusinessStage = 'idea' | 'selling' | 'growing';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  tagline?: string;
  category: string;
  description?: string;
  stage: BusinessStage;
  target_audience?: string;
  biggest_challenge?: string;
  currency: string;
  currency_symbol: string;
  is_demo?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description: string;
  category: string;
  selling_price: number;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  units_sold: number;
  image_url?: string;
  sku?: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  total_orders: number;
  total_spent: number;
  last_purchase_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  subtotal: number;
  profit: number;
  created_at: string;
}

export interface Order {
  id: string;
  business_id: string;
  customer_id?: string;
  customer_name?: string;
  order_number: string;
  status: 'completed' | 'pending' | 'cancelled';
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  total_cost: number;
  total_profit: number;
  payment_method: 'Card' | 'Cash' | 'Bank Transfer' | 'UPI' | 'Stripe';
  notes?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface Expense {
  id: string;
  business_id: string;
  title: string;
  category: 'Materials' | 'Packaging' | 'Marketing' | 'Software' | 'Rent' | 'Utilities' | 'Other';
  amount: number;
  expense_date: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
}

export interface MarketingContent {
  id: string;
  business_id: string;
  type: 'instagram_caption' | 'product_description' | 'campaign_pitch' | 'whatsapp_copy' | 'launch_announcement';
  title: string;
  prompt: string;
  content: string;
  target_channel?: string;
  is_saved: boolean;
  created_at: string;
}

export interface AICoachMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  business_context?: Record<string, any>;
  created_at: string;
}

export interface AICoachConversation {
  id: string;
  business_id: string;
  title: string;
  created_at: string;
  messages?: AICoachMessage[];
}

export interface BusinessFinancials {
  total_revenue: number;
  total_cost_of_goods: number;
  total_expenses: number;
  gross_profit: number;
  net_profit: number;
  profit_margin_percentage: number;
  total_orders: number;
  total_customers: number;
  average_order_value: number;
}

export interface AIInsightItem {
  id: string;
  type: 'success' | 'warning' | 'opportunity' | 'action';
  title: string;
  description: string;
  metric?: string;
  action_label?: string;
  action_route?: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  duration: string;
  category: 'Beginner' | 'Pricing' | 'Marketing' | 'Operations' | 'Finance';
  content: {
    summary: string;
    keyPoints: string[];
    actionStep: string;
    proTip: string;
    example: string;
  };
}
