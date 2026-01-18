import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export function Checkbox({
  label,
  description,
  id,
  className = '',
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-start">
      <div className="flex items-center h-touch">
        <input
          type="checkbox"
          id={checkboxId}
          className={`
            w-5 h-5 text-primary-500 border-2 border-neutral-300 rounded
            focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>
      <div className="ml-3">
        <label
          htmlFor={checkboxId}
          className="block text-body font-medium text-neutral-900 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-body-sm text-neutral-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
