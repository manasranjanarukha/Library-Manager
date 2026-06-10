import { useMemo } from "react";

export default function useStats(books) {
  return useMemo(() => {
    if (!books.length) return null;

    const published = books.filter((b) => b.status !== "draft").length;
    const drafts = books.length - published;
    const totalSaves = books.reduce((sum, b) => sum + (b.saves || 0), 0);

    const ratings = books.map((b) => b.rating?.average).filter(Boolean);
    const avgRating = ratings.length
      ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1)
      : "—";

    // Top genre by frequency
    const genreMap = books.reduce((acc, b) => {
      if (b.genre) acc[b.genre] = (acc[b.genre] || 0) + 1;
      return acc;
    }, {});
    const topGenre =
      Object.entries(genreMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return {
      total: books.length,
      published,
      drafts,
      avgRating,
      totalSaves,
      topGenre,
    };
  }, [books]);
}
