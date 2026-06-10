import { BookOpen } from "lucide-react";
export default function EmptyState({ query, genre }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <BookOpen className="w-12 h-12 text-slate-200 mb-4" aria-hidden="true" />
      <p className="text-[#1E293B] font-semibold text-base mb-1">
        No books found
      </p>
      <p className="text-[#64748B] text-sm">
        {query
          ? `No results for "${query}"${genre !== "All" ? ` in ${genre}` : ""}`
          : `No books in the "${genre}" category yet`}
      </p>
    </div>
  );
}
