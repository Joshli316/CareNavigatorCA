import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export function Select({
  label,
  options,
  error,
  helperText,
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hasError = !!error;

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block text-body font-medium text-neutral-900 mb-2"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`
          w-full h-touch px-4 text-body
          border-2 rounded-button
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-white
          ${hasError
            ? 'border-danger focus:border-danger focus:ring-danger'
            : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
          }
          ${className}
        `}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
        }
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-2 text-body-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="mt-2 text-body-sm text-neutral-600">
          {helperText}
        </p>
      )}
    </div>
  );
}
