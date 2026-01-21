import "./index.css";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectRoute";
import AuthorHomePage from "./pages/AuthorHomePage";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EditBookPage from "./pages/EditBookPage";
import BookDetail from "./pages/BookDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { UserProvider } from "./context/userContext";
import AddBookPage from "./pages/AddBookPage";
import ProfilePage from "./pages/profilePage";
import BookReader from "./pages/BookReader.jsx";
import FavoriteBooks from "./pages/FavoriteBooks.jsx";

function App() {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route
            path="/books/add"
            element={
              <ProtectedRoute>
                <AddBookPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-book/:id"
            element={
              <ProtectedRoute>
                <EditBookPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-items/:id"
            element={
              <ProtectedRoute allowedRoles={["Reader"]}>
                <BookDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authors/:authorId/books"
            element={
              <ProtectedRoute>
                <AuthorHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:bookId/read"
            element={
              <ProtectedRoute>
                <BookReader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reader/:readerId/favorites"
            element={
              <ProtectedRoute allowedRoles={["Reader"]}>
                <FavoriteBooks />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
