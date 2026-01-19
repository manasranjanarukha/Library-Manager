// src/pages/EditBookPage.jsx
import { useParams } from "react-router-dom";
import BookForm from "../components/BookForm";

export default function EditBookPage() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Book</h1>
      <BookForm mode="edit" bookId={id} />
    </div>
  );
}
