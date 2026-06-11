// ─── React ────────────────────────────────────────────────────────────────────
import { useContext } from "react";

// ─── Third Party ──────────────────────────────────────────────────────────────
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

// ─── Components ───────────────────────────────────────────────────────────────
import BookForm from "../components/bookForm/BookForm";
import PageMeta from "../components/PageMeta";

// ─── Context ──────────────────────────────────────────────────────────────────
import { UserContext } from "../context/UserContext";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AddBookPage() {
  const { user } = useContext(UserContext);

  return (
    <>
      <PageMeta
        title="Add a New Book"
        description="Publish a new book or save it as a draft on Readymate."
        keywords="add book, publish book, book drafts, online reading platform, Readymate"
      />

      <main
        className="min-h-screen bg-[#F8FAFC]"
        aria-label="Add new book page"
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-24 ">
          {/* ── Back link ── */}
          <Link
            to={`/authors/${user?._id}/books`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-black hover:text-[#0F766E] font-medium mb-6 transition-colors duration-200 group"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200"
              aria-hidden="true"
            />
            Back to My Books
          </Link>

          {/* ── Page header ── */}
          <header className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-[#0F766E]/8 text-[#0F766E] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#0F766E]/15">
                <BookOpen className="w-3 h-3" aria-hidden="true" />
                New book
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] leading-tight tracking-tight">
              Add a new book
            </h1>
            <p className="text-sm text-black mt-1.5 font-medium">
              Fill in the details below — publish immediately or save as a draft
              to come back later.
            </p>
          </header>

          {/* ── Divider ── */}
          <div className="h-px bg-gradient-to-r from-black via-slate-200 to-transparent mb-7" />

          {/* ── Form ── */}
          <BookForm mode="add" />
        </div>
      </main>
    </>
  );
}
