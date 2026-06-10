import { BookOpen, ChevronLeft, Star } from "lucide-react";
export default function CategoryHeader({
  meta,
  genre,
  bookCount,
  avgRating,
  onBack,
}) {
  return (
    <header
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a4a44 0%, #0f766e 55%, #115e59 100%)",
      }}
    >
      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden="true"
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-teal-950/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8 lg:pb-10 lg:pt-8">
        {/* Back link */}
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/55 transition-colors hover:text-white sm:mb-5 sm:text-xs"
          aria-label="Back to all categories cursor-pointer"
        >
          <ChevronLeft
            className="h-3.5 w-3.5 cursor-alias"
            aria-hidden="true"
          />
          All categories
        </button>

        {/* Category icon + title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/12 text-xl backdrop-blur-sm sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl"
            aria-hidden="true"
          >
            {meta.icon}
          </div>
          <div>
            <h1
              className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {genre}
            </h1>
            <p className="mt-0.5 text-[11px] text-white/55 sm:text-sm">
              {meta.desc}
            </p>
          </div>
        </div>

        {/* Stat chips */}
        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
          {[
            {
              icon: BookOpen,
              label: `${bookCount} book${bookCount !== 1 ? "s" : ""}`,
            },
            ...(avgRating
              ? [{ icon: Star, label: `Avg ${avgRating} rating` }]
              : []),
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/75 backdrop-blur-sm sm:text-xs"
            >
              <Icon className="h-3 w-3 text-white/50" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
