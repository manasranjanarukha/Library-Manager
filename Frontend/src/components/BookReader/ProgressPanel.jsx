import { memo } from "react";
import { Bookmark, Clock } from "lucide-react";
import { MILESTONES } from "../../constants/bookReader";
export const ProgressPanel = memo(function ProgressPanel({
  pageNumber,
  numPages,
}) {
  if (!numPages) return null;

  const progress = Math.floor((pageNumber / numPages) * 100);
  const pagesLeft = numPages - pageNumber;
  const minsLeft = pagesLeft * 2;
  const timeLabel =
    minsLeft >= 60
      ? `${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m left`
      : `${minsLeft}m left`;

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:p-5">
      {/* Labels row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-white/35">
          <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
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
        {MILESTONES.map((m) => {
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
        {MILESTONES.map((m) => (
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
});
