import { 
  Business, Product, Customer, Order, OrderItem, Expense, MarketingContent, AICoachMessage, BusinessFinancials 
} from '../types';
import { 
  DEMO_BUSINESS, DEMO_PRODUCTS, DEMO_CUSTOMERS, DEMO_ORDERS, DEMO_EXPENSES, DEMO_MARKETING_CONTENT, DEMO_AI_MESSAGES 
} from './seed';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_PREFIX = 'shelaunch_db_v1_';

class DatabaseService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Local storage write failed:', e);
    }
  }

  // Initializing default seed data for Demo
  public init(): void {
    const initialized = localStorage.getItem(`${STORAGE_KEY_PREFIX}initialized`);
    if (!initialized) {
      this.resetDemoData();
      localStorage.setItem(`${STORAGE_KEY_PREFIX}initialized`, 'true');
    }
  }

  public resetDemoData(): void {
    this.setStorage('businesses', [DEMO_BUSINESS]);
    this.setStorage('products', DEMO_PRODUCTS);
    this.setStorage('customers', DEMO_CUSTOMERS);
    this.setStorage('orders', DEMO_ORDERS);
    this.setStorage('expenses', DEMO_EXPENSES);
    this.setStorage('marketing', DEMO_MARKETING_CONTENT);
    this.setStorage('ai_messages', DEMO_AI_MESSAGES);
  }

  // --- BUSINESSES ---
  public async getBusinesses(userId: string): Promise<Business[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .or(`owner_id.eq.${userId},is_demo.eq.true`);
      if (!error && data && data.length > 0) return data as Business[];
    }
    const all = this.getStorage<Business[]>('businesses', [DEMO_BUSINESS]);
    return all.filter(b => b.owner_id === userId || b.is_demo);
  }

  public async getBusinessById(businessId: string): Promise<Business | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();
      if (!error && data) return data as Business;
    }
    const all = this.getStorage<Business[]>('businesses', [DEMO_BUSINESS]);
    return all.find(b => b.id === businessId) || null;
  }

  public async createBusiness(business: Omit<Business, 'id' | 'created_at' | 'updated_at'>): Promise<Business> {
    const newBusiness: Business = {
      ...business,
      id: 'biz-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('businesses')
        .insert([newBusiness])
        .select()
        .single();
      if (!error && data) return data as Business;
    }

    const all = this.getStorage<Business[]>('businesses', [DEMO_BUSINESS]);
    all.push(newBusiness);
    this.setStorage('businesses', all);
    return newBusiness;
  }

  public async updateBusiness(businessId: string, updates: Partial<Business>): Promise<Business | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('businesses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', businessId)
        .select()
        .single();
      if (!error && data) return data as Business;
    }

    const all = this.getStorage<Business[]>('businesses', [DEMO_BUSINESS]);
    const index = all.findIndex(b => b.id === businessId);
    if (index === -1) return null;
    all[index] = { ...all[index], ...updates, updated_at: new Date().toISOString() };
    this.setStorage('businesses', all);
    return all[index];
  }

  // --- PRODUCTS ---
  public async getProducts(businessId: string): Promise<Product[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      if (!error && data) return data as Product[];
    }
    const all = this.getStorage<Product[]>('products', DEMO_PRODUCTS);
    return all.filter(p => p.business_id === businessId);
  }

  public async addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'units_sold'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Math.random().toString(36).substring(2, 9),
      units_sold: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
      if (!error && data) return data as Product;
    }

    const all = this.getStorage<Product[]>('products', DEMO_PRODUCTS);
    all.unshift(newProduct);
    this.setStorage('products', all);
    return newProduct;
  }

  public async updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .select()
        .single();
      if (!error && data) return data as Product;
    }

    const all = this.getStorage<Product[]>('products', DEMO_PRODUCTS);
    const index = all.findIndex(p => p.id === productId);
    if (index === -1) return null;
    all[index] = { ...all[index], ...updates, updated_at: new Date().toISOString() };
    this.setStorage('products', all);
    return all[index];
  }

  public async deleteProduct(productId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) return true;
    }
    const all = this.getStorage<Product[]>('products', DEMO_PRODUCTS);
    const filtered = all.filter(p => p.id !== productId);
    this.setStorage('products', filtered);
    return true;
  }

  // --- CUSTOMERS ---
  public async getCustomers(businessId: string): Promise<Customer[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', businessId)
        .order('total_spent', { ascending: false });
      if (!error && data) return data as Customer[];
    }
    const all = this.getStorage<Customer[]>('customers', DEMO_CUSTOMERS);
    return all.filter(c => c.business_id === businessId);
  }

  public async addCustomer(customer: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: 'cust-' + Math.random().toString(36).substring(2, 9),
      total_orders: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('customers').insert([newCustomer]).select().single();
      if (!error && data) return data as Customer;
    }

    const all = this.getStorage<Customer[]>('customers', DEMO_CUSTOMERS);
    all.unshift(newCustomer);
    this.setStorage('customers', all);
    return newCustomer;
  }

  public async updateCustomer(customerId: string, updates: Partial<Customer>): Promise<Customer | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', customerId)
        .select()
        .single();
      if (!error && data) return data as Customer;
    }

    const all = this.getStorage<Customer[]>('customers', DEMO_CUSTOMERS);
    const index = all.findIndex(c => c.id === customerId);
    if (index === -1) return null;
    all[index] = { ...all[index], ...updates, updated_at: new Date().toISOString() };
    this.setStorage('customers', all);
    return all[index];
  }

  public async deleteCustomer(customerId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('customers').delete().eq('id', customerId);
      if (!error) return true;
    }
    const all = this.getStorage<Customer[]>('customers', DEMO_CUSTOMERS);
    const filtered = all.filter(c => c.id !== customerId);
    this.setStorage('customers', filtered);
    return true;
  }

  // --- ORDERS & THE CRITICAL ATOMIC SALE WORKFLOW ---
  public async getOrders(businessId: string): Promise<Order[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      if (!error && data) return data as Order[];
    }
    const all = this.getStorage<Order[]>('orders', DEMO_ORDERS);
    return all.filter(o => o.business_id === businessId);
  }

  /**
   * CRITICAL ATOMIC SALE TRANSACTION:
   * 1. Creates Order
   * 2. Decreases product stock
   * 3. Increases product units_sold
   * 4. Updates customer order count and lifetime spent
   * 5. Recalculates revenue, profit, and margins
   */
  public async recordSale(
    businessId: string,
    params: {
      customerId?: string;
      customerName?: string;
      items: { productId: string; quantity: number }[];
      paymentMethod: Order['payment_method'];
      discount?: number;
      tax?: number;
      notes?: string;
    }
  ): Promise<Order> {
    const products = await this.getProducts(businessId);
    const customers = await this.getCustomers(businessId);

    let subtotal = 0;
    let totalCost = 0;
    let totalProfit = 0;

    const orderId = 'ord-' + Math.random().toString(36).substring(2, 9);
    const orderNumber = 'SL-' + Math.floor(1000 + Math.random() * 9000);

    const orderItems: OrderItem[] = [];

    // Process each item and validate stock
    for (const item of params.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

      const itemSubtotal = product.selling_price * item.quantity;
      const itemCost = product.cost_price * item.quantity;
      const itemProfit = itemSubtotal - itemCost;

      subtotal += itemSubtotal;
      totalCost += itemCost;
      totalProfit += itemProfit;

      orderItems.push({
        id: 'item-' + Math.random().toString(36).substring(2, 9),
        order_id: orderId,
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.selling_price,
        unit_cost: product.cost_price,
        subtotal: itemSubtotal,
        profit: itemProfit,
        created_at: new Date().toISOString(),
      });

      // 1. UPDATE PRODUCT STOCK & UNITS SOLD
      const newStock = Math.max(0, product.stock_quantity - item.quantity);
      const newSold = product.units_sold + item.quantity;
      await this.updateProduct(product.id, {
        stock_quantity: newStock,
        units_sold: newSold,
      });
    }

    const discount = params.discount || 0;
    const tax = params.tax || 0;
    const totalAmount = Math.max(0, subtotal - discount + tax);
    const netProfit = totalProfit - discount;

    const customer = customers.find(c => c.id === params.customerId);
    const customerName = customer?.name || params.customerName || 'Walk-in Customer';

    // 2. UPDATE CUSTOMER STATS IF CUSTOMER RECORD EXISTS
    if (customer) {
      await this.updateCustomer(customer.id, {
        total_orders: customer.total_orders + 1,
        total_spent: customer.total_spent + totalAmount,
        last_purchase_at: new Date().toISOString(),
      });
    }

    const newOrder: Order = {
      id: orderId,
      business_id: businessId,
      customer_id: params.customerId,
      customer_name: customerName,
      order_number: orderNumber,
      status: 'completed',
      subtotal,
      discount,
      tax,
      total_amount: totalAmount,
      total_cost: totalCost,
      total_profit: netProfit,
      payment_method: params.paymentMethod,
      notes: params.notes,
      items: orderItems,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      await supabase.from('orders').insert([newOrder]);
      if (orderItems.length > 0) {
        await supabase.from('order_items').insert(orderItems);
      }
    }

    const allOrders = this.getStorage<Order[]>('orders', DEMO_ORDERS);
    allOrders.unshift(newOrder);
    this.setStorage('orders', allOrders);

    return newOrder;
  }

  // --- EXPENSES ---
  public async getExpenses(businessId: string): Promise<Expense[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('business_id', businessId)
        .order('expense_date', { ascending: false });
      if (!error && data) return data as Expense[];
    }
    const all = this.getStorage<Expense[]>('expenses', DEMO_EXPENSES);
    return all.filter(e => e.business_id === businessId);
  }

  public async addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    const newExpense: Expense = {
      ...expense,
      id: 'exp-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('expenses').insert([newExpense]).select().single();
      if (!error && data) return data as Expense;
    }

    const all = this.getStorage<Expense[]>('expenses', DEMO_EXPENSES);
    all.unshift(newExpense);
    this.setStorage('expenses', all);
    return newExpense;
  }

  public async deleteExpense(expenseId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
      if (!error) return true;
    }
    const all = this.getStorage<Expense[]>('expenses', DEMO_EXPENSES);
    const filtered = all.filter(e => e.id !== expenseId);
    this.setStorage('expenses', filtered);
    return true;
  }

  // --- MARKETING ---
  public async getMarketingContent(businessId: string): Promise<MarketingContent[]> {
    const all = this.getStorage<MarketingContent[]>('marketing', DEMO_MARKETING_CONTENT);
    return all.filter(m => m.business_id === businessId);
  }

  public async saveMarketingContent(item: Omit<MarketingContent, 'id' | 'created_at'>): Promise<MarketingContent> {
    const newContent: MarketingContent = {
      ...item,
      id: 'mkt-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    const all = this.getStorage<MarketingContent[]>('marketing', DEMO_MARKETING_CONTENT);
    all.unshift(newContent);
    this.setStorage('marketing', all);
    return newContent;
  }

  public async deleteMarketingContent(id: string): Promise<boolean> {
    const all = this.getStorage<MarketingContent[]>('marketing', DEMO_MARKETING_CONTENT);
    const filtered = all.filter(m => m.id !== id);
    this.setStorage('marketing', filtered);
    return true;
  }

  // --- AI COACH MESSAGES ---
  public async getAIMessages(businessId: string): Promise<AICoachMessage[]> {
    const all = this.getStorage<AICoachMessage[]>('ai_messages', DEMO_AI_MESSAGES);
    return all;
  }

  public async addAIMessage(msg: Omit<AICoachMessage, 'id' | 'created_at'>): Promise<AICoachMessage> {
    const newMsg: AICoachMessage = {
      ...msg,
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    const all = this.getStorage<AICoachMessage[]>('ai_messages', DEMO_AI_MESSAGES);
    all.push(newMsg);
    this.setStorage('ai_messages', all);
    return newMsg;
  }

  // --- DYNAMIC FINANCIAL CALCULATIONS ---
  public async calculateFinancials(businessId: string): Promise<BusinessFinancials> {
    const orders = await this.getOrders(businessId);
    const expenses = await this.getExpenses(businessId);
    const customers = await this.getCustomers(businessId);

    const total_revenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const total_cost_of_goods = orders.reduce((sum, o) => sum + (Number(o.total_cost) || 0), 0);
    const total_expenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    
    const gross_profit = total_revenue - total_cost_of_goods;
    const net_profit = gross_profit - total_expenses;
    const profit_margin_percentage = total_revenue > 0 ? (net_profit / total_revenue) * 100 : 0;
    const average_order_value = orders.length > 0 ? total_revenue / orders.length : 0;

    return {
      total_revenue,
      total_cost_of_goods,
      total_expenses,
      gross_profit,
      net_profit,
      profit_margin_percentage,
      total_orders: orders.length,
      total_customers: customers.length,
      average_order_value,
    };
  }
}

export const db = new DatabaseService();
db.init();
