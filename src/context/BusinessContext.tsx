import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Business, Product, Customer, Order, Expense, MarketingContent, AICoachMessage, BusinessFinancials, AIInsightItem 
} from '../types';
import { db } from '../lib/db';
import { useAuth } from './AuthContext';
import { NOOR_JEWELS_BUSINESS_ID, DEMO_BUSINESS } from '../lib/seed';
import { generateAIInsights } from '../lib/gemini';

interface BusinessContextType {
  currentBusiness: Business | null;
  userBusinesses: Business[];
  products: Product[];
  customers: Customer[];
  orders: Order[];
  expenses: Expense[];
  marketingList: MarketingContent[];
  aiMessages: AICoachMessage[];
  financials: BusinessFinancials;
  insights: AIInsightItem[];
  loading: boolean;
  
  // Actions
  selectBusiness: (businessId: string) => Promise<void>;
  createBusiness: (data: Omit<Business, 'id' | 'created_at' | 'updated_at'>) => Promise<Business>;
  updateBusiness: (updates: Partial<Business>) => Promise<void>;
  
  // Products
  addProduct: (data: Omit<Product, 'id' | 'business_id' | 'created_at' | 'updated_at' | 'units_sold'>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Customers
  addCustomer: (data: Omit<Customer, 'id' | 'business_id' | 'total_orders' | 'total_spent' | 'created_at' | 'updated_at'>) => Promise<Customer>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Sales
  recordSale: (params: {
    customerId?: string;
    customerName?: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: Order['payment_method'];
    discount?: number;
    tax?: number;
    notes?: string;
  }) => Promise<Order>;

  // Expenses
  addExpense: (data: Omit<Expense, 'id' | 'business_id' | 'created_at'>) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;

  // Marketing
  saveMarketingItem: (data: Omit<MarketingContent, 'id' | 'business_id' | 'created_at'>) => Promise<MarketingContent>;
  deleteMarketingItem: (id: string) => Promise<void>;

  // AI Chat
  sendCoachMessage: (message: string) => Promise<AICoachMessage>;

  // Reset / Refresh
  refreshData: () => Promise<void>;
  resetToDemo: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const DEFAULT_FINANCIALS: BusinessFinancials = {
  total_revenue: 0,
  total_cost_of_goods: 0,
  total_expenses: 0,
  gross_profit: 0,
  net_profit: 0,
  profit_margin_percentage: 0,
  total_orders: 0,
  total_customers: 0,
  average_order_value: 0,
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoUser } = useAuth();

  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [marketingList, setMarketingList] = useState<MarketingContent[]>([]);
  const [aiMessages, setAiMessages] = useState<AICoachMessage[]>([]);
  const [financials, setFinancials] = useState<BusinessFinancials>(DEFAULT_FINANCIALS);
  const [insights, setInsights] = useState<AIInsightItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load business & dependent datasets
  const loadBusinessData = useCallback(async (businessId: string) => {
    setLoading(true);
    try {
      const [prods, custs, ords, exps, mkts, msgs, fins] = await Promise.all([
        db.getProducts(businessId),
        db.getCustomers(businessId),
        db.getOrders(businessId),
        db.getExpenses(businessId),
        db.getMarketingContent(businessId),
        db.getAIMessages(businessId),
        db.calculateFinancials(businessId),
      ]);

      setProducts(prods);
      setCustomers(custs);
      setOrders(ords);
      setExpenses(exps);
      setMarketingList(mkts);
      setAiMessages(msgs);
      setFinancials(fins);

      const currentBiz = await db.getBusinessById(businessId);
      setCurrentBusiness(currentBiz);

      // Generate real AI insights from live dataset
      const freshInsights = generateAIInsights({
        business: currentBiz,
        products: prods,
        customers: custs,
        orders: ords,
        expenses: exps,
        financials: {
          revenue: fins.total_revenue,
          costOfGoods: fins.total_cost_of_goods,
          expenses: fins.total_expenses,
          profit: fins.net_profit,
          margin: fins.profit_margin_percentage,
        }
      });
      setInsights(freshInsights);
    } catch (e) {
      console.error('Failed to load business data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync user businesses on login/user switch
  useEffect(() => {
    const init = async () => {
      if (!user) {
        setCurrentBusiness(null);
        setUserBusinesses([]);
        setProducts([]);
        setCustomers([]);
        setOrders([]);
        setExpenses([]);
        setFinancials(DEFAULT_FINANCIALS);
        setInsights([]);
        setLoading(false);
        return;
      }

      if (isDemoUser) {
        setUserBusinesses([DEMO_BUSINESS]);
        await loadBusinessData(NOOR_JEWELS_BUSINESS_ID);
        return;
      }

      const bizList = await db.getBusinesses(user.id);
      setUserBusinesses(bizList);

      if (bizList.length > 0) {
        await loadBusinessData(bizList[0].id);
      } else {
        setCurrentBusiness(null);
        setLoading(false);
      }
    };

    init();
  }, [user, isDemoUser, loadBusinessData]);

  const selectBusiness = async (businessId: string) => {
    await loadBusinessData(businessId);
  };

  const createBusiness = async (data: Omit<Business, 'id' | 'created_at' | 'updated_at'>): Promise<Business> => {
    const newBiz = await db.createBusiness(data);
    setUserBusinesses(prev => [newBiz, ...prev]);
    await loadBusinessData(newBiz.id);
    return newBiz;
  };

  const updateBusiness = async (updates: Partial<Business>) => {
    if (!currentBusiness) return;
    const updated = await db.updateBusiness(currentBusiness.id, updates);
    if (updated) {
      setCurrentBusiness(updated);
      setUserBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b));
    }
  };

  const addProduct = async (data: Omit<Product, 'id' | 'business_id' | 'created_at' | 'updated_at' | 'units_sold'>) => {
    if (!currentBusiness) throw new Error('No active business');
    const created = await db.addProduct({ ...data, business_id: currentBusiness.id });
    await loadBusinessData(currentBusiness.id);
    return created;
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    if (!currentBusiness) return;
    await db.updateProduct(id, data);
    await loadBusinessData(currentBusiness.id);
  };

  const deleteProduct = async (id: string) => {
    if (!currentBusiness) return;
    await db.deleteProduct(id);
    await loadBusinessData(currentBusiness.id);
  };

  const addCustomer = async (data: Omit<Customer, 'id' | 'business_id' | 'total_orders' | 'total_spent' | 'created_at' | 'updated_at'>) => {
    if (!currentBusiness) throw new Error('No active business');
    const created = await db.addCustomer({ ...data, business_id: currentBusiness.id });
    await loadBusinessData(currentBusiness.id);
    return created;
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    if (!currentBusiness) return;
    await db.updateCustomer(id, data);
    await loadBusinessData(currentBusiness.id);
  };

  const deleteCustomer = async (id: string) => {
    if (!currentBusiness) return;
    await db.deleteCustomer(id);
    await loadBusinessData(currentBusiness.id);
  };

  // Critical transactional sale recorder
  const recordSale = async (params: {
    customerId?: string;
    customerName?: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: Order['payment_method'];
    discount?: number;
    tax?: number;
    notes?: string;
  }): Promise<Order> => {
    if (!currentBusiness) throw new Error('No active business');
    const order = await db.recordSale(currentBusiness.id, params);
    await loadBusinessData(currentBusiness.id);
    return order;
  };

  const addExpense = async (data: Omit<Expense, 'id' | 'business_id' | 'created_at'>) => {
    if (!currentBusiness) throw new Error('No active business');
    const created = await db.addExpense({ ...data, business_id: currentBusiness.id });
    await loadBusinessData(currentBusiness.id);
    return created;
  };

  const deleteExpense = async (id: string) => {
    if (!currentBusiness) return;
    await db.deleteExpense(id);
    await loadBusinessData(currentBusiness.id);
  };

  const saveMarketingItem = async (data: Omit<MarketingContent, 'id' | 'business_id' | 'created_at'>) => {
    if (!currentBusiness) throw new Error('No active business');
    const created = await db.saveMarketingContent({ ...data, business_id: currentBusiness.id });
    setMarketingList(prev => [created, ...prev]);
    return created;
  };

  const deleteMarketingItem = async (id: string) => {
    await db.deleteMarketingContent(id);
    setMarketingList(prev => prev.filter(m => m.id !== id));
  };

  const sendCoachMessage = async (userPrompt: string): Promise<AICoachMessage> => {
    if (!currentBusiness) throw new Error('No active business');

    // 1. Add user message
    const userMsg = await db.addAIMessage({
      conversation_id: 'conv-' + currentBusiness.id,
      role: 'user',
      content: userPrompt,
    });
    setAiMessages(prev => [...prev, userMsg]);

    // 2. Generate grounded AI response with real business context
    const { callGemini } = await import('../lib/gemini');
    const responseText = await callGemini(
      userPrompt,
      `You are the SheLaunch AI Business Coach. Guide this woman entrepreneur warmly, practically, and concisely using their real business data.`,
      {
        business: currentBusiness,
        products,
        customers,
        orders,
        expenses,
        financials: {
          revenue: financials.total_revenue,
          costOfGoods: financials.total_cost_of_goods,
          expenses: financials.total_expenses,
          profit: financials.net_profit,
          margin: financials.profit_margin_percentage,
        }
      }
    );

    const assistantMsg = await db.addAIMessage({
      conversation_id: 'conv-' + currentBusiness.id,
      role: 'assistant',
      content: responseText,
    });
    setAiMessages(prev => [...prev, assistantMsg]);

    return assistantMsg;
  };

  const refreshData = async () => {
    if (currentBusiness) {
      await loadBusinessData(currentBusiness.id);
    }
  };

  const resetToDemo = async () => {
    db.resetDemoData();
    await loadBusinessData(NOOR_JEWELS_BUSINESS_ID);
  };

  return (
    <BusinessContext.Provider value={{
      currentBusiness,
      userBusinesses,
      products,
      customers,
      orders,
      expenses,
      marketingList,
      aiMessages,
      financials,
      insights,
      loading,
      selectBusiness,
      createBusiness,
      updateBusiness,
      addProduct,
      updateProduct,
      deleteProduct,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      recordSale,
      addExpense,
      deleteExpense,
      saveMarketingItem,
      deleteMarketingItem,
      sendCoachMessage,
      refreshData,
      resetToDemo,
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness must be used within a BusinessProvider');
  return context;
};
