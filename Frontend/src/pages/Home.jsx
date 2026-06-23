// React
import { useEffect, useMemo, useState } from "react";

// Icons
import { Flame, BookOpen, Search, TrendingUp } from "lucide-react";

// Components
import BookCard from "../components/BookCard";
import HeroCarousel from "../components/Home/HeroCarousel";
import CategoryPills from "../components/Home/CategoryPills";
import TrendingRow from "../components/Home/TrendingRow";
import PageMeta from "../components/PageMeta";
import SectionHeader from "../components/Home/SectionHeader";
import SearchBar from "../components/Home/SearchBar";
import BookGridSection from "../components/Home/BookGridSection";
import EmptyState from "../components/Home/EmptyState";
import SkeletonList from "../components/Home/SkeletonList";
import useHome from "../hooks/useHome";
import SortDropDown from "../components/SortDropDown";

// ─── Main Home Page ────────────────────────────────────────────────────────────
export default function Home() {
  const {
    filteredBooks,
    loading,
    activeGenre,
    setActiveGenre,
    searchQuery,
    setSearchQuery,
    banners,
    trendingBooks,
    handleNext,
  } = useHome();
  console.log("tren", trendingBooks);
  return (
    <>
      <PageMeta
        title="Readymate – Discover & Read Books Online"
        description="Browse thousands of books by genre, discover trending titles, and manage your reading list on Readymate."
      />

      <main
        className="min-h-screen w-full bg-[#F8FAFC]"
        aria-label="Readymate home page"
      >
        <div className="pt-6" aria-hidden="true" />

        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 pt-5 flex flex-col gap-5">
          {loading ? (
            <div className="rounded-2xl bg-slate-200 animate-pulse min-h-[220px] sm:min-h-[280px]" />
          ) : banners.length > 0 ? (
            <HeroCarousel banners={banners} />
          ) : null}

          {!searchQuery && activeGenre === "All" && (
            <section aria-labelledby="trending-heading">
              <SectionHeader
                icon={Flame}
                title="Trending Now"
                subtitle="Most loved by readers this week"
                iconColor="text-orange-500"
              />
              {loading ? (
                <SkeletonList
                  count={3}
                  className="flex gap-3 overflow-hidden"
                  itemClassName="flex-shrink-0 w-[280px]"
                />
              ) : (
                <TrendingRow books={trendingBooks} />
              )}
            </section>
          )}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryPills active={activeGenre} onChange={setActiveGenre} />
          <section aria-labelledby="books-heading">
            <SectionHeader
              icon={
                searchQuery
                  ? Search
                  : activeGenre === "All"
                    ? BookOpen
                    : TrendingUp
              }
              title={
                searchQuery
                  ? `Results for "${searchQuery}"`
                  : activeGenre === "All"
                    ? "All Books"
                    : `${activeGenre} Books`
              }
              subtitle={
                !loading
                  ? `${filteredBooks.length} book${filteredBooks.length !== 1 ? "s" : ""} available`
                  : undefined
              }
            />

            <BookGridSection
              loading={loading}
              books={filteredBooks}
              searchQuery={searchQuery}
              activeGenre={activeGenre}
            />
          </section>
          <button
            onClick={handleNext}
            className="bg-teal-300 py-3.5 text-black"
          >
            Next
          </button>
        </div>
      </main>
    </>
  );
}
