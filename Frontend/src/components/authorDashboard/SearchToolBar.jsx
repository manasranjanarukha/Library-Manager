import { Search, X } from "lucide-react";

// Constants
const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
];

// Component
export default function SearchToolBar({
  search,
  setSearch,
  filter,
  setFilter,
  resetFilters,
  hasActiveFilters,
  filteredBooks,
  books,
}) {
  return (
    <section
      aria-label="Search and filter books"
      className="animate-[fadeUp_0.35s_ease_both]"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your books…"
            aria-label="Search books by title"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/25 focus:border-[#0F766E] transition-all duration-200 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-[#64748B]" />
            </button>
          )}
        </div>

        {/* Filter pills + sort */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filters */}
          <div
            className="flex p-1 gap-1 bg-white rounded-xl border border-slate-200 shadow-sm"
            role="group"
            aria-label="Filter by status"
          >
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                aria-pressed={filter === opt.value}
                className={[
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                  filter === opt.value
                    ? "bg-[#0F766E] text-white shadow-sm"
                    : "text-[#64748B] hover:text-[#1E293B]",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Clear filters chip */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC2626] bg-[#DC2626]/5 border border-[#DC2626]/15 hover:bg-[#DC2626]/10 transition-all duration-200 active:scale-95"
              aria-label="Clear all filters"
            >
              <X className="w-3 h-3" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <p
        className="text-xs text-[#94A3B8] font-medium mt-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {filteredBooks.length} of {books.length} book
        {books.length !== 1 ? "s" : ""}
        {hasActiveFilters ? " (filtered)" : ""}
      </p>
    </section>
  );
}
