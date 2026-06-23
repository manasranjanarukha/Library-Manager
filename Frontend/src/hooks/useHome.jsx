import { useState, useEffect, useMemo } from "react";
import useDebounce from "./useDebounce";
import { fetchBookItemsFromServer } from "../service/bookService";
export default function useHome() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBookItemsFromServer(undefined, page)
      .then((fetched) => {
        setBooks((prev) => (page === 1 ? fetched : [...prev, ...fetched]));
      })
      .finally(() => setLoading(false));
  }, [page]);
  function handleNext() {
    setPage((page) => page + 1);
  }
  const banners = useMemo(
    () =>
      [...books]
        .filter((b) => b.cover && b.rating?.average >= 4)
        .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
        .slice(0, 5),
    [books],
  );

  const trendingBooks = useMemo(
    () => [...books].filter((b) => b.saves >= 2),
    [books],
  );

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => {
        const matchesGenre =
          activeGenre === "All" ||
          book.genre?.toLowerCase() === activeGenre.toLowerCase();
        const q = debouncedSearchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          book.title?.toLowerCase().includes(q) ||
          book.author?.fullName?.toLowerCase().includes(q) ||
          book.genre?.toLowerCase().includes(q);
        return matchesGenre && matchesSearch;
      }),
    [books, activeGenre, debouncedSearchQuery],
  );

  return {
    filteredBooks,
    loading,
    activeGenre,
    setActiveGenre,
    searchQuery,
    setSearchQuery,
    banners,
    trendingBooks,
    handleNext,
  };
}
