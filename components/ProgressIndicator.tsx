import React from 'react';
import { LoaderIcon } from '../components/Icons';

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'primary'
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const isComplete = current >= total;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {percentage}%
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <div className={`progress ${sizeClasses[size]}`}>
          <div
            className={`progress-bar ${variantClasses[variant]}`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={current}
            aria-valuemin={0}
            aria-valuemax={total}
          />
        </div>
        
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {current > 0 && total > 0 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Processing {current} of {total} images
        </div>
      )}
    </div>
  );
};

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoaderIcon className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {text && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </span>
      )}
    </div>
  );
};

export interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Processing...',
  size = 'md'
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        <LoadingSpinner size={size} text={text} />
      </div>
    </div>
  );
};