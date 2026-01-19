import { useState, useContext } from "react";
import {
  addBookItemToServer,
  bookDetailFromServer,
  editBookItemToServer,
} from "../service/bookService";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function BookForm({ mode, bookId }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    title: "Hello",
    author: "Ramayana",
    genre: "Romance",
    price: "499",
    description: "This is a book description for readymate",
    cover: "",
    bookFile: "",
    rating: "4.9",
    pages: "10",
    publishedYear: "2023",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    async function fetchData() {
      if (mode === "edit" && bookId) {
        const fetchedData = await bookDetailFromServer(bookId);

        setFormData(fetchedData);
        setPreviewUrl(`${API_URL}/uploads/books/covers/${fetchedData.cover}`);
      }
    }
    fetchData();
  }, [mode, bookId]);
  // ✅ Genres for dropdown
  const genres = [
    // 📚 Fiction
    "Fantasy",
    "Science Fiction",
    "Dystopian",
    "Adventure",
    "Romance",
    "Contemporary",
    "Historical Fiction",
    "Mystery",
    "Thriller",
    "Horror",
    "Paranormal",
    "Young Adult (YA)",
    "New Adult",
    "Children’s Fiction",

    // 📖 Non-Fiction
    "Biography / Autobiography / Memoir",
    "Self-help / Personal Development",
    "Health & Fitness",
    "History",
    "Philosophy",
    "Psychology",
    "Religion / Spirituality",
    "Politics",
    "Science",
    "Technology",
    "Business / Economics",
    "Travel",
    "True Crime",
    "Essays",

    // 🎨 Other Categories
    "Poetry",
    "Drama / Plays",
    "Anthology (short stories, essays)",
    "Graphic Novels / Comics",
    "Classic Literature",
  ];

  // handle input changes
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && name === "cover" && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      // Create preview URL
      const reader = new FileReader();
      console.log(reader);

      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (name === "bookFile") {
      // If it's the file input → store the file object
      setFormData({ ...formData, bookFile: files[0] });
    } else {
      // For text/number inputs → store normal value
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        const editData = await editBookItemToServer(
          bookId,
          formData.cover,
          formData.bookFile,
          formData.title,
          formData.author,
          formData.genre,
          parseFloat(formData.price),
          formData.description,
          parseFloat(formData.rating),
          parseInt(formData.pages),
          parseInt(formData.publishedYear)
        );
        navigate(`/authors/:${user.id}/books`);
        alert(`Book edited successfully!`);
      } else {
        const data = await addBookItemToServer(
          formData.cover,
          formData.bookFile,
          formData.title,
          formData.author,
          formData.genre,
          parseFloat(formData.price),
          formData.description,
          parseFloat(formData.rating),
          parseInt(formData.pages),
          parseInt(formData.publishedYear)
        );
        alert(data.message);
        setFormData({
          title: "",
          author: "",
          genre: "",
          price: "",
          description: "",
          cover: "",
          bookFile: "",
          rating: "",
          pages: "",
          publishedYear: "",
        });
        navigate(`/authors/:${user.id}/books`);
        setErrors({});
      }
    } catch (err) {
      console.error("❌ Error creating book:", err.message);
      alert("Failed to add book", errors);
      if (err.errors && err.errors.length > 0) {
        const newErrors = {};
        err.errors.map((value) => {
          newErrors[value.path] = value.msg; // map backend errors to field names
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md mx-auto p-4 border rounded-md shadow"
        encType="multipart/form-data"
      >
        <div>
          <label className="flex font-medium m-0">
            {mode === "edit"
              ? " Edit Book Cover Photo"
              : "Upload Book Cover Photo"}
          </label>
          <div className="flex items-center space-x-4">
            {/* Preview Circle */}
            <div className="flex-shrink-0">
              <div className="h-40 w-30  bg-gray-100 border-2 border-gray-300 overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  // 1️⃣ New image selected
                  <img
                    src={previewUrl}
                    alt="Cover Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // 3️⃣ No image
                  <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                <svg
                  className="h-5 w-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Choose Photo
                <input
                  type="file"
                  name="cover"
                  accept="image/jpg,image/jpeg,image/png"
                  onChange={handleChange}
                  className="sr-only"
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                JPG, JPEG or PNG. Max 5MB.
              </p>
            </div>
          </div>
          {errors.cover && (
            <p className="mt-2 text-sm text-red-600">{errors.cover}</p>
          )}
        </div>
        <label className="flex font-medium m-0">
          {mode === "edit" ? "Edit Book File" : "Upload Book File"}
        </label>
        <div>
          {mode === "edit" && formData.bookFile && (
            <a
              href={`${API_URL}/uploads/books/bookFiles/${formData.bookFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View / Download Book PDF
            </a>
          )}

          <input
            type="file"
            name="bookFile"
            accept="application/pdf"
            onChange={handleChange}
            required={mode === "add"}
            className="w-full p-2 border rounded"
          />
        </div>
        {errors.title && <p className="text-red-600">{errors.title}</p>}
        <label htmlFor="author" className="flex font-medium m-0">
          {mode === "edit" ? "Edit Author" : "Add Author"}
        </label>
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.author && <p className="text-red-600">{errors.author}</p>}
        {/* ✅ Genre dropdown */}
        <label htmlFor="genre" className="flex font-medium m-0">
          {mode === "edit" ? "Edit Genre" : "Add Genre"}
        </label>
        <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        >
          <option value="">Select Genre</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {errors.genre && <p className="text-red-600">{errors.genre}</p>}
        <label htmlFor="price" className="flex font-medium m-0">
          {mode === "edit" ? "Edit Price" : "Add Price"}
        </label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.price && <p className="text-red-600">{errors.price}</p>}
        <label htmlFor="description" className="flex font-medium m-0">
          {mode === "edit" ? "Edit Description" : "Add Description"}
        </label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.description && (
          <p className="text-red-600">{errors.description}</p>
        )}
        <label htmlFor="rating" className="flex font-medium m-0">
          {mode === "edit" ? "Edit Rating" : "Add Rating"}
        </label>
        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating (1-5)"
          value={formData.rating}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.rating && <p className="text-red-600">{errors.rating}</p>}
        <label htmlFor="pages" className="flex font-medium m-0">
          {mode === "edit" ? "Edit Pages" : "Add Pages"}
        </label>
        <input
          type="number"
          name="pages"
          placeholder="Pages"
          value={formData.pages}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.pages && <p className="text-red-600">{errors.pages}</p>}
        <label htmlFor="publishedYear" className="flex font-medium m-0">
          {mode === "edit" ? "Edit Published Year" : "Add Published Year"}
        </label>
        <input
          type="number"
          name="publishedYear"
          placeholder="Published Year"
          value={formData.publishedYear}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.publishedYear && (
          <p className="text-red-600">{errors.publishedYear}</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {mode === "edit" ? "Update Book" : "Add Book"}
        </button>
      </form>
    </>
  );
}
