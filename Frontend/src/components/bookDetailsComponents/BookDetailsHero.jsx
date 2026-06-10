// React
import React from "react";

// Router
import { Link } from "react-router-dom";

// Icons
import { Calendar, FileText, Tag, BookOpen } from "lucide-react";

// Components
import StarDisplay from "../StarDisplay";
function Chip({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
        accent ? "bg-teal-50" : "bg-slate-50"
      }`}
    >
      <Icon
        className={`h-3.5 w-3.5 flex-shrink-0 ${
          accent ? "text-teal-600" : "text-slate-400"
        }`}
        aria-hidden="true"
      />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p
          className={`text-xs font-bold ${
            accent ? "text-teal-700" : "text-slate-700"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
export default function BookDetailsHero({ book, reviews }) {
  const avgRating = book?.rating?.average || 0;

  const { cover, title, author, publishedYear, pages, genre } = book;
  return (
    <div>
      <section
        className="relative mb-5 overflow-hidden rounded-3xl sm:mb-6 lg:mb-8 fade-up"
        aria-label="Book overview"
      >
        {/* Blurred bg from cover */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${cover})`,
            filter: "blur(32px) brightness(0.2) saturate(1.6)",
            transform: "scale(1.15)",
          }}
          aria-hidden="true"
        />
        {/* Teal directional overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-teal-950/85 via-teal-900/55 to-slate-900/70"
          aria-hidden="true"
        />
        {/* Bottom depth fade */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent"
          aria-hidden="true"
        />

        {/*
              Layout strategy:
              - mobile (< sm):       stacked, cover centered above text
              - tablet (sm – lg):    side-by-side, cover left, text right
              - desktop (lg+):       side-by-side, cover larger, more padding
              - wide (xl+):          even more padding + bigger cover
            */}
        <div
          className="relative z-10 flex flex-col items-center gap-5 px-5 py-8
                            sm:flex-row sm:items-end sm:gap-7 sm:px-8 sm:py-10
                            lg:gap-10 lg:px-12 lg:py-14
                            xl:px-16 xl:py-16"
        >
          {/* ── Cover image ──
                  Sizes at each breakpoint:
                  mobile:  120px wide (2:3 ratio → 180px tall)
                  sm:      148px wide → 222px tall
                  md:      168px wide → 252px tall
                  lg:      200px wide → 300px tall
                  xl:      220px wide → 330px tall
              ── */}
          <div className="flex-shrink-0">
            <div
              className="relative mx-auto
                             w-[120px]
                             sm:mx-0 sm:w-[148px]
                             md:w-[168px]
                             lg:w-[200px]
                             xl:w-[220px]"
            >
              <img
                src={cover}
                alt={`Cover of ${title}`}
                className="w-full rounded-2xl object-cover shadow-[0_20px_60px_rgba(0,0,0,0.65)]
                               ring-2 ring-white/15 lg:rounded-3xl aspect-2/3"
                loading="lazy"
              />
              {/* Glass shine overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl lg:rounded-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ── Text content ── */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            {/* Genre badge */}
            {genre && (
              <span className="mb-2 inline-block rounded-full bg-teal-600/90 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm sm:mb-3">
                {genre}
              </span>
            )}

            {/* Title */}
            <h1
              className="mb-1.5 line-clamp-3 font-bold leading-tight text-white
                             text-xl
                             sm:text-2xl sm:line-clamp-none
                             md:text-3xl
                             lg:text-4xl
                             xl:text-5xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {title}
            </h1>

            {/* Author */}
            <p className="mb-3 text-sm font-medium text-white/70 sm:mb-4 sm:text-base lg:text-lg">
              by{" "}
              <span className="font-semibold text-white/90">
                {author?.fullName || "Unknown Author"}
              </span>
            </p>

            {/* Rating row */}
            {avgRating > 0 && (
              <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:mb-4">
                <StarDisplay rating={avgRating} size="lg" />
                <span className="text-sm font-bold text-amber-300 lg:text-base">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-white/50">
                  ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Info chips */}
            <div className="mb-5 flex flex-wrap justify-center gap-2 sm:justify-start sm:mb-6 lg:gap-3">
              <Chip icon={Calendar} label="Year" value={publishedYear} />
              <Chip icon={FileText} label="Pages" value={`${pages} pp.`} />
              <Chip icon={Tag} label="Genre" value={genre} accent />
            </div>

            {/* CTA button */}
            <Link
              to={`/book/${book._id}/read`}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-2.5 text-sm font-bold text-teal-700
                             shadow-md transition-all duration-200
                             hover:bg-teal-600 hover:text-white hover:shadow-lg
                             active:scale-[0.97]
                             sm:px-7 sm:py-3
                             lg:px-8 lg:py-3.5 lg:text-base"
            >
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true" />
              Read Book
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
