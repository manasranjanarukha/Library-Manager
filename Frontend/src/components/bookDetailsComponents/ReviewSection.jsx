// React
import React, { useEffect, useState } from "react";

// Icons
import { MessageSquare, Send, Star } from "lucide-react";

// Components
import ReviewCard from "../ReviewCard";

// Services
import {
  submitReviewToServer,
  fetchAllReviews,
} from "../../service/reviewService";
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="Choose your rating"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          className="p-0.5 transition-transform duration-100 hover:scale-110 active:scale-95 focus-visible:outline-none"
        >
          <Star
            className={`h-5 w-5 transition-colors duration-150 ${
              n <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-black-200"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-1 text-xs font-semibold text-slate-400">
          {value}/5
        </span>
      )}
    </div>
  );
}

export default function ReviewSection({ book, user, reviews, setReviews }) {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  useEffect(() => {
    setLoading(true);
    const fetchReviews = async () => {
      try {
        const data = await fetchAllReviews(book?._id);
        setReviews(data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching reviews:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    if (book?._id) {
      fetchReviews();
    }
  }, [book?._id]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setComment(value);
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const newReview = await submitReviewToServer(
        book?._id,
        user?._id,
        comment,
        rating,
      );
      setReviews((prev) => [...prev, newReview]);
      setComment("");
      setSubmitting(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error submitting review:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <section
        className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm fade-up"
        style={{ animationDelay: "140ms" }}
        aria-label="Reader reviews"
      >
        <div className="p-5 sm:p-6 lg:p-7">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <MessageSquare
                className="h-5 w-5 text-teal-600"
                aria-hidden="true"
              />
              Reader Reviews
            </h2>
            {reviews.length > 0 && (
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">
                {reviews.length}
              </span>
            )}
          </div>

          {/* Write review form */}
          <form
            onSubmit={handleReviewSubmit}
            className="mb-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5"
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Write a Review
            </p>

            {/* Star picker */}
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Your rating
              </span>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Input + submit
                        - mobile: stacked (flex-col)
                        - sm+: side-by-side (flex-row)
                    */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={comment}
                onChange={handleOnChange}
                placeholder="Share your thoughts about this book…"
                aria-label="Write your review"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <button
                type="submit"
                disabled={!comment.trim() || submitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-teal-800 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {submitting ? "Posting…" : "Post Review"}
              </button>
            </div>
          </form>

          {/* Reviews list */}
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((rev, i) => (
                <ReviewCard key={rev._id} reviews={rev} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
                <MessageSquare
                  className="h-6 w-6 text-teal-300"
                  aria-hidden="true"
                />
              </div>
              <p className="mb-1 text-sm font-bold text-slate-700">
                No reviews yet
              </p>
              <p className="text-xs text-slate-400">
                Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
