import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { AuthPage } from './pages/auth/AuthPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { BusinessHomePage } from './pages/home/BusinessHomePage';
import { ProductsPage } from './pages/products/ProductsPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { SalesPage } from './pages/sales/SalesPage';
import { FinancePage } from './pages/finance/FinancePage';
import { MarketingStudioPage } from './pages/marketing/MarketingStudioPage';
import { CoachPage } from './pages/coach/CoachPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { InsightsPage } from './pages/insights/InsightsPage';
import { CommandCenterPage } from './pages/command-center/CommandCenterPage';
import { LearnPage } from './pages/learn/LearnPage';
import { PricingHelperPage } from './pages/pricing-helper/PricingHelperPage';

export function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* In-App Operating System Routes wrapped in AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/home" element={<BusinessHomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/pricing-helper" element={<PricingHelperPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/marketing" element={<MarketingStudioPage />} />
              <Route path="/coach" element={<CoachPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/command-center" element={<CommandCenterPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BusinessProvider>
    </AuthProvider>
  );
}

export default App;
