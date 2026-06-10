import { List, LayoutGrid } from "lucide-react";
import { memo } from "react";
function ViewToggle({ view, onChange }) {
  const options = [
    { id: "list", Icon: List, label: "List" },
    { id: "grid", Icon: LayoutGrid, label: "Grid" },
  ];
  return (
    <div className="flex p-1 gap-1 bg-white rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
      {options.map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          aria-label={`${label} view`}
          aria-pressed={view === id}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 curpsor-pointer",
            view === id
              ? "bg-[#0F766E] text-white shadow-sm"
              : "text-[#64748B] hover:text-[#1E293B]",
          ].join(" ")}
        >
          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline cursor-pointer">{label}</span>
        </button>
      ))}
    </div>
  );
}
export default memo(ViewToggle);
