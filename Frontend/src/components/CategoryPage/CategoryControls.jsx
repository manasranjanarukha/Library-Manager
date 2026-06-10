import { LayoutGrid, List, Search, X } from "lucide-react";
import { VIEWS } from "../../constants/sortOptions";
import SortDropDown from "./SortDropDown";

// Unused import - genre prop is used but doesn't come from imports
function CategoryControls({
  query,
  setQuery,
  sortBy,
  setSortBy,
  view,
  setView,
  subcat,
  setSubcat,
  subcats,
  genre,
}) {
  return (
    <div className="sticky top-14 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      {/* Search + Sort */}
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${genre}…`}
            aria-label={`Search books in ${genre}`}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <SortDropDown value={sortBy} onChange={setSortBy} />

        {/* View toggle */}
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {[
            { id: VIEWS.LIST, Icon: List },
            { id: VIEWS.GRID, Icon: LayoutGrid },
          ].map(({ id, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              aria-label={`Switch to ${id} view`}
              aria-pressed={view === id}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150 cursor-pointer ${
                view === id
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory pills */}
      {subcats.length > 1 && (
        <div
          className="pills-scroll flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 sm:px-6 lg:px-8 max-w-6xl mx-auto"
          role="listbox"
          aria-label="Filter by subcategory"
        >
          {subcats.map((s) => (
            <button
              key={s}
              role="option"
              aria-selected={subcat === s}
              onClick={() => setSubcat(s)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer   ${
                subcat === s
                  ? "bg-teal-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryControls;
