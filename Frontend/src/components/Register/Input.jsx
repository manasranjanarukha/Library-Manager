export default function Input({ error, className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-xl border border-black bg-white px-3.5 py-2.5 text-sm text-slate-800 ",
        "placeholder-slate-400 outline-none transition-all duration-200 ",
        "focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600",
        error ? "border-red-300" : "border border-black",
        className,
      ].join(" ")}
      aria-invalid={error ? "true" : "false"}
      {...props}
    />
  );
}
