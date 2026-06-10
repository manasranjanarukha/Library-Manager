import { EyeOff, Eye, CheckCircle, Info } from "lucide-react";
export default function StatusToggle({ value, onChange }) {
  const isDraft = value === "draft";

  return (
    <div className="flex flex-col gap-3">
      {/* Toggle row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
        {/* Status indicator */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={[
              "w-2 h-2 rounded-full flex-shrink-0",
              isDraft ? "bg-amber-400" : "bg-emerald-500",
            ].join(" ")}
            aria-hidden="true"
          />
          <span className="text-sm text-[#1E293B] font-medium truncate">
            {isDraft
              ? "Draft — hidden from readers"
              : "Published — visible to all readers"}
          </span>
        </div>

        {/* Toggle buttons */}
        <div
          className="flex p-1 gap-1 bg-slate-100 rounded-xl flex-shrink-0"
          role="group"
          aria-label="Publication status"
        >
          <button
            type="button"
            onClick={() => onChange("draft")}
            aria-pressed={isDraft}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
              isDraft
                ? "bg-amber-400 text-amber-900 shadow-sm"
                : "text-black hover:text-[#1E293B]",
            ].join(" ")}
          >
            <EyeOff className="w-3 h-3" aria-hidden="true" />
            Draft
          </button>
          <button
            type="button"
            onClick={() => onChange("published")}
            aria-pressed={!isDraft}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
              !isDraft
                ? "bg-[#0F766E] text-white shadow-sm"
                : "text-black hover:text-[#1E293B]",
            ].join(" ")}
          >
            <Eye className="w-3 h-3" aria-hidden="true" />
            Publish
          </button>
        </div>
      </div>

      {/* Contextual info banner */}
      {isDraft ? (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50">
          <Info
            className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-bold text-amber-800 mb-0.5">
              Saving as draft
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Your book will be saved but hidden from all readers. You can
              publish it any time from your Author Dashboard.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50">
          <CheckCircle
            className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-bold text-emerald-800 mb-0.5">
              Ready to publish
            </p>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Your book will be immediately visible to all readers on the
              platform once you submit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
