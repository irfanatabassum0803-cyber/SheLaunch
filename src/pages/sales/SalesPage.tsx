import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  UserPlus, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBusiness } from '../../context/BusinessContext';
import { Product, Customer, Order } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const SalesPage: React.FC = () => {
  const { currentBusiness, products, customers, orders, recordSale } = useBusiness();

  // Sale POS Cart state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [walkinName, setWalkinName] = useState<string>('');
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<Order['payment_method']>('Card');
  const [discount, setDiscount] = useState<string>('0');
  const [tax, setTax] = useState<string>('0');
  const [notes, setNotes] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  const currency = currentBusiness?.currency_symbol || '$';

  // Cart calculations
  let subtotal = 0;
  let totalCost = 0;

  const resolvedCart = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    const price = product?.selling_price || 0;
    const cost = product?.cost_price || 0;
    const lineSubtotal = price * item.quantity;
    const lineCost = cost * item.quantity;
    subtotal += lineSubtotal;
    totalCost += lineCost;
    return {
      ...item,
      product,
      lineSubtotal,
      lineCost,
      lineProfit: lineSubtotal - lineCost,
    };
  });

  const parsedDiscount = parseFloat(discount) || 0;
  const parsedTax = parseFloat(tax) || 0;
  const totalAmount = Math.max(0, subtotal - parsedDiscount + parsedTax);
  const netProfit = (subtotal - totalCost) - parsedDiscount;
  const profitMargin = totalAmount > 0 ? (netProfit / totalAmount) * 100 : 0;

  const addToCart = (product: Product) => {
    const existing = cartItems.find(i => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock_quantity) {
        alert(`Only ${product.stock_quantity} unit(s) available in stock.`);
        return;
      }
      setCartItems(prev => prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      if (product.stock_quantity <= 0) {
        alert('This product is out of stock.');
        return;
      }
      setCartItems(prev => [...prev, { productId: product.id, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    setCartItems(prev => {
      return prev.map(i => {
        if (i.productId === productId) {
          const newQty = i.quantity + delta;
          if (product && newQty > product.stock_quantity) {
            alert(`Only ${product.stock_quantity} unit(s) in stock.`);
            return i;
          }
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean) as { productId: string; quantity: number }[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };

  const handleCompleteSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Please add at least one product to the sale cart.');
      return;
    }

    setRecording(true);
    try {
      const order = await recordSale({
        customerId: selectedCustomerId || undefined,
        customerName: selectedCustomerId 
          ? customers.find(c => c.id === selectedCustomerId)?.name 
          : (walkinName || 'Walk-in Client'),
        items: cartItems,
        paymentMethod,
        discount: parsedDiscount,
        tax: parsedTax,
        notes: notes || undefined,
      });

      // Confetti burst for sale victory
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#AC3353', '#FFA3B8', '#D7B447', '#10B981']
      });

      setSuccessOrder(order);
      // Reset POS cart
      setCartItems([]);
      setSelectedCustomerId('');
      setWalkinName('');
      setDiscount('0');
      setTax('0');
      setNotes('');
      setRecording(false);
    } catch (e) {
      console.error('Failed to record sale:', e);
      alert('Sale failed. Please try again.');
      setRecording(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
          Sales & Point of Sale (POS)
        </h2>
        <p className="text-xs text-blush-200/70">
          Record customer transactions with atomic inventory deductions and instant profit calculation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Product Catalog Picker (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="subtle" className="p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-blush-200 uppercase tracking-wider">
              1. Tap Products to Add to Sale
            </span>
            <span className="text-xs text-blush-300/70">
              {products.length} Products Available
            </span>
          </Card>

          {products.length === 0 ? (
            <Card variant="default" className="text-center py-12 space-y-3">
              <ShoppingBag className="w-10 h-10 text-blush-400/60 mx-auto" />
              <p className="text-xs text-blush-200/80">No products available in your catalog yet.</p>
              <Button size="sm" variant="primary" onClick={() => window.location.href = '/products'}>
                Add Products First
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {products.map((p) => {
                const inCart = cartItems.find(i => i.productId === p.id);
                const isOutOfStock = p.stock_quantity <= 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      inCart
                        ? 'bg-burgundy-950/90 border-blush-400/60 shadow-lg shadow-burgundy-950/60'
                        : isOutOfStock
                          ? 'opacity-40 cursor-not-allowed bg-wine-950/20 border-wine-900/40'
                          : 'bg-wine-950/40 border-wine-800/60 hover:bg-wine-900/60 hover:border-blush-400/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <Badge variant="wine" size="sm">{p.category}</Badge>
                        <span className={`text-[11px] font-semibold ${isOutOfStock ? 'text-red-400' : p.stock_quantity <= p.low_stock_threshold ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {p.stock_quantity} left
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-xs text-cream-50 line-clamp-1">{p.name}</h4>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-wine-800/40">
                      <span className="font-serif font-bold text-sm text-cream-50">
                        {currency}{p.selling_price.toFixed(2)}
                      </span>
                      {inCart ? (
                        <span className="text-xs font-bold text-blush-300 bg-blush-500/20 px-2 py-0.5 rounded-md">
                          {inCart.quantity} in cart
                        </span>
                      ) : (
                        <span className="text-[11px] text-blush-300/80 font-medium">
                          + Tap to Add
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Transaction Register / Checkout (5 cols) */}
        <div className="lg:col-span-5">
          <Card variant="highlight" className="p-6 space-y-6 shadow-2xl border-blush-400/30">
            <div className="flex items-center justify-between border-b border-wine-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif font-bold text-lg text-cream-50">Sale Register</h3>
              </div>
              <Badge variant="emerald" size="sm">Live POS</Badge>
            </div>

            <form onSubmit={handleCompleteSale} className="space-y-4">
              {/* Select Customer */}
              <div>
                <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-1.5">
                  Select Customer / Client
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-[#18040B]/80 text-cream-50 text-xs rounded-xl border border-burgundy-700/60 py-2.5 px-3 focus:outline-none focus:border-blush-400"
                >
                  <option value="">-- Walk-in / Non-Registered Client --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.total_orders} past orders)
                    </option>
                  ))}
                </select>
              </div>

              {!selectedCustomerId && (
                <Input
                  label="Walk-in Client Name (Optional)"
                  placeholder="e.g. Maya Lin"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                />
              )}

              {/* Cart Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-blush-200/90 uppercase tracking-wider">
                  <span>Selected Items ({cartItems.length})</span>
                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCartItems([])}
                      className="text-[10px] text-zinc-400 hover:text-red-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {resolvedCart.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-wine-950/40 border border-wine-800/40 text-xs text-blush-300/60">
                    Cart is empty. Select products from the left to begin.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {resolvedCart.map((item) => (
                      <div
                        key={item.productId}
                        className="p-2.5 rounded-xl bg-wine-950/60 border border-wine-800/40 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-cream-50 truncate">{item.product?.name}</p>
                          <p className="text-[10px] text-blush-300/70">
                            {currency}{item.product?.selling_price.toFixed(2)} ea • Profit: +{currency}{item.lineProfit.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-wine-900/80 rounded-lg p-0.5 border border-wine-700/60">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="p-1 hover:text-white text-blush-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold px-1.5 text-xs text-cream-50">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="p-1 hover:text-white text-blush-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1 text-zinc-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Card', 'Cash', 'Stripe'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        paymentMethod === method
                          ? 'bg-wine-800 text-white border-blush-400'
                          : 'bg-wine-950/40 text-blush-200 border-wine-800/50 hover:bg-wine-900/50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discounts & Adjustments */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Input
                  label={`Discount (${currency})`}
                  type="number"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
                <Input
                  label={`Tax / Fee (${currency})`}
                  type="number"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>

              {/* Financial Calculation Summary Box */}
              <div className="p-4 rounded-2xl bg-black/40 border border-blush-400/20 space-y-2 text-xs">
                <div className="flex items-center justify-between text-blush-200/70">
                  <span>Gross Subtotal:</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                {parsedDiscount > 0 && (
                  <div className="flex items-center justify-between text-amber-400">
                    <span>Discount Applied:</span>
                    <span>-{currency}{parsedDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-wine-800/40 text-base font-serif font-bold text-cream-50">
                  <span>Total Amount Paid:</span>
                  <span className="text-white text-lg">{currency}{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-emerald-400 font-semibold">Net Profit from this Sale:</span>
                  <span className="text-emerald-400 font-bold">
                    +{currency}{netProfit.toFixed(2)} ({profitMargin.toFixed(1)}% margin)
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={recording}
                disabled={cartItems.length === 0}
                className="w-full"
                icon={<CheckCircle2 className="w-5 h-5" />}
              >
                Complete & Record Transaction
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Sale Confirmation Modal */}
      <Modal
        isOpen={Boolean(successOrder)}
        onClose={() => setSuccessOrder(null)}
        title="Transaction Completed Successfully! ✨"
        subtitle={`Order #${successOrder?.order_number} has been recorded into the database.`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 space-y-1.5">
            <p className="font-bold text-sm">✅ Automatic Database Synchronization:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-emerald-300/90">
              <li>Inventory deducted accurately for all sold items</li>
              <li>Product units sold incremented</li>
              <li>Customer lifetime spend and purchase date updated</li>
              <li>Revenue, COGS, and profit reflected in real-time P&L</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-wine-950/60 border border-wine-800/40 space-y-1">
            <div className="flex justify-between font-semibold text-cream-50">
              <span>Customer:</span>
              <span>{successOrder?.customer_name}</span>
            </div>
            <div className="flex justify-between font-semibold text-cream-50">
              <span>Total Paid:</span>
              <span>{currency}{successOrder?.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-400">
              <span>Net Profit:</span>
              <span>+{currency}{successOrder?.total_profit.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              size="md"
              variant="primary"
              onClick={() => setSuccessOrder(null)}
            >
              Done / Ready for Next Sale
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
