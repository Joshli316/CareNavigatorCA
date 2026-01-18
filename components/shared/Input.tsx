import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hasError = !!error;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-body font-medium text-neutral-900 mb-2"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-full h-touch px-4 text-body
          border-2 rounded-button
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${hasError
            ? 'border-danger focus:border-danger focus:ring-danger'
            : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
          }
          ${className}
        `}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...props}
      />
      {error && (
        <div id={`${inputId}-error`} className="mt-2 flex items-start space-x-2" role="alert">
          <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
          <p className="text-body-sm text-error font-medium">{error}</p>
        </div>
      )}
      {!error && helperText && (
        <div id={`${inputId}-helper`} className="mt-2 flex items-start space-x-2">
          <Info className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
          <p className="text-body-sm text-neutral-600">{helperText}</p>
        </div>
      )}
    </div>
  );
}
