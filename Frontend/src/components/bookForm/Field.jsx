import { AlertCircle } from "lucide-react";
export default function Field({ label, hint, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center gap-2 ">
          <span className="text-[10px] font-bold tracking-widest uppercase text-black">
            {label}
          </span>
          {hint && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0F766E]/8 text-[#0F766E] border border-[#0F766E]/15">
              {hint}
            </span>
          )}
          {required && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#DC2626]/8 text-[#DC2626] border border-[#DC2626]/15">
              Required
            </span>
          )}
        </div>
      )}
      {children}
      {error && (
        <p
          role="alert"
          className="flex items-center gap-1 text-xs text-[#DC2626] font-medium"
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
