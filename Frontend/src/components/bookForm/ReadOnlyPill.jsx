export default function ReadOnlyPill({ icon: Icon, value, placeholder }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-1 border-black bg-[#F8FAFC] text-sm text-black select-none">
      <Icon
        className="w-3.5 h-3.5 text-black flex-shrink-0"
        aria-hidden="true"
      />
      <span
        className={
          value ? "text-[#1E293B] font-medium tabular-nums" : "text-black"
        }
      >
        {value || placeholder}
      </span>
    </div>
  );
}
