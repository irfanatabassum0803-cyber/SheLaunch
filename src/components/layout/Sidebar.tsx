import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  Package, 
  Boxes, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Megaphone, 
  BarChart3, 
  Lightbulb, 
  ShieldCheck, 
  Bot, 
  ChevronRight,
  LogOut,
  X,
  Crown,
  LucideIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useBusiness } from '../../context/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  isAi?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const location = useLocation();
  const { currentBusiness, userBusinesses, selectBusiness } = useBusiness();
  const { user, isDemoUser, logout, loginDemo } = useAuth();

  const navSections: NavSection[] = [
    {
      title: 'HOME',
      items: [
        { label: 'Business Home', path: '/home', icon: Home },
      ]
    },
    {
      title: 'START',
      items: [
        { label: 'Business Setup', path: '/onboarding', icon: Sparkles },
        { label: 'Learn', path: '/learn', icon: BookOpen },
        { label: 'Pricing Helper', path: '/pricing-helper', icon: Calculator },
      ]
    },
    {
      title: 'RUN',
      items: [
        { label: 'Products', path: '/products', icon: Package },
        { label: 'Inventory', path: '/inventory', icon: Boxes },
        { label: 'Customers', path: '/customers', icon: Users },
        { label: 'Sales', path: '/sales', icon: ShoppingBag },
        { label: 'Finance', path: '/finance', icon: DollarSign },
        { label: 'Marketing', path: '/marketing', icon: Megaphone },
      ]
    },
    {
      title: 'GROW',
      items: [
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Insights', path: '/insights', icon: Lightbulb },
        { label: 'Command Centre', path: '/command-center', icon: ShieldCheck },
      ]
    },
    {
      title: 'AI ASSISTANT',
      items: [
        { label: 'SheLaunch Coach', path: '/coach', icon: Bot, isAi: true },
      ]
    }
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#18040B]/95 border-r border-wine-800/40 text-cream-100 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-wine-800/40 flex items-center justify-between">
        <NavLink to="/home" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-burgundy-700 via-wine-600 to-blush-500 flex items-center justify-center shadow-lg shadow-burgundy-950/60 border border-blush-300/30"
          >
            <span className="text-xl">✨</span>
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xl tracking-tight text-cream-50 group-hover:text-blush-200 transition-colors">
                SHELAUNCH
              </span>
            </div>
            <p className="text-[10px] uppercase font-semibold tracking-widest text-blush-300/70">
              Business OS
            </p>
          </div>
        </NavLink>

        {onCloseMobile && (
          <button 
            onClick={onCloseMobile} 
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-wine-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Business Switcher */}
      <div className="px-4 py-3 border-b border-wine-900/40 bg-burgundy-950/40">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blush-300/60">
            Active Workspace
          </span>
          {isDemoUser && (
            <Badge variant="gold" size="sm" icon={<Crown className="w-3 h-3" />}>
              Demo Mode
            </Badge>
          )}
        </div>

        <select
          value={currentBusiness?.id || ''}
          onChange={(e) => {
            if (e.target.value === 'NEW_BUSINESS') {
              window.location.href = '/onboarding';
            } else {
              selectBusiness(e.target.value);
            }
          }}
          className="w-full bg-[#270811] text-cream-50 text-xs font-medium rounded-xl border border-wine-700/60 py-2 px-2.5 focus:outline-none focus:border-blush-400 cursor-pointer transition-colors"
        >
          {userBusinesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} {b.is_demo ? '(Luxury Demo)' : ''}
            </option>
          ))}
          <option value="NEW_BUSINESS">+ Create New Business</option>
        </select>
      </div>

      {/* Navigation Links with Smooth Moving Indicator */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-blush-300/50">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className="relative block"
                  >
                    {/* Sliding Background Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="absolute inset-0 bg-gradient-to-r from-burgundy-800 to-wine-700 rounded-xl shadow-md shadow-burgundy-950/50 border border-blush-400/30"
                      />
                    )}

                    <div
                      className={`relative z-10 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors duration-200 group ${
                        isActive
                          ? 'text-white font-semibold'
                          : 'text-blush-200/80 hover:text-white hover:bg-wine-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: item.isAi ? 15 : 0 }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-blush-500/25 text-blush-100' 
                              : item.isAi 
                                ? 'bg-wine-800/60 text-blush-300 group-hover:bg-wine-700' 
                                : 'text-blush-300/70 group-hover:text-blush-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                        <span>{item.label}</span>
                      </div>

                      {item.isAi ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-blush-400 text-white shadow-xs animate-pulse">
                          AI
                        </span>
                      ) : isActive ? (
                        <ChevronRight className="w-3.5 h-3.5 text-blush-300/80" />
                      ) : null}
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / User Profile & Demo Switch */}
      <div className="p-4 border-t border-wine-800/40 bg-[#140308]/90">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-burgundy-600 to-blush-400 flex items-center justify-center text-xs font-bold text-white shrink-0 border border-blush-300/30">
              {user?.full_name?.charAt(0) || 'F'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-cream-50 truncate">
                {user?.full_name || 'Founder'}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">
                {user?.email || 'founder@shelaunch.app'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Log Out"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-300 hover:bg-wine-900/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {!isDemoUser && (
          <button
            onClick={() => {
              loginDemo();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full text-center text-[11px] font-medium py-1.5 px-2 rounded-lg bg-wine-900/40 hover:bg-wine-800/60 text-blush-200 border border-wine-700/40 transition-colors"
          >
            👑 Switch to Noor Jewels Demo
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={onCloseMobile} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
