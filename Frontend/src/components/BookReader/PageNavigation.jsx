import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomOut,
  ZoomIn,
  Minimize,
  Maximize,
} from "lucide-react";
import ToolBtn from "./ToolBtn";
export default function PageNavigation({
  goToPrevPage,
  pageNumber,
  numPages,
  handlePageInput,
  goToNextPage,
  handleZoomOut,
  scale,
  handleZoomIn,
  toggleFullscreen,
  isFullscreen,
}) {
  return (
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
        <ToolBtn onClick={handleZoomIn} disabled={scale >= 2.0} label="Zoom in">
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
  );
}
