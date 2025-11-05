import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary',
  size = 'md', 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-oxal-verdigris text-white hover:bg-oxal-desert focus:ring-oxal-verdigris',
    secondary: 'bg-oxal-sandstone text-gray-900 hover:bg-oxal-teak focus:ring-oxal-sandstone',
    outline: 'border border-oxal-verdigris bg-white text-oxal-verdigris hover:bg-oxal-cream focus:ring-oxal-verdigris',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <button 
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}