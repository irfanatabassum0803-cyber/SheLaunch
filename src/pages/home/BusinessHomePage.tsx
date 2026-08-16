import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  Crown
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatsCard } from '../../components/ui/StatsCard';

export const BusinessHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoUser } = useAuth();
  const { currentBusiness, products, customers, orders, financials, insights } = useBusiness();

  const currency = currentBusiness?.currency_symbol || '$';

  // Setup Checklist calculation
  const checklist = [
    { id: 'biz', label: 'Create Business Foundation', completed: Boolean(currentBusiness), link: '/onboarding' },
    { id: 'prod', label: 'Add Your First Product', completed: products.length > 0, link: '/products' },
    { id: 'cust', label: 'Add a Customer or Client Lead', completed: customers.length > 0, link: '/customers' },
    { id: 'sale', label: 'Record Your First Sale', completed: orders.length > 0, link: '/sales' },
    { id: 'coach', label: 'Get Advice from SheLaunch AI Coach', completed: true, link: '/coach' },
  ];

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Dynamic Next Best Action
  const getNextBestAction = () => {
    if (products.length === 0) {
      return {
        title: 'Add Your First Product or Collection',
        description: 'Your store needs items in its catalog before you can record sales or calculate profit margins.',
        actionLabel: 'Add First Product',
        actionRoute: '/products',
      };
    }
    if (customers.length === 0) {
      return {
        title: 'Add Your First Customer or VIP Contact',
        description: 'Keep track of buyers, contact details, and personalized notes for repeat orders.',
        actionLabel: 'Add Customer',
        actionRoute: '/customers',
      };
    }
    if (orders.length === 0) {
      return {
        title: 'Record Your First Transaction',
        description: 'Made a sale in-person or on Instagram? Record it now to automatically deduct inventory and track profit.',
        actionLabel: 'Record a Sale',
        actionRoute: '/sales',
      };
    }
    const lowStock = products.find(p => p.stock_quantity <= p.low_stock_threshold);
    if (lowStock) {
      return {
        title: `Restock ${lowStock.name}`,
        description: `Only ${lowStock.stock_quantity} unit(s) remaining in stock. Restock now to prevent lost sales.`,
        actionLabel: 'Open Inventory',
        actionRoute: '/inventory',
      };
    }
    return {
      title: 'Generate Instagram Copy in Marketing Studio',
      description: 'Your catalog and stock are healthy. Use Gemini AI to write high-converting launch copy for your community.',
      actionLabel: 'Open Marketing Studio',
      actionRoute: '/marketing',
    };
  };

  const nextAction = getNextBestAction();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* 1. WELCOME BANNER & FOUNDER STATUS */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-burgundy-950/90 via-wine-900/60 to-burgundy-900/80 border border-blush-400/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blush-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="wine" size="md">
              {currentBusiness?.stage === 'selling' ? 'Active Seller' : currentBusiness?.stage === 'growing' ? 'Scaling Business' : 'Idea Stage'}
            </Badge>
            {isDemoUser && (
              <Badge variant="gold" size="md" icon={<Crown className="w-3 h-3" />}>
                Noor Jewels Demo
              </Badge>
            )}
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-cream-50">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Founder'}! 🌸
          </h2>
          <p className="text-xs sm:text-sm text-blush-200/80 max-w-xl">
            You&apos;re off to a great start with <span className="text-white font-semibold">{currentBusiness?.name || 'your business'}</span>. Here is your overview for today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Button
            size="md"
            variant="outline"
            onClick={() => navigate('/products')}
            icon={<Package className="w-4 h-4 text-blush-300" />}
          >
            Add Product
          </Button>

          <Button
            size="md"
            variant="outline"
            onClick={() => navigate('/customers')}
            icon={<Users className="w-4 h-4 text-blush-300" />}
          >
            Add Customer
          </Button>

          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/sales')}
            icon={<ShoppingBag className="w-4 h-4" />}
          >
            Record Sale
          </Button>
        </div>
      </motion.div>

      {/* 2. REAL FINANCIAL KPIS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Revenue"
          value={`${currency}${financials.total_revenue.toFixed(2)}`}
          icon={DollarSign}
          subtitle={`Across ${orders.length} total completed sale(s)`}
        />
        <StatsCard
          title="Net Take-Home Profit"
          value={`${currency}${financials.net_profit.toFixed(2)}`}
          icon={TrendingUp}
          isPositive={financials.net_profit >= 0}
          change={`${financials.profit_margin_percentage.toFixed(1)}% margin`}
          subtitle="After COGS and operating expenses"
        />
        <StatsCard
          title="Product Catalog"
          value={products.length}
          icon={Package}
          subtitle={`${products.reduce((sum, p) => sum + p.units_sold, 0)} total units sold`}
        />
        <StatsCard
          title="Customer Base"
          value={customers.length}
          icon={Users}
          subtitle={`${customers.filter(c => c.total_orders > 1).length} repeat VIP buyers`}
        />
      </motion.div>

      {/* 3. NEXT BEST ACTION & SETUP PROGRESS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Best Action Card */}
        <Card variant="highlight" className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden hover:border-blush-400/50 transition-all">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <Badge variant="gold" size="sm" icon={<Sparkles className="w-3 h-3 text-gold-400" />}>
                Recommended Next Step
              </Badge>
              <span className="text-xs text-blush-300/70 font-medium">Calibrated by SheLaunch OS</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-cream-50">
              {nextAction.title}
            </h3>
            <p className="text-xs sm:text-sm text-blush-200/80 leading-relaxed max-w-xl">
              {nextAction.description}
            </p>
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-wine-800/40 mt-4 relative z-10">
            <span className="text-xs text-blush-300/60 hidden sm:inline">
              Takes ~2 minutes to complete
            </span>
            <Button
              size="md"
              variant="primary"
              onClick={() => navigate(nextAction.actionRoute)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {nextAction.actionLabel}
            </Button>
          </div>
        </Card>

        {/* Business Foundation Checklist */}
        <Card variant="default" className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-cream-50">Setup Progress</h4>
              <span className="text-xs font-semibold text-blush-300">{progressPercent}%</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-wine-950 border border-wine-800/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-burgundy-600 via-wine-500 to-blush-400 rounded-full"
              />
            </div>

            <div className="space-y-2.5 pt-2">
              {checklist.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ x: item.completed ? 0 : 3 }}
                  onClick={() => !item.completed && navigate(item.link)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                    item.completed 
                      ? 'text-blush-200/60 bg-wine-950/20' 
                      : 'text-cream-50 bg-wine-900/40 hover:bg-wine-800/60 cursor-pointer border border-blush-400/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-blush-400/60 shrink-0" />
                    )}
                    <span className={item.completed ? 'line-through text-blush-300/50' : 'font-medium'}>
                      {item.label}
                    </span>
                  </div>
                  {!item.completed && <ArrowRight className="w-3.5 h-3.5 text-blush-300" />}
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 4. RECENT ACTIVITY & AI DIAGNOSTIC INSIGHTS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card variant="default" className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="font-serif font-bold text-base text-cream-50">Recent Sales & Activity</h4>
              <p className="text-xs text-blush-200/70">Real transactions synchronized from your point of sale</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/sales')}
              icon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              View All Orders
            </Button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 space-y-3 bg-wine-950/30 rounded-2xl border border-wine-900/40">
              <ShoppingBag className="w-8 h-8 text-blush-400/60 mx-auto" />
              <p className="text-xs text-blush-200/70">No sales recorded yet.</p>
              <Button size="sm" variant="outline" onClick={() => navigate('/sales')}>
                Record Your First Sale
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-wine-800/30">
              {orders.slice(0, 5).map((order) => (
                <motion.div 
                  key={order.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-3.5 flex items-center justify-between text-xs hover:bg-wine-900/20 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cream-50">{order.customer_name || 'Walk-in Client'}</span>
                      <span className="text-[10px] text-blush-300/60">#{order.order_number}</span>
                    </div>
                    <p className="text-blush-200/60 text-[11px]">
                      {order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ') || 'Custom Sale'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-cream-50 text-sm">
                      {currency}{Number(order.total_amount).toFixed(2)}
                    </span>
                    <p className="text-[10px] text-emerald-400 font-medium">
                      +{currency}{Number(order.total_profit).toFixed(2)} profit
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Business Coach Quick Teaser */}
        <Card variant="subtle" className="p-6 flex flex-col justify-between space-y-4 hover:border-blush-400/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blush-200 font-semibold text-xs">
              <Bot className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>SheLaunch AI Business Coach</span>
            </div>
            <h4 className="font-serif font-bold text-base text-cream-50">
              Ask your dedicated AI co-pilot
            </h4>
            <p className="text-xs text-blush-200/70 leading-relaxed">
              Powered by Google Gemini and connected directly to your catalog, orders, and real margins.
            </p>

            <div className="space-y-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                onClick={() => navigate('/coach')}
                className="w-full text-left p-2.5 rounded-xl bg-wine-950/60 hover:bg-wine-900/80 border border-wine-800/40 text-[11px] text-blush-200 transition-colors shadow-sm"
              >
                💬 &ldquo;How is my business doing this month?&rdquo;
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                onClick={() => navigate('/coach')}
                className="w-full text-left p-2.5 rounded-xl bg-wine-950/60 hover:bg-wine-900/80 border border-wine-800/40 text-[11px] text-blush-200 transition-colors shadow-sm"
              >
                💡 &ldquo;Which product should I promote for highest profit?&rdquo;
              </motion.button>
            </div>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/coach')}
            className="w-full mt-2 shadow-lg shadow-wine-700/40"
            icon={<Bot className="w-4 h-4" />}
          >
            Launch AI Coach
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
};
