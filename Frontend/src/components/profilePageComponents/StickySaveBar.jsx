// React
import React from "react";
// Icons
import { Save, CheckCircle } from "lucide-react";

export default function StickySaveBar({
  handleSave,
  handleCancel,
  saveAnim,
  isEditing,
}) {
  return (
    <>
      {isEditing && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 animate-[fadeUp_0.4s_ease_both]">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_32px_rgba(15,118,110,0.18)]">
            <span className="flex-1 text-xs text-[#64748B] font-medium pl-1 hidden sm:block">
              Unsaved changes
            </span>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              aria-label="Save profile changes"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0d6560] shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex-shrink-0 cursor-pointer"
            >
              {saveAnim ? (
                <CheckCircle
                  className="w-4 h-4 save-success"
                  aria-hidden="true"
                />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              {saveAnim ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
