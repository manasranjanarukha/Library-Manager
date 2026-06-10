import { useMemo } from "react";
export default function useFilteredBooks(books, { search, filter, sort }) {
  return useMemo(() => {
    let result = [...books];

    // Filter by status
    if (filter === "published")
      result = result.filter((b) => b.status !== "draft");
    if (filter === "draft") result = result.filter((b) => b.status === "draft");

    // Search by title (case-insensitive)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((b) => b.title?.toLowerCase().includes(q));
    }

    // Sort
    switch (sort) {
      case "oldest":
        result.sort((a, b) => (a.publishedYear || 0) - (b.publishedYear || 0));
        break;
      case "newest":
        result.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0));
        break;
      case "rating":
        result.sort(
          (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0),
        );
        break;
      case "saves":
        result.sort((a, b) => (b.saves || 0) - (a.saves || 0));
        break;
      default:
        break;
    }

    return result;
  }, [books, search, filter, sort]);
}
