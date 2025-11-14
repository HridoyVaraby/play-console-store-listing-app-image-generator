import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseAccessibilityOptions {
  /** Enable keyboard navigation */
  keyboardNavigation?: boolean;
  /** Enable ARIA live regions */
  ariaLiveRegions?: boolean;
  /** Enable focus management */
  focusManagement?: boolean;
  /** Enable screen reader announcements */
  screenReaderAnnouncements?: boolean;
}

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  description: string;
  handler: (event: KeyboardEvent) => void;
  disabled?: boolean;
}

/**
 * Comprehensive accessibility hook for managing keyboard navigation, focus, and ARIA compliance
 */
export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    keyboardNavigation = true,
    ariaLiveRegions = true,
    focusManagement = true,
    screenReaderAnnouncements = true
  } = options;

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndexRef = useRef<number>(-1);

  /**
   * Register keyboard shortcuts
   */
  const registerKeyboardShortcuts = useCallback((shortcuts: KeyboardShortcut[]) => {
    if (!keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        if (shortcut.disabled) return;

        const modifiersMatch = !shortcut.modifiers || shortcut.modifiers.every(modifier => {
          switch (modifier) {
            case 'ctrl': return event.ctrlKey;
            case 'alt': return event.altKey;
            case 'shift': return event.shiftKey;
            case 'meta': return event.metaKey;
            default: return false;
          }
        });

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (modifiersMatch && keyMatch) {
          event.preventDefault();
          shortcut.handler(event);
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardNavigation]);

  /**
   * Announce content to screen readers
   */
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!screenReaderAnnouncements) return;

    setAnnouncements(prev => [...prev, message]);
    
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(msg => msg !== message));
    }, 1000);
  }, [screenReaderAnnouncements]);

  /**
   * Manage focus trap within a container
   */
  const useFocusTrap = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    if (!focusManagement) return;

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const focusableElements = Array.from(
        container.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true') as HTMLElement[];

      focusableElementsRef.current = focusableElements;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        const currentFocus = document.activeElement as HTMLElement;
        const currentIndex = focusableElements.indexOf(currentFocus);

        if (event.shiftKey) {
          // Shift + Tab (backward)
          if (currentIndex <= 0) {
            event.preventDefault();
            focusableElements[focusableElements.length - 1]?.focus();
          }
        } else {
          // Tab (forward)
          if (currentIndex >= focusableElements.length - 1) {
            event.preventDefault();
            focusableElements[0]?.focus();
          }
        }
      };

      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }, [containerRef, focusManagement]);
  }, [focusManagement]);

  /**
   * Set ARIA attributes for dynamic content
   */
  const setAriaAttributes = useCallback((element: HTMLElement, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }, []);

  /**
   * Generate unique IDs for ARIA relationships
   */
  const generateId = useCallback((prefix: string) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Validate color contrast ratio
   */
  const checkColorContrast = useCallback((foreground: string, background: string): number => {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd use a proper color contrast library
    const getLuminance = (color: string): number => {
      // Basic luminance calculation (simplified)
      const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(foreground);
    const lum2 = getLuminance(background);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }, []);

  /**
   * Skip link functionality
   */
  const useSkipLink = useCallback((targetId: string, label: string) => {
    useEffect(() => {
      const handleSkipLink = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && event.target instanceof HTMLAnchorElement) {
          const target = document.getElementById(targetId);
          if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      };

      document.addEventListener('keydown', handleSkipLink);
      return () => document.removeEventListener('keydown', handleSkipLink);
    }, [targetId]);

    return {
      href: `#${targetId}`,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      },
      children: label
    };
  }, []);

  return {
    registerKeyboardShortcuts,
    announceToScreenReader,
    useFocusTrap,
    setAriaAttributes,
    generateId,
    checkColorContrast,
    useSkipLink,
    announcements
  };
};

/**
 * Hook for managing ARIA live regions
 */
export const useAriaLive = (region: 'polite' | 'assertive' = 'polite') => {
  const [content, setContent] = useState<string>('');

  const announce = useCallback((message: string) => {
    setContent(message);
    
    // Clear after announcement
    setTimeout(() => setContent(''), 1000);
  }, []);

  const ariaLiveProps = {
    'aria-live': region,
    'aria-atomic': 'true',
    className: 'sr-only'
  };

  return { announce, content, ariaLiveProps };
};

/**
 * Hook for keyboard navigation within lists
 */
export const useKeyboardNavigation = (items: any[], onSelect: (item: any) => void) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          onSelect(items[focusedIndex]);
        }
        break;
      case 'Escape':
        setFocusedIndex(-1);
        break;
    }
  }, [items, focusedIndex, onSelect]);

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    getItemProps: (index: number) => ({
      'aria-selected': focusedIndex === index,
      tabIndex: focusedIndex === index ? 0 : -1,
      onMouseEnter: () => setFocusedIndex(index)
    })
  };
};