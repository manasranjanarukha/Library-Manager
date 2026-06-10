export default function Input({ hasError, className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800",
        "placeholder-slate-400 outline-none transition-all duration-200",
        "focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError ? "border-red-300" : "border-slate-200",
        className,
      ].join(" ")}
      aria-invalid={hasError ? "true" : "false"}
      {...props}
    />
  );
}
