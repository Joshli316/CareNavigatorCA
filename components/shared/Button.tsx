import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-accent-600 text-white hover:bg-accent-700 shadow-subtle',
  secondary: 'bg-accent-50 text-accent-700 hover:bg-accent-100',
  outline: 'border border-gray-200 text-gray-700 hover:border-accent-300 hover:text-accent-700 hover:bg-accent-50',
  ghost: 'text-gray-600 hover:text-accent-700 hover:bg-accent-50',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs rounded',
  md: 'h-10 px-5 text-sm rounded-md',
  lg: 'h-12 px-6 text-sm rounded-md',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
