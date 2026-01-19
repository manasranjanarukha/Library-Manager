const API_URL = import.meta.env.VITE_API_URL;
export const submitReviewToServer = async (bookId, userId, comment) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookId: bookId,
      comment: comment,
      userId: userId,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    // Throw backend errors (if any) instead of generic error
    throw data;
  }
  return data;
};

export const fetchAllReviews = async (id) => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) throw data;

  return data;
};
