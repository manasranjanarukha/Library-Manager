// React
import React, { useMemo } from "react";

// Router
import { Link } from "react-router-dom";

// Icons
import {
  User,
  Calendar,
  FileText,
  Tag,
  Star,
  Hash,
  BookOpen,
} from "lucide-react";

// Components
import StarDisplay from "../StarDisplay";

export default function SideBar({ book, avgRating, reviews, authorName }) {
  const ratingCounts = useMemo(() => {
    const counts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      const rounded = Math.round(review.rating);

      if (counts[rounded] !== undefined) {
        counts[rounded]++;
      }
    });

    return counts;
  }, [reviews]);
  const detailItems = [
    { icon: User, label: "Author", value: authorName },
    {
      icon: Calendar,
      label: "Published",
      value: book.publishedYear,
    },
    {
      icon: FileText,
      label: "Pages",
      value: `${book.pages} pages`,
    },
    { icon: Tag, label: "Genre", value: book.genre },
    {
      icon: Star,
      label: "Rating",
      value: avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : "Unrated",
    },
    {
      icon: Hash,
      label: "Reviews",
      value: `${reviews.length} review${reviews.length !== 1 ? "s" : ""}`,
    },
  ];
  return (
    <div>
      <aside
        className="space-y-4 lg:space-y-5 fade-up"
        style={{ animationDelay: "200ms" }}
      >
        {/* Quick stats card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:p-6">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Book Details
          </h3>
          <div className="space-y-3">
            {detailItems.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
              >
                <Icon
                  className="h-4 w-4 flex-shrink-0 text-teal-600"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="truncate text-xs font-bold text-slate-700">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cover preview card (desktop only) */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
          <div className="relative">
            <img
              src={book.cover}
              alt={`Full cover of ${book.title}`}
              className="w-full object-cover aspect-2/3"
              loading="lazy"
            />
            {/* Genre pill over cover */}
            {book.genre && (
              <span className="absolute left-3 top-3 rounded-full bg-teal-700/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                {book.genre}
              </span>
            )}
          </div>
          <div className="p-4">
            <Link
              to={`/book/${book._id}/read`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-teal-800 active:scale-[0.97]"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Read Now
            </Link>
          </div>
        </div>

        {/* Rating visual (desktop sidebar) */}
        {avgRating > 0 && (
          <div className="hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:block lg:p-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              Community Rating
            </h3>
            <div className="flex items-end gap-3">
              <span
                className="text-5xl font-black text-teal-700"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {avgRating.toFixed(1)}
              </span>
              <div className="mb-1.5">
                <StarDisplay rating={avgRating} size="lg" />
                <p className="mt-1 text-xs text-slate-400">out of 5</p>
              </div>
            </div>
            {/* Mini bar chart */}
            <div className="mt-4 space-y-1.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const count = ratingCounts[n];

                const pct =
                  reviews.length > 0
                    ? Math.round((count / reviews.length) * 100)
                    : 0;

                return (
                  <div key={n} className="flex items-center gap-2">
                    <span className="w-4 text-right text-[11px] font-semibold text-slate-400">
                      {n}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-600 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-[11px] text-slate-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
