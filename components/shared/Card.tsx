import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-subtle',
        hoverable && 'transition-all duration-200 hover:shadow-card hover:border-gray-300',
        className
      )}
    >
      {children}
    </div>
  );
}
