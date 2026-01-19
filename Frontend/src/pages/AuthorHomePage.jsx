import { useEffect, useState } from "react";

import AuthorBookCard from "../components/AuthorBookCard";
import { fetchBookItemsFromServer } from "../service/bookService";

export default function AuthorHomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookItemsFromServer()
      .then((fetchedBooks) => {
        setBooks(fetchedBooks);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      })
      .finally(() => {
        setLoading(false); // done fetching
      });
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src="/public/book-loading.gif" alt="Loading book" />
          <p className="mt-4 text-gray-600">Loading Books</p>
        </div>
      </div>
    );
  }

  if (!loading && books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">No books found 📭</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📚 My Books</h1>

      <div className="flex flex-wrap gap-6 justify-center lg:flex-wrap xl:flex-wrap overflow-x-auto">
        {books.map((book) => (
          <AuthorBookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
