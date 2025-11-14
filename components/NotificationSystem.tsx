import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { XIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from './Icons';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    if (!notification.persistent && notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearNotifications }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-5 h-5" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300 transform";
    const exitStyles = isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100";
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} ${exitStyles} bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200`;
      case 'error':
        return `${baseStyles} ${exitStyles} bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} ${exitStyles} bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200`;
      case 'info':
        return `${baseStyles} ${exitStyles} bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200`;
    }
  };

  return (
    <div className={getStyles()} role="alert" aria-live="polite">
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            {notification.message && (
              <p className="text-sm mt-1 opacity-90">{notification.message}</p>
            )}
          </div>
          {!notification.persistent && (
            <button
              onClick={handleClose}
              className="ml-3 flex-shrink-0 text-current hover:opacity-70 transition-opacity"
              aria-label="Close notification"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {notification.actions && notification.actions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {notification.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  if (!notification.persistent) {
                    handleClose();
                  }
                }}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-colors
                  ${action.variant === 'danger' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700'
                    : action.variant === 'secondary'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700'
                  }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Utility hooks for common notification patterns
export const useSuccessNotification = () => {
  const { addNotification } = useNotifications();
  return useCallback((title: string, message?: string) => {
    addNotification({ type: 'success', title, message });
  }, [addNotification]);
};

export const useErrorNotification = () => {
  const { addNotification } = useNotifications();
  return useCallback((title: string, message?: string, actions?: NotificationAction[]) => {
    addNotification({ type: 'error', title, message, actions });
  }, [addNotification]);
};

export const useWarningNotification = () => {
  const { addNotification } = useNotifications();
  return useCallback((title: string, message?: string) => {
    addNotification({ type: 'warning', title, message });
  }, [addNotification]);
};

export const useInfoNotification = () => {
  const { addNotification } = useNotifications();
  return useCallback((title: string, message?: string) => {
    addNotification({ type: 'info', title, message });
  }, [addNotification]);
};