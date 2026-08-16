import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShoppingBag, 
  Target, 
  TrendingUp, 
  Lightbulb,
  HeartHandshake,
  Gem,
  Scissors,
  Palette,
  Coffee,
  Sparkle,
  Home as HomeIcon,
  Briefcase
} from 'lucide-react';
import { AmbientCanvasBackground } from '../../components/background/AmbientCanvasBackground';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { LaunchCelebrationModal } from '../../components/onboarding/LaunchCelebrationModal';

const categories = [
  { id: 'Jewellery', label: 'Jewelry & Accessories', icon: Gem, desc: 'Handcrafted rings, pearls, earrings & statement pieces' },
  { id: 'Apparel', label: 'Fashion & Apparel', icon: Scissors, desc: 'Bespoke clothing, loungewear, scarves & textiles' },
  { id: 'Art & Craft', label: 'Art, Prints & Crafts', icon: Palette, desc: 'Original paintings, ceramics, embroidery & prints' },
  { id: 'Bakery', label: 'Bakery & Artisan Foods', icon: Coffee, desc: 'Custom cakes, specialty pastries, organic teas & treats' },
  { id: 'Beauty', label: 'Clean Beauty & Skincare', icon: Sparkle, desc: 'Botanical oils, handmade soaps, body butters & perfumes' },
  { id: 'Home Decor', label: 'Home Decor & Candles', icon: HomeIcon, desc: 'Soy candles, linen textiles, pottery & floral styling' },
  { id: 'Consulting', label: 'Coaching & Services', icon: Briefcase, desc: 'Creative consulting, photography, events & styling' },
];

const stages = [
  {
    id: 'idea' as const,
    title: 'Just an Idea',
    subtitle: 'I have a vision or passion project and want to build the right foundation from day one.',
    icon: Lightbulb,
  },
  {
    id: 'selling' as const,
    title: 'Already Selling',
    subtitle: 'I have made some sales (to friends, pop-ups, or Instagram) and need better organization.',
    icon: ShoppingBag,
  },
  {
    id: 'growing' as const,
    title: 'Scaling & Growing',
    subtitle: 'I have steady orders and want to maximize profit margins, inventory health, and repeat clients.',
    icon: TrendingUp,
  },
];

