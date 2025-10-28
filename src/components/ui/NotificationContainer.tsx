'use client';

import { useState, useCallback } from 'react';
import { Notification, type NotificationConfig } from './Notification';

interface NotificationWithId extends NotificationConfig {
  id: string;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationWithId[]>([]);

  const addNotification = useCallback((
    title: string,
    type: 'error' | 'success' | 'info' | 'warning' = 'info',
    message?: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const showError = useCallback((title: string, message?: string) => {
    return addNotification(title, 'error', message);
  }, [addNotification]);

  const showSuccess = useCallback((title: string, message?: string) => {
    return addNotification(title, 'success', message);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    return addNotification(title, 'warning', message);
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    return addNotification(title, 'info', message);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo
  };
}

interface NotificationContainerProps {
  notifications: NotificationWithId[];
  onRemove: (id: string) => void;
}

export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 pointer-events-none z-50">
      {notifications.map(notification => (
        <div key={notification.id} className="pointer-events-auto">
          <Notification
            {...notification}
            onClose={onRemove}
          />
        </div>
      ))}
    </div>
  );
}
