import { Check, Mail, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: 1, icon: Mail, label: "Email", desc: "Enter your registered email" },
  {
    id: 2,
    icon: ShieldCheck,
    label: "Captcha",
    desc: "Solve the security challenge",
  },
  { id: 3, icon: KeyRound, label: "Password", desc: "Set your new password" },
  { id: 4, icon: CheckCircle2, label: "Done", desc: "All set!" },
];

export default function StepStrip({ current }) {
  return (
    <div
      className="flex items-center gap-0"
      role="list"
      aria-label="Reset password steps"
    >
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        const Icon = s.icon;

        return (
          <div key={s.id} className="flex flex-1 items-center" role="listitem">
            {/* Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                  done
                    ? "border-teal-600 bg-teal-600 text-white"
                    : active
                      ? "border-teal-600 bg-white text-teal-700"
                      : "border-slate-200 bg-white text-slate-300",
                ].join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? (
                  <Check
                    className="h-4 w-4"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                ) : (
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </div>
              <span
                className={[
                  "hidden text-[10px] font-semibold sm:block",
                  done || active ? "text-teal-700" : "text-slate-400",
                ].join(" ")}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "h-0.5 flex-1 transition-colors duration-500",
                  current > s.id ? "bg-teal-600" : "bg-slate-200",
                ].join(" ")}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
