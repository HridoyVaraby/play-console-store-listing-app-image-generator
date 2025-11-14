import React, { useState, useCallback } from 'react';
import { useErrorNotification } from '../components/NotificationSystem';

export interface ErrorInfo {
  id: string;
  type: 'validation' | 'network' | 'processing' | 'system' | 'user';
  title: string;
  message: string;
  details?: string;
  timestamp: Date;
  recoverable: boolean;
  actions?: ErrorAction[];
  context?: Record<string, any>;
}

export interface ErrorAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: string;
}

export interface ErrorRecoveryOptions {
  retry?: () => Promise<void>;
  fallback?: () => void;
  report?: () => void;
  dismiss?: () => void;
}

/**
 * Comprehensive error handling system with recovery options
 */
export const useErrorHandler = () => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const { addErrorNotification } = useErrorNotification();

  const createError = useCallback((
    type: ErrorInfo['type'],
    title: string,
    message: string,
    options: {
      details?: string;
      recoverable?: boolean;
      actions?: ErrorAction[];
      context?: Record<string, any>;
    } = {}
  ): ErrorInfo => {
    return {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      details: options.details,
      timestamp: new Date(),
      recoverable: options.recoverable ?? true,
      actions: options.actions,
      context: options.context
    };
  }, []);

  const handleError = useCallback((
    error: unknown,
    context: {
      title?: string;
      type?: ErrorInfo['type'];
      recoverable?: boolean;
      recoveryOptions?: ErrorRecoveryOptions;
    } = {}
  ): ErrorInfo => {
    let errorInfo: ErrorInfo;

    if (error instanceof Error) {
      errorInfo = createError(
        context.type || 'system',
        context.title || 'An error occurred',
        error.message,
        {
          details: error.stack,
          recoverable: context.recoverable,
          context: { originalError: error.message }
        }
      );
    } else if (typeof error === 'string') {
      errorInfo = createError(
        context.type || 'system',
        context.title || 'An error occurred',
        error,
        { recoverable: context.recoverable }
      );
    } else {
      errorInfo = createError(
        context.type || 'system',
        context.title || 'An unknown error occurred',
        'Something went wrong. Please try again.',
        { recoverable: context.recoverable }
      );
    }

    // Add to errors state
    setErrors(prev => [...prev, errorInfo]);

    // Show notification
    addErrorNotification(errorInfo.title, errorInfo.message, errorInfo.actions);

    return errorInfo;
  }, [createError, addErrorNotification]);

  const handleValidationError = useCallback((
    field: string,
    message: string,
    details?: string
  ) => {
    const error = createError(
      'validation',
      'Validation Error',
      message,
      { 
        details,
        context: { field },
        actions: [
          {
            label: 'Fix Issue',
            onClick: () => {
              // Focus on the problematic field
              const fieldElement = document.querySelector(`[name="${field}"], #${field}`);
              if (fieldElement instanceof HTMLElement) {
                fieldElement.focus();
                fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            },
            variant: 'primary'
          }
        ]
      }
    );

    setErrors(prev => [...prev, error]);
    addErrorNotification(error.title, error.message, error.actions);
    return error;
  }, [createError, addErrorNotification]);

  const handleNetworkError = useCallback((
    url: string,
    status?: number,
    recoveryOptions?: ErrorRecoveryOptions
  ) => {
    const message = status 
      ? `Network request failed with status ${status}`
      : 'Network request failed';

    const actions: ErrorAction[] = [];

    if (recoveryOptions?.retry) {
      actions.push({
        label: 'Retry',
        onClick: recoveryOptions.retry,
        variant: 'primary'
      });
    }

    if (recoveryOptions?.report) {
      actions.push({
        label: 'Report Issue',
        onClick: recoveryOptions.report,
        variant: 'secondary'
      });
    }

    const error = createError(
      'network',
      'Network Error',
      message,
      {
        details: `URL: ${url}`,
        actions,
        context: { url, status }
      }
    );

    setErrors(prev => [...prev, error]);
    addErrorNotification(error.title, error.message, error.actions);
    return error;
  }, [createError, addErrorNotification]);

  const handleProcessingError = useCallback((
    operation: string,
    error: unknown,
    recoveryOptions?: ErrorRecoveryOptions
  ) => {
    const actions: ErrorAction[] = [];

    if (recoveryOptions?.retry) {
      actions.push({
        label: 'Retry Operation',
        onClick: recoveryOptions.retry,
        variant: 'primary'
      });
    }

    if (recoveryOptions?.fallback) {
      actions.push({
        label: 'Use Alternative',
        onClick: recoveryOptions.fallback,
        variant: 'secondary'
      });
    }

    const errorInfo = handleError(error, {
      type: 'processing',
      title: `${operation} Failed`,
      recoveryOptions: { actions }
    });

    return errorInfo;
  }, [handleError]);

  const dismissError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const retryError = useCallback((errorId: string) => {
    const error = errors.find(e => e.id === errorId);
    if (error && error.actions) {
      const retryAction = error.actions.find(action => action.label.toLowerCase().includes('retry'));
      if (retryAction) {
        retryAction.onClick();
        dismissError(errorId);
      }
    }
  }, [errors, dismissError]);

  return {
    errors,
    handleError,
    handleValidationError,
    handleNetworkError,
    handleProcessingError,
    dismissError,
    clearErrors,
    retryError,
    createError
  };
};

/**
 * Error boundary component for React error handling
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{this.state.error.message}</p>
            <button
              onClick={this.reset}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}