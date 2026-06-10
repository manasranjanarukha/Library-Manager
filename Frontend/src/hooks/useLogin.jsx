import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUserInServer } from "../service/userService";
import { UserContext } from "../context/userContext";
export default function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error as user types
    if (errorMsg) setErrorMsg("");
  }

  async function handleSubmit(e) {
    if (loading) return; // Prevent multiple submissions
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await loginUserInServer(form.email, form.password);
      const loggedInUser = result?.user?.user;

      if (!loggedInUser?._id) throw new Error("Invalid login response");

      setUser(loggedInUser);
      setForm({ email: "", password: "" });

      switch (loggedInUser.userType) {
        case "Author":
          navigate(`/authors/${loggedInUser._id}/books`, { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error("Login error:", err);

      const msg = err?.errors?.length
        ? err?.errors?.map((e) => e.msg).join(" · ")
        : err?.message || "Invalid email or password. Please try again.";

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    errorMsg,
    handleChange,
    handleSubmit,
  };
}
