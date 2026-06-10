//React
import { useEffect } from "react";
// Icons from lucide-react
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteModal({ book, onConfirm, onCancel, isDeleting }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1E293B]/30 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 w-full max-w-sm"
        style={{ animation: "modalIn 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Icon + title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#DC2626]/8 flex items-center justify-center flex-shrink-0">
            <AlertTriangle
              className="w-5 h-5 text-[#DC2626]"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2
              id="delete-dialog-title"
              className="font-bold text-[#1E293B] text-base leading-tight"
            >
              Delete "{book.title}"?
            </h2>
            <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
              This will permanently remove the book. Readers who saved it will
              lose it from their reading lists. This cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#64748B] hover:bg-slate-100 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#b91c1c] transition-colors duration-150 active:scale-95 disabled:opacity-60 cursor-pointer"
            aria-busy={isDeleting}
          >
            {isDeleting ? (
              <>
                <span
                  className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Yes, delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
