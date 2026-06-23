import { READER_LAYOUT } from "../../constants/bookReader";

export default function BookViewer({ pageMaxWidth, canvasRef }) {
  return (
    <div
      className="reader-scroll w-full overflow-auto rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      style={{
        maxWidth: `${pageMaxWidth}px`,
        maxHeight: READER_LAYOUT.READER_MAX_HEIGHT,
      }}
    >
      <canvas ref={canvasRef} className="mx-auto block" />
    </div>
  );
}
