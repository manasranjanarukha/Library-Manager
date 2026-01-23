import React from "react";

import { useContext } from "react";
import { Star, Calendar, BookOpen, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { favBook, fetchFavBooks } from "../service/favService";
const API_URL = import.meta.env.VITE_API_URL;
export default function BookCard({ book }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (!user) {
      alert("Please login or Register");
      navigate("/auth/login");
    } else {
      navigate(`/book-items/${book.id}`);
    }
  };

  const getBookId = async () => {
    try {
      const favData = await fetchFavBooks();
      console.log("fav data", favData);

      const data = await favBook(book.id); // ✅ pass ID only
      console.log("Favorite response:", data);
      alert(data.message);

      navigate(`/reader/${user?._id}/favorites`);
    } catch (error) {
      alert(error.message);
    }
  };

  // Helper function to render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 w-full group">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Left Side - Image Container */}
        <div className="flex-shrink-0 w-full sm:w-40 md:w-48 lg:w-44 xl:w-48">
          <div
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
            style={{ paddingTop: "150%" }}
          >
            <img
              src={`${API_URL}/uploads/books/covers/${book.cover}`}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />

            {/* Genre Badge */}
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                {book.genre}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Book Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Top Section - Title, Author, Rating, Description */}
          <div>
            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {book.title}
            </h2>

            {/* Author */}
            <p className="text-gray-600 font-medium text-sm mb-2">
              by {book.author}
            </p>

            {/* Rating */}
            <div className="mb-3">{renderStars(book.rating)}</div>

            {/* Price */}
            <div className="mb-3">
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg text-lg font-bold shadow-md">
                <IndianRupee className="w-4 h-4" />
                {book.price}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3 sm:line-clamp-2 md:line-clamp-3">
              {book.description}
            </p>

            {/* Book Details */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium">{book.publishedYear}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="font-medium">{book.pages} pages</span>
              </div>
            </div>
          </div>

          {/* Bottom Section - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <button
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              onClick={handleViewDetails}
            >
              View Details
            </button>

            <button
              className="sm:w-auto px-4 py-2.5 border-2 border-red-400 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              onClick={getBookId}
            >
              <Star className="w-4 h-4" />
              <span className="sm:hidden">Star</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
