import { CheckCircle2 } from "lucide-react";
export default function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="flex items-start gap-2.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-3"
    >
      <CheckCircle2
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600"
        aria-hidden="true"
      />
      <p className="text-xs font-medium leading-relaxed text-teal-700">
        {message}
      </p>
    </div>
  );
}
