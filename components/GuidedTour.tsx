import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { XIcon, ChevronRightIcon, ChevronLeftIcon, InformationCircleIcon } from './Icons';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  placement?: 'start' | 'center' | 'end';
  showSkip?: boolean;
  showProgress?: boolean;
  actions?: TourAction[];
}

export interface TourAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onStepChange?: (step: TourStep, index: number) => void;
  showProgress?: boolean;
  showSkip?: boolean;
  allowClickOutside?: boolean;
  overlay?: boolean;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  onStepChange,
  showProgress = true,
  showSkip = true,
  allowClickOutside = true,
  overlay = true
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  const { announceToScreenReader, useFocusTrap } = useAccessibility();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[currentStepIndex];

  // Focus trap for the tour
  useFocusTrap(tooltipRef);

  // Announce step changes to screen readers
  useEffect(() => {
    if (isOpen && currentStep) {
      announceToScreenReader(`Step ${currentStepIndex + 1} of ${steps.length}: ${currentStep.title}`);
      onStepChange?.(currentStep, currentStepIndex);
    }
  }, [currentStepIndex, isOpen, currentStep, steps.length, announceToScreenReader, onStepChange]);

  // Position the tooltip
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const positionTooltip = () => {
      const target = document.querySelector(currentStep.target) as HTMLElement;
      if (!target) {
        console.warn(`Tour target element not found: ${currentStep.target}`);
        return;
      }

      setTargetElement(target);

      const rect = target.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      const position = currentStep.position || 'bottom';
      const placement = currentStep.placement || 'center';
      const offset = 16; // 16px offset from target

      let top = 0;
      let left = 0;

      // Calculate position based on target and tooltip dimensions
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      switch (position) {
        case 'top':
          top = rect.top - tooltipRect.height - offset;
          left = placement === 'start' ? rect.left : 
                 placement === 'end' ? rect.right - tooltipRect.width :
                 rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = rect.bottom + offset;
          left = placement === 'start' ? rect.left : 
                 placement === 'end' ? rect.right - tooltipRect.width :
                 rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = placement === 'start' ? rect.top : 
                placement === 'end' ? rect.bottom - tooltipRect.height :
                rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.left - tooltipRect.width - offset;
          break;
        case 'right':
          top = placement === 'start' ? rect.top : 
                placement === 'end' ? rect.bottom - tooltipRect.height :
                rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.right + offset;
          break;
        case 'center':
          top = (viewportHeight - tooltipRect.height) / 2;
          left = (viewportWidth - tooltipRect.width) / 2;
          break;
      }

      // Ensure tooltip stays within viewport
      const padding = 16;
      top = Math.max(padding, Math.min(top, viewportHeight - tooltipRect.height - padding));
      left = Math.max(padding, Math.min(left, viewportWidth - tooltipRect.width - padding));

      setTooltipPosition({ top, left });
      setIsVisible(true);
    };

    // Small delay to ensure DOM updates are complete
    const timer = setTimeout(positionTooltip, 100);
    return () => clearTimeout(timer);
  }, [isOpen, currentStep]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          handlePrevious();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, currentStepIndex, steps.length]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStepIndex, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleComplete = useCallback(() => {
    onClose();
    onComplete?.();
  }, [onClose, onComplete]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (allowClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  }, [allowClickOutside, onClose]);

  if (!isOpen || !currentStep) return null;

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      {/* Overlay */}
      {overlay && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Highlight target element */}
      {targetElement && overlay && (
        <div
          className="fixed border-4 border-blue-500 rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left
        }}
        aria-label={`Tour step ${currentStepIndex + 1} of ${steps.length}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <InformationCircleIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentStep.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close tour"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {currentStep.content}
        </p>

        {/* Actions */}
        {currentStep.actions && (
          <div className="space-y-2 mb-6">
            {currentStep.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${action.variant === 'danger'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30'
                    : action.variant === 'secondary'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Progress */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {showSkip && (
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Skip tour
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                aria-label="Previous step"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStepIndex < steps.length - 1 && <ChevronRightIcon className="w-4 h-4 inline ml-1" />}
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Use arrow keys to navigate • ESC to close
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing guided tours
 */
export const useGuidedTour = (tourKey: string) => {
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    return localStorage.getItem(`tour-${tourKey}`) === 'true';
  });

  const markTourAsSeen = useCallback(() => {
    localStorage.setItem(`tour-${tourKey}`, 'true');
    setHasSeenTour(true);
  }, [tourKey]);

  const resetTour = useCallback(() => {
    localStorage.removeItem(`tour-${tourKey}`);
    setHasSeenTour(false);
  }, [tourKey]);

  return {
    hasSeenTour,
    markTourAsSeen,
    resetTour
  };
};