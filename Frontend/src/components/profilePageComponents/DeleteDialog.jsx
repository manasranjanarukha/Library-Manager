// Icons
import { Trash2 } from "lucide-react";
export default function DeleteDialog({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm account deletion"
    >
      <div
        className="absolute inset-0 bg-[#1E293B]/30 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 w-full max-w-sm
        animate-[fadeUp_0.4s_ease_both]"
      >
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#DC2626]/8 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-[#DC2626]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-[#1E293B] text-base">
              Delete account?
            </h3>
            <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
              This is permanent and cannot be undone. All your data will be
              removed.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#b91c1c] transition-colors cursor-pointer active:scale-95"
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}
