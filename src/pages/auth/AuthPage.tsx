import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { AmbientCanvasBackground } from '../../components/background/AmbientCanvasBackground';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, signUp, loginDemo } = useAuth();
  const { userBusinesses } = useBusiness();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    if (mode === 'forgot') {
      setTimeout(() => {
        setSubmitting(false);
        setSuccessMsg('A password recovery email has been dispatched. Please check your inbox.');
      }, 800);
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name');
        setSubmitting(false);
        return;
      }
      const res = await signUp(email, password, fullName);
      setSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        navigate('/onboarding');
      }
    } else {
      const res = await login(email, password);
      setSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        if (userBusinesses.length > 0) {
          navigate('/home');
        } else {
          navigate('/home');
        }
      }
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen bg-[#1F060E] text-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <AmbientCanvasBackground variant="cinematic" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-burgundy-700 via-wine-600 to-blush-500 flex items-center justify-center shadow-xl shadow-burgundy-950/80 border border-blush-300/30 group-hover:scale-105 transition-transform">
              <span className="text-2xl">✨</span>
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-2xl tracking-tight text-cream-50">
                SHELAUNCH
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-blush-300/80">
                Business Operating System
              </p>
            </div>
          </div>
        </div>

        {/* Auth Form Box */}
        <Card variant="default" className="p-8 sm:p-9 shadow-2xl border-blush-400/25">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-cream-50">
              {mode === 'signup' && 'Create Your Business'}
              {mode === 'login' && 'Welcome Back, Founder'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h2>
            <p className="text-xs text-blush-200/70 mt-1">
              {mode === 'signup' && 'Step into your new operating system for calm, confident growth.'}
              {mode === 'login' && 'Access your products, sales, customers, and AI co-pilot.'}
              {mode === 'forgot' && 'Enter your email address to recover your account.'}
            </p>
          </div>

          {/* Quick Demo Login Shortcut */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-wine-900/90 to-burgundy-900/80 hover:from-wine-800 hover:to-burgundy-800 border border-gold-400/30 text-xs font-semibold text-gold-200 shadow-md transition-all group"
            >
              <Crown className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform" />
              <span>Instant 1-Click Demo (Noor Jewels)</span>
            </button>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-wine-800/40"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-blush-300/50">
                Or continue with email
              </span>
              <div className="flex-grow border-t border-wine-800/40"></div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Your Full Name"
                placeholder="e.g. Maya Lin"
                leftIcon={<User className="w-4 h-4" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="founder@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {mode !== 'forgot' && (
              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-blush-300/80 hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {mode === 'signup' && 'Start My Business Journey'}
              {mode === 'login' && 'Sign In to Dashboard'}
              {mode === 'forgot' && 'Send Recovery Link'}
            </Button>
          </form>

          {/* Toggle Modes */}
          <div className="mt-6 text-center text-xs text-blush-200/70">
            {mode === 'signup' && (
              <p>
                Already have a SheLaunch account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-semibold text-blush-200 hover:text-white underline underline-offset-4"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'login' && (
              <p>
                New to SheLaunch?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-semibold text-blush-200 hover:text-white underline underline-offset-4"
                >
                  Create an account
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-semibold text-blush-200 hover:text-white underline underline-offset-4"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
