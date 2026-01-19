import { useEffect, useState } from "react";

import BookCard from "../components/BookCard";
import { fetchBookItemsFromServer } from "../service/bookService";

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBookItemsFromServer()
      .then((fetchedBooks) => {
        setBooks(fetchedBooks);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  if (!books || books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src="/public/book-loading.gif" alt="Loading book" />
          <p className="mt-4 text-gray-600">Loading books, please wait...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Available Books</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
