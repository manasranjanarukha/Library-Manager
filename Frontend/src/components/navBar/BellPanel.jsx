// React
import { useEffect, useRef } from "react";
// Route
import { Link } from "react-router-dom";
// Icons
import {
  BellIcon,
  BookmarkIcon,
  BookOpenIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
export default function BellPanel({ saveForLaterBooks, userId, onClose }) {
  const panelRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  /* Close on Escape */
  useEffect(() => {
    function handler(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const items = saveForLaterBooks.slice(0, 6);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 origin-top-right"
      style={{ animation: "bellPanelIn 0.18s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_8px_32px_rgba(15,118,110,0.13)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <BellIcon className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
            <span className="text-sm font-bold text-[#1E293B]">
              Reading List
            </span>
            {items.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0F766E] text-white text-[10px] font-bold">
                {saveForLaterBooks.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <BookmarkIcon
              className="w-8 h-8 text-slate-200 mb-2"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-[#1E293B]">
              No saved books yet
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Bookmark books to add them to your reading list.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {items.map((book) => (
              <li key={book?._id}>
                <Link
                  to={`/books/${book?._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#0F766E]/4 transition-colors group cursor-pointer"
                >
                  {/* Cover thumbnail */}
                  <div className="flex-shrink-0 w-9 h-12 rounded-lg overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                    {book?.cover ? (
                      <img
                        src={book?.cover}
                        alt={`Cover of ${book?.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpenIcon className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1E293B] truncate group-hover:text-[#0F766E] transition-colors">
                      {book?.title}
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {book?.author?.fullName || "Unknown Author"}
                    </p>
                  </div>
                  {/* Arrow */}
                  <ChevronDownIcon
                    className="w-4 h-4 text-slate-300 -rotate-90 flex-shrink-0 group-hover:text-[#0F766E] transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {saveForLaterBooks.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-50 bg-slate-50/50">
            <Link
              to={userId ? `/reader/${userId}/save-for-later` : "/auth/login"}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-[#0F766E] hover:text-[#0d6560] transition-colors py-1"
            >
              <BookmarkIcon className="w-3.5 h-3.5" aria-hidden="true" />
              View full reading list ({saveForLaterBooks.length})
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
