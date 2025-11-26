import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20",
    secondary: "bg-teal-100 text-teal-800 hover:bg-teal-200",
    outline: "border-2 border-teal-600 text-teal-600 hover:bg-teal-50",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};