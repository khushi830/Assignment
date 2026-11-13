import React, { useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3200);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  let borderColor = 'border-primary-container';
  let iconName = 'info';
  let iconColor = 'text-primary-container';

  if (toast.type === 'success') {
    borderColor = 'border-on-tertiary-container';
    iconName = 'check_circle';
    iconColor = 'text-on-tertiary-container';
  } else if (toast.type === 'error') {
    borderColor = 'border-error';
    iconName = 'error';
    iconColor = 'text-error';
  } else if (toast.type === 'warning') {
    borderColor = 'border-secondary-container';
    iconName = 'warning';
    iconColor = 'text-secondary';
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto bg-surface-container-lowest text-on-surface rounded-2xl p-3.5 shadow-2xl border-l-4 ${borderColor} border border-surface-variant/40 flex items-start justify-between gap-3 transform transition-all duration-300 max-w-sm w-full`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`material-symbols-outlined text-xl ${iconColor} mt-0.5 shrink-0`}>
          {iconName}
        </span>
        <div>
          <div className="font-extrabold text-xs uppercase tracking-wider text-on-surface">
            {toast.title}
          </div>
          <div className="text-xs text-on-surface-variant mt-0.5 leading-relaxed font-medium">
            {toast.message}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors shrink-0"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

export default function Toast() {
  const { toasts, removeToast } = useBooking();

  if (!toasts || toasts.length === 0) return null;

  // Never stack repeated or multiple notifications: show only the single latest user action notification
  const latestToast = toasts[toasts.length - 1];

  return (
    <aside
      aria-label="Action Notifications"
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <ToastItem key={latestToast.id} toast={latestToast} onDismiss={removeToast} />
    </aside>
  );
}
