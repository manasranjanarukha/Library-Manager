import { Search } from "lucide-react";
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-6xl">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, author, or genre…"
        aria-label="Search books"
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] transition-all duration-200 shadow-sm"
      />
    </div>
  );
}
