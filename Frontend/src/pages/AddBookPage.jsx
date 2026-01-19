// src/pages/EditBookPage.jsx

import BookForm from "../components/BookForm";

export default function AddBookPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Add a New Book</h1>
      <BookForm />
    </div>
  );
}
