import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUserInServer } from "../service/userService";
import { UserContext } from "../context/userContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUserInServer(form.email, form.password);
      const loggedInUser = result?.user?.user;

      if (!loggedInUser?.id) {
        throw new Error("Invalid login response");
      }

      setUser(loggedInUser);

      navigate(
        loggedInUser.userType === "Author"
          ? `/authors/${loggedInUser.id}/books`
          : "/",
        { replace: true }
      );

      setForm({ email: "", password: "" });
    } catch (err) {
      alert(
        err?.errors
          ? err.errors.map((e) => e.msg).join("\n")
          : err?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-3"
            value={form.email}
            onChange={handleOnChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-3"
            value={form.password}
            onChange={handleOnChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded transition
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}
