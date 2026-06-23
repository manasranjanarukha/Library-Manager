import { useContext, memo } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Trash2, Calendar, BookOpen, Star } from "lucide-react";
function GridCard({ book, onRemove, removing }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const author = book?.author?.fullName || "Unknown Author";
  console.log(book);

  function viewDetails() {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    navigate(`/books/${book?._id}`);
  }

  return (
    <article
      className={[
        "group relative bg-white rounded-2xl overflow-hidden flex flex-col",
        "border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)]",
        "hover:shadow-[0_8px_32px_rgba(15,118,110,0.13)] hover:border-[#0F766E]/20",
        "transition-all duration-300 active:scale-[0.98]",
        removing
          ? "opacity-0 scale-90 pointer-events-none"
          : "opacity-100 scale-100",
      ].join(" ")}
      itemScope
      itemType="https://schema.org/Book"
    >
      {/* Cover */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={book?.cover}
          alt={`Cover of ${book?.title}`}
          loading="lazy"
          itemProp="image"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          aria-hidden="true"
        />

        {/* Genre badge */}
        <div className="absolute top-2.5 left-0 right-0 flex justify-center px-2">
          <span className="bg-[#0F766E]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-sm max-w-full truncate">
            {book?.genre}
          </span>
        </div>

        {/* Remove on hover */}
        <button
          onClick={onRemove}
          aria-label={`Remove ${book?.title}`}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm text-[#DC2626] opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-sm hover:bg-[#DC2626] hover:text-white transition-all duration-200 active:scale-90 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        {/* Rating pill */}
        {book?.rating?.average > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
            <Star
              className="w-2.5 h-2.5 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span className="text-[10px] font-bold text-white">
              {book?.rating.average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">
        <h3
          className="text-xs sm:text-sm font-bold text-[#1E293B] leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors duration-200 mb-0.5"
          itemProp="name"
        >
          {book?.title}
        </h3>
        <p
          className="text-[10px] sm:text-[11px] text-[#94A3B8] font-medium truncate mb-2"
          itemProp="author"
        >
          {author}
        </p>

        <div className="flex items-center gap-2 mt-auto mb-2.5">
          <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
            <Calendar
              className="w-2.5 h-2.5 text-teal-700"
              aria-hidden="true"
            />
            <span>{book?.publishedYear}</span>
          </div>
          <div className="w-px h-3 bg-slate-200" aria-hidden="true" />
          <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
            <BookOpen
              className="w-2.5 h-2.5 text-teal-700"
              aria-hidden="true"
            />
            <span>{book?.pages} pp.</span>
          </div>
        </div>

        <button
          onClick={viewDetails}
          className="w-full py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d6560] text-white text-[11px] font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
          aria-label={`View details for ${book?.title}`}
        >
          View Details
        </button>
      </div>

      {/* Bottom teal accent */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#0F766E] to-[#14B8A6] group-hover:w-full transition-all duration-500"
        aria-hidden="true"
      />
    </article>
  );
}
export default memo(GridCard);
