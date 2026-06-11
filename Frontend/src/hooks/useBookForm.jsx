// React
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Context
import { UserContext } from "../context/UserContext";
// Services
import {
  addBookItemToServer,
  bookDetailFromServer,
  editBookItemToServer,
} from "../service/bookService";
// Utils
import extractPdfPages from "../utils/pdf";
const INITIAL_FORM = {
  title: "dfgrdregfegrg",
  genre: "",
  description: "dddddddddddddddddddddddddddddddddddddddddd",
  cover: "", // File | string (URL in edit mode)
  bookFile: "", // File | string (URL in edit mode)
  pages: "", // auto-filled from PDF
  publishedYear: String(new Date().getFullYear()),
  status: "published", // "draft" | "published"
};
export default function useBookForm({ mode = "add", bookId }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (!isEdit || !bookId) return;
    let cancelled = false;
    bookDetailFromServer(bookId)
      .then((data) => {
        if (cancelled) return;
        setFormData({
          ...INITIAL_FORM,
          ...data,
          status: data.status || "published",
        });
        if (data.cover) setPreviewUrl(data.cover);
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.error("[BookForm] fetchDetail:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, bookId]);
  // Input dispatcher
  const handleChange = useCallback(async (e) => {
    const { name, type, value, files } = e.target;
    if (type !== "file") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return;
    }
    const file = files?.[0];
    if (!file) return;
    if (name === "cover") {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, cover: file }));
      setErrors((prev) => ({ ...prev, cover: undefined }));
      return;
    }
    if (name === "bookFile") {
      try {
        const pageCount = await extractPdfPages(file);
        setFormData((prev) => ({
          ...prev,
          bookFile: file,
          pages: String(pageCount),
        }));
      } catch (err) {
        if (import.meta.env.DEV) console.error("[BookForm] PDF parse:", err);
        setFormData((prev) => ({ ...prev, bookFile: file }));
      }
      setErrors((prev) => ({ ...prev, bookFile: undefined }));
    }
  }, []);
  // Status toggle handler
  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };
  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const {
        cover,
        bookFile,
        title,
        genre,
        description,
        pages,
        publishedYear,
        status,
      } = formData;
      if (isEdit) {
        await editBookItemToServer(
          bookId,
          cover,
          bookFile,
          title,
          genre,
          description,
          parseInt(pages),
          parseInt(publishedYear),
          status,
        );
        navigate(`/authors/${user._id}/books`);
      } else {
        const data = await addBookItemToServer(
          user._id,
          cover,
          bookFile,
          title,
          genre,
          description,
          parseInt(pages),
          parseInt(publishedYear),
          status,
        );
        if (import.meta.env.DEV)
          console.info("[BookForm] Book created:", data.message);
        setFormData(INITIAL_FORM);
        setPreviewUrl(null);
        navigate(`/authors/${user._id}/books`);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error("[BookForm] Submit:", err);
      if (err.errors?.length) {
        const mapped = {};
        err.errors.forEach(({ path, msg }) => {
          mapped[path] = msg;
        });
        setErrors(mapped);
      } else {
        setErrors({
          _form: err.message || "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const isDraft = formData.status === "draft";
  const submitLabel = isSubmitting
    ? "Uploading…"
    : isDraft
      ? "Save draft"
      : isEdit
        ? "Update book"
        : "Publish book";
  return {
    formData,
    errors,
    previewUrl,
    isSubmitting,
    isEdit,
    handleChange,
    handleStatusChange,
    handleSubmit,
    user,
    isDraft,
  };
}
