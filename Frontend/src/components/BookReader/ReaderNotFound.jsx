import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
export default function ReaderNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0d1117] px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-900/40">
        <BookOpen className="h-8 w-8 text-teal-500" aria-hidden="true" />
      </div>
      <p className="text-base font-semibold text-white/80">Book not found</p>
      <Link
        to="/"
        className="text-sm font-medium text-teal-500 hover:text-teal-400 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
