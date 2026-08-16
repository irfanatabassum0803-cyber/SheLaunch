import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';

interface AIOrientedLoaderProps {
  label?: string;
  sublabel?: string;
}

export const AIOrientedLoader: React.FC<AIOrientedLoaderProps> = ({
  label = 'AI is analyzing your business telemetry...',
  sublabel = 'Synthesizing inventory velocity, profit margins, and customer data'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-5">
      {/* Central Glowing AI Orb with Orbital Rings */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer Pulsing Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-burgundy-600 via-wine-500 to-blush-400 blur-xl opacity-60"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Orbit Ring 1 */}
        <motion.div
          className="absolute inset-0 rounded-full border border-blush-400/40"
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gold-300 shadow-md shadow-gold-300/80" />
        </motion.div>

        {/* Orbit Ring 2 (Reversed) */}
        <motion.div
          className="absolute inset-2 rounded-full border border-wine-500/50 border-dashed"
          animate={{ rotate: -360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blush-300 shadow-md shadow-blush-300/80" />
        </motion.div>

        {/* Core Icon Sphere */}
        <motion.div
          className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-tr from-burgundy-800 via-wine-700 to-burgundy-900 border border-blush-300/40 flex items-center justify-center text-white shadow-xl shadow-black/60"
          animate={{
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Bot className="w-6 h-6 text-blush-200" />
        </motion.div>
      </div>

      {/* Label and Sublabel with Shimmer */}
      <div className="space-y-1 max-w-sm">
        <motion.p
          className="text-sm font-semibold text-cream-50 flex items-center justify-center gap-1.5"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
          <span>{label}</span>
        </motion.p>
        {sublabel && (
          <p className="text-xs text-blush-200/70">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
};
