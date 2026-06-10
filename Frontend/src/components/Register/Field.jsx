import { AlertCircle } from "lucide-react";
export default function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-black">
            {label}
          </span>
          {required && (
            <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-semibold text-red-600">
              Required
            </span>
          )}
        </div>
      )}
      {children}
      {error && (
        <p
          role="alert"
          className="flex items-center gap-1 text-[11px] font-medium text-red-600"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
