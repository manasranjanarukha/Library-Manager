import { useContext } from "react";

import { Link } from "react-router-dom";

import { TrendingUp, Plus } from "lucide-react";

import { UserContext } from "../../context/UserContext";

export default function Header() {
  const { user } = useContext(UserContext);
  return (
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-[fadeUp_0.35s_ease_both]">
      <div>
        <span className="inline-flex items-center gap-1.5 bg-[#0F766E]/8 text-[#0F766E] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#0F766E]/15 mb-2">
          <TrendingUp className="w-3 h-3" aria-hidden="true" />
          Author dashboard
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] leading-tight tracking-tight">
          My Books
        </h1>
        <p className="text-sm text-[#64748B] mt-1 font-medium">
          Manage, track and publish your work
        </p>
      </div>

      <Link
        to={`/${user?._id}/books/add`}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d6560] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 self-start sm:self-auto"
        aria-label="Add a new book"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        Add new book
      </Link>
    </header>
  );
}
