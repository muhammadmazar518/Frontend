import { useEffect } from "react";
import { Button } from "./ui";

const toneClasses = {
  danger: "border-danger/40 bg-danger/15 text-danger",
  success: "border-success/40 bg-success/15 text-success",
  warning: "border-warning/40 bg-warning/15 text-warning",
};

export const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
      className="fixed inset-0 z-[900] flex animate-fade-up items-center justify-center bg-black/70 p-5 backdrop-blur-[6px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] animate-pop-in rounded-lg border border-line-strong bg-surface p-6 shadow-lg"
      >
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border text-xl font-extrabold ${toneClasses[tone] || toneClasses.danger}`}
        >
          !
        </div>
        <h3 className="m-0 text-[17px] font-bold text-text">{title}</h3>
        {message && (
          <p className="my-2 mb-5 text-[13.5px] leading-relaxed text-text-2">{message}</p>
        )}
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
