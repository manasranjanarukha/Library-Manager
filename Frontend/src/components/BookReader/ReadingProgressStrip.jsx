export default function ReadingProgressStrip({ progress }) {
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
