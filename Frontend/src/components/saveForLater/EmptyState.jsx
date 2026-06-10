import { Link } from "react-router-dom";
import { BookOpen, BookMarked, Bookmark } from "lucide-react";
import { memo } from "react";
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center px-6">
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0F766E]/8 border border-[#0F766E]/15 flex items-center justify-center">
          <BookMarked
            className="w-9 h-9 sm:w-11 sm:h-11 text-teal-700/40"
            aria-hidden="true"
          />
        </div>
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0F766E] flex items-center justify-center shadow-sm">
          <Bookmark
            className="w-2.5 h-2.5 text-white fill-white"
            aria-hidden="true"
          />
        </span>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-[#1E293B] mb-2">
        Your reading list is empty
      </h2>
      <p className="text-sm text-[#64748B] max-w-xs leading-relaxed mb-7">
        Browse books and tap the bookmark icon to save titles you want to read
        later.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d6560] text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
      >
        <BookOpen className="w-4 h-4" aria-hidden="true" />
        Discover Books
      </Link>
    </div>
  );
}
export default memo(EmptyState);
