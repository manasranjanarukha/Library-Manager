import { PROGRESS_BADGE_SIZE } from "../../constants/bookReader";
export function ProgressBadge({ progress }) {
  const size = PROGRESS_BADGE_SIZE;
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
