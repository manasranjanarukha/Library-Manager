import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "../components/ReviewCard";
import { bookDetailFromServer } from "../service/bookService";
import {
  fetchAllReviews,
  submitReviewToServer,
} from "../service/reviewService";
import { UserContext } from "../context/userContext";

export default function BookDetail() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadBookAndReviews = async () => {
      try {
        const [bookData, reviewData] = await Promise.all([
          bookDetailFromServer(id),
          fetchAllReviews(id),
        ]);

        setBook(bookData);
        setReviews(reviewData);
      } catch (err) {
        console.error("Error loading book or reviews:", err);
      }
    };

    loadBookAndReviews();
  }, [id]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setComment(value);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const newReview = await submitReviewToServer(book.id, user.id, comment);
      setReviews((prev) => [...prev, newReview]);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <img src="/public/book-loading.gif" alt="Loading book" />
          <p className="mt-4 text-gray-600">
            Loading book Details, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 sm:mb-8 text-sm sm:text-base">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-gray-600 ml-2 text-sm sm:text-base">
              Books
            </span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base text-blue-600 font-medium">
              Book Details
            </span>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Book cover section - Improved responsive design */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Book cover image with proper aspect ratio */}
                <div className="relative w-full aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={`${API_URL}/uploads/books/covers/${book.cover}`}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Book info card content */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Featured badge */}
                  <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Featured Book</span>
                  </div>

                  {/* Read Book button */}
                  <Link to={`/${book.id}/read`} className="block">
                    <button className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-gray-900 text-white font-semibold text-base rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Read Book
                    </button>
                  </Link>

                  {/* Mobile book title preview (visible only on small screens) */}
                  <div className="lg:hidden pt-2 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      by {book.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book details section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and author */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="border-l-4 border-blue-600 pl-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    {book.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 mt-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>by {book.author}</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
                    />
                  </svg>
                  About This Book
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Reviews section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-yellow-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Reader Reviews
                  </h2>
                  {reviews?.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full self-start sm:self-auto">
                      {reviews.length}{" "}
                      {reviews.length === 1 ? "Review" : "Reviews"}
                    </span>
                  )}
                </div>

                {/* Review input form */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      name="comment"
                      value={comment}
                      placeholder="Write your review here..."
                      onChange={handleOnChange}
                      className="flex-1 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-xl text-base outline-none transition-all duration-200"
                    />
                    <button
                      onClick={handleReviewSubmit}
                      disabled={!comment.trim()}
                      className="bg-gray-900 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                      Post Review
                    </button>
                  </div>
                </div>

                {/* Reviews list */}
                <div className="space-y-4">
                  {reviews?.length > 0 ? (
                    reviews.map((rev) => (
                      <div
                        key={rev._id}
                        className="transform hover:scale-[1.01] transition-transform duration-200"
                      >
                        <ReviewCard review={rev} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.436L3 21l1.436-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                        />
                      </svg>
                      <p className="text-gray-500 text-lg font-medium">
                        No reviews yet
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Be the first to share your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Back to books button */}
          <div className="mt-8 sm:mt-12">
            <Link to="/">
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Books
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
