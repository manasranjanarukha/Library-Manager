// React
import { useEffect, useState, useCallback } from "react";

// Router
import { Link, useNavigate, useParams } from "react-router-dom";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  BookOpen,
  X,
  BookMarked,
  Clock,
} from "lucide-react";

// PDF
import { Document, Page, pdfjs } from "react-pdf";

console.log("API Version:", pdfjs.version);
console.log("Worker URL:", pdfjs.GlobalWorkerOptions.workerSrc);

// Services
import { bookDetailFromServer } from "../service/bookService";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

/* ══════════════════════════════════════════════════
   SEO — page-level meta injection
══════════════════════════════════════════════════ */
function ReaderMeta({ book }) {
  useEffect(() => {
    if (!book) return;
    const prev = document.title;
    document.title = `Reading: ${book.title} — Readymate`;

    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    const prevDesc = desc.content;
    desc.content = `Read "${book.title}" by ${book.author?.fullName || "Unknown Author"} on Readymate. ${book.description?.slice(0, 120) || ""}`;

    // robots: noindex reader pages (prevents duplicate content)
    let robots = document.querySelector('meta[name="robots"]');
    const robotsNew = !robots;
    if (robotsNew) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    const prevRobots = robots.content;
    robots.content = "noindex, nofollow";

    return () => {
      document.title = prev;
      desc.content = prevDesc;
      if (robotsNew) robots.remove();
      else robots.content = prevRobots;
    };
  }, [book]);

  // Schema.org Book structured data
  if (!book) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author?.fullName || "Unknown" },
    image: book.cover,
    numberOfPages: book.pages,
    datePublished: book.publishedYear,
    genre: book.genre,
  };
  return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
}

