import React, { useState, useCallback } from 'react';
import Toast from './Toast';

let toastId = 0;
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = toastId++;
    const toast = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Expose showToast globally
  React.useEffect(() => {
    window.showToast = showToast;
    return () => {
      delete window.showToast;
    };
  }, [showToast]);

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Helper functions for easy use
export const toast = {
  success: (message, duration) => {
    if (window.showToast) {
      window.showToast(message, 'success', duration);
    }
  },
  error: (message, duration) => {
    if (window.showToast) {
      window.showToast(message, 'error', duration);
    }
  },
  warning: (message, duration) => {
    if (window.showToast) {
      window.showToast(message, 'warning', duration);
    }
  },
  info: (message, duration) => {
    if (window.showToast) {
      window.showToast(message, 'info', duration);
    }
  }
};

export default ToastContainer;

