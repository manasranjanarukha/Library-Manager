import { BookOpen, PenLine } from "lucide-react";
export default function UserTypeSelector({ value, onChange, error }) {
  const USER_TYPES = [
    {
      value: "Reader",
      label: "Reader",
      desc: "Browse, save and review books",
      icon: BookOpen,
    },
    {
      value: "Author",
      label: "Author",
      desc: "Upload and publish your books",
      icon: PenLine,
    },
  ];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {USER_TYPES.map(({ value: v, label, desc, icon: Icon }) => {
          const active = value === v;
          return (
            <label
              key={v}
              className={[
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all duration-150 sm:p-3.5",
                active
                  ? "border-teal-600 bg-teal-50"
                  : "border border-black bg-white hover:border-slate-300",
                error && !active ? "border-red-200" : "",
              ].join(" ")}
            >
              <input
                type="radio"
                name="userType"
                value={v}
                checked={active}
                onChange={onChange}
                className="sr-only border border-black"
                aria-label={label}
              />
              {/* Custom radio dot */}
              <span
                className={[
                  "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150",
                  active ? "border-teal-600 bg-teal-600" : "border-slate-300",
                ].join(" ")}
                aria-hidden="true"
              >
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`h-3.5 w-3.5 flex-shrink-0 ${
                      active ? "text-teal-700" : "text-slate-400"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-xs font-bold ${
                      active ? "text-teal-700" : "text-slate-700"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
                  {desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
