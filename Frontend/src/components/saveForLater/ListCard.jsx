import { useContext, memo } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { Trash2, Calendar, BookOpen } from "lucide-react";
import StarRow from "../StarDisplay";
function ListCard({ book, index, onRemove, removing }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const author = book?.author?.fullName || "Unknown Author";

  function viewDetails() {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    navigate(`/book-items/${book?._id}`);
  }

  return (
    <article
      className={[
        "group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white",
        "border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.05)]",
        "hover:shadow-[0_6px_24px_rgba(15,118,110,0.10)] hover:border-[#0F766E]/20",
        "transition-all duration-300",
        removing
          ? "opacity-0 scale-95 pointer-events-none"
          : "opacity-100 scale-100",
      ].join(" ")}
      itemScope
      itemType="https://schema.org/Book"
    >
      {/* Index */}
      <span className="hidden sm:flex w-6 text-right text-xs font-bold text-[#CBD5E1] flex-shrink-0 group-hover:text-teal-700 transition-colors duration-200 tabular-nums select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Cover */}
      <div className="flex-shrink-0 w-12 h-[68px] sm:w-14 sm:h-20 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 group-hover:ring-[#0F766E]/30 transition-all duration-300">
        <img
          src={book?.cover}
          alt={`Cover of ${book?.title}`}
          loading="lazy"
          itemProp="image"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <h3
              className="text-sm sm:text-base font-bold text-[#1E293B] leading-snug line-clamp-1 group-hover:text-teal-700 transition-colors duration-200"
              itemProp="name"
            >
              {book?.title}
            </h3>
            <p
              className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 font-medium truncate"
              itemProp="author"
            >
              {author}
            </p>
          </div>
          <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F766E]/8 text-teal-700 border border-[#0F766E]/15">
            {book?.genre}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
          <StarRow rating={book?.rating?.average || 0} />
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#94A3B8] font-medium">
            <Calendar className="w-3 h-3 text-teal-700" aria-hidden="true" />
            <span itemProp="datePublished">{book?.publishedYear}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#94A3B8] font-medium">
            <BookOpen className="w-3 h-3 text-teal-700" aria-hidden="true" />
            <span itemProp="numberOfPages">{book?.pages} pp.</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={viewDetails}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F766E]/8 border border-[#0F766E]/20 text-teal-700 text-xs font-semibold hover:bg-[#0F766E] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
          aria-label={`View details for ${book?.title}`}
        >
          View
        </button>
        <button
          onClick={onRemove}
          aria-label={`Remove ${book?.title} from reading list`}
          className="p-2 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5 text-[#DC2626] hover:bg-[#DC2626] hover:text-white hover:border-[#DC2626] transition-all duration-200 active:scale-90 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 w-[3px] h-0 bg-[#0F766E] rounded-l-2xl group-hover:h-full transition-all duration-300"
        aria-hidden="true"
      />
    </article>
  );
}
export default memo(ListCard);
