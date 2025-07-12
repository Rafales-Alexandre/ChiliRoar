"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  showLoading: (message: string) => string;
  dismissToast: (toastId: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#fff',
        border: '1px solid #059669',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 6000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: '#fff',
        border: '1px solid #DC2626',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#3B82F6',
        color: '#fff',
        border: '1px solid #2563EB',
      },
      icon: 'ℹ️',
    });
  };

  const showWarning = (message: string) => {
    toast(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#F59E0B',
        color: '#fff',
        border: '1px solid #D97706',
      },
      icon: '⚠️',
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6B7280',
        color: '#fff',
        border: '1px solid #4B5563',
      },
    });
  };

  const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
  };

  const value: ToastContextType = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismissToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        toastOptions={{
          className: 'font-medium',
          duration: 4000,
        }}
      />
    </ToastContext.Provider>
  );
} 