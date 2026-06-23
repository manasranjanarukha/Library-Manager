import { Link, useNavigate } from "react-router-dom";
// Lucide React Icons
import {
  Bookmark,
  BookOpen,
  Calendar,
  Edit2,
  Eye,
  Star,
  Trash2,
} from "lucide-react";
function BookSchema({ book }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author?.fullName || "Unknown" },
    image: book.cover,
    numberOfPages: book.pages,
    datePublished: book.publishedYear,
    genre: book.genre,
    ...(book.rating?.average && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: book.rating.average,
        bestRating: "5",
        ratingCount: book.rating.count || 1,
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function BookCardWrapper({ book, onDeleteRequest }) {
  const isDraft = book.status === "draft";
  const rating = book.rating?.average || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);
  const navigate = useNavigate();

  return (
    <article
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_24px_rgba(15,118,110,0.10)] hover:border-[#0F766E]/20 transition-all duration-300 overflow-hidden"
      itemScope
      itemType="https://schema.org/Book"
    >
      {/* Schema.org metadata */}
      <BookSchema book={book} />

      <div className="flex">
        {/* Cover */}
        <div className="relative flex-shrink-0 w-[80px] sm:w-[100px] min-h-[130px] bg-slate-100 overflow-hidden">
          {book.cover ? (
            <img
              src={book.cover}
              alt={`Cover of ${book.title}`}
              loading="lazy"
              itemProp="image"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white/60" aria-hidden="true" />
            </div>
          )}

          {/* Gradient at bottom of cover */}
          <div
            className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Genre badge */}
          <div className="absolute top-2 left-0 right-0 flex justify-center px-1">
            <span className="bg-[#0F766E]/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full truncate max-w-full">
              {book.genre}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 min-w-0">
          {/* Title row + status badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <h3
                className="text-sm sm:text-base font-bold text-[#1E293B] leading-snug line-clamp-1 group-hover:text-[#0F766E] transition-colors duration-200"
                itemProp="name"
              >
                {book.title}
              </h3>
              <p
                className="text-[11px] text-[#64748B] font-medium truncate mt-0.5"
                itemProp="author"
              >
                {book.author?.fullName || "Unknown Author"}
              </p>
            </div>
            {/* Published / Draft status badge */}
            <span
              className={[
                "flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                isDraft
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200",
              ].join(" ")}
            >
              {isDraft ? "Draft" : "Published"}
            </span>
          </div>

          {/* Stars */}
          {rating > 0 && (
            <div
              className="flex items-center gap-0.5 mb-2"
              aria-label={`Rating: ${rating} out of 5`}
              role="img"
            >
              {[...Array(fullStars)].map((_, i) => (
                <Star
                  key={`f${i}`}
                  className="w-3 h-3 fill-amber-400 text-amber-400"
                />
              ))}
              {hasHalfStar && (
                <span className="relative inline-block w-3 h-3">
                  <Star className="absolute inset-0 w-full h-full text-slate-200" />
                  <span className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className="w-full h-full fill-amber-400 text-amber-400" />
                  </span>
                </span>
              )}
              {[...Array(emptyStars)].map((_, i) => (
                <Star key={`e${i}`} className="w-3 h-3 text-slate-200" />
              ))}
              <span className="text-[10px] font-bold text-[#64748B] ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            {book.publishedYear && (
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#94A3B8] font-medium">
                <Calendar
                  className="w-3 h-3 text-[#0F766E]"
                  aria-hidden="true"
                />
                <span itemProp="datePublished">{book.publishedYear}</span>
              </div>
            )}
            {book.pages && (
              <>
                <div className="w-px h-3 bg-slate-200" aria-hidden="true" />
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#94A3B8] font-medium">
                  <BookOpen
                    className="w-3 h-3 text-[#0F766E]"
                    aria-hidden="true"
                  />
                  <span itemProp="numberOfPages">{book.pages} pp.</span>
                </div>
              </>
            )}
            {book.saves > 0 && (
              <>
                <div className="w-px h-3 bg-slate-200" aria-hidden="true" />
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#94A3B8] font-medium">
                  <Bookmark
                    className="w-3 h-3 text-[#0F766E]"
                    aria-hidden="true"
                  />
                  <span>{book.saves} saves</span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-auto">
            <Link
              to={`/books/${book._id}`}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0F766E]/8 border border-[#0F766E]/20 text-[#0F766E] text-[11px] sm:text-xs font-semibold hover:bg-[#0F766E] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label={`View ${book.title}`}
            >
              <Eye className="w-3 h-3" aria-hidden="true" />
              View
            </Link>
            <Link
              to={`/edit-book/${book._id}`}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[#64748B] text-[11px] sm:text-xs font-semibold hover:bg-slate-100 hover:text-[#1E293B] transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label={`Edit ${book.title}`}
            >
              <Edit2 className="w-3 h-3" aria-hidden="true" />
              Edit
            </Link>
            <button
              onClick={() => onDeleteRequest(book)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/20 text-[#DC2626] text-[11px] sm:text-xs font-semibold hover:bg-[#DC2626] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label={`Delete ${book.title}`}
            >
              <Trash2 className="w-3 h-3" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Hover accent line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#0F766E] to-[#14B8A6] group-hover:w-full transition-all duration-500"
        aria-hidden="true"
      />
    </article>
  );
}
