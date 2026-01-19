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
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function BookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePageInput = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= numPages) {
      setPageNumber(value);
    }
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
      {/* Header */}
      <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Title and back button */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
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

            {/* Zoom controls - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-2 ml-4">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-300" />
              </button>
              <span className="text-gray-300 text-sm font-medium min-w-[60px] text-center">
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
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 ml-2"
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

      {/* PDF Viewer */}
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

        {/* Page Navigation */}
        {numPages && (
          <div className="mt-6 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 p-4 w-full max-w-5xl">
            <div className="flex items-center justify-between gap-4">
              {/* Previous button */}
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page indicator */}
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

              {/* Next button */}
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
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-300" />
              </button>
              <span className="text-gray-300 text-sm font-medium min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 2.0}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-300" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 ml-2"
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
        )}
      </div>
    </div>
  );
}
