'use client';

import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', children, ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors';
    const errorClasses = error ? 'border-red-300 bg-red-50' : 'border-neutral-300';
    const finalClasses = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={finalClasses}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };