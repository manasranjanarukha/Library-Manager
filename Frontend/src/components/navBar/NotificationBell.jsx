// React
import { useState } from "react";
// Icons
import { BellIcon } from "@heroicons/react/24/outline";
// Components
import BellPanel from "./BellPanel";
function NotificationBell({ savedCount, saveForLaterBooks, user, classNames }) {
  const [bellOpen, setBellOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setBellOpen((v) => !v)}
        aria-label={`View notifications${savedCount > 0 ? `, ${savedCount} saved books` : ""}`}
        aria-expanded={bellOpen}
        className={classNames(
          "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]cursor-pointer",
          bellOpen
            ? "bg-[#0F766E]/10 text-[#0F766E]"
            : "text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]",
        )}
      >
        <BellIcon
          className={classNames(
            "h-5 w-5 transition-transform duration-300",
            bellOpen ? "rotate-12" : "",
          )}
          aria-hidden="true"
        />
        {/* Count badge on bell */}
        {savedCount > 0 && (
          <span
            className="badge-pop absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[9px] font-bold text-white ring-2 ring-white"
            aria-hidden="true"
          >
            {savedCount > 99 ? "99+" : savedCount}
          </span>
        )}
      </button>

      {/* Bell popover panel */}
      {bellOpen && (
        <BellPanel
          saveForLaterBooks={saveForLaterBooks}
          userId={user?._id}
          onClose={() => setBellOpen(false)}
        />
      )}
    </div>
  );
}

export default NotificationBell;
