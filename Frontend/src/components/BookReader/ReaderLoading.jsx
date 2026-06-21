import { BookOpen } from "lucide-react";
export default function ReaderLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
      <div className="flex flex-col items-center gap-4">
        <BookOpen
          className="h-12 w-12 animate-pulse text-teal-600"
          aria-hidden="true"
        />
        <p className="text-sm text-white/40">Loading book…</p>
      </div>
    </div>
  );
}
