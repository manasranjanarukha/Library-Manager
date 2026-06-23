// Router
import { Link } from "react-router-dom";
import { GENRES } from "../../constants/geners";

export default function CategoryPills({ active = "All" }) {
  return (
    <section aria-label="Book categories">
      <h1 className="text-base font-bold text-slate-900 mb-3">Categories</h1>
      <div
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {GENRES.map((genre) => {
          const isActive = active === genre;
          return (
            <Link
              key={genre}
              to={`/books/categories/${genre}`}
              onClick={() => console.log(isActive)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-teal-600 text-white shadow-[0_2px_12px_rgba(15,118,110,0.35)]"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-teal-600/40 hover:text-teal-700"
              }`}
            >
              {genre}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
