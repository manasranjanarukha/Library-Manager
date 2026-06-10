// React
import React, { useState } from "react";

// Router
import { Link } from "react-router-dom";

// Icons
import { BookOpen, Bookmark, ArrowLeft, Search } from "lucide-react";

// Contexts
import { useSaveForLater } from "../context/SaveForLaterContext";
// components
import PageMeta from "../components/PageMeta";
import ListCard from "../components/saveForLater/ListCard";
import GridCard from "../components/saveForLater/GridCard";
import EmptyState from "../components/saveForLater/EmptyState";
import SearchBar from "../components/saveForLater/SearchBar";
import ViewToggle from "../components/saveForLater/ViewToggle";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SaveForLater() {
  const { saveForLaterBooks, removeSaveForLaterContext } = useSaveForLater();
  const [view, setView] = useState("list");
  const [query, setQuery] = useState("");
  const [removing, setRemoving] = useState(new Set());

  const isEmpty = !saveForLaterBooks?.length;

  const filtered = saveForLaterBooks.filter((b) => {
    const q = query.toLowerCase();
    return (
      !q ||
      b.title?.toLowerCase().includes(q) ||
      b.author?.fullName?.toLowerCase().includes(q) ||
      b.genre?.toLowerCase().includes(q)
    );
  });
  console.log("filterred", filtered);

  async function handleRemove(id) {
    setRemoving((prev) => new Set([...prev, id]));
    await new Promise((r) => setTimeout(r, 300));
    try {
      await removeSaveForLaterContext(id);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Failed to remove book from reading list:", err);
      }
    } finally {
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  if (!saveForLaterBooks) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center animate-pulse">
          <BookOpen className="w-6 h-6 text-teal-700" aria-hidden="true" />
        </div>
        <p className="text-sm text-[#64748B]">Loading your reading list…</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`My Saved Books (${filtered.length}) | Readymate`}
        description="Manage your personal reading list on Readymate. Browse, search, and organize books you've saved for later reading."
        keywords="saved books, reading list, bookmarks, books to read, Readymate library"
      />

      {/* <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style> */}

      <main className="min-h-screen bg-[#F8FAFC]" aria-label="My reading list">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-24 space-y-5 sm:space-y-6">
          {/* ── Header ── */}
          <header>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#64748B] hover:text-teal-700 font-medium mb-4 transition-colors duration-200 group"
            >
              <ArrowLeft
                className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200"
                aria-hidden="true"
              />
              Back to Library
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 bg-[#0F766E]/8 text-teal-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#0F766E]/15">
                    <Bookmark
                      className="w-3 h-3 fill-[#0F766E]"
                      aria-hidden="true"
                    />
                    Reading List
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E293B] leading-tight tracking-tight">
                  My Saved Books
                </h1>
                <p className="text-sm text-[#64748B] mt-1 font-medium">
                  {saveForLaterBooks.length} book
                  {saveForLaterBooks.length !== 1 ? "s" : ""} in your reading
                  list
                </p>
              </div>

              {/* Controls */}
              {!isEmpty && (
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <SearchBar value={query} onChange={setQuery} />
                  <ViewToggle view={view} onChange={setView} />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mt-5 h-px bg-gradient-to-r from-[#0F766E]/20 via-slate-200 to-transparent" />
          </header>

          {/* ── Body ── */}
          {isEmpty ? (
            <EmptyState />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search
                className="w-8 h-8 text-slate-200 mb-3"
                aria-hidden="true"
              />
              <p className="font-semibold text-[#1E293B] text-sm">
                No results for "{query}"
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Try a different title, author, or genre.
              </p>
            </div>
          ) : view === "list" ? (
            <section aria-label="Saved books list">
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {filtered.map((book, i) => (
                  <li
                    key={book?._id}
                    style={{
                      animation: "fadeUp 0.35s ease both",
                      animationDelay: `${Math.min(i * 40, 280)}ms`,
                    }}
                  >
                    <ListCard
                      book={book}
                      index={i}
                      removing={removing.has(book?._id)}
                      onRemove={() => handleRemove(book?._id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section aria-label="Saved books grid">
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filtered.map((book, i) => (
                  <li
                    key={book?._id}
                    style={{
                      animation: "fadeUp 0.35s ease both",
                      animationDelay: `${Math.min(i * 40, 280)}ms`,
                    }}
                  >
                    <GridCard
                      book={book}
                      removing={removing.has(book?._id)}
                      onRemove={() => handleRemove(book?._id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Footer count ── */}
          {!isEmpty && filtered.length > 0 && (
            <footer className="flex items-center justify-center gap-3 pt-4">
              <div
                className="h-px w-12 bg-gradient-to-r from-transparent to-slate-200"
                aria-hidden="true"
              />
              <span className="text-[11px] text-[#94A3B8] font-medium tracking-wide">
                {filtered.length} of {saveForLaterBooks.length} book
                {saveForLaterBooks.length !== 1 ? "s" : ""}
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
