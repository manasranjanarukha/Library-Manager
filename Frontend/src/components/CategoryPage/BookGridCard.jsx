import { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, BookOpen, Star } from "lucide-react";
import { useSaveForLater } from "../../context/SaveForLaterContext";
import { UserContext } from "../../context/UserContext";
export default function BookGridCard({ book }) {
  const { _id, title, cover, author, rating, genre } = book;
  const { user } = useContext(UserContext);
  const {
    saveForLaterBooks,
    removeSaveForLaterContext,
    addSaveForLaterContext,
  } = useSaveForLater();
  const navigate = useNavigate();
  const saveForLaterIds = useMemo(
    () => new Set(saveForLaterBooks.map((f) => f?._id)),
    [saveForLaterBooks],
  );
  const isSaveForLater = saveForLaterIds.has(_id);

  async function toggleSaveForLater(e) {
    e.preventDefault(); // prevents Link navigation
    e.stopPropagation(); // prevents bubbling
    if (!user) {
      alert("Please login or Register");
      navigate("/auth/login");
      return;
    }
    try {
      if (isSaveForLater) {
        await removeSaveForLaterContext(_id);
      } else {
        await addSaveForLaterContext(_id);
      }
    } catch (error) {
      console.error("Save for later error:", error);
    }
  }
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] shadow-[0_2px_12px_rgba(0,0,0,0.07)] border border-black active:scale-[0.99] h-full flex flex-col">
      <Link
        to={`/books/${_id}`}
        className="group relative overflow-hidden rounded-[14px] border border-slate-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-teal-100 hover:shadow-[0_12px_28px_rgba(15,110,86,0.13)]"
        aria-label={`${title} by ${author?.fullName}`}
      >
        {/* ── Cover ── */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "2/3" }}
        >
          {cover ? (
            <img
              src={cover}
              alt={`Cover of ${title}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-teal-50">
              <BookOpen className="h-7 w-7 text-teal-400" aria-hidden="true" />
              <span className="text-[9px] font-medium text-teal-700">
                No Cover
              </span>
            </div>
          )}

          {/* Dark teal gradient scrim */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#04342C]/60" />

          {/* Genre badge — top left */}
          {genre && (
            <span className="absolute left-2 top-2 rounded-full bg-[rgba(4,52,44,0.82)] px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-wide text-teal-300 backdrop-blur-sm">
              {genre}
            </span>
          )}

          {/* Bookmark button — top right */}
          <button
            onClick={toggleSaveForLater}
            className={`absolute right-2 top-2 flex h-[26px] w-[26px] items-center justify-center rounded-full cursor-pointer ${
              isSaveForLater
                ? "border-red-300 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                : "border-slate-200 bg-slate-50 text-black hover:border-red-300 hover:bg-red-50 hover:text-red-500"
            }`}
            aria-label={
              isSaveForLater ? "Remove from Save for later" : "Save for later"
            }
          >
            <Bookmark
              className={`h-3 w-3 ${isSaveForLater ? "fill-red-500 text-red-500" : "text-black"}`}
            />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-2 sm:p-2.5">
          <h3 className="line-clamp-2 text-[11.5px] font-semibold leading-snug text-slate-800 transition-colors group-hover:text-teal-700">
            {title}
          </h3>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">
            {author?.fullName || "Unknown"}
          </p>

          {/* ── Footer ── */}
          <div className="mt-2 flex items-center justify-between">
            {rating?.average > 0 ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-500">
                <Star
                  className="h-2.5 w-2.5 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                {rating.average.toFixed(1)}
              </span>
            ) : (
              <span className="text-[9.5px] text-slate-300">
                {rating?.count ? `${rating.count} ratings` : ""}
              </span>
            )}

            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[9.5px] font-semibold text-teal-800">
              View →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
