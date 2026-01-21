const API_URL = import.meta.env.VITE_API_URL;
export const favBook = async (bookId) => {
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
