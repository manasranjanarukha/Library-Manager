import { BookOpen, RefreshCw } from "lucide-react";

export default function EmptyState({ query, subcat, genre, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
        <BookOpen className="h-7 w-7 text-teal-300" aria-hidden="true" />
      </div>
      <p className="mb-1 text-sm font-bold text-slate-700">No books found</p>
      <p className="mb-5 text-xs leading-relaxed text-slate-400">
        {query
          ? `No results for "${query}" in ${subcat !== "All" ? subcat : genre}`
          : `No books in "${subcat}" yet`}
      </p>
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-white px-4 py-2 text-xs font-semibold text-teal-700 transition-all hover:bg-teal-50"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        Clear filters
      </button>
    </div>
  );
}
