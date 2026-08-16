import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp,
  Boxes,
  Image as ImageIcon
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const ProductsPage: React.FC = () => {
  const { currentBusiness, products, addProduct, updateProduct, deleteProduct } = useBusiness();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Jewellery');
  const [sellingPrice, setSellingPrice] = useState('0');
  const [costPrice, setCostPrice] = useState('0');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currency = currentBusiness?.currency_symbol || '$';

  // Categories list
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory(currentBusiness?.category || 'General');
    setSellingPrice('');
    setCostPrice('');
    setStockQuantity('10');
    setLowStockThreshold('5');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setSellingPrice(product.selling_price.toString());
    setCostPrice(product.cost_price.toString());
    setStockQuantity(product.stock_quantity.toString());
    setLowStockThreshold(product.low_stock_threshold.toString());
    setImageUrl(product.image_url || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const sPrice = parseFloat(sellingPrice) || 0;
    const cPrice = parseFloat(costPrice) || 0;
    const stock = parseInt(stockQuantity) || 0;
    const threshold = parseInt(lowStockThreshold) || 5;

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name,
          description,
          category,
          selling_price: sPrice,
          cost_price: cPrice,
          stock_quantity: stock,
          low_stock_threshold: threshold,
          image_url: imageUrl || undefined,
        });
      } else {
        await addProduct({
          name,
          description,
          category,
          selling_price: sPrice,
          cost_price: cPrice,
          stock_quantity: stock,
          low_stock_threshold: threshold,
          image_url: imageUrl || undefined,
          status: 'active',
        });
      }
      setSubmitting(false);
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  // Profit calculation preview in form
  const previewSelling = parseFloat(sellingPrice) || 0;
  const previewCost = parseFloat(costPrice) || 0;
  const previewProfit = previewSelling - previewCost;
  const previewMargin = previewSelling > 0 ? (previewProfit / previewSelling) * 100 : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
            Product Catalog
          </h2>
          <p className="text-xs text-blush-200/70">
            Manage your items, selling prices, production costs, and real-time inventory
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="subtle" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search products by name or keyword..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-blush-300/60 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-wine-700 text-white border border-blush-400/40'
                  : 'bg-wine-950/40 text-blush-200/70 hover:bg-wine-900/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card variant="default" className="text-center py-16 space-y-4">
          <Package className="w-12 h-12 text-blush-400/60 mx-auto" />
          <h4 className="text-lg font-serif font-bold text-cream-50">No products found</h4>
          <p className="text-xs text-blush-200/70 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try changing your search keywords or category filters.'
              : 'Add your first product to start tracking inventory, sales, and profits!'}
          </p>
          <Button size="md" variant="primary" onClick={openAddModal} icon={<Plus className="w-4 h-4" />}>
            Add Product
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const isLowStock = p.stock_quantity <= p.low_stock_threshold;
            const isOutOfStock = p.stock_quantity === 0;
            const unitProfit = p.selling_price - p.cost_price;
            const margin = p.selling_price > 0 ? (unitProfit / p.selling_price) * 100 : 0;

            return (
              <Card key={p.id} variant="default" className="flex flex-col justify-between overflow-hidden p-5 group">
                <div>
                  {/* Product Image / Placeholder */}
                  <div className="w-full h-44 rounded-xl bg-gradient-to-tr from-burgundy-950 to-wine-900/60 mb-4 overflow-hidden relative border border-wine-800/40">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-blush-400/40">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[10px]">No Photo Added</span>
                      </div>
                    )}

                    {/* Stock Status Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isOutOfStock ? (
                        <Badge variant="amber" size="sm" icon={<AlertTriangle className="w-3 h-3 text-red-400" />}>
                          Out of Stock
                        </Badge>
                      ) : isLowStock ? (
                        <Badge variant="amber" size="sm" icon={<AlertTriangle className="w-3 h-3 text-amber-400" />}>
                          Low Stock: {p.stock_quantity} left
                        </Badge>
                      ) : (
                        <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                          {p.stock_quantity} in stock
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5">
                      <Badge variant="wine" size="sm">
                        {p.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5">
                    <h3 className="font-serif font-bold text-base text-cream-50 line-clamp-1 group-hover:text-blush-200 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-blush-200/70 line-clamp-2 leading-relaxed">
                      {p.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-2 my-4 p-2.5 rounded-xl bg-wine-950/60 border border-wine-800/50 text-center">
                    <div>
                      <span className="text-[10px] uppercase text-blush-300/60">Retail Price</span>
                      <p className="font-serif font-bold text-sm text-cream-50 mt-0.5">
                        {currency}{p.selling_price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-blush-300/60">Unit Cost</span>
                      <p className="font-serif font-bold text-sm text-blush-200 mt-0.5">
                        {currency}{p.cost_price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-blush-300/60">Profit</span>
                      <p className="font-serif font-bold text-sm text-emerald-400 mt-0.5">
                        +{currency}{unitProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls & Units Sold */}
                <div className="pt-3 border-t border-wine-800/40 flex items-center justify-between text-xs">
                  <span className="text-blush-300/80 font-medium">
                    🔥 {p.units_sold} sold
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(p)}
                      title="Edit Product"
                      className="p-1.5 rounded-lg text-blush-200 hover:text-white hover:bg-wine-900/60 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      title="Delete Product"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-300 hover:bg-wine-900/60 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        subtitle="Catalog your creation with price, unit cost, and stock count"
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Product Name *"
            placeholder="e.g. Aura Freshwater Baroque Pearl Earrings"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe craftsmanship, materials, dimensions, and inspiration..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#18040B]/80 border border-burgundy-700/60 rounded-xl p-3 text-sm text-cream-50 placeholder:text-zinc-500 focus:border-blush-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Category"
              placeholder="e.g. Earrings, Necklaces, Candles"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <Input
              label="Image URL (Optional)"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`Selling / Retail Price (${currency}) *`}
              type="number"
              step="0.01"
              placeholder="135.00"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />

            <Input
              label={`Cost to Make / Acquire (${currency}) *`}
              type="number"
              step="0.01"
              placeholder="38.00"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              required
            />
          </div>

          {/* Real-time Profit Preview Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-burgundy-950 to-wine-900/50 border border-blush-400/20 flex items-center justify-between text-xs">
            <div>
              <span className="text-blush-300/70">Profit per Unit:</span>
              <p className="font-serif font-bold text-base text-emerald-400">
                +{currency}{previewProfit.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-blush-300/70">Profit Margin:</span>
              <p className="font-serif font-bold text-base text-gold-300">
                {previewMargin.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Starting Stock Quantity *"
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />

            <Input
              label="Low Stock Warning Threshold *"
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              required
            />
          </div>

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
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
