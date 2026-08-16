import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Search, 
  ArrowUpDown, 
  RefreshCw,
  TrendingDown,
  PackageCheck
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const InventoryPage: React.FC = () => {
  const { currentBusiness, products, updateProduct } = useBusiness();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('10');
  const [adjustType, setAdjustType] = useState<'add' | 'set'>('add');
  const [submitting, setSubmitting] = useState(false);

  const currency = currentBusiness?.currency_symbol || '$';

  // Categorize products by inventory health
  const inStockProducts = products.filter(p => p.stock_quantity > p.low_stock_threshold);
  const lowStockProducts = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold);
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === 'in_stock') return p.stock_quantity > p.low_stock_threshold;
    if (filterStatus === 'low_stock') return p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
    if (filterStatus === 'out_of_stock') return p.stock_quantity === 0;
    return true;
  });

  const openRestock = (product: Product) => {
    setSelectedProduct(product);
    setAdjustAmount('10');
    setAdjustType('add');
    setRestockModalOpen(true);
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmitting(true);

    const amount = parseInt(adjustAmount) || 0;
    const newQuantity = adjustType === 'add' 
      ? Math.max(0, selectedProduct.stock_quantity + amount)
      : Math.max(0, amount);

    await updateProduct(selectedProduct.id, {
      stock_quantity: newQuantity,
    });

    setSubmitting(false);
    setRestockModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
          Inventory Health
        </h2>
        <p className="text-xs text-blush-200/70">
          Track real-time stock levels, low inventory warnings, and restock batches
        </p>
      </div>

      {/* 3 Overview Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card 
          variant="interactive" 
          onClick={() => setFilterStatus('in_stock')}
          className={`p-5 flex items-center justify-between ${filterStatus === 'in_stock' ? 'border-emerald-500/60 bg-emerald-950/20' : ''}`}
        >
          <div className="space-y-1">
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">In Stock & Healthy</span>
            <p className="text-2xl font-serif font-bold text-cream-50">{inStockProducts.length} Items</p>
            <p className="text-[11px] text-blush-300/60">Adequate inventory buffer</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        <Card 
          variant="interactive" 
          onClick={() => setFilterStatus('low_stock')}
          className={`p-5 flex items-center justify-between ${filterStatus === 'low_stock' ? 'border-amber-500/60 bg-amber-950/20' : ''}`}
        >
          <div className="space-y-1">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Low Stock Warning</span>
            <p className="text-2xl font-serif font-bold text-cream-50">{lowStockProducts.length} Items</p>
            <p className="text-[11px] text-blush-300/60">At or below warning threshold</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Card>

        <Card 
          variant="interactive" 
          onClick={() => setFilterStatus('out_of_stock')}
          className={`p-5 flex items-center justify-between ${filterStatus === 'out_of_stock' ? 'border-red-500/60 bg-red-950/20' : ''}`}
        >
          <div className="space-y-1">
            <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">Out of Stock</span>
            <p className="text-2xl font-serif font-bold text-cream-50">{outOfStockProducts.length} Items</p>
            <p className="text-[11px] text-blush-300/60">Cannot be sold right now</p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/20">
            <TrendingDown className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="subtle" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search inventory items..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-wine-700 text-white border border-blush-400/40'
                : 'bg-wine-950/40 text-blush-200/70 hover:bg-wine-900/60'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilterStatus('low_stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'low_stock'
                ? 'bg-amber-800 text-amber-200 border border-amber-500/40'
                : 'bg-wine-950/40 text-blush-200/70 hover:bg-wine-900/60'
            }`}
          >
            Low Stock ({lowStockProducts.length})
          </button>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card variant="default" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-wine-950/80 border-b border-wine-800/40 text-blush-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-5">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Current Stock</th>
                <th className="py-3.5 px-4 text-right">Low Threshold</th>
                <th className="py-3.5 px-4 text-right">Inventory Value</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-800/20 text-cream-100">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock_quantity === 0;
                const isLow = p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
                const totalAssetValue = p.stock_quantity * p.cost_price;

                return (
                  <tr key={p.id} className="hover:bg-wine-900/20 transition-colors">
                    <td className="py-4 px-5 font-semibold text-cream-50 flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-wine-900/60 flex items-center justify-center text-blush-300">
                          <Boxes className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span>{p.name}</span>
                        <p className="text-[10px] text-blush-300/60 font-normal">{p.sku || 'No SKU'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-blush-200/80">{p.category}</td>
                    <td className="py-4 px-4 text-center">
                      {isOutOfStock ? (
                        <Badge variant="amber" size="sm">Out of Stock</Badge>
                      ) : isLow ? (
                        <Badge variant="amber" size="sm">Low Stock</Badge>
                      ) : (
                        <Badge variant="emerald" size="sm">Healthy</Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-serif font-bold text-sm">
                      <span className={isOutOfStock ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-cream-50'}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-blush-300/70">{p.low_stock_threshold}</td>
                    <td className="py-4 px-4 text-right font-medium text-blush-200">
                      {currency}{totalAssetValue.toFixed(2)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openRestock(p)}
                        icon={<RefreshCw className="w-3.5 h-3.5" />}
                      >
                        Adjust / Restock
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restock Modal */}
      <Modal
        isOpen={restockModalOpen}
        onClose={() => setRestockModalOpen(false)}
        title={`Adjust Stock: ${selectedProduct?.name}`}
        subtitle={`Current stock in database: ${selectedProduct?.stock_quantity} units`}
        maxWidth="md"
      >
        <form onSubmit={handleAdjustStock} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAdjustType('add')}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                adjustType === 'add'
                  ? 'bg-wine-700 text-white border-blush-400'
                  : 'bg-wine-950/40 text-blush-200 border-wine-800/50'
              }`}
            >
              + Add Restock Shipment
            </button>
            <button
              type="button"
              onClick={() => setAdjustType('set')}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                adjustType === 'set'
                  ? 'bg-wine-700 text-white border-blush-400'
                  : 'bg-wine-950/40 text-blush-200 border-wine-800/50'
              }`}
            >
              Set Exact Count
            </button>
          </div>

          <Input
            label={adjustType === 'add' ? 'Units to Add to Stock' : 'New Total Stock Count'}
            type="number"
            value={adjustAmount}
            onChange={(e) => setAdjustAmount(e.target.value)}
            required
            autoFocus
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-wine-800/40">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setRestockModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              Confirm Stock Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
