/**
 * StatCard Component
 * Displays a statistics card with icon, label, value, and optional subtitle
 */

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor = "text-[#0F766E]",
  iconBg = "bg-[#0F766E]/8",
}) {
  return (
    <div className="rounded-2xl bg-[#F1F5F9] p-4 flex flex-col gap-1 min-w-0">
      {/* Icon and Label Section */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} aria-hidden="true" />
        </span>
        <span className="truncate text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
          {label}
        </span>
      </div>

      {/* Value Section */}
      <p className="text-xl sm:text-2xl font-black leading-none tabular-nums text-[#1E293B]">
        {value}
      </p>

      {/* Optional Subtitle Section */}
      {sub && (
        <p className="text-[11px] font-medium text-[#94A3B8] truncate">{sub}</p>
      )}
    </div>
  );
}
