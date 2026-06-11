// React
import { createContext, useState, useEffect } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Services
import { getCurrentUser, logoutUserInServer } from "../service/userService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // global user state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();

        if (result.loggedIn) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Error fetching user on app load:", err);
        }

        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await logoutUserInServer();
    setUser(null); // clear context
    navigate("/auth/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
