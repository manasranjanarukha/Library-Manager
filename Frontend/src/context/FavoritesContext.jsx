import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import {
  fetchFavBooks,
  addFavBook,
  removeFavBook,
} from "../service/favService";
import { fetchBookItemsFromServer } from "../service/bookService";
import { useNavigate } from "react-router-dom";

export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavoriteBooks([]);
      return;
    }

    const loadFavoritesBooksAndBooks = async () => {
      const response1 = await fetchFavBooks();
      const booksData = await fetchBookItemsFromServer();
      setBooks(booksData);
      const favoriteBooksData = response1.favorites.map((f) => f.book);
      setFavoriteBooks(favoriteBooksData);
    };

    loadFavoritesBooksAndBooks();
  }, [user]);

  const addFavoriteLocal = async (bookId) => {
    try {
      const data = await addFavBook(bookId);
      alert(data.message);
      // Find the full book object from books state
      const book = books.find((b) => b.id === bookId);
      console.log(book);

      if (book) {
        setFavoriteBooks((prev) => {
          if (prev.some((b) => b._id === book.id)) {
            return prev;
          }
          return [...prev, book];
        });
      }
      navigate(`/reader/${user?._id}/favorites`);
      console.log("Favorite Books Updated:", favoriteBooks);
    } catch (error) {
      alert(error.message);
    }
  };
  const removeFavorite = async (bookId) => {
    try {
      await removeFavBook(bookId); // backend call

      setFavoriteBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <FavoritesContext.Provider
      value={{ favoriteBooks, addFavoriteLocal, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
};
