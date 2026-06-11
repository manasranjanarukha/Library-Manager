// React
import { useState, useEffect, useContext } from "react";

// Router
import { Link, useParams } from "react-router-dom";

// Icons
import { BookOpen, ChevronLeft } from "lucide-react";

// Components
import StarDisplay from "../components/StarDisplay";
import BookDetailsHero from "../components/bookDetailsComponents/BookDetailsHero";
import BookDetailsAbout from "../components/bookDetailsComponents/BookDetailsAbout";
import ReviewSection from "../components/bookDetailsComponents/ReviewSection";
import SideBar from "../components/bookDetailsComponents/SideBar";
import PageMeta from "../components/PageMeta";

// Services
import { bookDetailFromServer } from "../service/bookService";

// Contexts
import { UserContext } from "../context/UserContext";

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 h-8 w-28 rounded-xl bg-slate-200" />
        <div
          className="mb-6 rounded-3xl bg-slate-200"
          style={{ height: 300 }}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function BookDetail() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    bookDetailFromServer(id)
      .then((bookData) => {
        setBook(bookData);
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);
  const authorName = book?.author?.fullName || "Unknown Author";
  const avgRating = book?.rating?.average || 0;
  if (loading) return <Skeleton />;

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
          <BookOpen className="h-8 w-8 text-teal-300" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-slate-800">
          Book not found
        </h1>
        <Link
          to="/"
          className="mt-2 text-sm font-semibold text-teal-700 hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${book.title} by ${authorName} | Book Details`}
        description={`Read about ${book.title}, a ${book.genre} book published in ${book.publishedYear}. Average rating: ${avgRating.toFixed(1)}. ${reviews.length} reader review${reviews.length !== 1 ? "s" : ""}.`}
      />
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="mx-auto max-w-screen-xl px-4 pb-24 pt-5 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
          {/* ── Back button ── */}
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all duration-150 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 sm:mb-7"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to Books
          </Link>

          {/* ══════════════════════════════════════════
              HERO — full-bleed cinematic banner
              Responsive cover size across all breakpoints
          ══════════════════════════════════════════ */}
          <BookDetailsHero book={book} reviews={reviews} />
          {/* ══════════════════════════════════════════
              BODY — two-column on desktop, single on mobile/tablet
              Left: About + Reviews
              Right (desktop only): Quick stats sidebar
          ══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 xl:gap-8">
            {/* ── Main content column ── */}
            <div className="space-y-4 lg:col-span-2 lg:space-y-5">
              {/* About section */}
              <BookDetailsAbout book={book} />
              {/* Reviews section */}
              <ReviewSection
                book={book}
                user={user}
                reviews={reviews}
                setReviews={setReviews}
              />
            </div>

            {/* ══════════════════════════════════════
                RIGHT SIDEBAR — only on lg+
                On mobile/tablet this stacks below
            ══════════════════════════════════════ */}
            <SideBar
              book={book}
              avgRating={avgRating}
              reviews={reviews}
              authorName={authorName}
            />
          </div>
        </div>
      </main>
    </>
  );
}
