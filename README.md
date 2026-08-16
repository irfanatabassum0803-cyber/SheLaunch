# 🌸 SHELAUNCH — Beginner-First Business Operating System

> **"Odoo for women entrepreneurs — but much warmer, simpler, more beginner-friendly, AI-powered, and beautiful."**

SHELAUNCH is a full-featured SaaS business operating system engineered from scratch specifically for women founders. It guides entrepreneurs from **"I have an idea and don't know where to start"** to **"I have a real business and I understand what is happening."**

---

## ✨ Key Features & Architecture

### 1. 🎨 Bespoke Luxury Design System & Ambient Dynamic Mesh
- Deep burgundy (`#270811`), maroon, wine (`#6E2A3B`), dusty rose, soft blush (`#FFCAD6`), and warm cream (`#FAF7F1`).
- Custom serif headings (`Playfair Display`, `Cinzel`) and ultra-clean modern typography (`Plus Jakarta Sans`).
- **Dynamic Floating Canvas Ambient Background**: Slow-moving blurred burgundy/wine light blooms and luminous particles with `prefers-reduced-motion` compliance.

### 2. 🏛️ Dual-Mode Data Architecture
- **Supabase + PostgreSQL + RLS**: Native PostgreSQL tables (`profiles`, `businesses`, `products`, `customers`, `orders`, `order_items`, `expenses`, `marketing_content`, `ai_messages`) with strict multi-tenant Row Level Security policies (`supabase/schema.sql`).
- **Instant Reactive Local Persistence**: Zero setup friction for immediate judging and pitch demos.

### 3. 👑 Noor Jewels Pre-Populated Luxury Demo
- Complete luxury fine jewelry brand with 12 handcrafted pieces, 8 registered clients, 8 completed sales transactions, categorized operating expenses, and diagnostic AI insights.
- Accessible directly via the **"Explore Demo"** button on the public landing page.

### 4. ⚡ Critical Atomic Sales & POS Workflow
- Point of Sale register allowing selection of customer, items, quantities, discounts, and taxes.
- **Atomic updates**: Automatically deducts product stock, increments units sold, updates customer purchase history & lifetime spend, and recalculates real-time P&L (revenue, COGS, expenses, net profit, margin %).

### 5. 🤖 Google Gemini AI Engine
- **SheLaunch AI Coach**: 24/7 business advisor grounded in real business data (stock levels, sales velocity, profit margins) with zero hallucination.
- **AI Marketing Studio**: One-click generation of editorial Instagram captions, WhatsApp VIP broadcast copy, luxury product descriptions, and campaign pitches.
- **AI Diagnostic Insights**: Real-time diagnostic cards highlighting top performers, low-stock warnings, and margin optimization levers.

### 6. 📚 Beginner-First Tooling
- **6-Step Onboarding Wizard**: Step-by-step foundation builder with progress animation and celebration confetti.
- **Pricing & Margin Helper**: Cost-plus calculator with margin slider and breakeven milestone analysis.
- **9-Masterclass Learning Hub**: Bite-sized, jargon-free business guides with actionable daily steps and founder pro-tips.
- **Executive Command Centre**: High-growth operations flight deck.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+

### 1. Install & Run
```bash
cd shelaunch
npm install
npm run dev
```

Visit `http://localhost:5173` to explore the cinematic public landing page or test the **Noor Jewels** luxury demo.

### 2. Environment Configuration (Optional)
Create `.env` based on `.env.example`:
```env
# Optional Supabase Connection
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional Google Gemini API Key
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```
*(If no API keys are provided, SHELAUNCH runs with full local reactive persistence and intelligent grounded AI models).*

---

## 📂 Project Structure
```
shelaunch/
├── src/
│   ├── components/
│   │   ├── background/      # Dynamic fluid canvas ambient background
│   │   ├── layout/          # Sidebar, Topbar, AppLayout
│   │   └── ui/              # Button, Card, Modal, Input, Badge, StatsCard
│   ├── context/
│   │   ├── AuthContext.tsx  # User session, profiles & 1-click demo login
│   │   └── BusinessContext.tsx # Live KPI state & atomic transactions
│   ├── lib/
│   │   ├── db.ts            # Unified relational data engine
│   │   ├── gemini.ts        # Gemini AI Coach & Marketing copy generator
│   │   ├── seed.ts          # Noor Jewels luxury dataset
│   │   └── supabase.ts      # Supabase client
│   ├── pages/
│   │   ├── landing/         # Cinematic Landing Page
│   │   ├── auth/            # Sign In / Sign Up
│   │   ├── onboarding/      # 6-Step Onboarding Wizard
│   │   ├── home/            # Business Home (Next Best Action, KPIs)
│   │   ├── products/        # Product Catalog CRUD & profit preview
│   │   ├── inventory/       # Stock Health & Restock Management
│   │   ├── customers/       # Customer CRM & Order History
│   │   ├── sales/           # Atomic POS & Transaction Register
│   │   ├── finance/         # P&L, Revenue vs Expenses, Profit Margins
│   │   ├── marketing/       # Gemini AI Marketing Studio
│   │   ├── coach/           # SheLaunch AI Business Coach
│   │   ├── analytics/       # Recharts visual charts & telemetry
│   │   ├── insights/        # AI Diagnostic Insights
│   │   ├── command-center/  # Executive Control Room
│   │   ├── learn/           # 9 Masterclasses Learning Hub
│   │   └── pricing-helper/  # Interactive pricing calculator
│   ├── types/               # Domain interfaces & models
│   ├── App.tsx              # Application Routes
│   └── main.tsx             # React 18 Entry
└── supabase/
    └── schema.sql           # PostgreSQL Schema & RLS Policies
```
