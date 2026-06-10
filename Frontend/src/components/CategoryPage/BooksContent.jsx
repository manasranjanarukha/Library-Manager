import { RefreshCw } from "lucide-react";
import { VIEWS } from "../../constants/sortOptions";
import BookGridCard from "./BookGridCard";
import BookListItem from "./BookListItem";
import EmptyState from "./EmptyState";
import SkeletonGrid from "./SkeletonGrid";
import SkeletonList from "./SkeletonList";

function BooksContent({
  loading,
  filtered,
  genre,
  view,
  gridCols,
  query,
  subcat,
  resetFilters,
  hasMore,
  paginated,
  setPage,
}) {
  return (
    <main
      className="mx-auto max-w-6xl px-3 pb-24 sm:px-6 lg:px-8 "
      aria-label={`${genre} books`}
    >
      {loading ? (
        view === VIEWS.LIST ? (
          <SkeletonList />
        ) : (
          <SkeletonGrid cols={gridCols} />
        )
      ) : filtered.length === 0 ? (
        <EmptyState
          query={query}
          subcat={subcat}
          genre={genre}
          onReset={resetFilters}
        />
      ) : view === VIEWS.LIST ? (
        /* ── LIST VIEW ── */
        <div
          className="overflow-hidden rounded-none border-y border-slate-100 bg-white sm:rounded-2xl sm:border flex flex-col gap-4 divide-y divide-slate-100"
          role={VIEWS.LIST}
        >
          {paginated.map((book, i) => (
            <div
              key={book._id}
              role="listitem"
              style={{
                animation: "fadeUp 0.3s ease both",
                animationDelay: `${Math.min(i * 25, 200)}ms`,
              }}
            >
              <BookListItem book={book} rank={i + 1} />
            </div>
          ))}
        </div>
      ) : (
        /* ── GRID VIEW ── */
        <div
          className={`grid gap-10 px-2 sm:gap-4 sm:px-0 ${gridCols}`}
          role={VIEWS.GRID}
        >
          {paginated.map((book, i) => (
            <div
              key={book._id}
              role="griditem"
              style={{
                animation: "fadeUp 0.3s ease both",
                animationDelay: `${Math.min(i * 25, 200)}ms`,
              }}
            >
              <BookGridCard book={book} />
            </div>
          ))}
        </div>
      )}

      {/* ── Load more ── */}
      {!loading && hasMore && (
        <div className="mt-6 px-4 sm:px-0">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-white py-3 text-sm font-semibold text-teal-700 transition-all duration-150 hover:bg-teal-50 hover:shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Load more books ({filtered.length - paginated.length} remaining)
          </button>
        </div>
      )}
    </main>
  );
}

export default BooksContent;
