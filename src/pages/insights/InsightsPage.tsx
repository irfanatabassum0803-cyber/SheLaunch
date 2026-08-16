import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Crown,
  Bot,
  Zap,
  Target
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentBusiness, insights, products, customers, orders, financials } = useBusiness();

  const currency = currentBusiness?.currency_symbol || '$';

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
              AI Actionable Insights
            </h2>
            <Badge variant="gold" size="sm" icon={<Sparkles className="w-3 h-3 text-gold-400" />}>
              Real-Time Diagnostics
            </Badge>
          </div>
          <p className="text-xs text-blush-200/70">
            Intelligent recommendations derived from your live product inventory, customer patterns, and margins
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/coach')}
          icon={<Bot className="w-3.5 h-3.5" />}
        >
          Consult AI Coach
        </Button>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {insights.length === 0 ? (
          <Card variant="default" className="text-center py-16 space-y-4">
            <Lightbulb className="w-12 h-12 text-blush-400/60 mx-auto" />
            <h4 className="text-lg font-serif font-bold text-cream-50">No insights yet</h4>
            <p className="text-xs text-blush-200/70 max-w-md mx-auto">
              Add more products and record your sales to let the diagnostic engine find revenue growth opportunities for your store.
            </p>
          </Card>
        ) : (
          insights.map((item) => {
            const isWarning = item.type === 'warning';
            const isSuccess = item.type === 'success';

            return (
              <Card
                key={item.id}
                variant={isWarning ? 'highlight' : 'default'}
                className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all ${
                  isWarning ? 'border-amber-500/40 bg-gradient-to-r from-burgundy-950 to-amber-950/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                    isWarning 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : isSuccess 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-blush-500/20 text-blush-300 border border-blush-400/30'
                  }`}>
                    {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-cream-50">
                        {item.title}
                      </h3>
                      {item.metric && (
                        <Badge variant={isWarning ? 'amber' : 'emerald'} size="sm">
                          {item.metric}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-blush-200/80 leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                {item.action_label && item.action_route && (
                  <div className="shrink-0 pt-2 sm:pt-0">
                    <Button
                      size="sm"
                      variant={isWarning ? 'primary' : 'outline'}
                      onClick={() => navigate(item.action_route!)}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {item.action_label}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Strategic Growth Levers Matrix */}
      <Card variant="subtle" className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif font-bold text-base text-cream-50">Foundational Growth Levers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-wine-950/60 border border-wine-800/40 space-y-2">
            <span className="font-bold text-cream-50 flex items-center gap-1.5">
              💎 1. High Margin Focus
            </span>
            <p className="text-blush-200/70 leading-relaxed">
              Prioritize promoting products where profit margin exceeds 60%. This generates cash reserves without extra operational burden.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-wine-950/60 border border-wine-800/40 space-y-2">
            <span className="font-bold text-cream-50 flex items-center gap-1.5">
              🌸 2. VIP Retention
            </span>
            <p className="text-blush-200/70 leading-relaxed">
              Repeat buyers spend 3x more on average. Send personalized thank you notes or early previews to your top registered clients.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-wine-950/60 border border-wine-800/40 space-y-2">
            <span className="font-bold text-cream-50 flex items-center gap-1.5">
              📦 3. Zero Stockouts
            </span>
            <p className="text-blush-200/70 leading-relaxed">
              Keep low-stock warning thresholds tuned so you re-order supplies at least 10 days before running out.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
