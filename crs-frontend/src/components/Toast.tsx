import { useEffect } from 'react';
import type { ToastState } from '../hooks/useToast';

interface ToastProps extends ToastState { onClose: () => void; }

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div role="alert" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1000, minWidth: 280, padding: '14px 18px', color: '#fff', backgroundColor: type === 'success' ? '#15803d' : '#b91c1c', borderRadius: 8, boxShadow: '0 8px 24px rgb(0 0 0 / 18%)' }}>
      {message}
      <button type="button" onClick={onClose} aria-label="Đóng thông báo" style={{ float: 'right', marginLeft: 16, color: '#fff', background: 'transparent', border: 0, cursor: 'pointer', fontSize: 18 }}>×</button>
    </div>
  );
}
