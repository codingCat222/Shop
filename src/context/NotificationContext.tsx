import React, { createContext, useContext, useState } from 'react';
import { EscrowNotification } from '../types/notification';

interface NotificationContextType {
  notifications: EscrowNotification[];
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<EscrowNotification[]>([]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => {
    const newNotif: EscrowNotification = {
      id: `notif_${Date.now()}`,
      userId: 'current_user',
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
