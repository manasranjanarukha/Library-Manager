// React
import { lazy, Suspense } from "react";

// Router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import Navbar from "./components/navBar/NavBar.jsx";
import ProtectedRoute from "./components/ProtectRoute";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import AuthorDashboardPage from "./pages/AuthorDashboardPage";
import EditBookPage from "./pages/EditBookPage";
import AddBookPage from "./pages/AddBookPage";
import ProfilePage from "./pages/profilePage";
import BookReader from "./pages/BookReader.jsx";

// Lazy Loaded Pages
const BookDetail = lazy(() => import("./pages/BookDetail"));
const SaveForLater = lazy(() => import("./pages/SaveForLater"));
const Login = lazy(() => import("./pages/Login"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));

// Contexts
import { UserProvider } from "./context/UserContext";
import { SaveForLaterProvider } from "./context/SaveForLaterContext.jsx";

function App() {
  return (
    <UserProvider>
      <SaveForLaterProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgetPassword />} />

          <Route
            path=":id/books/add"
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
            path="/books/:id"
            element={
              <ProtectedRoute allowedRoles={["Reader"]}>
                <suspense fallback={<div>Loading...</div>}>
                  <BookDetail />
                </suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/authors/:authorId/books"
            element={
              <ProtectedRoute>
                <AuthorDashboardPage />
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
            path="book/:id/read"
            element={
              <ProtectedRoute>
                <BookReader />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reader/:readerId/save-for-later"
            element={
              <ProtectedRoute allowedRoles={["Reader"]}>
                <Suspense fallback={<div>Loading...</div>}>
                  <SaveForLater />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route path="/books/categories/:genre" element={<CategoryPage />} />
        </Routes>
      </SaveForLaterProvider>
    </UserProvider>
  );
}

export default App;
