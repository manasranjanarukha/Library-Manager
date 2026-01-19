const API_URL = import.meta.env.VITE_API_URL;
export const addBookItemToServer = async (
  cover,
  bookFile,
  title,
  author,
  genre,
  price,
  description,
  rating,
  pages,
  publishedYear,
) => {
  const formData = new FormData();
  formData.append("bookFile", bookFile);
  formData.append("cover", cover);
  formData.append("title", title);
  formData.append("author", author);
  formData.append("genre", genre);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("rating", rating);
  formData.append("pages", pages);
  formData.append("publishedYear", publishedYear);

  const response = await fetch(`${API_URL}/book-items`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw backend errors (if any) instead of generic error
    throw data;
  }

  return data;
};

export const editBookItemToServer = async (
  id,
  cover,
  bookFile,
  title,
  author,
  genre,
  price,
  description,
  rating,
  pages,
  publishedYear,
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("author", author);
  formData.append("genre", genre);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("rating", rating);
  formData.append("pages", pages);
  formData.append("publishedYear", publishedYear);

  // Only append cover if it's a new file
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

  if (!response.ok) {
    throw new Error("Failed to edit item details");
  }

  const data = await response.json();
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

export const fetchBookItemsFromServer = async () => {
  const response = await fetch(`${API_URL}/book-items`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  const data = await response.json();

  return data.map((data) => bookItemToLocalItem(data));
};

export const bookDetailFromServer = async (id) => {
  const response = await fetch(`${API_URL}/book-items/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch item details");
  }
  const data = await response.json();
  return bookItemToLocalItem(data);
};

export const favBook = async (id) => {
  const response = await fetch(`${API_URL}/book-items/star/${id}`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to favorite book");
  }

  return response.json();
};

const bookItemToLocalItem = (bookItem) => {
  return {
    id: bookItem._id, // MongoDB document ID
    title: bookItem.title, // Book title
    author: bookItem.author, // Author name
    genre: bookItem.genre, // Book genre
    price: bookItem.price, // Price
    description: bookItem.description, // Description
    cover: bookItem.cover, // Cover image URL
    bookFile: bookItem.bookFile, // Book file URL
    rating: bookItem.rating, // Rating
    pages: bookItem.pages, // Number of pages
    publishedYear: bookItem.publishedYear, // Published year
    createdAt: bookItem.createdAt, // Auto timestamp
    updatedAt: bookItem.updatedAt, // Auto timestamp
  };
};
