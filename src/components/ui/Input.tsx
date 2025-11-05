'use client';

import { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  variant?: 'default' | 'small';
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
  variant?: 'default' | 'small';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, variant = 'default', className = '', ...props }, ref) => {
    const baseClasses = variant === 'small' 
      ? 'w-full px-2 py-2 border border-oxal-sandstone rounded-lg focus:outline-none focus:ring-2 focus:ring-oxal-verdigris transition-colors text-sm'
      : 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oxal-verdigris transition-colors';
    
    const errorClasses = error ? 'border-red-300 bg-red-50' : 'border-oxal-sandstone';
    const prefixClasses = prefix ? (variant === 'small' ? 'pl-8' : 'pl-8') : '';
    const suffixClasses = suffix ? (variant === 'small' ? 'pr-8' : 'pr-12') : '';
    const finalClasses = `${baseClasses} ${errorClasses} ${prefixClasses} ${suffixClasses} ${className}`;

    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-900 mb-2">
            {label}
          </label>
        )}
        <div className={(prefix || suffix) ? 'relative' : undefined}>
          {prefix && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oxal-teak">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={finalClasses}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-oxal-teak">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oxal-verdigris transition-colors resize-none';
    const errorClasses = error ? 'border-red-300 bg-red-50' : 'border-oxal-sandstone';
    const finalClasses = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-900 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={finalClasses}
          {...props}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
TextArea.displayName = 'TextArea';

export { Input, TextArea };