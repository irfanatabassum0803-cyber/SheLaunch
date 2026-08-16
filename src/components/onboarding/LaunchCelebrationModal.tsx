import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Crown, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button';

interface LaunchCelebrationModalProps {
  isOpen: boolean;
  businessName: string;
  onContinue: () => void;
}

export const LaunchCelebrationModal: React.FC<LaunchCelebrationModalProps> = ({
  isOpen,
  businessName,
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen) {
      // 1. Initial luxury confetti burst
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#8A233F', '#C74F6E', '#FFA3B8', '#D7B447', '#FAF7F2'],
        ticks: 250,
      });

      // 2. Secondary side cannon showers
      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: ['#AC3353', '#FFA3B8', '#D7B447'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: ['#AC3353', '#FFA3B8', '#D7B447'],
        });
      }, 400);

      return () => clearTimeout(timer1);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* 1. Deep Cinematic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#120207]/95 backdrop-blur-xl"
          />

          {/* 2. Expanding Radiant Glow Rings */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.8, 2.2], opacity: [0.8, 0.4, 0] }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-burgundy-600 via-wine-500 to-gold-400 blur-3xl pointer-events-none"
          />

          {/* 3. Central Celebratory Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.15 }}
            className="relative z-10 w-full max-w-lg bg-gradient-to-b from-[#2A0815] via-[#20050E] to-[#18030B] border border-blush-400/35 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-black/90 space-y-6"
          >
            {/* Animated Checkmark Sphere with Halo */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              {/* Outer Rotating Starfield */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-wine-600 via-blush-500 to-gold-400 blur-md opacity-70"
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />

              {/* Glowing Center Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.3 }}
                className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-burgundy-700 via-wine-600 to-blush-500 flex items-center justify-center text-white border-2 border-white/40 shadow-xl"
              >
                <Check className="w-10 h-10 stroke-[3]" />
              </motion.div>
            </div>

            {/* Typography Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold">
                <Crown className="w-3.5 h-3.5" />
                <span>Founder Milestone Achieved</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-cream-50 tracking-tight">
                YOU&apos;RE OFFICIALLY LIVE 🚀
              </h2>

              <p className="text-base sm:text-lg font-serif italic text-blush-200">
                &ldquo;{businessName || 'Your Business'}&rdquo;
              </p>

              <p className="text-xs sm:text-sm text-blush-200/80 max-w-sm mx-auto leading-relaxed pt-1">
                Your business is officially launched. <br />
                This is the beginning of something amazing.
              </p>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <Button
                size="lg"
                variant="primary"
                onClick={onContinue}
                className="w-full py-4 text-base font-semibold shadow-2xl shadow-wine-700/60 group"
                icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />}
              >
                Continue to Dashboard
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
