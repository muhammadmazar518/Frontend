import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

let idCounter = 0;

const ICONS = {
  success: { glyph: "✓", className: "border-success/40 bg-success/15 text-success" },
  error: { glyph: "✕", className: "border-danger/40 bg-danger/15 text-danger" },
  warning: { glyph: "!", className: "border-warning/40 bg-warning/15 text-warning" },
  info: { glyph: "i", className: "border-primary/30 bg-primary-soft text-primary" },
};

const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-5 right-5 z-[1000] flex max-w-[min(380px,calc(100vw-40px))] flex-col gap-2.5">
    {toasts.map((t) => {
      const icon = ICONS[t.type] || ICONS.info;
      return (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          onClick={() => onDismiss(t.id)}
          className="flex animate-toast-in cursor-pointer items-start gap-3 rounded-md border border-line-strong bg-surface p-4 shadow-lg"
        >
          <div
            className={`flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border text-xs font-extrabold ${icon.className}`}
          >
            {icon.glyph}
          </div>
          <div>
            {t.title && (
              <p className="mb-0.5 text-[13.5px] font-bold text-text">{t.title}</p>
            )}
            <p className="m-0 text-[13px] leading-relaxed text-text-2">{t.message}</p>
          </div>
        </div>
      );
    })}
  </div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info", opts = {}) => {
      const id = ++idCounter;
      setToasts((list) => [...list, { id, message, type, title: opts.title }]);
      const duration = opts.duration ?? 4200;
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      info: (message, opts) => push(message, "info", opts),
      success: (message, opts) => push(message, "success", opts),
      error: (message, opts) => push(message, "error", opts),
      warning: (message, opts) => push(message, "warning", opts),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};
