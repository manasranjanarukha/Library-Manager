import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { PDF_CONFIG, READER_LAYOUT } from "../constants/bookReader";
import { bookDetailFromServer } from "../service/bookService";
import { Icon } from "lucide-react";
const pdfjsLib = await import("pdfjs-dist");
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
export default function useBookReader(id) {
  const { PAGE_BASE_WIDTH, MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } = PDF_CONFIG;
  // keep READER_LAYOUT available but avoid unused local vars
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true); // book fetch
  const [pdfLoading, setPdfLoading] = useState(false); // pdf load/render
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const progress = useMemo(() => {
    if (!numPages) return 0;

    return Math.floor((pageNumber / numPages) * 100);
  }, [pageNumber, numPages]);
  const canvasRef = useRef(null);
  const pdfRef = useRef(null);

  const goToPrevPage = useCallback(
    () => setPageNumber((p) => Math.max(p - 1, 1)),
    [],
  );
  const goToNextPage = useCallback(
    () => setPageNumber((p) => Math.min(p + 1, numPages || 1)),
    [numPages],
  );
  const handleZoomIn = useCallback(
    () => setScale((s) => Math.min(+(s + ZOOM_STEP).toFixed(1), MAX_ZOOM)),
    [],
  );
  const handleZoomOut = useCallback(
    () => setScale((s) => Math.max(+(s - ZOOM_STEP).toFixed(1), MIN_ZOOM)),
    [],
  );
  const toggleFullscreen = useCallback(() => setIsFullscreen((f) => !f), []);
  const handlePageInput = useCallback(
    (e) => {
      const v = parseInt(e.target.value, 10);

      if (v >= 1 && v <= (numPages || 1)) {
        setPageNumber(v);
      }
    },
    [numPages],
  );

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

  useEffect(() => {
    if (!book?.bookFile) return;

    async function loadPdf() {
      try {
        setPdfLoading(true);

        const pdf = await pdfjsLib.getDocument(book.bookFile).promise;

        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
      } catch (err) {
        console.error(err);
      } finally {
        setPdfLoading(false);
      }
    }

    loadPdf();
  }, [book?.bookFile]);
  useEffect(() => {
    if (!book?.bookFile) return;

    async function renderPdf() {
      try {
        if (!pdfRef.current) return;

        const page = await pdfRef.current.getPage(pageNumber);

        const viewport = page?.getViewport({
          scale,
        });

        const canvas = canvasRef.current;

        if (!canvas) return;

        const context = canvas?.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (err) {
        console.error(err);
      }
    }

    renderPdf();
  }, [pageNumber, scale, numPages]);

  const pageMaxWidth = useMemo(() => {
    return Math.min(
      PAGE_BASE_WIDTH * scale,
      typeof window !== "undefined" ? window.innerWidth - 32 : PAGE_BASE_WIDTH,
    );
  }, [scale, PAGE_BASE_WIDTH]);
  return {
    loading,
    PDF_CONFIG,
    READER_LAYOUT,
    book,
    pageNumber,
    setPageNumber,
    numPages,
    scale,
    setScale,
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
    Icon,
  };
}
