// React
import { useState, useContext, useMemo } from "react";

// Router
import { Link, useNavigate } from "react-router-dom";

// Icons
import { Star, Calendar, BookOpen, Bookmark, ChevronRight } from "lucide-react";

// Contexts
import { UserContext } from "../context/UserContext";
import { useSaveForLater } from "../context/SaveForLaterContext";
function renderStars(rating) {
  if (rating === undefined || rating === null) return null;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
        />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="w-3.5 h-3.5 text-slate-200" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-slate-200" />
      ))}
      <span className="text-xs font-semibold text-slate-500 ml-1.5">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function BookCard({ book }) {
  console.log("BookCard Render:", book);
  const {
    _id,
    title,
    cover,
    genre,
    description,
    publishedYear,
    pages,
    rating,
    author,
  } = book;
  const {
    saveForLaterBooks,
    removeSaveForLaterContext,
    addSaveForLaterContext,
  } = useSaveForLater();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const saveForLaterIds = useMemo(
    () => new Set(saveForLaterBooks.map((f) => f?._id)),
    [saveForLaterBooks],
  );
  console.log("Save For Later ids", saveForLaterIds);

  const isSaveForLater = saveForLaterIds.has(_id);

  async function toggleSaveForLater() {
    if (!user) {
      alert("Please login or Register");
      navigate("/auth/login");
      return;
    }
    try {
      if (isSaveForLater) {
        await removeSaveForLaterContext(_id);
      } else {
        await addSaveForLaterContext(_id);
        // navigate(`/reader/${user._id}/save-for-later`);
      }
    } catch (error) {
      console.error("Save for later error:", error);
    }
  }

  const bookStructuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    author: {
      "@type": "Person",
      name: author?.fullName || "Unknown Author",
    },
    image: cover,
    numberOfPages: pages,
    datePublished: publishedYear,
    ...(rating?.average && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.average,
        bestRating: "5",
      },
    }),
  };

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] shadow-[0_2px_12px_rgba(0,0,0,0.07)] border border-slate-100 active:scale-[0.99] h-full">
      <script type="application/ld+json">
        {JSON.stringify(bookStructuredData)}
      </script>
      <div className="flex gap-0 h-full">
        {/* Cover Column */}
        <div className="relative flex-shrink-0 w-[110px] sm:w-[130px]">
          <div className="relative h-full min-h-[170px] bg-slate-50 overflow-hidden">
            <img
              src={cover}
              alt={`Cover of ${title}`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            <div className="absolute top-2.5 left-0 right-0 flex justify-center">
              <span className="bg-teal-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm max-w-[90%] truncate">
                {genre}
              </span>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 flex flex-col p-3.5 sm:p-4 min-w-0">
          <div className="mb-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
              {author?.fullName || "Unknown Author"}
            </p>
          </div>

          <div className="mb-2">{renderStars(rating?.average || 0)}</div>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3 flex-1">
            {description}
          </p>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Calendar className="w-3 h-3 text-teal-500" aria-hidden="true" />
              <span>{publishedYear}</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <BookOpen className="w-3 h-3 text-teal-500" aria-hidden="true" />
              <span>{pages} pp.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/books/${_id}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            <button
              onClick={toggleSaveForLater}
              aria-label={
                isSaveForLater ? "Remove from Save for later" : "Save for later"
              }
              className={`flex-shrink-0 p-2 rounded-xl border-2 transition-all duration-200 active:scale-90 cursor-pointer ${
                isSaveForLater
                  ? "border-red-300 bg-red-50 text-red-500 hover:bg-red-100"
                  : "border-slate-200 bg-slate-50 text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 transition-all duration-200 ${isSaveForLater ? "fill-red-500 text-red-500" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-teal-500 to-teal-300 group-hover:w-full transition-all duration-500 rounded-full" />
    </article>
  );
}
