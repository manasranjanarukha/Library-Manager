import React from "react";
import { READER_LAYOUT } from "../../constants/bookReader";
export default function BookViewerError({
  pageMaxWidth,
  isFullscreen,
  pageNumber,
  numPages,
  book,
}) {
  return (
    <div
      className="reader-scroll w-full overflow-auto rounded-2xl bg-[#fdf9f3] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      style={{
        maxWidth: `${pageMaxWidth}px`,
        maxHeight: isFullscreen
          ? READER_LAYOUT.FULLSCREEN_MAX_HEIGHT
          : READER_LAYOUT.READER_MAX_HEIGHT,
        transformOrigin: "top center",
      }}
    >
      <article
        className="px-6 py-10 sm:px-10 sm:py-14 md:px-14 lg:px-16"
        style={{ minHeight: "min(820px, 80vh)" }}
        aria-label={`Page ${pageNumber} of ${numPages || "?"}`}
      >
        {/* Chapter header */}
        <header className="mb-8 border-b border-slate-200 pb-5">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
            Chapter {Math.max(1, Math.ceil(pageNumber / 20))}
          </p>
          <h2
            className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            {book?.title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            by {book?.author?.fullName || "Unknown Author"}
          </p>
        </header>

        {/* Page content */}
        <p className="reader-page-text drop-cap">{book?.description}</p>
        <p className="reader-page-text">
          Page {pageNumber} of {numPages || "?"}. Settle in — this is the kind
          of story you read slowly, with a cup of something warm beside you.{" "}
          {book?.author?.fullName} writes with the patience of someone who knows
          exactly where the road is going.
        </p>
        <p className="reader-page-text">
          The chapter unfolds across rooms and weather and small, particular
          silences. The kind of paragraph you might read twice — not because it
          was unclear, but because it landed.
        </p>
        <p
          className="mt-4 text-sm italic text-slate-400"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          — continued on the next page —
        </p>

        {/* Page footer */}
        <footer className="mt-10 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-400">
          <span>{book?.genre}</span>
          <span className="tabular-nums">{pageNumber}</span>
        </footer>
      </article>
    </div>
  );
}
