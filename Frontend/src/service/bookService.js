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

  // 1. Guard text fields against undefined/null
  if (title) formData.append("title", title);
  if (author) formData.append("author", author);
  if (genre) formData.append("genre", genre);
  if (price) formData.append("price", price);
  if (description) formData.append("description", description);
  if (rating) formData.append("rating", rating);
  if (pages) formData.append("pages", pages);
  if (publishedYear) formData.append("publishedYear", publishedYear);

  // 2. Only append if they are actual files!
  if (cover instanceof File) {
    formData.append("cover", cover);
  }
  if (bookFile instanceof File) {
    formData.append("bookFile", bookFile);
  }
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await fetch(`${API_URL}/book-items`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log(data);

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
  author,
  genre,
  price,
  description,
  rating,
  pages,
  publishedYear,
) => {
  const formData = new FormData();

  // Guard against sending the string "undefined" or "null" for text fields
  if (title) formData.append("title", title);
  if (author) formData.append("author", author);
  if (genre) formData.append("genre", genre);
  if (price) formData.append("price", price);
  if (description) formData.append("description", description);
  if (rating) formData.append("rating", rating);
  if (pages) formData.append("pages", pages);
  if (publishedYear) formData.append("publishedYear", publishedYear);

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
  console.log(formData);

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
