import { useEffect, useRef, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS } from ".././constants/sortOptions";
export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-teal-300 hover:text-teal-700 sm:px-4"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">{current?.label}</span>
        <span className="sm:hidden">Sort</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-1.5 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-200/60"
          role="listbox"
          aria-label="Sort options cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                opt.value === value
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.value === value && (
                <span
                  className="mr-2 h-1.5 w-1.5 rounded-full bg-teal-600"
                  aria-hidden="true"
                />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
