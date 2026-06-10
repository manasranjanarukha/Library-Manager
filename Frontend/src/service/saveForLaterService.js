const API_URL = import.meta.env.VITE_API_URL;
export const addSaveForLater = async (bookId) => {
  const response = await fetch(`${API_URL}/save-for-later/${bookId}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json(); // ✅ always read body

  if (!response.ok) {
    // Print backend error message
    console.error("Backend error:", data);

    // Throw backend message to caller
    throw new Error(data.message || "Failed to save book for later");
  }

  return data;
};

export const fetchSaveForLaterBooks = async () => {
  const response = await fetch(`${API_URL}/save-for-later`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json(); // ✅ always read body

  if (!response.ok) {
    // Print backend error message
    console.error("Backend error:", data);

    // Throw backend message to caller
    throw new Error(data.message || "Failed to fetch saved books");
  }

  return data;
};

export const removeSaveForLater = async (bookId) => {
  const response = await fetch(`${API_URL}/save-for-later/${bookId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json(); // ✅ always read body

  if (!response.ok) {
    // Print backend error message
    console.error("Backend error:", data);
    // Throw backend message to caller
    throw new Error(data.message || "Failed to remove saved book");
  }
  return data;
};
