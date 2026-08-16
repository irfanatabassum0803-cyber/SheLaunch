import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  Trash2, 
  Instagram, 
  MessageSquare, 
  FileText, 
  Send, 
  Flame, 
  Bot 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusiness } from '../../context/BusinessContext';
import { generateMarketingContent } from '../../lib/gemini';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { AIOrientedLoader } from '../../components/ui/AIOrientedLoader';

const contentTypeOptions = [
  { id: 'instagram_caption', label: 'Instagram Caption', icon: Instagram, desc: 'Editorial hooks, story, bullets & hashtags' },
  { id: 'whatsapp_copy', label: 'WhatsApp VIP Broadcast', icon: MessageSquare, desc: 'Warm, personal priority announcements' },
  { id: 'product_description', label: 'Luxury Product Description', icon: FileText, desc: 'Heirloom storytelling & care instructions' },
  { id: 'campaign_pitch', label: 'Campaign Concept & Strategy', icon: Flame, desc: 'Angles, positioning, and content hooks' },
];

export const MarketingStudioPage: React.FC = () => {
  const { currentBusiness, products, customers, orders, financials, marketingList, saveMarketingItem, deleteMarketingItem } = useBusiness();

  const [contentType, setContentType] = useState('instagram_caption');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState(currentBusiness?.target_audience || '');
  const [tone, setTone] = useState('Warm, elegant, confident, premium');
  const [keyFeatures, setKeyFeatures] = useState('');

  const [generatedOutput, setGeneratedOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-fill when selecting an existing product
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) {
      setProductName('');
      setKeyFeatures('');
      return;
    }
    const product = products.find(p => p.id === prodId);
    if (product) {
      setProductName(product.name);
      setKeyFeatures(product.description || `Handcrafted ${product.category} selling for $${product.selling_price}`);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedOutput('');
    setSavedSuccess(false);

    try {
      const output = await generateMarketingContent(
        contentType,
        productName,
        targetAudience,
        tone,
        keyFeatures,
        {
          business: currentBusiness,
          products,
          customers,
          orders,
          expenses: [],
          financials: {
            revenue: financials.total_revenue,
            costOfGoods: financials.total_cost_of_goods,
            expenses: financials.total_expenses,
            profit: financials.net_profit,
            margin: financials.profit_margin_percentage,
          }
        }
      );

      setGeneratedOutput(output);
      setGenerating(false);
    } catch (e) {
      console.error(e);
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveItem = async () => {
    if (!generatedOutput) return;
    await saveMarketingItem({
      type: contentType as any,
      title: `${productName || 'Signature'} (${contentTypeOptions.find(c => c.id === contentType)?.label})`,
      prompt: `Product: ${productName}, Tone: ${tone}`,
      content: generatedOutput,
      target_channel: contentType === 'instagram_caption' ? 'Instagram' : contentType === 'whatsapp_copy' ? 'WhatsApp' : 'Store',
      is_saved: true,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
          AI Marketing Studio
        </h2>
        <p className="text-xs text-blush-200/70">
          Generate captivating, high-converting copy in seconds with Google Gemini AI tuned for your brand
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Generator Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="default" className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif font-bold text-base text-cream-50">Content Generator</h3>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Content Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-2">
                  What would you like to create?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = contentType === opt.id;
                    return (
                      <motion.button
                        key={opt.id}
                        type="button"
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setContentType(opt.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-wine-800 text-white border-blush-400 shadow-md'
                            : 'bg-wine-950/40 text-blush-200 border-wine-800/50 hover:bg-wine-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3.5 h-3.5 text-blush-300" />
                          <span className="truncate">{opt.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Select Existing Product */}
              {products.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-1.5">
                    Autofill from Product Catalog (Optional)
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full bg-[#18040B]/80 text-cream-50 text-xs rounded-xl border border-burgundy-700/60 py-2.5 px-3 focus:outline-none focus:border-blush-400"
                  >
                    <option value="">-- Or enter custom topic manually --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                    ))}
                  </select>
                </div>
              )}

              <Input
                label="Product or Topic Name *"
                placeholder="e.g. Aura Baroque Pearl Earrings"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />

              <Input
                label="Target Audience"
                placeholder="e.g. Modern brides, jewelry collectors"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />

              <Input
                label="Brand Tone & Voice"
                placeholder="e.g. Warm, elegant, confident, poetic"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-1.5">
                  Key Craftsmanship Details & Features
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 18k gold vermeil, natural baroque pearls, hypoallergenic, limited edition..."
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  className="w-full bg-[#18040B]/80 border border-burgundy-700/60 rounded-xl p-3 text-xs text-cream-50 placeholder:text-zinc-500 focus:border-blush-400 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={generating}
                className="w-full shadow-xl shadow-wine-700/40"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Generate with Gemini AI
              </Button>
            </form>
          </Card>
        </div>

        {/* Output & Saved Library (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Output Card */}
          <Card variant="highlight" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-wine-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-rose-400" />
                <h3 className="font-serif font-bold text-base text-cream-50">Generated Content</h3>
              </div>

              {generatedOutput && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSaveItem}
                    icon={<Bookmark className="w-3.5 h-3.5 text-blush-300" />}
                  >
                    {savedSuccess ? 'Saved! ✨' : 'Save to Library'}
                  </Button>
                </div>
              )}
            </div>

            {generating ? (
              <AIOrientedLoader
                label="Gemini AI is crafting your luxury copy..."
                sublabel="Infusing brand tone, storytelling hooks, and conversion strategy"
              />
            ) : generatedOutput ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-2xl bg-black/40 border border-blush-400/20 text-xs text-cream-50 leading-relaxed whitespace-pre-wrap font-sans max-h-[420px] overflow-y-auto shadow-inner"
              >
                {generatedOutput}
              </motion.div>
            ) : (
              <div className="text-center py-16 space-y-3 bg-wine-950/30 rounded-2xl border border-wine-800/30">
                <Sparkles className="w-8 h-8 text-blush-400/50 mx-auto" />
                <p className="text-xs text-blush-200/70 max-w-sm mx-auto">
                  Select your content type on the left, pick a product, and click &ldquo;Generate with Gemini AI&rdquo; to produce custom marketing copy.
                </p>
              </div>
            )}
          </Card>

          {/* Saved Marketing Snippets Library */}
          <Card variant="default" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-cream-50">Saved Marketing Copy</h4>
              <span className="text-xs text-blush-300/70">{marketingList.length} Saved</span>
            </div>

            {marketingList.length === 0 ? (
              <p className="text-xs text-blush-200/60 py-4 text-center">
                No saved copy yet. Save your favorite generated captions above!
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {marketingList.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-wine-950/60 border border-wine-800/40 space-y-2 text-xs hover:border-blush-400/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cream-50">{item.title}</span>
                        <Badge variant="wine" size="sm">{item.target_channel || 'Social'}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            navigator.clipboard.writeText(item.content);
                            alert('Copied to clipboard!');
                          }}
                          className="p-1 text-blush-200 hover:text-white"
                          title="Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteMarketingItem(item.id)}
                          className="p-1 text-zinc-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>

                    <p className="text-blush-200/80 line-clamp-3 leading-relaxed whitespace-pre-wrap bg-black/20 p-2.5 rounded-lg">
                      {item.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
