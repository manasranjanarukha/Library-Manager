import BookCard from "../BookCard";
import SkeletonList from "./SkeletonList";
import EmptyState from "./EmptyState";
export default function BookGridSection({
  loading,
  books,
  searchQuery,
  activeGenre,
}) {
  if (loading) {
    return <SkeletonList count={4} className="grid grid-cols-1 gap-3" />;
  }

  if (books.length === 0) {
    return <EmptyState query={searchQuery} genre={activeGenre} />;
  }

  return (
    <div
      className="grid grid-cols-1 gap-3"
      role="list"
      aria-label={`${activeGenre} books list`}
    >
      {books.map((book, i) => (
        <div
          key={book._id}
          role="listitem"
          className="fade-slide-in"
          style={{
            animationDelay: `${Math.min(i * 40, 300)}ms`,
          }}
        >
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
