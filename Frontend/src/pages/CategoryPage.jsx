import { useNavigate, useParams } from "react-router-dom";

import BooksContent from "../components/CategoryPage/BooksContent";
import CategoryControls from "../components/CategoryPage/CategoryControls";
import CategoryHeader from "../components/CategoryPage/CategoryHeader";
import PageMeta from "../components/PageMeta";
import ResultSummery from "../components/CategoryPage/ResultSummery";
import { GENRE_META } from "../constants/geners";
import useGenreBooks from "../hooks/useGenreBooks";
export default function CategoryPage() {
  const { genre } = useParams();
  const navigate = useNavigate();
  const {
    meta,
    loading,
    query,
    setQuery,
    sortBy,
    setSortBy,
    view,
    setView,
    subcat,
    setSubcat,
    paginated,
    hasMore,
    avgRating,
    subcats,
    resetFilters,
    books,
    filtered,
    setPage,
  } = useGenreBooks(genre);
  console.log("CategoryPage Render:", loading, hasMore);
  /* Grid cols class */
  const gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

  return (
    <>
      {" "}
      <PageMeta
        title={`${genre} Books — Readymate`}
        description={`Browse  ${genre} books on Readymate. ${GENRE_META[genre]?.desc || "Discover great reads."}`}
        keywords={`${genre}, books, reading, ${GENRE_META[genre]?.desc || "Discover great reads."}`}
      />
      <style>{`
         @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .pills-scroll::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="min-h-screen bg-[#F8FAFC]">
        <CategoryHeader
          meta={meta}
          genre={genre}
          bookCount={books.length}
          avgRating={avgRating}
          onBack={() => navigate(-1)}
        />
        <CategoryControls
          query={query}
          setQuery={setQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          view={view}
          setView={setView}
          subcat={subcat}
          setSubcat={setSubcat}
          subcats={subcats}
          genre={genre}
        />
        <ResultSummery
          filtered={filtered}
          subcat={subcat}
          query={query}
          resetFilters={resetFilters}
        />
        <BooksContent
          filtered={filtered}
          genre={genre}
          loading={loading}
          view={view}
          gridCols={gridCols}
          query={query}
          subcat={subcat}
          resetFilters={resetFilters}
          hasMore={hasMore}
          paginated={paginated}
          setPage={setPage}
        />
      </div>
    </>
  );
}