/* ══════════════════════════════════════════════════
   READING PROGRESS STRIP — 3px teal bar at very top
══════════════════════════════════════════════════ */
function ReadingProgressStrip({ progress }) {
  return (
    <div
      className="h-[3px] w-full bg-white/5"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Reading progress: ${progress}%`}
    >
      <div
        className="h-full bg-teal-600 transition-all duration-500 ease-out rounded-r-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CIRCULAR PROGRESS BADGE
══════════════════════════════════════════════════ */
function ProgressBadge({ progress }) {
  const size = 38;
  const stroke = 2.8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#0F766E"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>
      <span
        className="absolute text-[9px] font-bold text-white tabular-nums"
        style={{ lineHeight: 1 }}
      >
        {progress}%
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ICON TOOL BUTTON
══════════════════════════════════════════════════ */
function ToolBtn({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors duration-150 hover:bg-white/10 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   PROGRESS PANEL — track + stats below reader
══════════════════════════════════════════════════ */
function ProgressPanel({ pageNumber, numPages }) {
  if (!numPages) return null;

  const progress = Math.floor((pageNumber / numPages) * 100);
  const pagesLeft = numPages - pageNumber;
  const minsLeft = pagesLeft * 2;
  const timeLabel =
    minsLeft >= 60
      ? `${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m left`
      : `${minsLeft}m left`;

  const milestones = [25, 50, 75, 100];

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:p-5">
      {/* Labels row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-white/35">
          <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reading progress</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/35">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{timeLabel}</span>
        </div>
      </div>

      {/* Track */}
      <div
        className="relative h-2 w-full overflow-visible rounded-full bg-white/[0.07]"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress: ${progress}%`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-teal-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        {milestones.map((m) => {
          const reached = progress >= m;
          return (
            <div
              key={m}
              className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${m}%` }}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full border-2 transition-all duration-500 ${
                  reached
                    ? "border-teal-400 bg-teal-600 shadow-[0_0_5px_rgba(20,184,166,0.5)]"
                    : "border-white/15 bg-[#0d1117]"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Milestone labels */}
      <div className="relative mt-2 h-4">
        {milestones.map((m) => (
          <span
            key={m}
            className={`absolute -translate-x-1/2 text-[10px] font-medium transition-colors duration-300 ${
              progress >= m ? "text-teal-400" : "text-white/20"
            }`}
            style={{ left: `${m}%` }}
          >
            {m}%
          </span>
        ))}
      </div>

      {/* Stat chips */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Read", value: `${pageNumber} pages` },
          { label: "Progress", value: `${progress}%` },
          { label: "Remaining", value: `${pagesLeft} pages` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 text-center"
          >
            <p className="mb-0.5 text-[10px] uppercase tracking-widest text-white/30">
              {label}
            </p>
            <p className="text-xs font-semibold tabular-nums text-white/75">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   NOT FOUND / LOADING STATES
══════════════════════════════════════════════════ */
function ReaderLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
      <div className="flex flex-col items-center gap-4">
        <BookOpen
          className="h-12 w-12 animate-pulse text-teal-600"
          aria-hidden="true"
        />
        <p className="text-sm text-white/40">Loading book…</p>
      </div>
    </div>
  );
}

function ReaderNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0d1117] px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-900/40">
        <BookOpen className="h-8 w-8 text-teal-500" aria-hidden="true" />
      </div>
      <p className="text-base font-semibold text-white/80">Book not found</p>
      <Link
        to="/"
        className="text-sm font-medium text-teal-500 hover:text-teal-400 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   BOOK READER — main component
══════════════════════════════════════════════════ */
export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const progress = numPages ? Math.floor((pageNumber / numPages) * 100) : 0;

  /* ── Navigation helpers ── */
  const goToPrevPage = useCallback(
    () => setPageNumber((p) => Math.max(p - 1, 1)),
    [],
  );
  const goToNextPage = useCallback(
    () => setPageNumber((p) => Math.min(p + 1, numPages || 1)),
    [numPages],
  );
  const handleZoomIn = useCallback(
    () => setScale((s) => Math.min(+(s + 0.2).toFixed(1), 2.0)),
    [],
  );
  const handleZoomOut = useCallback(
    () => setScale((s) => Math.max(+(s - 0.2).toFixed(1), 0.5)),
    [],
  );
  const toggleFullscreen = useCallback(() => setIsFullscreen((f) => !f), []);

  const handlePageInput = (e) => {
    const v = parseInt(e.target.value, 10);
    if (v >= 1 && v <= (numPages || 1)) setPageNumber(v);
  };

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") goToPrevPage();
      if (e.key === "ArrowRight") goToNextPage();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goToPrevPage, goToNextPage, isFullscreen]);

  /* ── Fetch book ── */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookDetailFromServer(id)
      .then((data) => setBook(data))
      .catch((err) => {
        if (import.meta.env.DEV) console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function onDocumentLoadSuccess({ numPages: n }) {
    setNumPages(n);
  }

  /* ── Render gates ── */
  if (loading) return <ReaderLoading />;
  if (!book) return <ReaderNotFound />;

  /* ── Scale-aware max page width ──
     base 720px scaled, clamped to viewport on mobile */
  const pageMaxWidth = Math.min(
    720 * scale,
    typeof window !== "undefined" ? window.innerWidth - 32 : 720,
  );

  return (
    <>
      <ReaderMeta book={book} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        .drop-cap::first-letter {
          font-size: 3.5em;
          font-weight: 700;
          float: left;
          line-height: 0.82;
          margin-right: 6px;
          color: #0F766E;
          font-family: 'Lora', Georgia, serif;
        }
        .reader-page-text {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(14px, 2.5vw, 17px);
          line-height: 1.9;
          color: #374151;
          margin-bottom: 1.1em;
        }
        .reader-scroll::-webkit-scrollbar { width: 5px; }
        .reader-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        .reader-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 99px; }
        .reader-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
      `}</style>

      {/* ── Root container ── */}
      <div
        className={`flex flex-col bg-[#0d1117] ${
          isFullscreen ? "fixed inset-0 z-50 overflow-y-auto" : "min-h-screen"
        }`}
      >
        {/* ══════════════════════════════════════
            STICKY HEADER
        ══════════════════════════════════════ */}
        <header className="sticky top-0 z-40 flex flex-col">
          <ReadingProgressStrip progress={progress} />

          <div className="border-b border-white/[0.07] bg-[#0d1117]/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
              {/* Left: close + title */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  aria-label="Close reader"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="min-w-0">
                  <h1 className="truncate text-sm font-semibold text-white/90 sm:text-base">
                    {book.title}
                  </h1>
                  <p className="truncate text-xs text-white/40">
                    by {book.author?.fullName || "Unknown Author"}
                  </p>
                </div>
              </div>

              {/* Right: progress ring + zoom + fullscreen */}
              <div className="flex flex-shrink-0 items-center gap-2">
                {numPages > 0 && <ProgressBadge progress={progress} />}

                {/* Zoom — hidden on mobile (shown in nav bar below) */}
                <div className="hidden items-center gap-1.5 sm:flex">
                  <ToolBtn
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                    label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </ToolBtn>
                  <span className="min-w-[46px] text-center text-xs font-semibold tabular-nums text-white/50">
                    {Math.round(scale * 100)}%
                  </span>
                  <ToolBtn
                    onClick={handleZoomIn}
                    disabled={scale >= 2.0}
                    label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </ToolBtn>
                </div>

                <ToolBtn
                  onClick={toggleFullscreen}
                  label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </ToolBtn>
              </div>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════
            READER BODY
        ══════════════════════════════════════ */}
        <main
          className="flex flex-1 flex-col items-center gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
          aria-label="Book reader"
        >
          {/* ── PDF renderer (if bookFile exists) OR text fallback ── */}
          {book.bookFile ? (
            <div
              className="reader-scroll w-full overflow-auto rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
              style={{
                maxWidth: `${pageMaxWidth}px`,
                maxHeight: "calc(100vh - 220px)",
              }}
            >
              <Document
                file={book?.bookFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                  console.error("PDF Load Error:", error);
                }}
                loading={
                  <div className="flex h-64 items-center justify-center">
                    <BookOpen
                      className="h-10 w-10 animate-pulse text-teal-600"
                      aria-hidden="true"
                    />
                  </div>
                }
                error={
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-red-400">
                    <X className="h-8 w-8" />
                    <p className="text-sm">Failed to load PDF</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mx-auto"
                />
              </Document>
            </div>
          ) : (
            /* ── Rich text page fallback ── */
            <div
              className="reader-scroll w-full overflow-auto rounded-2xl bg-[#fdf9f3] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
              style={{
                maxWidth: `${pageMaxWidth}px`,
                maxHeight: isFullscreen
                  ? "calc(100vh - 200px)"
                  : "calc(100vh - 220px)",
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
                    {book.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    by {book.author?.fullName || "Unknown Author"}
                  </p>
                </header>

                {/* Page content */}
                <p className="reader-page-text drop-cap">{book.description}</p>
                <p className="reader-page-text">
                  Page {pageNumber} of {numPages || "?"}. Settle in — this is
                  the kind of story you read slowly, with a cup of something
                  warm beside you. {book.author?.fullName} writes with the
                  patience of someone who knows exactly where the road is going.
                </p>
                <p className="reader-page-text">
                  The chapter unfolds across rooms and weather and small,
                  particular silences. The kind of paragraph you might read
                  twice — not because it was unclear, but because it landed.
                </p>
                <p
                  className="mt-4 text-sm italic text-slate-400"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  — continued on the next page —
                </p>

                {/* Page footer */}
                <footer className="mt-10 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-400">
                  <span>{book.genre}</span>
                  <span className="tabular-nums">{pageNumber}</span>
                </footer>
              </article>
            </div>
          )}

          {/* ══════════════════════════════════════
              NAVIGATION BAR
          ══════════════════════════════════════ */}
          {numPages > 0 && (
            <nav
              className="w-full max-w-3xl rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3.5 sm:p-4"
              aria-label="Page navigation"
            >
              {/* Main nav row */}
              <div className="flex items-center justify-between gap-3">
                {/* Prev */}
                <button
                  type="button"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  aria-label="Previous page"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs font-semibold text-white/60 transition-all duration-150 hover:bg-teal-700/80 hover:text-white hover:border-teal-700 disabled:cursor-not-allowed disabled:opacity-30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:px-4 sm:text-sm cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page input */}
                <div className="flex items-center gap-2 text-xs text-white/40 sm:text-sm">
                  <span>Page</span>
                  <input
                    type="number"
                    min={1}
                    max={numPages}
                    value={pageNumber}
                    onChange={handlePageInput}
                    aria-label={`Current page: ${pageNumber} of ${numPages}`}
                    className="w-14 rounded-lg border border-white/10 bg-white/[0.07] py-1.5 text-center text-xs font-semibold text-white tabular-nums focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 sm:w-16 sm:text-sm"
                  />
                  <span className="whitespace-nowrap">of {numPages}</span>
                </div>

                {/* Next */}
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  aria-label="Next page"
                  className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-150 hover:bg-teal-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:px-4 sm:text-sm cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile zoom row — visible only < sm */}
              <div className="mt-3 flex items-center justify-center gap-3 border-t border-white/[0.06] pt-3 sm:hidden">
                <ToolBtn
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </ToolBtn>
                <span className="min-w-[50px] text-center text-xs font-semibold tabular-nums text-white/50">
                  {Math.round(scale * 100)}%
                </span>
                <ToolBtn
                  onClick={handleZoomIn}
                  disabled={scale >= 2.0}
                  label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn
                  onClick={toggleFullscreen}
                  label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </ToolBtn>
              </div>
            </nav>
          )}

          {/* ══════════════════════════════════════
              PROGRESS PANEL
          ══════════════════════════════════════ */}
          <ProgressPanel pageNumber={pageNumber} numPages={numPages} />

          {/* ── Back to book detail ── */}
          <Link
            to={`/book-items/${id}`}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-white/30 transition-colors hover:text-teal-400"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to book details
          </Link>
        </main>
      </div>
    </>
  );
}
