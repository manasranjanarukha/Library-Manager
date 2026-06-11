// Router
import { useParams, Link } from "react-router-dom";
// icons
import { ArrowLeft, BookOpen } from "lucide-react";
//React
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

// hooks
import useBookForm from "../hooks/useBookForm";
// Components
import BookForm from "../components/bookForm/BookForm";
import PageMeta from "../components/PageMeta";

export default function EditBookPage() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const mode = "edit";
  const { formData } = useBookForm({ mode, id });
  return (
    <>
      <PageMeta
        title={`Edit ${formData.title || "Book"}`}
        description="Edit and manage your published book details."
        keywords={`${formData.title}, edit book, author panel`}
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
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] leading-tight tracking-tight">
              Edit Your Book
            </h1>

            <p className="text-sm text-black mt-1.5 font-medium">
              Update your book details, then publish the changes or save them as
              a draft.
            </p>
          </header>

          {/* ── Divider ── */}
          <div className="h-px bg-gradient-to-r from-black via-slate-200 to-transparent mb-7" />

          {/* ── Form ── */}
          <BookForm mode="edit" bookId={id} />
        </div>
      </main>
    </>
  );
}
