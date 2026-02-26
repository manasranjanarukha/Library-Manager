import React, { useContext, useState } from "react";
import {
  Star,
  Calendar,
  BookOpen,
  IndianRupee,
  Heart,
  Trash2,
  BookMarked,
  LayoutGrid,
  List,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useFavorites } from "../context/FavoritesContext";

const API_URL = import.meta.env.VITE_API_URL;

/* ─── Star Rating ─────────────────────────────────── */
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - Math.ceil(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(full)].map((_, i) => (
        <Star
          key={`f${i}`}
          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
        />
      ))}
      {half && (
        <div className="relative w-3.5 h-3.5">
          <Star className="w-3.5 h-3.5 text-zinc-600" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {[...Array(empty)].map((_, i) => (
        <Star key={`e${i}`} className="w-3.5 h-3.5 text-zinc-600" />
      ))}
      <span className="text-xs text-zinc-500 ml-1.5 font-sans">({rating})</span>
    </div>
  );
}

/* ─── Single Favourite Book Card ─────────────────── */
function FavBookCard({ book, index, view }) {
  const { removeFavorite } = useFavorites();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);

  function handleViewDetails() {
    if (!user) {
      alert("Please login or Register");
      navigate("/auth/login");
    } else {
      navigate(`/book-items/${book._id}`);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    await removeFavorite(book._id);
  }

  /* ── LIST ROW ── */
  if (view === "list") {
    return (
      <div
        className={`group relative flex items-center gap-5 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-amber-400/30 hover:bg-white/[0.055] hover:shadow-[0_0_32px_rgba(251,191,36,0.06)] ${removing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
        style={{
          transition: removing ? "opacity 0.3s, transform 0.3s" : undefined,
        }}
      >
        {/* Index */}
        <span className="hidden sm:flex font-sans text-zinc-700 text-sm w-7 justify-end flex-shrink-0 group-hover:text-amber-400 transition-colors duration-200 font-semibold">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Cover */}
        <div className="flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-zinc-900 border border-white/10">
          <img
            src={`${API_URL}/uploads/books/covers/${book.cover}`}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h3
                className="text-white font-bold text-base leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors duration-200"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {book.title}
              </h3>
              <p className="text-zinc-500 text-xs font-sans mt-0.5">
                by {book.author}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {book.genre}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <StarRating rating={book.rating} />
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm font-sans">
              <IndianRupee className="w-3 h-3" />
              {book.price}
            </div>
            <div className="flex items-center gap-1 text-zinc-600 text-xs font-sans">
              <Calendar className="w-3 h-3" />
              {book.publishedYear}
            </div>
            <div className="flex items-center gap-1 text-zinc-600 text-xs font-sans">
              <BookOpen className="w-3 h-3" />
              {book.pages}p
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleViewDetails}
            className="hidden sm:block px-4 py-1.5 rounded-lg bg-white/[0.07] border border-white/10 text-zinc-300 text-xs font-sans font-semibold hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-200"
          >
            View
          </button>
          <button
            onClick={handleRemove}
            className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ── GRID CARD ── */
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-amber-400/30 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(251,191,36,0.1)] ${removing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

      {/* Cover */}
      <div
        className="relative w-full bg-zinc-900"
        style={{ paddingTop: "140%" }}
      >
        <img
          src={`${API_URL}/uploads/books/covers/${book.cover}`}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Genre badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-sans font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-violet-500/80 text-white backdrop-blur-sm border border-violet-400/40">
            {book.genre}
          </span>
        </div>

        {/* Rank badge */}
        <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/70 border border-white/20 backdrop-blur-sm flex items-center justify-center font-sans text-xs text-zinc-400 font-bold">
          {index + 1}
        </div>

        {/* Price pinned to bottom of image */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-0.5 bg-emerald-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg font-sans font-bold text-sm">
          <IndianRupee className="w-3.5 h-3.5" />
          {book.price}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 p-4">
        <h3
          className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors duration-200 mb-1"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {book.title}
        </h3>
        <p className="text-zinc-500 text-xs font-sans mb-2">by {book.author}</p>

        <div className="mb-2">
          <StarRating rating={book.rating} />
        </div>

        <p className="text-zinc-600 text-xs font-sans leading-relaxed line-clamp-2 mb-3 flex-1">
          {book.description}
        </p>

        <div className="flex items-center gap-3 text-zinc-600 text-xs font-sans mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {book.publishedYear}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {book.pages} pages
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleViewDetails}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-black font-sans font-bold text-xs hover:from-amber-300 hover:to-orange-300 transition-all duration-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] active:scale-95"
          >
            View Details
          </button>
          <button
            onClick={handleRemove}
            className="px-3 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────── */
export default function FavoriteBooks() {
  const { favoriteBooks } = useFavorites();
  console.log("Favorite books page ", favoriteBooks);

  const [view, setView] = useState("grid");

  const isEmpty = favoriteBooks.length === 0;

  if (!favoriteBooks) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src="/public/book-loading.gif" alt="Loading book" />
          <p className="mt-4 text-gray-600">
            Loading favorite books, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-amber-700/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full bg-rose-800/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-violet-900/10 blur-[100px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-14">
        {/* ── Header ── */}
        <header className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-xs font-sans tracking-[0.35em] uppercase font-semibold">
                  Your Library
                </span>
              </div>
              <h1
                className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                My
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400">
                  Favourites
                </span>
              </h1>
              <p className="mt-3 text-zinc-500 font-sans text-sm">
                {favoriteBooks.length} book
                {favoriteBooks.length !== 1 ? "s" : ""} in your collection
              </p>
            </div>

            {!isEmpty && (
              <div className="flex items-center gap-2">
                <div className="flex p-1 gap-1 bg-white/[0.05] rounded-xl border border-white/[0.08] font-sans">
                  <button
                    onClick={() => setView("grid")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      view === "grid"
                        ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Grid
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      view === "list"
                        ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    List
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        </header>

        {/* ── Empty State ── */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                <BookMarked className="w-14 h-14 text-zinc-700" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400" />
            </div>
            <h2
              className="text-2xl font-bold text-zinc-200 mb-2"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              No favourites yet
            </h2>
            <p className="text-zinc-600 font-sans text-sm max-w-xs leading-relaxed mb-8">
              Explore books and tap the heart icon to build your personal
              reading list.
            </p>
            <button className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-black font-sans font-bold text-sm rounded-full hover:from-amber-300 hover:to-orange-300 transition-all duration-200 hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <Heart className="w-4 h-4" />
              Discover Books
            </button>
          </div>
        ) : view === "grid" ? (
          /* ── Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {favoriteBooks.map((book, i) => (
              <FavBookCard
                key={book.id || book._id}
                book={book}
                index={i}
                view="grid"
              />
            ))}
          </div>
        ) : (
          /* ── List ── */
          <div className="flex flex-col gap-3">
            {favoriteBooks.map((book, i) => (
              <FavBookCard
                key={book.id || book._id}
                book={book}
                index={i}
                view="list"
              />
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        {!isEmpty && (
          <div className="mt-20 flex items-center justify-center gap-4 text-zinc-700 font-sans text-xs tracking-[0.3em] uppercase">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-800" />
            <Heart className="w-3 h-3 text-rose-700" />
            <span>
              {favoriteBooks.length} favourite
              {favoriteBooks.length !== 1 ? "s" : ""}
            </span>
            <Heart className="w-3 h-3 text-rose-700" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-zinc-800" />
          </div>
        )}
      </div>
    </div>
  );
}
