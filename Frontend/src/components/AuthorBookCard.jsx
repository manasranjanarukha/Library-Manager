// React
import React, { useState } from "react";

// Router
import { Link } from "react-router-dom";

// Icons
import { Loader, Trash2, Star, Calendar, BookOpen } from "lucide-react";

// 1. READABILITY: Moved pure function outside the component to prevent re-creation on every render
const renderStars = (rating) => {
  if (!rating) return null;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  );
};

export default function AuthorBookCard({ book, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. READABILITY: Destructure the book object early for cleaner JSX
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

  const authorName = author?.fullName || "Unknown Author";

  const handleDelete = async () => {
    if (isDeleting) return;
    if (!window.confirm("Delete this book?")) return;

    try {
      setIsDeleting(true);
      await onDelete(_id);
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
      alert("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // 3. SEO: Generate Structured Data for Search Engines
  const bookStructuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    author: {
      "@type": "Person",
      name: authorName,
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
    /* 4. SEO: Changed root div to <article> for better semantic meaning */
    <article className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 w-full group">
      {/* Inject SEO JSON-LD schema invisibly into the DOM */}
      <script type="application/ld+json">
        {JSON.stringify(bookStructuredData)}
      </script>

      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Left Side - Image Container */}
        <div className="flex-shrink-0 w-full sm:w-40 md:w-48 lg:w-44 xl:w-48">
          <div
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
            style={{ paddingTop: "150%" }}
          >
            <img
              src={cover}
              alt={`Cover art for ${title}`} // Slightly improved alt text for screen readers/SEO
              loading="lazy" // SEO/Performance: Lazy load off-screen images
              className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                {genre}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Book Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {title}
            </h2>
            <p className="text-gray-600 font-medium text-sm mb-2">
              by {authorName}
            </p>

            <div className="mb-3">{renderStars(rating?.average)}</div>

            <p className="text-gray-700 text-[1rem] leading-relaxed mb-3 line-clamp-3 sm:line-clamp-2 md:line-clamp-3">
              {description}
            </p>

            <div className="flex items-center gap-4 text-lg text-gray-500 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-medium">{publishedYear}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-medium">{pages} pages</span>
              </div>
            </div>
          </div>

          {/* Bottom Section - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            {/* 5. SEO & Accessibility: Use <Link> instead of <button onClick={navigate}> */}
            <Link
              to={`/edit-book/${_id}`}
              className="flex-1 text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95"
            >
              Edit Details
            </Link>

            <button
              className="sm:w-auto px-4 py-2.5 border-2 border-red-400 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label={`Delete ${title}`} // Accessibility
            >
              {isDeleting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="sm:hidden">Deleting</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span className="sm:hidden">Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
