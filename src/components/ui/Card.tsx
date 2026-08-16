import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'subtle' | 'interactive' | 'highlight';
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  glow = false,
  ...props
}) => {
  const variantStyles = {
    default: 'glass-card text-cream-50 rounded-2xl p-6 shadow-xl shadow-black/30',
    subtle: 'glass-card-subtle text-cream-50 rounded-2xl p-5',
    interactive: 'glass-card glass-card-hover cursor-pointer text-cream-50 rounded-2xl p-6 shadow-xl',
    highlight: 'bg-gradient-to-br from-burgundy-900/80 via-wine-900/50 to-burgundy-950/90 border border-blush-400/30 rounded-2xl p-6 shadow-2xl',
  };

  return (
    <motion.div
      className={twMerge(clsx(variantStyles[variant], glow && 'glow-wine', className))}
      {...props}
    >
      {children}
    </motion.div>
  );
};
