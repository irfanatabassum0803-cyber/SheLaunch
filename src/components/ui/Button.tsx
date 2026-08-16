import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blush-400/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-wine-500 text-white shadow-lg shadow-burgundy-950/50 hover:shadow-wine-600/30 border border-blush-300/25',
    secondary: 'bg-wine-900/70 text-blush-100 hover:bg-wine-800/90 border border-wine-700/50 shadow-sm',
    outline: 'bg-transparent text-cream-100 border border-wine-600/60 hover:bg-wine-900/50 hover:border-blush-400/50',
    ghost: 'bg-transparent text-blush-200 hover:bg-wine-900/40 hover:text-white',
    danger: 'bg-red-900/40 text-red-200 border border-red-800/50 hover:bg-red-800/60',
  };

  return (
    <motion.button
      whileHover={disabled || loading ? undefined : { y: -1.5, scale: 1.015 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97, y: 0.5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || loading}
      {...props}
    >
      {/* Specular Shimmer Sheen on Hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
