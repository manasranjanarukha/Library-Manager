const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Highest rated", value: "rating" },
  { label: "Most saved", value: "saves" },
];
{
  /* Sort dropdown */
}
<div className="relative">
  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    aria-label="Sort books"
    className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/25 focus:border-[#0F766E] transition-all duration-200 shadow-sm cursor-pointer"
  >
    {SORT_OPTIONS.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
  <ArrowUpDown
    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none"
    aria-hidden="true"
  />
  <SlidersHorizontal
    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none"
    aria-hidden="true"
  />
</div>;
