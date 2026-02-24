
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../components/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 ${className}`}>
      <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-stone-300 dark:text-stone-600" />
      </div>
      <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xs mx-auto mb-6">{description}</p>}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="w-auto h-10 text-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
