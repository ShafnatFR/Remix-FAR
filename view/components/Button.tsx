
import React from 'react';
import { ButtonProps } from '../../types';
import { Loader2 } from 'lucide-react';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading, 
  variant = 'primary', 
  className = '', 
  disabled,
  ...props 
}) => {
  
  const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white dark:text-stone-950 shadow-lg shadow-orange-500/20 dark:shadow-orange-900/20",
    outline: "border-2 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-orange-500 hover:text-orange-500 bg-transparent",
    ghost: "text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-900/50",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 dark:shadow-red-900/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
