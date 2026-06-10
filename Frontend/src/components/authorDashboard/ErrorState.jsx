/* UI Components */
import { AlertTriangle } from "lucide-react";

export default function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <AlertTriangle
        className="mb-3 h-8 w-8 text-[#DC2626]/40"
        aria-hidden="true"
      />
      <p className="text-sm font-semibold text-[#1E293B]">{message}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-4 text-xs font-semibold text-[#0F766E] hover:underline"
      >
        Retry
      </button>
    </div>
  );
}
