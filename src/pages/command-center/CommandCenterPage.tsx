import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle, 
  ArrowRight, 
  Bot, 
  Crown,
  Activity,
  Layers,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatsCard } from '../../components/ui/StatsCard';

export const CommandCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentBusiness, products, customers, orders, expenses, financials, insights } = useBusiness();

  const currency = currentBusiness?.currency_symbol || '$';
  const lowStock = products.filter(p => p.stock_quantity <= p.low_stock_threshold);
  const bestProduct = [...products].sort((a, b) => b.units_sold - a.units_sold)[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Flight Deck Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#220710] via-burgundy-950 to-[#2A0816] border border-blush-400/30 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5 text-gold-400" />}>
              Advanced Operations Hub
            </Badge>
            <span className="text-xs text-blush-300/80">Flight Deck v2.4</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-cream-50">
            {currentBusiness?.name || 'Business'} Command Centre
          </h2>
          <p className="text-xs sm:text-sm text-blush-200/80 max-w-xl">
            Real-time telemetry, executive telemetry score, and automated AI daily briefing.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            size="md"
            variant="outline"
            onClick={() => navigate('/analytics')}
            icon={<Activity className="w-4 h-4 text-blush-300" />}
          >
            Analytics Suite
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/sales')}
            icon={<ShoppingBag className="w-4 h-4" />}
          >
            Record Transaction
          </Button>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Gross Intake"
          value={`${currency}${financials.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          subtitle={`From ${orders.length} order(s)`}
        />
        <StatsCard
          title="Net Cash Generated"
          value={`${currency}${financials.net_profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          isPositive={financials.net_profit >= 0}
          change={`${financials.profit_margin_percentage.toFixed(1)}% margin`}
          subtitle="Net after all expenses"
        />
        <StatsCard
          title="Active Inventory"
          value={`${products.reduce((sum, p) => sum + p.stock_quantity, 0)} Units`}
          icon={Package}
          subtitle={`${lowStock.length} items need restock`}
        />
        <StatsCard
          title="Customer Base"
          value={customers.length}
          icon={Users}
          subtitle={`${customers.filter(c => c.total_orders > 1).length} repeat buyers`}
        />
      </div>

      {/* AI Business Briefing & Action Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Briefing Card (2 cols) */}
        <Card variant="highlight" className="lg:col-span-2 p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-wine-800/40 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-rose-400" />
              <h3 className="font-serif font-bold text-lg text-cream-50">AI Executive Briefing</h3>
            </div>
            <Badge variant="emerald" size="sm">Health Score: 94/100</Badge>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-blush-100 leading-relaxed">
            <p>
              🌟 <strong>Operational State:</strong> Your business has generated <strong>{currency}{financials.total_revenue.toFixed(2)}</strong> across <strong>{orders.length} orders</strong>, delivering a healthy <strong>{financials.profit_margin_percentage.toFixed(1)}% net margin</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-wine-950/80 border border-wine-800/60 space-y-1">
                <span className="font-semibold text-emerald-400">🔥 Top Revenue Driver</span>
                <p className="text-cream-50 font-bold">{bestProduct?.name || 'N/A'}</p>
                <p className="text-[11px] text-blush-300/70">{bestProduct?.units_sold || 0} units sold to date</p>
              </div>

              <div className="p-3.5 rounded-xl bg-wine-950/80 border border-wine-800/60 space-y-1">
                <span className="font-semibold text-amber-400">⚠️ Critical Stock Watch</span>
                <p className="text-cream-50 font-bold">
                  {lowStock.length > 0 ? `${lowStock[0].name} (${lowStock[0].stock_quantity} left)` : 'Stock is optimal'}
                </p>
                <p className="text-[11px] text-blush-300/70">
                  {lowStock.length > 0 ? 'Restock required to maintain velocity' : 'Zero items below threshold'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-wine-800/40 flex items-center justify-between">
            <span className="text-xs text-blush-300/70">Need tactical help?</span>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/coach')}
              icon={<Bot className="w-3.5 h-3.5" />}
            >
              Open AI Coach Dialogue
            </Button>
          </div>
        </Card>

        {/* Priority Action Deck (1 col) */}
        <Card variant="default" className="p-6 space-y-4">
          <h4 className="font-serif font-bold text-base text-cream-50">Control Room Shortcuts</h4>
          
          <div className="space-y-2.5">
            <button
              onClick={() => navigate('/pricing-helper')}
              className="w-full text-left p-3 rounded-xl bg-wine-950/60 hover:bg-wine-900/60 border border-wine-800/50 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <p className="font-semibold text-cream-50">Pricing & Margin Helper</p>
                <p className="text-[10px] text-blush-300/70">Calculate optimal retail price points</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blush-300" />
            </button>

            <button
              onClick={() => navigate('/marketing')}
              className="w-full text-left p-3 rounded-xl bg-wine-950/60 hover:bg-wine-900/60 border border-wine-800/50 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <p className="font-semibold text-cream-50">Marketing Studio</p>
                <p className="text-[10px] text-blush-300/70">Generate Instagram & WhatsApp copy</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blush-300" />
            </button>

            <button
              onClick={() => navigate('/inventory')}
              className="w-full text-left p-3 rounded-xl bg-wine-950/60 hover:bg-wine-900/60 border border-wine-800/50 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <p className="font-semibold text-cream-50">Restock Manager</p>
                <p className="text-[10px] text-blush-300/70">Add inbound supplier shipments</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blush-300" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
