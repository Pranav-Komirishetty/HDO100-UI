import React from "react";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  successMessage?: string;
  failMessage?: string;
  onConfirm: () => {};
  onCancel: () => void;
  variant?: "danger" | "success";
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",

  successMessage = "Completed",
  failMessage = "Unsuccessfull",
  onConfirm,
  onCancel,
  variant = "danger",
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  if (!isOpen) return null;

  const buttonColor =
    variant === "danger" ? "bg-red-600/30" : "bg-green-600/30";

  async function handleConfirm() {
    if (loading) return;

    setLoading(true);
    try {
      const res = await onConfirm();
      if (res == "failed") {
        setSuccess(true);
        setShowSuccess(false);
      } else {
        setSuccess(true);
        setShowSuccess(true);
      }

      setTimeout(() => {
        setLoading(false);
        resetModal();
      }, 2000);
    } catch {
      setLoading(false);
    }
  }

  const resetModal = () => {
    setSuccess(false);
    setShowSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] backdrop-blur-[0.75px] bg-stone-700/15 flex items-end justify-center">
      <div className="w-full px-4 pb-24">
        <div className="bg-neutral-800 backdrop-blur-3xl border-neutral-400 border-[0.75px] opacity-95 rounded-2xl p-6 shadow-2xl transition-all ease-in-out">
          {!success ? (
            <>
              <h2 className="text-lg text-neutral-200 font-semibold mb-2">
                {title}
              </h2>

              <p className="text-sm text-neutral-300 mb-6">{message}</p>

              <div className="flex gap-3 pt-2">
                <button
                  disabled={loading}
                  onClick={onCancel}
                  className="flex-1 py-3 text-neutral-300 font-semibold rounded-full bg-white/20 backdrop-blur-xl border border-white/20 disabled:opacity-50"
                >
                  {cancelText}
                </button>

                <button
                  disabled={loading}
                  onClick={handleConfirm}
                  className={`flex-1 text-neutral-300 font-semibold py-3 backdrop-blur-xl border border-white/20 rounded-full ${buttonColor} disabled:opacity-70 flex justify-center items-center`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </>
          ) : showSuccess ? (
            <div className="text-center py-6">
              <div className="text-green-600 text-4xl mb-3">✓</div>
              <p className="font-semibold text-green-600">{successMessage}</p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-red-600 text-4xl mb-3">X</div>
              <p className="font-semibold text-red-600">{failMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
