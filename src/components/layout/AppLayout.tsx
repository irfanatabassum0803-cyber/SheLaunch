import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AmbientCanvasBackground } from '../background/AmbientCanvasBackground';
import { motion, AnimatePresence } from 'framer-motion';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/home': { title: 'Business Home', subtitle: 'Your day-to-day business cockpit and next best actions' },
  '/onboarding': { title: 'Business Setup', subtitle: 'Step-by-step guidance for setting up your foundation' },
  '/learn': { title: 'Learning Hub', subtitle: 'Bite-sized business mastery tailored for women entrepreneurs' },
  '/pricing-helper': { title: 'Pricing & Margin Helper', subtitle: 'Calculate profitable retail prices with healthy margins' },
  '/products': { title: 'Product Catalog', subtitle: 'Manage your items, costs, selling prices, and stock' },
  '/inventory': { title: 'Inventory Health', subtitle: 'Stock monitoring, low-stock warnings, and reorder alerts' },
  '/customers': { title: 'Customer CRM', subtitle: 'Track client relationships, order frequency, and lifetime value' },
  '/sales': { title: 'Sales & POS Recorder', subtitle: 'Record transactions, update stock, and track profits instantly' },
  '/finance': { title: 'Finance & P&L', subtitle: 'Track revenue, operating expenses, cost of goods, and net profit' },
  '/marketing': { title: 'AI Marketing Studio', subtitle: 'Generate high-converting captions, product pitches, and campaigns' },
  '/analytics': { title: 'Business Analytics', subtitle: 'Visual charts and performance trends derived from real records' },
  '/insights': { title: 'AI Actionable Insights', subtitle: 'Real-time diagnosis of inventory health, margins, and top sellers' },
  '/command-center': { title: 'Command Centre', subtitle: 'Advanced executive telemetry for growing operations' },
  '/coach': { title: 'SheLaunch AI Business Coach', subtitle: 'Your personal 24/7 AI mentor grounded in your real business numbers' },
};

export const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentMeta = pageMeta[location.pathname] || {
    title: 'SheLaunch',
    subtitle: 'Beginner-First Business OS for Women Entrepreneurs',
  };

  return (
    <div className="min-h-screen bg-[#1F060E] text-[#FAF7F2] relative flex flex-col selection:bg-wine-600 selection:text-white">
      {/* Subtle ambient light mesh for app screens */}
      <AmbientCanvasBackground variant="subtle" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <Topbar 
            onOpenMobileMenu={() => setMobileOpen(true)}
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
