const API_URL = import.meta.env.VITE_API_URL;
export const addBookItemToServer = async (
  userId,
  cover,
  bookFile,
  title,
  genre,
  description,
  pages,
  publishedYear,
  status,
) => {
  const formData = new FormData();

  if (title) formData.append("title", title);
  if (genre) formData.append("genre", genre);
  if (description) formData.append("description", description);
  if (pages) formData.append("pages", pages);
  if (publishedYear) formData.append("publishedYear", publishedYear);
  if (status) formData.append("status", status);

  // 2. Only append if they are actual files!
  if (cover instanceof File) {
    formData.append("cover", cover);
  }
  if (bookFile instanceof File) {
    formData.append("bookFile", bookFile);
  }
  for (let [key, value] of formData.entries()) {
  }

  const response = await fetch(
    `${API_URL}/book-items${userId ? `/${userId}` : ""}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const editBookItemToServer = async (
  id,
  cover,
  bookFile,
  title,
  genre,
  description,
  pages,
  publishedYear,
  status,
) => {
  const formData = new FormData();

  // Guard against sending the string "undefined" or "null" for text fields
  if (title) formData.append("title", title);
  if (genre) formData.append("genre", genre);
  if (description) formData.append("description", description);
  if (pages) formData.append("pages", pages);
  if (publishedYear) formData.append("publishedYear", publishedYear);
  if (status) formData.append("status", status);

  // Only append cover if it's a new file (You nailed this part!)
  if (cover instanceof File) {
    formData.append("cover", cover);
  }

  if (bookFile instanceof File) {
    formData.append("bookFile", bookFile);
  }

  const response = await fetch(`${API_URL}/book-items/${id}`, {
    method: "PUT",
    body: formData, // ✅ send as FormData
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw the actual backend error so your UI can display it
    throw data;
  }

  return data;
};

export const deleteBookFromServer = async (id) => {
  const response = await fetch(`${API_URL}/book-items/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete book");
  }

  const data = await response.json();
  return data;
};

export const fetchBookItemsFromServer = async (genre) => {
  const url = genre
    ? `${API_URL}/book-items?genre=${encodeURIComponent(genre)}`
    : `${API_URL}/book-items`;
  const response = await fetch(url, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  const data = await response.json();

  return data;
};

export const bookDetailFromServer = async (id) => {
  const response = await fetch(`${API_URL}/book-items/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch item details");
  }
  const data = await response.json();

  return data;
};

export const storeBooksRating = async (id) => {
  const response = await fetch(`${API_URL}/book-items/${id}/rating`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to store book rating");
  }
};

// const bookItemToLocalItem = (bookItem) => {
//   return {
//     id: bookItem._id, // MongoDB document ID
//     title: bookItem.title, // Book title
//     author: bookItem.author, // Author name
//     genre: bookItem.genre, // Book genre
//     description: bookItem.description, // Description
//     cover: bookItem.cover, // Cover image URL
//     bookFile: bookItem.bookFile, // Book file URL
//     pages: bookItem.pages, // Number of pages
//     publishedYear: bookItem.publishedYear, // Published year
//     rating: bookItem.rating, // Rating object with average and count
//     createdAt: bookItem.createdAt, // Auto timestamp
//     updatedAt: bookItem.updatedAt, // Auto timestamp
//   };
// };
