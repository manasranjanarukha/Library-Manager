import { useEffect, useState } from "react";
import AuthorBookCard from "../components/AuthorBookCard";
import {
  fetchBookItemsFromServer,
  deleteBookFromServer,
} from "../service/bookService";

export default function AuthorHomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookItemsFromServer()
      .then((fetchedBooks) => {
        setBooks(fetchedBooks);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDeleteBook = async (id) => {
    try {
      await deleteBookFromServer(id);

      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src="/book-loading.gif" />
      </div>
    );
  }

  if (!loading && books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No books found 📭
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📚 My Books</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {books.map((book) => (
          <AuthorBookCard
            key={book.id}
            book={book}
            onDelete={handleDeleteBook}
          />
        ))}
      </div>
    </div>
  );
}
