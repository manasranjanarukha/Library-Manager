import React from "react";
import ReadingProgressStrip from "./ReadingProgressStrip";
import { ProgressBadge } from "./ProgressBadge";
import { PDF_CONFIG } from "../../constants/bookReader";
import { X, ZoomIn, ZoomOut, Minimize, Maximize } from "lucide-react";
import ToolBtn from "./ToolBtn";
import { useNavigate } from "react-router-dom";
export default function Header({
  progress,
  book,
  numPages,
  handleZoomOut,
  scale,
  handleZoomIn,
  toggleFullscreen,
  isFullscreen,
}) {
  console.log("headr");

  return (
    <header className="sticky top-0 z-40 flex flex-col">
      <ReadingProgressStrip progress={progress} />

      <div className="border-b border-white/[0.07] bg-[#0d1117]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <BookInfo book={book} />
          {/* Right: progress ring + zoom + fullscreen */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {numPages > 0 && <ProgressBadge progress={progress} />}

            <ZoomControls
              scale={scale}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              toggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

const BookInfo = React.memo(function BookInfo({ book }) {
  const navigate = useNavigate();
  console.log("fvfedrferfer");

  return (
    <>
      {/* Left: close + title */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close reader"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-white/90 sm:text-base">
            {book?.title}
          </h1>
          <p className="truncate text-xs text-white">
            by {book?.author?.fullName || "Unknown Author"}
          </p>
        </div>
      </div>
    </>
  );
});

const ZoomControls = React.memo(function ZoomControls({
  scale,
  handleZoomOut,
  handleZoomIn,
  toggleFullscreen,
  isFullscreen,
}) {
  console.log("ZoomControls render");

  return (
    <>
      {/* Zoom — hidden on mobile (shown in nav bar below) */}
      <div className="hidden items-center gap-1.5 sm:flex text-white">
        <ToolBtn
          onClick={handleZoomOut}
          disabled={scale <= PDF_CONFIG.MIN_ZOOM}
          label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </ToolBtn>
        <span className="min-w-[46px] text-center text-xs font-semibold tabular-nums text-white/50">
          {Math.round(scale * 100)}%
        </span>
        <ToolBtn
          onClick={handleZoomIn}
          disabled={scale >= PDF_CONFIG.MAX_ZOOM}
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
    </>
  );
});
