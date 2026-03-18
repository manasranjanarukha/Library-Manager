import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { bookDetailFromServer } from "../service/bookService";
import { useParams, useNavigate } from "react-router-dom";
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

const API_URL = import.meta.env.VITE_API_URL;
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// ── Reading Progress Bar (sticky top strip) ──────────────────────────────────
function ReadingProgressStrip({ progress }) {
  return (
    <div className="h-1 w-full bg-gray-700/60">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ── Circular progress ring ────────────────────────────────────────────────────
function ProgressRing({ progress, size = 44, stroke = 3.5 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      {/* fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Compact progress badge (header) ──────────────────────────────────────────
function ProgressBadge({ pageNumber, numPages }) {
  const progress = numPages ? Math.floor((pageNumber / numPages) * 100) : 0;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      <ProgressRing progress={progress} />
      <span
        className="absolute text-[10px] font-bold text-white tabular-nums"
        style={{ lineHeight: 1 }}
      >
        {progress}%
      </span>
    </div>
  );
}

// ── Bottom progress panel ─────────────────────────────────────────────────────
function ProgressPanel({ pageNumber, numPages }) {
  if (!numPages) return null;

  const progress = Math.floor((pageNumber / numPages) * 100);
  const pagesLeft = numPages - pageNumber;

  // Rough estimate: avg 2 min/page
  const minsLeft = pagesLeft * 2;
  const timeLabel =
    minsLeft >= 60
      ? `${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m left`
      : `${minsLeft}m left`;

  // Milestone badges
  const milestones = [25, 50, 75, 100];

  return (
    <div className="w-full max-w-5xl mt-3 px-1">
      {/* chapter-style label row */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <BookMarked className="w-3.5 h-3.5" />
          <span>Reading progress</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLabel}</span>
        </div>
      </div>

      {/* segmented progress bar with milestone ticks */}
      <div className="relative h-2.5 bg-gray-700/70 rounded-full overflow-visible">
        {/* fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* milestone ticks */}
        {milestones.map((m) => {
          const reached = progress >= m;
          return (
            <div
              key={m}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${m}%`, transform: "translate(-50%, -50%)" }}
            >
              <div
                className={`w-2 h-2 rounded-full border-2 transition-colors duration-500 ${
                  reached
                    ? "bg-violet-400 border-violet-300 shadow-[0_0_6px_rgba(167,139,250,0.7)]"
                    : "bg-gray-600 border-gray-500"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* milestone labels */}
      <div className="relative mt-1.5 h-4">
        {milestones.map((m) => {
          const reached = progress >= m;
          return (
            <span
              key={m}
              className={`absolute text-[10px] font-medium -translate-x-1/2 transition-colors duration-300 ${
                reached ? "text-violet-400" : "text-gray-600"
              }`}
              style={{ left: `${m}%` }}
            >
              {m}%
            </span>
          );
        })}
      </div>

      {/* stats row */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { label: "Read", value: `${pageNumber} pages` },
          { label: "Progress", value: `${progress}%` },
          { label: "Remaining", value: `${pagesLeft} pages` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-gray-700/50 rounded-lg px-3 py-2 text-center border border-gray-600/40"
          >
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">
              {label}
            </p>
            <p className="text-white text-xs font-semibold tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  const progress = numPages ? Math.floor((pageNumber / numPages) * 100) : 0;

  useEffect(() => {
    if (!bookId) return;
    fetchBookDetails(bookId);
  }, [bookId]);

  const fetchBookDetails = async (id) => {
    try {
      setLoading(true);
      const data = await bookDetailFromServer(id);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const handlePageInput = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= numPages) setPageNumber(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-white text-lg">Loading book...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}
    >
      {/* ── Sticky reading-progress strip (very top) ── */}
      <div className="sticky top-0 z-50">
        <ReadingProgressStrip progress={progress} />

        {/* ── Header ── */}
        <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              {/* Back + title */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 flex-shrink-0"
                  title="Back"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                    {books?.title || "Book Reader"}
                  </h1>
                  {books?.author && (
                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                      by {books.author}
                    </p>
                  )}
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-3 ml-4">
                {/* Progress badge — always visible */}
                {numPages && (
                  <ProgressBadge pageNumber={pageNumber} numPages={numPages} />
                )}

                {/* Zoom — hidden on mobile */}
                <div className="hidden sm:flex items-center space-x-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5 text-gray-300" />
                  </button>
                  <span className="text-gray-300 text-sm font-medium min-w-[52px] text-center tabular-nums">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={scale >= 2.0}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-300" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 ml-1"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5 text-gray-300" />
                    ) : (
                      <Maximize className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PDF Viewer ── */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-5xl">
          <div className="overflow-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-180px)]">
            <Document
              file={`${API_URL}/uploads/books/bookFiles/${books?.bookFile}`}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center p-12">
                  <BookOpen className="w-12 h-12 text-blue-500 animate-pulse" />
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center p-12 text-red-500">
                  <X className="w-12 h-12 mb-4" />
                  <p>Failed to load PDF</p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className="mx-auto"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </div>

        {/* ── Page Navigation ── */}
        {numPages && (
          <div className="mt-6 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 p-4 w-full max-w-5xl">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center space-x-3">
                <span className="text-gray-300 text-sm sm:text-base whitespace-nowrap">
                  Page
                </span>
                <input
                  type="number"
                  min="1"
                  max={numPages}
                  value={pageNumber}
                  onChange={handlePageInput}
                  className="w-16 sm:w-20 px-2 py-1.5 bg-gray-700 text-white text-center rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <span className="text-gray-300 text-sm sm:text-base whitespace-nowrap">
                  of {numPages}
                </span>
              </div>

              <button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile zoom controls */}
            <div className="flex sm:hidden items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-5 h-5 text-gray-300" />
              </button>
              <span className="text-gray-300 text-sm font-medium min-w-[60px] text-center tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 2.0}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-5 h-5 text-gray-300" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 ml-2"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-gray-300" />
                ) : (
                  <Maximize className="w-5 h-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Progress Panel ── */}
        <ProgressPanel pageNumber={pageNumber} numPages={numPages} />
      </div>
    </div>
  );
}
