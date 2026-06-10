// React
import React from "react";
// Route
import { Link } from "react-router-dom";
// Icons
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function Logo() {
  return (
    <>
      {/* ── Logo ── */}
      <Link
        to="/"
        className="group flex shrink-0 items-center gap-2"
        aria-label="Readymate – Go to homepage"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F766E] text-white shadow-sm transition-all duration-200 group-hover:bg-[#0d6560] group-hover:scale-105">
          <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-[1.05rem] font-bold tracking-tight text-[#1E293B]">
          Ready<span className="text-[#0F766E]">mate</span>
        </span>
      </Link>
    </>
  );
}
