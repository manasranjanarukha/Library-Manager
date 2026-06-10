// React
import { useRef } from "react";

// Icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// Components
import BookCard from "../BookCard";

export default function TrendingRow({ books }) {
  console.log("books", books);

  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll trending left"
        className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 items-center justify-center text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {books.map((book) => (
          <div
            key={book._id}
            className="flex-shrink-0 w-[290px] sm:w-[340px] snap-start"
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        aria-label="Scroll trending right"
        className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 items-center justify-center text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
