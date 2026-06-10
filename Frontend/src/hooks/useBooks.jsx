import { useState, useEffect, useCallback } from "react";
import {
  fetchBookItemsFromServer,
  deleteBookFromServer,
} from "../service/bookService";

export default function useBooks() {
  // ── State ─────────────────────────────────────────────
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete flow state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch Books ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadBooks = async () => {
      try {
        setError(null);

        const data = await fetchBookItemsFromServer();

        if (!cancelled) {
          setBooks(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load books. Please try again.");

          if (import.meta.env.DEV) {
            console.error("[AuthorDashboardPage] Fetch failed:", err);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Delete Book ──────────────────────────────────────
  const deleteBook = useCallback(async (id) => {
    await deleteBookFromServer(id);

    setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
  }, []);

  // ── Delete Modal Flow ────────────────────────────────
  const handleDeleteRequest = useCallback((book) => {
    setDeleteTarget(book);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);

      await deleteBook(deleteTarget._id);

      setDeleteTarget(null);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("[AuthorDashboardPage] Delete failed:", err);
      }
    } finally {
      setIsDeleting(false);
    }
  }, [deleteBook, deleteTarget]);

  // ── Exposed API ──────────────────────────────────────
  return {
    books,
    loading,
    error,
    deleteTarget,
    isDeleting,
    deleteBook,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
}
