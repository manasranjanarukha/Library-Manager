// Route
import { Link } from "react-router-dom";
// Icons from lucide-react
import { BookOpen, Plus } from "lucide-react";

export default function EmptyAll({ userId }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#0F766E]/8 border border-[#0F766E]/15 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-[#0F766E]/40" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-bold text-[#1E293B] mb-2">No books yet</h2>
      <p className="text-sm text-[#64748B] max-w-xs leading-relaxed mb-6">
        Start your author journey — add your first book and share it with
        readers.
      </p>
      <Link
        to={`/${userId}/books/add`}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d6560] text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        Add your first book
      </Link>
    </div>
  );
}
