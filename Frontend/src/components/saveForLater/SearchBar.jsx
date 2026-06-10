import { Search, X } from "lucide-react";
import { memo } from "react";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1 min-w-0">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your saved books…"
        aria-label="Search saved books"
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/25 focus:border-[#0F766E] transition-all duration-200 shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-3 h-3 text-[#64748B]" />
        </button>
      )}
    </div>
  );
}
export default memo(SearchBar);
