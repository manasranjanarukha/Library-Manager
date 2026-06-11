import { createContext, useContext, useEffect, useState } from "react";

// Contexts
import { UserContext } from "./UserContext";

// Services
import {
  fetchSaveForLaterBooks,
  addSaveForLater,
  removeSaveForLater,
} from "../service/saveForLaterService";

import { fetchBookItemsFromServer } from "../service/bookService";

export const SaveForLaterContext = createContext(null);

export const SaveForLaterProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [savedBooks, setSavedBooks] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user) {
      setSavedBooks([]);
      return;
    }

    const loadData = async () => {
      try {
        const saveResponse = await fetchSaveForLaterBooks();
        const booksData = await fetchBookItemsFromServer();

        setBooks(booksData);

        const booksFromSave =
          saveResponse?.saveForLaters?.map((item) => item.book) || [];

        setSavedBooks(booksFromSave);
      } catch (error) {
        console.error("Error loading save for later books:", error);
      }
    };

    loadData();
  }, [user]);

  const addSaveForLaterContext = async (bookId) => {
    try {
      await addSaveForLater(bookId);

      const book = books.find((b) => b?._id === bookId);

      if (!book) return;

      setSavedBooks((prev) => {
        const alreadyExists = prev.some((b) => b?._id === bookId);

        if (alreadyExists) return prev;

        return [...prev, book];
      });
    } catch (error) {
      console.error("Error adding save for later:", error);
    }
  };

  const removeSaveForLaterContext = async (bookId) => {
    try {
      await removeSaveForLater(bookId);

      setSavedBooks((prev) => prev.filter((book) => book?._id !== bookId));
    } catch (error) {
      console.error("Error removing save for later:", error);
    }
  };

  // Only published books exposed to UI
  const saveForLaterBooks = savedBooks.filter(
    (book) => book?.status === "published",
  );

  return (
    <SaveForLaterContext.Provider
      value={{
        saveForLaterBooks,
        savedBooks, // optional: keep access to all saved books
        addSaveForLaterContext,
        removeSaveForLaterContext,
      }}
    >
      {children}
    </SaveForLaterContext.Provider>
  );
};

export const useSaveForLater = () => {
  return useContext(SaveForLaterContext);
};
