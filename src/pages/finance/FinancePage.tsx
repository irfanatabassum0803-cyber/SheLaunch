import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Receipt, 
  Trash2, 
  Calendar,
  Wallet,
  Tag,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Expense } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { StatsCard } from '../../components/ui/StatsCard';

const expenseCategories = [
  'Materials',
  'Packaging',
  'Marketing',
  'Software',
  'Rent',
  'Utilities',
  'Other',
] as const;

export const FinancePage: React.FC = () => {
  const { currentBusiness, financials, expenses, addExpense, deleteExpense } = useBusiness();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Materials');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currency = currentBusiness?.currency_symbol || '$';

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addExpense({
        title,
        category,
        amount: parseFloat(amount) || 0,
        expense_date: expenseDate,
        notes: notes || undefined,
      });

      setTitle('');
      setAmount('');
      setNotes('');
      setSubmitting(false);
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string, name: string) => {
    if (window.confirm(`Delete expense "${name}"?`)) {
      await deleteExpense(id);
    }
  };

  // Group expenses by category
  const expensesByCategory = expenseCategories.map(cat => {
    const total = expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return { category: cat, total };
  }).filter(item => item.total > 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
            Finance & Profit Breakdown
          </h2>
          <p className="text-xs text-blush-200/70">
            Live Profit & Loss statement derived from your real sales and operating expenses
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Business Expense
        </Button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Gross Revenue"
          value={`${currency}${financials.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          subtitle="Total intake from customer orders"
        />
        <StatsCard
          title="Cost of Goods (COGS)"
          value={`${currency}${financials.total_cost_of_goods.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={Wallet}
          subtitle="Direct production / raw material costs"
        />
        <StatsCard
          title="Operating Expenses"
          value={`${currency}${financials.total_expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={Receipt}
          subtitle="Marketing, software, packaging & overhead"
        />
        <StatsCard
          title="Net Take-Home Profit"
          value={`${currency}${financials.net_profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          isPositive={financials.net_profit >= 0}
          change={`${financials.profit_margin_percentage.toFixed(1)}% margin`}
          subtitle="Actual net cash generated"
        />
      </div>

      {/* Profit & Loss Visual Summary Card */}
      <Card variant="highlight" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-wine-800/40 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-cream-50">Executive P&L Statement</h3>
            <p className="text-xs text-blush-200/70">Automatic accounting equation based on real transactions</p>
          </div>
          <Badge variant="gold" size="md">
            Net Margin: {financials.profit_margin_percentage.toFixed(1)}%
          </Badge>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-wine-800/20 text-cream-100">
            <span className="font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Gross Sales Revenue
            </span>
            <span className="font-serif font-bold text-sm text-cream-50">
              +{currency}{financials.total_revenue.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-wine-800/20 text-blush-200/80">
            <span className="font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Less: Cost of Goods Sold (Materials in sold units)
            </span>
            <span className="font-serif font-bold text-sm text-amber-300">
              -{currency}{financials.total_cost_of_goods.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-wine-800/40 text-blush-100 font-semibold">
            <span>= Gross Profit (Revenue - COGS)</span>
            <span className="font-serif font-bold text-sm text-cream-50">
              {currency}{financials.gross_profit.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-wine-800/20 text-blush-200/80">
            <span className="font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Less: Operating Overhead & Expenses
            </span>
            <span className="font-serif font-bold text-sm text-rose-300">
              -{currency}{financials.total_expenses.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 text-base font-serif font-bold text-white bg-wine-950/80 p-4 rounded-xl border border-blush-400/20">
            <span>= NET BUSINESS PROFIT</span>
            <span className="text-emerald-400 text-lg">
              {currency}{financials.net_profit.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Expenses History Table & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (1 col) */}
        <Card variant="subtle" className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-gold-400" />
            <h4 className="font-serif font-bold text-sm text-cream-50">Expense by Category</h4>
          </div>

          {expensesByCategory.length === 0 ? (
            <p className="text-xs text-blush-200/60 py-4">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {expensesByCategory.map((cat) => {
                const percent = financials.total_expenses > 0 
                  ? ((cat.total / financials.total_expenses) * 100).toFixed(0) 
                  : 0;

                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-cream-100">{cat.category}</span>
                      <span className="text-blush-200">{currency}{cat.total.toFixed(2)} ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-wine-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-burgundy-600 to-rose-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Expenses List (2 cols) */}
        <Card variant="default" className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-cream-50">Expense Log</h4>
            <span className="text-xs text-blush-300/70">{expenses.length} Total Logs</span>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-8 text-xs text-blush-200/60">
              No expenses recorded yet. Track packaging, marketing, and booth fees to protect your profit!
            </div>
          ) : (
            <div className="divide-y divide-wine-800/30">
              {expenses.map((exp) => (
                <div key={exp.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cream-50">{exp.title}</span>
                      <Badge variant="wine" size="sm">{exp.category}</Badge>
                    </div>
                    <p className="text-[11px] text-blush-300/60 mt-0.5">
                      {new Date(exp.expense_date).toLocaleDateString()} • {exp.notes || 'Operating cost'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-rose-300 text-sm">
                      -{currency}{Number(exp.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id, exp.title)}
                      className="p-1 text-zinc-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Business Expense"
        subtitle="Log materials, packaging, or marketing costs to maintain accurate profit margins"
        maxWidth="md"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Input
            label="Expense Description *"
            placeholder="e.g. 500 Custom Branded Packaging Boxes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#18040B]/80 text-cream-50 text-xs rounded-xl border border-burgundy-700/60 py-2.5 px-3 focus:outline-none focus:border-blush-400"
              >
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Input
              label={`Amount (${currency}) *`}
              type="number"
              step="0.01"
              placeholder="120.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <Input
            label="Date of Expense"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />

          <Input
            label="Notes / Vendor (Optional)"
            placeholder="e.g. EcoEnclose, Klaviyo monthly, Artisan Fair Booth"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-wine-800/40">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              Save Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
