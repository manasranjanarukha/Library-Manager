import { useState, useEffect, useContext } from "react";
import { Star, Heart, Trash2, BookOpen, Search, Filter } from "lucide-react";
import { UserContext } from "../context/userContext";
import BookCard from "../components/BookCard";

const API_URL = import.meta.env.VITE_API_URL;

export default function FavoriteBooks() {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedGenre, setSelectedGenre] = useState("all");

  // Mock data - Replace with actual API call
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch(`${API_URL}/favorites/${user.id}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockFavorites = [
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          cover: "gatsby.jpg",
          genre: "Classic",
          rating: 4.5,
          price: 299,
          description:
            "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
          publishedYear: 1925,
          pages: 180,
          addedDate: "2024-01-15",
        },
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          cover: "mockingbird.jpg",
          genre: "Fiction",
          rating: 4.8,
          price: 350,
          description:
            "A gripping tale of racial injustice and childhood innocence in the American South.",
          publishedYear: 1960,
          pages: 324,
          addedDate: "2024-01-10",
        },
      ];

      setFavorites(mockFavorites);
      setFilteredFavorites(mockFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort favorites
  useEffect(() => {
    let result = [...favorites];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Genre filter
    if (selectedGenre !== "all") {
      result = result.filter((book) => book.genre === selectedGenre);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price":
        result.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    setFilteredFavorites(result);
  }, [searchQuery, selectedGenre, sortBy, favorites]);

  const genres = ["all", ...new Set(favorites.map((book) => book.genre))];

  const removeFavorite = (bookId) => {
    // Add API call to remove from favorites
    setFavorites(favorites.filter((book) => book.id !== bookId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Heart className="w-16 h-16 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-white" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  My Favorite Books
                </h1>
              </div>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg">
                Your personal collection of beloved reads
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
              <p className="text-sm text-white/80">Total Favorites</p>
              <p className="text-3xl font-bold">{favorites.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Filters and Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Genre Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre === "all" ? "All Genres" : genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title (A-Z)</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedGenre !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">
                Active filters:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedGenre !== "all" && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Genre: {selectedGenre}
                  <button
                    onClick={() => setSelectedGenre("all")}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Books Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredFavorites.map((book) => (
              <div key={book.id} className="relative group">
                <BookCard book={book} />

                {/* Remove from Favorites Button */}
                <button
                  onClick={() => removeFavorite(book.id)}
                  className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 z-10"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No favorites found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedGenre !== "all"
                  ? "Try adjusting your filters to see more books"
                  : "Start adding books to your favorites collection!"}
              </p>
              {(searchQuery || selectedGenre !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("all");
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stats Section */}
        {favorites.length > 0 && (
          <div className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <BookOpen className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-2xl sm:text-3xl font-bold">
                {favorites.length}
              </p>
              <p className="text-sm text-blue-100">Total Books</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <Star className="w-8 h-8 mb-2 opacity-80 fill-white" />
              <p className="text-2xl sm:text-3xl font-bold">
                {(
                  favorites.reduce((acc, book) => acc + book.rating, 0) /
                  favorites.length
                ).toFixed(1)}
              </p>
              <p className="text-sm text-purple-100">Avg Rating</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
              <Heart className="w-8 h-8 mb-2 opacity-80 fill-white" />
              <p className="text-2xl sm:text-3xl font-bold">
                {genres.length - 1}
              </p>
              <p className="text-sm text-pink-100">Genres</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold">
                ₹{favorites.reduce((acc, book) => acc + book.price, 0)}
              </div>
              <p className="text-sm text-red-100">Total Value</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
