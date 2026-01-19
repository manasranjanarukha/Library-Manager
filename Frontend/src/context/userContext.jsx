// UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { getCurrentUser, logoutUserInServer } from "../service/userService";
import { useNavigate } from "react-router-dom";

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
        console.error("Error fetching user:", err);

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