const challenges = [
  { id: 'pricing', label: 'Pricing my products for healthy profit without feeling guilty' },
  { id: 'customers', label: 'Finding my first 10-50 dream customers consistently' },
  { id: 'inventory', label: 'Managing stock, supplies, and cost of goods without chaos' },
  { id: 'marketing', label: 'Writing high-converting social captions and campaigns that don’t feel salesy' },
  { id: 'clarity', label: 'Understanding my true numbers, revenue, and take-home profit' },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBusiness } = useBusiness();

  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Jewellery');
  const [stage, setStage] = useState<'idea' | 'selling' | 'growing'>('idea');
  const [targetAudience, setTargetAudience] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('pricing');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [creating, setCreating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setCreating(true);
    try {
      await createBusiness({
        owner_id: user?.id || 'usr-local',
        name: businessName.trim() || 'My Artisan Brand',
        tagline: tagline.trim() || 'Handcrafted with intention',
        category,
        stage,
        target_audience: targetAudience.trim() || 'Discerning women who love thoughtful craftsmanship',
        biggest_challenge: challenges.find(c => c.id === biggestChallenge)?.label || biggestChallenge,
        currency: 'USD',
        currency_symbol: currencySymbol,
        description: `A ${category} brand created to bring high quality pieces to ${targetAudience || 'our community'}.`,
      });

      setCreating(false);
      // Trigger the Signature Business Launch Celebration
      setShowCelebration(true);
    } catch (e) {
      console.error('Failed to create business:', e);
      setCreating(false);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen bg-[#1F060E] text-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <AmbientCanvasBackground variant="cinematic" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress Bar & Header */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-blush-200/80">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Step {step} of {totalSteps}</span>
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-wine-950/80 border border-wine-800/60 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-burgundy-600 via-wine-500 to-blush-400"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <Card variant="default" className="p-8 sm:p-10 border-blush-400/25 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: BUSINESS NAME */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Badge variant="wine" size="md">Step 1 — Identity</Badge>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
                    What is your business called?
                  </h2>
                  <p className="text-xs sm:text-sm text-blush-200/70">
                    Choose your official brand or project name. You can always change this later as your brand evolves.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <Input
                    label="Business Name"
                    placeholder="e.g. Celine & Co. Studio, Noor Jewels, Velvet Bakery"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    autoFocus
                    required
                  />

                  <Input
                    label="Tagline or One-Sentence Essence (Optional)"
                    placeholder="e.g. Timeless handcrafted treasures for modern grace"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-2">
                      Primary Currency
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['$', '€', '£', '₹'].map((curr) => (
                        <motion.button
                          key={curr}
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setCurrencySymbol(curr)}
                          className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                            currencySymbol === curr
                              ? 'bg-wine-800 text-white border-blush-400 shadow-md'
                              : 'bg-wine-950/40 text-blush-200 border-wine-800/60 hover:bg-wine-900/60'
                          }`}
                        >
                          {curr}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CATEGORY / WHAT DO YOU SELL */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Badge variant="wine" size="md">Step 2 — What You Sell</Badge>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
                    What does {businessName || 'your business'} create?
                  </h2>
                  <p className="text-xs sm:text-sm text-blush-200/70">
                    This helps our Gemini AI customize your product metrics, inventory thresholds, and marketing hooks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-h-[45vh] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        type="button"
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCategory(cat.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-burgundy-900 to-wine-800 border-blush-400 text-white shadow-lg'
                            : 'bg-wine-950/40 border-wine-800/60 text-blush-200 hover:bg-wine-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blush-500/20 text-blush-200' : 'bg-wine-900/60 text-blush-300'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-xs text-cream-50">{cat.label}</span>
                        </div>
                        <p className="text-[11px] text-blush-200/70 pl-8 leading-tight">{cat.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: BUSINESS STAGE */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Badge variant="wine" size="md">Step 3 — Stage of Journey</Badge>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
                    Where are you right now?
                  </h2>
                  <p className="text-xs sm:text-sm text-blush-200/70">
                    We adapt the dashboard so you only see what matters right now without overwhelming noise.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {stages.map((stg) => {
                    const Icon = stg.icon;
                    const isSelected = stage === stg.id;
                    return (
                      <motion.button
                        key={stg.id}
                        type="button"
                        whileHover={{ y: -2, scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStage(stg.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'bg-gradient-to-r from-burgundy-900 to-wine-800 border-blush-400 text-white shadow-xl'
                            : 'bg-wine-950/40 border-wine-800/60 text-blush-200 hover:bg-wine-900/50'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-blush-500/20 text-blush-200' : 'bg-wine-900/60 text-blush-300'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-cream-50">{stg.title}</h4>
                          <p className="text-xs text-blush-200/70 mt-1 leading-relaxed">{stg.subtitle}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: TARGET AUDIENCE */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Badge variant="wine" size="md">Step 4 — Dream Customer</Badge>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
                    Who are you creating for?
                  </h2>
                  <p className="text-xs sm:text-sm text-blush-200/70">
                    Tell us about your dream customer so the AI Marketing Studio writes in a voice that resonates with them.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <Input
                    label="Describe Your Dream Customer"
                    placeholder="e.g. Modern brides looking for heirloom pearl accessories; busy moms who want non-toxic self-care rituals."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    autoFocus
                  />

                  <div className="p-4 rounded-xl bg-burgundy-950/60 border border-wine-800/40 space-y-2">
                    <span className="text-xs font-semibold text-blush-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      Founder Micro-Tip:
                    </span>
                    <p className="text-[11px] text-blush-300/80 leading-relaxed">
                      &ldquo;When you speak to everyone, you speak to no one.&rdquo; Being specific about one woman&apos;s lifestyle makes your brand feel exclusive and irresistible.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: BIGGEST CHALLENGE / GOAL */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Badge variant="wine" size="md">Step 5 — Priority Goal</Badge>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
                    What is your main focus right now?
                  </h2>
                  <p className="text-xs sm:text-sm text-blush-200/70">
                    We will calibrate the &ldquo;Next Best Action&rdquo; cards on your Business Home to support this exact goal.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {challenges.map((c) => {
                    const isSelected = biggestChallenge === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        type="button"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setBiggestChallenge(c.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-burgundy-900 to-wine-800 border-blush-400 text-white shadow-md'
                            : 'bg-wine-950/40 border-wine-800/60 text-blush-200 hover:bg-wine-900/50'
                        }`}
                      >
                        <span>{c.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 6: CONFIRMATION & BLUEPRINT */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-wine-600 to-gold-400 flex items-center justify-center text-white mx-auto shadow-xl"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
                    Your Foundation Is Ready!
                  </h2>
                  <p className="text-xs sm:text-sm text-blush-200/70">
                    Here is your personalized launch summary for <span className="text-white font-semibold">{businessName || 'Your Business'}</span>.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#18040B]/80 border border-blush-400/20 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-wine-800/40 pb-2">
                    <span className="text-blush-300/70">Business Name</span>
                    <span className="font-bold text-cream-50">{businessName || 'My Brand'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-wine-800/40 pb-2">
                    <span className="text-blush-300/70">Category</span>
                    <span className="font-semibold text-cream-50">{category}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-wine-800/40 pb-2">
                    <span className="text-blush-300/70">Stage</span>
                    <span className="font-semibold text-cream-50 capitalize">{stage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blush-300/70">Primary Currency</span>
                    <span className="font-semibold text-gold-300">{currencySymbol} (USD)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-burgundy-950/60 border border-wine-800/40 text-xs text-blush-200 space-y-1">
                  <span className="font-semibold text-cream-50">✨ Your First Day Roadmap:</span>
                  <p className="text-[11px] text-blush-300/80">
                    We will take you to your Business Home where you can add your very first product, check suggested pricing, and test recording a sale!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-wine-800/40">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={step === 1 && !businessName.trim()}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="lg"
                loading={creating}
                onClick={handleComplete}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Launch My Business
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Signature Business Launch Celebration Modal */}
      <LaunchCelebrationModal
        isOpen={showCelebration}
        businessName={businessName}
        onContinue={handleCelebrationContinue}
      />
    </div>
  );
};
