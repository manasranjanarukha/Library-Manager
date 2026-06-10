// React
import { useCallback, useEffect, useRef, useState } from "react";

// Router
import { Link } from "react-router-dom";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Scale,
} from "lucide-react";

export default function HeroCarousel({ banners }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      if (isTransitioning || !banners.length) return;
      setIsTransitioning(true);
      setCurrent((index + banners.length) % banners.length);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [banners.length, isTransitioning],
  );

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [current, goTo]);

  if (!banners.length) return null;
  const slide = banners[current];

  return (
    <section
      aria-label="Featured books carousel"
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_8px_40px_rgba(15,118,110,0.18)]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${slide.cover})`,
          filter: "blur(24px) brightness(0.35)",
          transform: "scale(1.1)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-teal-700/85 via-teal-700/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center gap-5 sm:gap-8 p-5 sm:p-10 min-h-[260px] sm:min-h-[340px]">
        <div className="flex-shrink-0 w-[110px] sm:w-[170px]">
          <img
            src={slide.cover}
            alt={`Cover of ${slide.title}`}
            className={`w-full aspect-[2/3] object-cover rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.55)] ring-2 ring-white/20 transform: isTransitioning;
  ?"scale(0.96) translateY(6px)"
                : "scale(1) translateY(0)";
  0.6: 1;
}`}
            loading="lazy"
          />
        </div>

        <div
          className="flex-1 min-w-0"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateX(12px)" : "translateX(0)",
            transition: "opacity 0.4s, transform 0.4s",
          }}
        >
          <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3" aria-hidden="true" /> Featured
          </span>
          <h2 className="text-white font-bold text-xl sm:text-3xl lg:text-4xl leading-tight line-clamp-2 mb-1">
            {slide.title}
          </h2>
          <p className="text-white/75 text-xs sm:text-sm font-medium mb-2">
            by {slide.author?.fullName || "Unknown Author"}
          </p>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 hidden sm:block max-w-md">
            {slide.description}
          </p>
          <Link
            to={`/book/${slide._id}/read`}
            className="inline-flex items-center gap-1.5 bg-white text-teal-700 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-teal-50 transition-all duration-200 shadow-md"
          >
            Read Now <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <button
        onClick={() => goTo(current - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
