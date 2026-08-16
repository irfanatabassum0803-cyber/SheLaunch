import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-blush-200/90 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-blush-300/70 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              'w-full bg-[#18040B]/80 border rounded-xl py-2.5 px-4 text-sm text-cream-50 placeholder:text-zinc-500 focus:outline-none transition-all duration-200',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              error 
                ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                : 'border-burgundy-700/60 focus:border-blush-400 focus:ring-2 focus:ring-blush-400/20',
              className
            )
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-blush-300/70 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-400 mt-1.5">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
