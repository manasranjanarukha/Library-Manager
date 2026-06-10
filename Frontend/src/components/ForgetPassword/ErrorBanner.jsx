import { AlertCircle } from "lucide-react";
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3"
    >
      <AlertCircle
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
        aria-hidden="true"
      />
      <p className="text-xs font-medium leading-relaxed text-red-700">
        {message}
      </p>
    </div>
  );
}
