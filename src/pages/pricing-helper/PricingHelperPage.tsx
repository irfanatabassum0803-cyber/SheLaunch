import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Package,
  Layers,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useBusiness } from '../../context/BusinessContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';

export const PricingHelperPage: React.FC = () => {
  const { currentBusiness } = useBusiness();
  const currency = currentBusiness?.currency_symbol || '$';

  // Cost inputs
  const [productName, setProductName] = useState('Freshwater Pearl Bracelet');
  const [materialCost, setMaterialCost] = useState('24.00');
  const [packagingCost, setPackagingCost] = useState('6.00');
  const [laborCost, setLaborCost] = useState('15.00');
  const [overheadCost, setOverheadCost] = useState('3.00');
  const [targetMargin, setTargetMargin] = useState(65); // 65% target margin

  // Calculations
  const mat = parseFloat(materialCost) || 0;
  const pack = parseFloat(packagingCost) || 0;
  const labor = parseFloat(laborCost) || 0;
  const overhead = parseFloat(overheadCost) || 0;

  const totalCost = mat + pack + labor + overhead;
  const marginDecimal = targetMargin / 100;
  
  // Selling Price = Total Cost / (1 - Margin)
  const suggestedPrice = marginDecimal < 1 ? totalCost / (1 - marginDecimal) : totalCost * 2;
  const netProfitPerUnit = suggestedPrice - totalCost;
  const markupMultiplier = totalCost > 0 ? (suggestedPrice / totalCost).toFixed(1) : '1.0';

  // Breakeven scenarios
  const salesToMake1000 = netProfitPerUnit > 0 ? Math.ceil(1000 / netProfitPerUnit) : 0;
  const salesToMake5000 = netProfitPerUnit > 0 ? Math.ceil(5000 / netProfitPerUnit) : 0;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
            Pricing & Margin Helper
          </h2>
          <Badge variant="gold" size="sm" icon={<Calculator className="w-3 h-3 text-gold-400" />}>
            Profit Protection
          </Badge>
        </div>
        <p className="text-xs text-blush-200/70">
          Price with pride and sustainability. Ensure every sale rewards your craftsmanship and time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cost Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card variant="default" className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blush-400" />
              <h3 className="font-serif font-bold text-base text-cream-50">Production Cost Factors</h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Item or Collection Name"
                placeholder="e.g. Signature Ceramic Mug, Silk Scarf"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={`Raw Materials Cost (${currency})`}
                  type="number"
                  step="0.01"
                  placeholder="24.00"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(e.target.value)}
                  helperText="Pearls, fabrics, ingredients, metals"
                />

                <Input
                  label={`Packaging & Ribbons (${currency})`}
                  type="number"
                  step="0.01"
                  placeholder="6.00"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(e.target.value)}
                  helperText="Boxes, pouches, stickers, thank you cards"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={`Your Time / Labor Cost (${currency})`}
                  type="number"
                  step="0.01"
                  placeholder="15.00"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  helperText="Pay yourself an hourly artisan wage!"
                />

                <Input
                  label={`Overhead / Platform Fee (${currency})`}
                  type="number"
                  step="0.01"
                  placeholder="3.00"
                  value={overheadCost}
                  onChange={(e) => setOverheadCost(e.target.value)}
                  helperText="Card processing, studio electricity"
                />
              </div>

              {/* Target Margin Slider with Live Glow */}
              <div className="pt-2 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-blush-200/90 uppercase tracking-wider">
                    Desired Net Profit Margin:
                  </span>
                  <motion.span 
                    key={targetMargin}
                    initial={{ scale: 1.2, color: '#D7B447' }}
                    animate={{ scale: 1, color: '#FAF0D4' }}
                    className="font-serif font-bold text-lg text-gold-300"
                  >
                    {targetMargin}%
                  </motion.span>
                </div>

                <input
                  type="range"
                  min="40"
                  max="85"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-wine-950 rounded-lg appearance-none cursor-pointer accent-blush-400 shadow-inner"
                />

                <div className="flex justify-between text-[10px] text-blush-300/60 font-medium">
                  <span>40% (Minimum)</span>
                  <span className="text-blush-200">65% (Recommended)</span>
                  <span>85% (Ultra-Luxury)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Pricing Results & Analysis (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card variant="highlight" className="p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Background dynamic light glow on calculation update */}
            <motion.div 
              key={suggestedPrice}
              initial={{ opacity: 0.8, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className="absolute -top-12 -right-12 w-48 h-48 bg-gold-400 rounded-full blur-3xl pointer-events-none"
            />

            <div className="flex items-center justify-between border-b border-wine-800/40 pb-3 relative z-10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400">
                  Recommended Retail Target
                </span>
                <h3 className="font-serif font-bold text-3xl sm:text-4xl text-cream-50 mt-1 tracking-tight">
                  <AnimatedCounter
                    value={suggestedPrice}
                    prefix={currency}
                    decimals={2}
                    duration={400}
                  />
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-blush-300/70">Markup Multiplier</span>
                <p className="font-serif font-bold text-lg text-emerald-400 mt-0.5">
                  {markupMultiplier}x Cost
                </p>
              </div>
            </div>

            {/* Financial Breakdown Equation */}
            <div className="space-y-2.5 text-xs relative z-10">
              <div className="flex justify-between text-blush-200/80">
                <span>Total Production & Labor Cost:</span>
                <span className="font-medium text-cream-100">
                  <AnimatedCounter value={totalCost} prefix={currency} decimals={2} duration={300} />
                </span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-wine-800/40 text-sm">
                <span>Estimated Net Profit per Sale:</span>
                <span>
                  +<AnimatedCounter value={netProfitPerUnit} prefix={currency} decimals={2} duration={300} /> ({targetMargin}%)
                </span>
              </div>
            </div>

            {/* Breakeven Milestone Calculator */}
            <div className="p-4 rounded-2xl bg-black/40 border border-blush-400/20 space-y-3 text-xs relative z-10 shadow-inner">
              <span className="font-bold text-cream-50 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Income Milestones:
              </span>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-wine-950/80 border border-wine-800/50">
                  <span className="text-[10px] uppercase text-blush-300/70">To Earn $1,000 Profit:</span>
                  <p className="font-serif font-bold text-base text-cream-50 mt-0.5">
                    <AnimatedCounter value={salesToMake1000} suffix=" Sales" duration={300} />
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-wine-950/80 border border-wine-800/50">
                  <span className="text-[10px] uppercase text-blush-300/70">To Earn $5,000 Profit:</span>
                  <p className="font-serif font-bold text-base text-gold-300 mt-0.5">
                    <AnimatedCounter value={salesToMake5000} suffix=" Sales" duration={300} />
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Pricing Psychology Note */}
            <div className="p-3.5 rounded-xl bg-wine-950/60 border border-wine-800/40 text-xs text-blush-200 space-y-1 relative z-10">
              <span className="font-semibold text-cream-50">💡 Why Higher Pricing Works:</span>
              <p className="text-[11px] text-blush-300/80 leading-relaxed">
                When you price with healthy margins, you only need {salesToMake1000} orders to make $1,000 in pure profit. Underpricing forces you into exhausting high-volume production without breathing room.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
