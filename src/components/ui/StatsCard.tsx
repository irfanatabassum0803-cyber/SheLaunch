import React from 'react';
import { Card } from './Card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  trendLabel?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  trendLabel,
}) => {
  // Parse numeric values if currency or standard number
  const isNumeric = typeof value === 'number' || (typeof value === 'string' && /^[$\€\£\₹]?\s*[\d,]+(\.\d+)?$/.test(value));
  let prefix = '';
  let numericVal = 0;
  let decimals = 0;

  if (typeof value === 'number') {
    numericVal = value;
  } else if (typeof value === 'string') {
    const match = value.match(/^([$\€\£\₹]?)\s*([\d,]+(?:\.\d+)?)/);
    if (match) {
      prefix = match[1] || '';
      const rawNum = match[2].replace(/,/g, '');
      numericVal = parseFloat(rawNum) || 0;
      if (rawNum.includes('.')) {
        decimals = rawNum.split('.')[1].length;
      }
    }
  }

  return (
    <Card 
      variant="interactive" 
      className="relative overflow-hidden group hover:border-blush-400/40 transition-all duration-300"
    >
      {/* Dynamic ambient radial bloom on hover */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-wine-500/20 to-blush-400/10 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-80 transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-blush-200/70">
          {title}
        </span>
        <motion.div 
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="p-2.5 rounded-xl bg-gradient-to-br from-wine-900/70 to-burgundy-900/50 border border-blush-400/25 text-blush-300 group-hover:text-white group-hover:border-blush-400/50 transition-colors shadow-md"
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>

      <div className="flex items-baseline gap-2 relative z-10">
        <div className="text-2xl sm:text-3xl font-bold font-serif text-cream-50 tracking-tight">
          {isNumeric ? (
            <AnimatedCounter
              value={numericVal}
              prefix={prefix}
              decimals={decimals}
              duration={1200}
            />
          ) : (
            value
          )}
        </div>
        {change && (
          <motion.span 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${
              isPositive ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </motion.span>
        )}
      </div>

      {(subtitle || trendLabel) && (
        <p className="text-xs text-blush-200/60 mt-2.5 flex items-center justify-between relative z-10">
          <span>{subtitle}</span>
          {trendLabel && <span className="text-blush-300/80 font-medium">{trendLabel}</span>}
        </p>
      )}
    </Card>
  );
};
