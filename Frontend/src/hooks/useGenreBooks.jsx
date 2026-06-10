import React from "react";
import { useState, useEffect, useMemo } from "react";
import { fetchBookItemsFromServer } from "../service/bookService";
import { GENRE_META } from "../constants/geners";
import { SORTS } from "../constants/sortOptions";
import { FILTERS } from "../constants/sortOptions";
import { VIEWS } from "../constants/sortOptions";
import useDebounce from "./useDebounce";

export default function useGenreBooks(genre) {
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState(SORTS.RATING);
  const [view, setView] = useState(VIEWS.LIST);
  const [subcat, setSubcat] = useState(FILTERS.ALL);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const debouncedQuery = useDebounce(query, 2000);
  const meta = GENRE_META[genre] || {
    icon: "📚",
    desc: "Discover great reads",
  };

  /* Fetch all books once, filter client-side */

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchBookItemsFromServer(genre);
        setBooks(data || []);
      } catch (err) {
        setError("Unable to load books");

        if (import.meta.env.DEV) {
          console.error("Failed to fetch books:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  console.log(books._id);

  /* Reset page when filters change */
  useEffect(() => {
    setPage(1);
  }, [query, subcat, sortBy, genre]);

  const subcats = useMemo(() => {
    const tags = [...new Set(books.map((b) => b.genre).filter(Boolean))];
    return [FILTERS.ALL, ...tags];
  }, [books]);

  /* Filtered + sorted books */
  const filtered = useMemo(() => {
    let filteredBooks = [...books];

    if (subcat !== FILTERS.ALL)
      filteredBooks = filteredBooks.filter(
        (b) => (b.subGenre || b.genre) === subcat,
      );
    // Search in title and author
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      filteredBooks = filteredBooks.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.fullName?.toLowerCase().includes(q),
      );
    }
    // sort
    const sortStrategies = {
      [SORTS.RATING]: (a, b) =>
        (b.rating?.average || 0) - (a.rating?.average || 0),

      [SORTS.NEWEST]: (a, b) => (b.publishedYear || 0) - (a.publishedYear || 0),

      [SORTS.OLDEST]: (a, b) => (a.publishedYear || 0) - (b.publishedYear || 0),

      [SORTS.TITLE]: (a, b) => (a.title || "").localeCompare(b.title || ""),

      [SORTS.PAGES]: (a, b) => (b.pages || 0) - (a.pages || 0),
    };

    filteredBooks.sort(sortStrategies[sortBy] || (() => 0));

    return filteredBooks;
  }, [books, subcat, debouncedQuery, sortBy]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  console.log("paginated", paginated);

  const hasMore = paginated.length < filtered.length;

  const avgRating = useMemo(() => {
    const rated = books.filter((b) => b.rating?.average > 0);
    if (!rated.length) return null;
    return (
      rated.reduce((s, b) => s + b.rating.average, 0) / rated.length
    ).toFixed(1);
  }, [books]);

  function resetFilters() {
    setQuery("");
    setSubcat(FILTERS.ALL);
    setSortBy(SORTS.RATING);
  }

  return {
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
    error,
    setPage,
  };
}
