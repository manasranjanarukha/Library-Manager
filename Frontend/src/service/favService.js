const API_URL = import.meta.env.VITE_API_URL;
export const addFavBook = async (bookId) => {
  const response = await fetch(`${API_URL}/favorites/star/${bookId}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json(); // ✅ always read body

  if (!response.ok) {
    // Print backend error message
    console.error("Backend error:", data);

    // Throw backend message to caller
    throw new Error(data.message || "Failed to favorite book");
  }

  return data;
};

export const fetchFavBooks = async () => {
  const response = await fetch(`${API_URL}/favorites/stars`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json(); // ✅ always read body

  if (!response.ok) {
    // Print backend error message
    console.error("Backend error:", data);

    // Throw backend message to caller
    throw new Error(data.message || "Failed to fetch favorite books");
  }

  return data;
};

export const removeFavBook = async (bookId) => {
  console.log("Book id", bookId);

  const response = await fetch(`${API_URL}/favorites/star/${bookId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json(); // ✅ always read body

  if (!response.ok) {
    // Print backend error message
    console.error("Backend error:", data);
    // Throw backend message to caller
    throw new Error(data.message || "Failed to remove favorite book");
  }
  return data;
};
