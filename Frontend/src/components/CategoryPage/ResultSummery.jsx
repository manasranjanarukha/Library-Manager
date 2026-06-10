import { X } from "lucide-react";

function ResultSummery({ filtered, subcat, query, resetFilters }) {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
      <p className="text-xs text-slate-400">
        <span className="font-bold text-slate-700">{filtered.length}</span> book
        {filtered.length !== 1 ? "s" : ""} found
        {subcat !== "All" ? ` in ${subcat}` : ""}
        {query ? ` for "${query}"` : ""}
      </p>
      {(query || subcat !== "All") && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:underline"
        >
          <X className="h-3 w-3" aria-hidden="true" />
          Clear
        </button>
      )}
    </div>
  );
}

export default ResultSummery;
