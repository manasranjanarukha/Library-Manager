// Grouped imports
import * as Icons from "lucide-react";

export default function EmptyFiltered({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <Icons.Search className="w-8 h-8 text-slate-200 mb-3" aria-hidden="true" />

      <p className="font-semibold text-[#1E293B] text-sm">No books match your filters</p>

      <p className="text-xs text-[#64748B] mt-1 mb-4">Try a different search term or filter.</p>

      <button onClick={onReset} className="text-xs font-semibold text-[#0F766E] hover:underline">
        Clear filters
      </button>
    </div>
  );
}
