// React
import { useState, useCallback, useContext } from "react";
// Hooks
import useBooks from "../hooks/useBooks";
import useStats from "../hooks/useStats";
import useFilteredBooks from "../hooks/useFilteredBooks";
// Author dashboard components
import Header from "../components/authorDashboard/Header";
import StatsBar from "../components/authorDashboard/StatsBar";
import SearchToolBar from "../components/authorDashboard/SearchToolBar";
import DeleteModal from "../components/authorDashboard/DeleteModal";
import EmptyAll from "../components/authorDashboard/EmptyAll";
import EmptyFiltered from "../components/authorDashboard/EmptyFiltered";
import ErrorState from "../components/authorDashboard/ErrorState";
import BookCardWrapper from "../components/authorDashboard/BookCardWrapper";
// Generic components
import PageMeta from "../components/PageMeta";
// Context
import { UserContext } from "../context/userContext";

function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 flex overflow-hidden animate-pulse"
      aria-hidden="true"
    >
      <div className="w-[80px] sm:w-[100px] flex-shrink-0 bg-slate-200 min-h-[130px]" />
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded-full w-2/3" />
        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
        <div className="h-3 bg-slate-100 rounded-full w-1/2" />
        <div className="flex gap-2 mt-4">
          <div className="h-7 bg-slate-200 rounded-xl flex-1" />
          <div className="h-7 bg-slate-200 rounded-xl w-16" />
          <div className="h-7 bg-slate-200 rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

export default function AuthorDashboardPage() {
  const { user } = useContext(UserContext);
  const { _id: userId } = user || {};
  const {
    books,
    loading,
    error,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    deleteTarget,
    isDeleting,
  } = useBooks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const stats = useStats(books);
  const filteredBooks = useFilteredBooks(books, { search, filter, sort });
  console.log(stats);

  const resetFilters = useCallback(() => {
    setSearch("");
    setFilter("all");
    setSort("newest");
  }, []);

  const hasActiveFilters =
    search.trim() || filter !== "all" || sort !== "newest";

  return (
    <>
      <PageMeta
        title="Author Dashboard – Manage Your Books on Readymate"
        description="Manage your books and view your statistics."
        keywords="author, dashboard, books, statistics"
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>

      {deleteTarget && (
        <DeleteModal
          book={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}

      <main
        className="min-h-screen bg-[#F8FAFC]"
        aria-label="Author book management dashboard"
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-24 space-y-5 sm:space-y-6">
          <Header />
          {!loading && stats && <StatsBar stats={stats} />}

          {!loading && !error && books.length > 0 && (
            <SearchToolBar
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              resetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
              filteredBooks={filteredBooks}
              books={books}
            />
          )}

          {!loading && (
            <div className="h-px bg-gradient-to-r from-[#0F766E]/20 via-slate-200 to-transparent" />
          )}

          <section aria-label="Book list" aria-live="polite">
            {loading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {!loading && error && <ErrorState message={error} />}

            {!loading && !error && books.length === 0 && (
              <EmptyAll userId={userId} />
            )}

            {!loading &&
              !error &&
              books.length > 0 &&
              filteredBooks.length === 0 && (
                <EmptyFiltered onReset={resetFilters} />
              )}

            {!loading && !error && filteredBooks.length > 0 && (
              <div className="space-y-3" role="list" aria-label="Your books">
                {filteredBooks.map((book, i) => (
                  <div
                    key={book._id}
                    role="listitem"
                    style={{
                      animation: "fadeUp 0.35s ease both",
                      animationDelay: `${Math.min(i * 40, 300)}ms`,
                    }}
                  >
                    <BookCardWrapper
                      book={book}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {!loading && !error && filteredBooks.length > 0 && (
            <footer className="flex items-center justify-center gap-3 pt-2">
              <div
                className="h-px w-12 bg-gradient-to-r from-transparent to-slate-200"
                aria-hidden="true"
              />
              <span className="text-[11px] text-[#94A3B8] font-medium">
                {filteredBooks.length} book
                {filteredBooks.length !== 1 ? "s" : ""}
              </span>
              <div
                className="h-px w-12 bg-gradient-to-l from-transparent to-slate-200"
                aria-hidden="true"
              />
            </footer>
          )}
        </div>
      </main>
    </>
  );
}
