import React, { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(message: string, type: ToastType = "info") {
    const id = Date.now();

    const newToast = { id, message, type, visible: false };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, visible: true } : toast,
        ),
      );
    }, 10);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, visible: false } : toast,
        ),
      );
    }, 3500);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3800);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-16 right-4 z-[9999] space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-2xl bg-neutral-700 border-neutral-300/80 shadow-lg border-[0.75px] bg-opacity-95 animate-slideIn min-w-[220px] transition-all duration-300 ease-in-out ${
              toast.type === "success"
                ? "text-green-400"
                : toast.type === "error"
                  ? "text-red-400"
                  : "text-neutral-200"
            } ${toast.visible ? "opacity-100" : "opacity-0"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
