import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  useEffect(() => {}, [user]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <Link
            to={"/"}
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold hover:text-blue-200 transition-colors duration-200"
          >
            <span className="text-2xl sm:text-3xl">📚</span>
            <span className="hidden sm:inline">Book Review Hub</span>
            <span className="sm:hidden">BRH</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {/* If logged in and Author → show Add Book */}
            {user?.userType === "Author" && (
              <>
                <Link
                  to={"/books/add"}
                  className="px-3 py-2 rounded-md text-sm lg:text-base font-medium hover:bg-blue-800 hover:text-blue-100 transition-all duration-200 transform hover:scale-105"
                >
                  Add Book
                </Link>
                <Link
                  to={`/authors/:${user.id}/books`}
                  className="px-3 py-2 rounded-md text-sm lg:text-base font-medium hover:bg-blue-800 hover:text-blue-100 transition-all duration-200 transform hover:scale-105"
                >
                  My Book
                </Link>
              </>
            )}

            {/* If logged in → show user name + logout */}
            {user ? (
              <>
                <span className="px-3 py-2 text-sm lg:text-base font-medium">
                  Hi, {user?.fullName}
                </span>
                <button
                  className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-md text-sm lg:text-base font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={"/auth/login"}
                  className="px-3 py-2 rounded-md text-sm lg:text-base font-medium hover:bg-blue-800 hover:text-blue-100 transition-all duration-200 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to={"/auth/register"}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm lg:text-base font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-white transform transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transform transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-blue-800 border-t border-blue-700 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {user ? (
            <>
              {/* Common user info */}
              <span className="block px-3 py-2 text-base font-medium">
                Hi, {user.fullName}
              </span>
              {/* Author-only link */}
              <Link
                to={"/"}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 hover:text-blue-100 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                🏠 Home
              </Link>
              {user.userType === "Author" && (
                <Link
                  to={"/books/add"}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 hover:text-blue-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  ➕ Add Book
                </Link>
              )}

              <button
                className="block w-full text-left px-3 py-2 bg-red-600 hover:bg-red-500 rounded-md text-base font-medium mt-2"
                onClick={logout}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={"/auth/login"}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 hover:text-blue-100 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                🔐 Login
              </Link>
              <Link
                to={"/auth/register"}
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-500 transition-colors duration-200 mt-2"
                onClick={() => setIsOpen(false)}
              >
                ✨ Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
