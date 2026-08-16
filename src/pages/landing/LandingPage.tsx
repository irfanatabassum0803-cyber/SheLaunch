import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  ShoppingBag, 
  BarChart3, 
  Package, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Crown,
  Heart,
  TrendingUp,
  DollarSign,
  Compass,
  Star,
  Activity
} from 'lucide-react';
import { AmbientCanvasBackground } from '../../components/background/AmbientCanvasBackground';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();
  const { scrollY } = useScroll();

  // Gentle Parallax for Hero Elements
  const heroY = useTransform(scrollY, [0, 400], [0, -40]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  const handleExploreDemo = () => {
    loginDemo();
    navigate('/home');
  };

  const handleStartBuilding = () => {
    navigate('/auth?mode=signup');
  };

  // Staggered Container Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  const sectionViewport = { once: true, amount: 0.25 };

  return (
    <div className="relative min-h-screen bg-[#1F060E] text-[#FAF7F2] overflow-x-hidden selection:bg-wine-600 selection:text-white">
      {/* Dynamic Animated Canvas Background with Floating Light Blooms */}
      <AmbientCanvasBackground variant="cinematic" />

      {/* Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-burgundy-700 via-wine-600 to-blush-500 flex items-center justify-center shadow-xl shadow-burgundy-950/80 border border-blush-300/30"
          >
            <span className="text-2xl">✨</span>
          </motion.div>
          <div>
            <span className="font-serif font-bold text-2xl tracking-tight text-cream-50 group-hover:text-blush-200 transition-colors">
              SHELAUNCH
            </span>
            <p className="text-[10px] uppercase font-bold tracking-widest text-blush-300/80">
              Business OS
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-blush-200/90">
          <a href="#how-it-works" className="hover:text-white hover:scale-105 transition-all">How It Works</a>
          <a href="#features" className="hover:text-white hover:scale-105 transition-all">Business Tools</a>
          <a href="#ai-coach" className="hover:text-white hover:scale-105 transition-all">AI Coach</a>
          <a href="#demo" className="hover:text-white hover:scale-105 transition-all">Live Demo</a>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExploreDemo}
            className="border-blush-400/40 text-blush-100 hover:bg-wine-900/50"
            icon={<Crown className="w-3.5 h-3.5 text-gold-400" />}
          >
            Explore Demo
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleStartBuilding}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Sign In
          </Button>
        </div>
      </motion.nav>

      {/* 1. HERO SECTION WITH WOW FACTOR */}
      <section className="relative z-10 pt-16 pb-24 px-6 sm:px-8 max-w-5xl mx-auto text-center">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Badge Reveal */}
          <motion.div variants={itemVariants} className="inline-block">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine-900/70 border border-blush-400/35 backdrop-blur-md text-xs font-semibold text-blush-200 shadow-xl hover:border-blush-400/60 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>The Modern Business OS for Women Entrepreneurs</span>
            </div>
          </motion.div>

          {/* Headline Reveal */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold text-cream-50 leading-[1.12] tracking-tight"
          >
            Start with one idea. <br />
            <span className="gradient-text-blush italic relative inline-block">
              Build something real.
              {/* Subtle underline glowing line */}
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                className="absolute bottom-1 left-0 h-[3px] bg-gradient-to-r from-transparent via-blush-400 to-transparent rounded-full"
              />
            </span>
          </motion.h1>

          {/* Supporting Text Reveal */}
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl mx-auto text-base sm:text-xl text-blush-200/80 font-normal leading-relaxed"
          >
            SheLaunch is your AI-powered business companion for building, running and growing your business — one confident step at a time.
          </motion.p>

          {/* CTAs with Magnetic Hover Effect */}
          <motion.div 
            variants={itemVariants}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <Button
              size="lg"
              variant="primary"
              onClick={handleStartBuilding}
              className="w-full sm:w-auto px-8 py-4 text-base shadow-2xl shadow-wine-700/60 group"
              icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />}
            >
              Build My Business
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleExploreDemo}
              className="w-full sm:w-auto px-7 py-4 text-base border-blush-400/40 text-cream-50 hover:bg-wine-900/50 hover:scale-[1.02] transition-transform"
              icon={<Crown className="w-4 h-4 text-gold-400" />}
            >
              Explore Noor Jewels Demo
            </Button>
          </motion.div>

          {/* Social Proof Tags */}
          <motion.div 
            variants={itemVariants}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-blush-300/70"
          >
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Beginner-First Architecture</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real Inventory & Atomic POS</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Grounded Gemini AI Coach</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. HOW SHELAUNCH WORKS (BUILD → RUN → GROW) */}
      <motion.section 
        id="how-it-works"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={sectionViewport}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-20 px-6 sm:px-8 max-w-6xl mx-auto border-t border-wine-800/30"
      >
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="blush" size="md">The Core Journey</Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cream-50">
            BUILD → RUN → GROW
          </h2>
          <p className="text-sm sm:text-base text-blush-200/80">
            Go from &ldquo;I have an idea and don&apos;t know where to start&rdquo; to &ldquo;I have a real business and understand what is happening.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* STEP 1: BUILD */}
          <Card variant="interactive" className="relative overflow-hidden group hover:border-blush-400/50">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-burgundy-800 to-wine-600 flex items-center justify-center text-xl font-serif font-bold text-white mb-6 border border-blush-400/20 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-xl font-serif font-bold text-cream-50 mb-2">
              BUILD Your Foundation
            </h3>
            <p className="text-sm text-blush-200/70 mb-4">
              Validate your pricing, catalog your first products, define your target audience, and set up your brand without feeling overwhelmed.
            </p>
            <ul className="text-xs space-y-2 text-blush-300/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-400" /> 6-Step Guided Setup
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-400" /> Visual Pricing & Margin Helper
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-400" /> 9 Beginner Learning Modules
              </li>
            </ul>
          </Card>

          {/* STEP 2: RUN */}
          <Card variant="interactive" className="relative overflow-hidden group border-blush-400/30 hover:border-blush-400/60">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-wine-700 to-blush-500 flex items-center justify-center text-xl font-serif font-bold text-white mb-6 border border-blush-400/20 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-xl font-serif font-bold text-cream-50 mb-2">
              RUN Everyday Operations
            </h3>
            <p className="text-sm text-blush-200/70 mb-4">
              Real inventory tracking, customer relationships, atomic sales recording, and dynamic P&L statements that stay accurate with every order.
            </p>
            <ul className="text-xs space-y-2 text-blush-300/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-400" /> Atomic Inventory & Sales Sync
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-400" /> Real-time Revenue & Profit P&L
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-400" /> Customer CRM & Purchase Log
              </li>
            </ul>
          </Card>

          {/* STEP 3: GROW */}
          <Card variant="interactive" className="relative overflow-hidden group hover:border-gold-400/50">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-burgundy-600 to-gold-500 flex items-center justify-center text-xl font-serif font-bold text-white mb-6 border border-gold-400/20 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-xl font-serif font-bold text-cream-50 mb-2">
              GROW With Real AI
            </h3>
            <p className="text-sm text-blush-200/70 mb-4">
              An intelligent coach and marketing studio that reads your actual product stock, margins, and sales velocity to give grounded guidance.
            </p>
            <ul className="text-xs space-y-2 text-blush-300/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> Grounded Gemini AI Coach
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> One-Click Marketing Copy Studio
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> Executive Command Centre
              </li>
            </ul>
          </Card>
        </div>
      </motion.section>

      {/* 3. BUSINESS TOOLS SHOWCASE */}
      <motion.section 
        id="features"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={sectionViewport}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-20 px-6 sm:px-8 max-w-6xl mx-auto border-t border-wine-800/30"
      >
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="gold" size="md">Complete Suite</Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cream-50">
            Everything You Need. Nothing Complicated.
          </h2>
          <p className="text-sm sm:text-base text-blush-200/80">
            Engineered with deep craft to make complex business metrics intuitive and empowering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="subtle" className="p-6 group hover:border-blush-400/40 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.15, rotate: -5 }} className="w-fit">
              <Package className="w-8 h-8 text-blush-400 mb-4" />
            </motion.div>
            <h4 className="text-lg font-serif font-bold text-cream-50 mb-2">Product Catalog & CRUD</h4>
            <p className="text-xs text-blush-200/70">
              Manage selling prices, cost prices, categories, and inventory thresholds with full search and filter controls.
            </p>
          </Card>

          <Card variant="subtle" className="p-6 group hover:border-gold-400/40 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.15, rotate: 5 }} className="w-fit">
              <ShoppingBag className="w-8 h-8 text-gold-400 mb-4" />
            </motion.div>
            <h4 className="text-lg font-serif font-bold text-cream-50 mb-2">Atomic Sales & POS</h4>
            <p className="text-xs text-blush-200/70">
              Record sales that automatically deduct stock, increment units sold, update customer spend, and compute net profit.
            </p>
          </Card>

          <Card variant="subtle" className="p-6 group hover:border-emerald-400/40 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.15, rotate: -5 }} className="w-fit">
              <DollarSign className="w-8 h-8 text-emerald-400 mb-4" />
            </motion.div>
            <h4 className="text-lg font-serif font-bold text-cream-50 mb-2">Real Financials & P&L</h4>
            <p className="text-xs text-blush-200/70">
              Live calculated revenue, Cost of Goods Sold, operating expenses, and exact profit margin percentages.
            </p>
          </Card>

          <Card variant="subtle" className="p-6 group hover:border-blush-300/40 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.15, rotate: 5 }} className="w-fit">
              <Users className="w-8 h-8 text-blush-300 mb-4" />
            </motion.div>
            <h4 className="text-lg font-serif font-bold text-cream-50 mb-2">Customer CRM</h4>
            <p className="text-xs text-blush-200/70">
              Know your VIP buyers, track purchase frequency, lifetime value, and send personalized loyalty notes.
            </p>
          </Card>

          <Card variant="subtle" className="p-6 group hover:border-rose-400/40 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.15, rotate: -5 }} className="w-fit">
              <Bot className="w-8 h-8 text-rose-400 mb-4" />
            </motion.div>
            <h4 className="text-lg font-serif font-bold text-cream-50 mb-2">SheLaunch AI Coach</h4>
            <p className="text-xs text-blush-200/70">
              Ask &ldquo;How is my business doing?&rdquo; or &ldquo;What should I restock?&rdquo; and receive grounded answers with zero hallucinations.
            </p>
          </Card>

          <Card variant="subtle" className="p-6 group hover:border-amber-400/40 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.15, rotate: 5 }} className="w-fit">
              <BarChart3 className="w-8 h-8 text-amber-400 mb-4" />
            </motion.div>
            <h4 className="text-lg font-serif font-bold text-cream-50 mb-2">Visual Analytics</h4>
            <p className="text-xs text-blush-200/70">
              Interactive charts for sales velocity, monthly revenue trends, category share, and stock health.
            </p>
          </Card>
        </div>
      </motion.section>

      {/* 4. NOOR JEWELS SPOTLIGHT DEMO WITH BREATHING VISUAL */}
      <motion.section 
        id="demo"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={sectionViewport}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-20 px-6 sm:px-8 max-w-6xl mx-auto border-t border-wine-800/30"
      >
        <Card variant="highlight" className="p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge variant="gold" size="md" icon={<Crown className="w-3.5 h-3.5" />}>
                Pre-Populated Luxury Demo
              </Badge>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-cream-50">
                Experience Noor Jewels in Action
              </h3>
              <p className="text-sm text-blush-200/80 leading-relaxed">
                We pre-loaded a complete luxury jewelry brand with 12 handcrafted items, active inventory, 8 VIP customers, completed sales transactions, expense logs, and AI diagnosis.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleExploreDemo}
                  icon={<Crown className="w-4 h-4 text-gold-300" />}
                >
                  Launch Noor Jewels Demo
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  onClick={handleStartBuilding}
                >
                  Create Your Own Business
                </Button>
              </div>
            </div>

            {/* Interactive Breathing Preview Card */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-[#18040B]/90 rounded-3xl border border-blush-400/30 p-6 space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-wine-800/40 pb-3">
                <div>
                  <h5 className="font-serif font-bold text-sm text-cream-50">Noor Jewels Atelier</h5>
                  <p className="text-[11px] text-blush-300/70">Fine Jewelry & Baroque Pearls</p>
                </div>
                <Badge variant="emerald" size="sm">Active Business</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-wine-950/60 border border-wine-800/50">
                  <span className="text-[10px] text-blush-300/70 uppercase">Revenue</span>
                  <p className="font-serif font-bold text-sm text-cream-50 mt-0.5">$2,195.00</p>
                </div>
                <div className="p-2.5 rounded-xl bg-wine-950/60 border border-wine-800/50">
                  <span className="text-[10px] text-blush-300/70 uppercase">Net Profit</span>
                  <p className="font-serif font-bold text-sm text-emerald-400 mt-0.5">$1,535.00</p>
                </div>
                <div className="p-2.5 rounded-xl bg-wine-950/60 border border-wine-800/50">
                  <span className="text-[10px] text-blush-300/70 uppercase">Margin</span>
                  <p className="font-serif font-bold text-sm text-gold-300 mt-0.5">70.0%</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-burgundy-950/80 border border-blush-400/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-blush-200 font-semibold">
                  <Bot className="w-3.5 h-3.5 text-rose-400" />
                  <span>AI Business Diagnosis</span>
                </div>
                <p className="text-[11px] text-blush-300/80">
                  &ldquo;Aura Baroque Pearl Earrings is your #1 earner (42 sold). Restock Lumière Drop Huggies (2 left) before weekend rush.&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.section>

      {/* 5. FINAL CALL TO ACTION */}
      <motion.section 
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={sectionViewport}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-24 px-6 sm:px-8 max-w-4xl mx-auto text-center border-t border-wine-800/30"
      >
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-cream-50">
            Ready to build your business with confidence?
          </h2>
          <p className="text-base sm:text-lg text-blush-200/80 max-w-xl mx-auto">
            Join thousands of women entrepreneurs turning passion into profitable, sustainable reality.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={handleStartBuilding}
              className="px-8 py-4 text-base"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Build My Business
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleExploreDemo}
              className="px-7 py-4 text-base"
            >
              Explore Demo First
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 sm:px-8 border-t border-wine-900/60 text-center text-xs text-blush-300/50">
        <p>© {new Date().getFullYear()} SHELAUNCH. Built for women entrepreneurs worldwide. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};
