export default function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
