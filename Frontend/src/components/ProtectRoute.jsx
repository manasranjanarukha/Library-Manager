import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useContext(UserContext);

  // 1. Still checking session → show loader

  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src="/public/book-loading.gif" alt="Loading book" />
          <p className="mt-4 text-gray-600">Loading User</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 3. Role-based routing using switch
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
