// React
import { useParams } from "react-router-dom";

// Router
import { Link } from "react-router-dom";

// Icons
import { ChevronLeft } from "lucide-react";

// Services
import PageMeta from "../components/PageMeta";
import useBookReader from "../hooks/useBookReader";
import ReaderLoading from "../components/BookReader/ReaderLoading";
import ReaderNotFound from "../components/BookReader/ReaderNotFound";
import ReadingProgressStrip from "../components/BookReader/ReadingProgressStrip";
import ToolBtn from "../components/BookReader/ToolBtn";
import { ProgressBadge } from "../components/BookReader/ProgressBadge";
import { ProgressPanel } from "../components/BookReader/ProgressPanel";
import Header from "../components/BookReader/Header";
import PageNavigation from "../components/BookReader/PageNavigation";
import BookViewer from "../components/BookReader/BookViewer";
import BookViewerError from "../components/BookReader/BookViewerError";

export default function BookReader() {
  const { id } = useParams();
  const {
    loading,
    book,
    pageNumber,
    numPages,
    scale,
    progress,
    canvasRef,
    goToNextPage,
    goToPrevPage,
    isFullscreen,
    handleZoomIn,
    handleZoomOut,
    toggleFullscreen,
    pageMaxWidth,
    handlePageInput,
    pdfLoading,
  } = useBookReader(id);

  if (loading || pdfLoading) return <ReaderLoading />;
  if (!book) return <ReaderNotFound />;

  return (
    <>
      <PageMeta
        title={`Reading: ${book.title} — Readymate`}
        description={`Read "${book.title}" by ${book.author?.fullName || "Unknown Author"} on Readymate. ${book.description?.slice(0, 120) || ""}`}
        keywords="book"
      />
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
      <Header
        progress={progress}
        book={book}
        numPages={numPages}
        handleZoomOut={handleZoomOut}
        scale={scale}
        handleZoomIn={handleZoomIn}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
      {/* ── Root container ── */}
      <div
        className={`flex flex-col bg-[#0d1117] ${
          isFullscreen ? "fixed inset-0 z-50 overflow-y-auto" : "min-h-screen"
        }`}
      >
        <main
          className="flex flex-1 flex-col items-center gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
          aria-label="Book reader"
        >
          {book?.bookFile ? (
            <BookViewer pageMaxWidth={pageMaxWidth} canvasRef={canvasRef} />
          ) : (
            // text fallback
            <BookViewerError
              pageMaxWidth={pageMaxWidth}
              isFullscreen={isFullscreen}
              pageNumber={pageNumber}
              numPages={numPages}
              book={book}
            />
          )}
          {numPages > 0 && (
            <PageNavigation
              goToPrevPage={goToPrevPage}
              pageNumber={pageNumber}
              numPages={numPages}
              handlePageInput={handlePageInput}
              goToNextPage={goToNextPage}
              handleZoomOut={handleZoomOut}
              scale={scale}
              handleZoomIn={handleZoomIn}
              toggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
            />
          )}

          {/* ══════════════════════════════════════
              PROGRESS PANEL
          ══════════════════════════════════════ */}
          <ProgressPanel pageNumber={pageNumber} numPages={numPages} />

          {/* ── Back to book detail ── */}
          <Link
            to={`/books/${id}`}
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
