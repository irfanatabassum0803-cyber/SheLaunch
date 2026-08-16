import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  PieChart as PieIcon,
  Crown,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import { useBusiness } from '../../context/BusinessContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatsCard } from '../../components/ui/StatsCard';

const COLORS = ['#C74F6E', '#E04770', '#8A233F', '#D7B447', '#4F1B28', '#EEB1BD'];

export const AnalyticsPage: React.FC = () => {
  const { currentBusiness, products, customers, orders, expenses, financials } = useBusiness();
  const currency = currentBusiness?.currency_symbol || '$';

  // Monthly / Order trend data prepared from real orders
  const sortedOrders = [...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  const revenueTrendData = sortedOrders.slice(-8).map((o, idx) => ({
    name: `Order #${o.order_number}`,
    revenue: Number(o.total_amount),
    profit: Number(o.total_profit),
  }));

  // Best Selling Products
  const topSellingProducts = [...products]
    .sort((a, b) => b.units_sold - a.units_sold)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 18) + '...' : p.name,
      units: p.units_sold,
      revenue: p.units_sold * p.selling_price,
    }));

  // Category Distribution
  const categoryData = Array.from(new Set(products.map(p => p.category))).map(cat => {
    const totalUnits = products
      .filter(p => p.category === cat)
      .reduce((sum, p) => sum + p.units_sold, 0);
    return { name: cat, value: totalUnits || 1 };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
          Business Analytics & Visual Trends
        </h2>
        <p className="text-xs text-blush-200/70">
          Telemetry and charts computed strictly from your real sales and product catalog
        </p>
      </div>

      {/* Overview Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Gross Revenue"
          value={`${currency}${financials.total_revenue.toFixed(2)}`}
          icon={DollarSign}
          subtitle={`Across ${orders.length} order(s)`}
        />
        <StatsCard
          title="Net Take-Home Profit"
          value={`${currency}${financials.net_profit.toFixed(2)}`}
          icon={TrendingUp}
          isPositive={financials.net_profit >= 0}
          change={`${financials.profit_margin_percentage.toFixed(1)}% margin`}
          subtitle="Revenue minus COGS and expenses"
        />
        <StatsCard
          title="Average Order Value"
          value={`${currency}${financials.average_order_value.toFixed(2)}`}
          icon={ShoppingBag}
          subtitle="Per customer transaction"
        />
        <StatsCard
          title="Catalog Health"
          value={`${products.length} Products`}
          icon={Package}
          subtitle={`${products.filter(p => p.stock_quantity <= p.low_stock_threshold).length} low-stock alerts`}
        />
      </motion.div>

      {/* 2 Main Visual Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Growth Chart */}
        <Card variant="highlight" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-wine-800/40 pb-3">
            <div>
              <h4 className="font-serif font-bold text-base text-cream-50">Revenue vs. Profit Trajectory</h4>
              <p className="text-xs text-blush-200/70">Transaction-by-transaction performance</p>
            </div>
            <Badge variant="gold" size="sm">Live Stream</Badge>
          </div>

          <div className="h-72 w-full pt-4">
            {revenueTrendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-blush-300/60">
                Record sales to see real-time growth curves.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C74F6E" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#C74F6E" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#A9586B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#A9586B" fontSize={10} tickLine={false} tickFormatter={(v) => `${currency}${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F060E', borderColor: '#6E2A3B', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(value: any) => [`${currency}${Number(value).toFixed(2)}`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#C74F6E" fillOpacity={1} fill="url(#colorRev)" name="Revenue" isAnimationActive={true} animationDuration={1200} />
                  <Area type="monotone" dataKey="profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProf)" name="Profit" isAnimationActive={true} animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Best Selling Products Velocity BarChart */}
        <Card variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-wine-800/40 pb-3">
            <div>
              <h4 className="font-serif font-bold text-base text-cream-50">Top Selling Products</h4>
              <p className="text-xs text-blush-200/70">Ranked by units moved</p>
            </div>
            <Badge variant="emerald" size="sm">Sales Velocity</Badge>
          </div>

          <div className="h-72 w-full pt-4">
            {topSellingProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-blush-300/60">
                No units sold yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSellingProducts} layout="vertical">
                  <XAxis type="number" stroke="#A9586B" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#A9586B" fontSize={10} tickLine={false} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F060E', borderColor: '#6E2A3B', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(value: any) => [`${value} Units`, 'Sold']}
                  />
                  <Bar dataKey="units" fill="#DE7E95" radius={[0, 8, 8, 0]} name="Units Sold" isAnimationActive={true} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Category Share & Inventory Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="subtle" className="p-6 space-y-4">
          <h4 className="font-serif font-bold text-sm text-cream-50">Category Share</h4>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1200}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F060E', borderColor: '#6E2A3B', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="default" className="lg:col-span-2 p-6 space-y-4">
          <h4 className="font-serif font-bold text-base text-cream-50">Top Customer Lifetime Value (LTV)</h4>
          <div className="divide-y divide-wine-800/30">
            {customers.slice(0, 4).map((c, i) => (
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="py-3 flex items-center justify-between text-xs hover:bg-wine-900/20 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-blush-300">0{i + 1}</span>
                  <div>
                    <p className="font-semibold text-cream-50">{c.name}</p>
                    <p className="text-[10px] text-blush-300/60">{c.total_orders} orders recorded</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-cream-50 text-sm">
                    {currency}{c.total_spent.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-emerald-400 font-medium">VIP Client</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
