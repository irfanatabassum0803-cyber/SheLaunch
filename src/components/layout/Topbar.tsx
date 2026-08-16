import React from 'react';
import { Menu, Plus, Bot, Sparkles, RefreshCw, ShoppingBag } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu, title, subtitle }) => {
  const { isDemoUser } = useAuth();
  const { currentBusiness, resetToDemo } = useBusiness();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-[#1F060E]/80 backdrop-blur-md border-b border-wine-800/30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-blush-200 hover:text-white hover:bg-wine-900/60 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          {title && (
            <h1 className="text-lg sm:text-xl font-serif font-bold text-cream-50 truncate tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-blush-200/70 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isDemoUser && (
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="gold" size="sm" icon={<Sparkles className="w-3 h-3 text-gold-400" />}>
              Noor Jewels Demo
            </Badge>
            <button
              onClick={() => resetToDemo()}
              title="Reset demo data to initial state"
              className="text-xs text-blush-300/80 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-wine-950/60 hover:bg-wine-900/80 border border-wine-700/40 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/coach')}
          icon={<Bot className="w-3.5 h-3.5 text-blush-300" />}
          className="hidden sm:inline-flex border-blush-400/30 text-blush-100 hover:bg-wine-900/50"
        >
          AI Coach
        </Button>

        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate('/sales')}
          icon={<ShoppingBag className="w-3.5 h-3.5" />}
        >
          Record Sale
        </Button>
      </div>
    </header>
  );
};
