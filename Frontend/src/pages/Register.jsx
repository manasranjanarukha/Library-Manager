import { useState } from "react";
import { useNavigate } from "react-router";
import { createUserInServer } from "../service/userService";

function Register() {
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    profilePicture: "",
    fullName: "Manas Ranjan Behera",
    email: "aaa@gmail.com",
    password: "aaaaaa",
    confirmPassword: "aaaaaa",
    userType: "",
    termsAccepted: false,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle file input separately for preview
    if (type === "file" && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createUserInServer(
        form.profilePicture,
        form.fullName,
        form.email,
        form.password,
        form.confirmPassword,
        form.userType,
        form.termsAccepted
      );

      navigate("/auth/login");

      alert("Registration successful!");

      // Clear form and errors
      setForm({
        profilePicture: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "",
        termsAccepted: false,
      });
      setPreviewUrl(null);
      setErrors({});
    } catch (err) {
      console.log("Validation failed from backend:", err);

      if (err.errors && err.errors.length > 0) {
        const newErrors = {};
        err.errors.map((value) => {
          newErrors[value.path] = value.msg;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Sign up to get started</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="space-y-6">
            {/* Profile Picture - STYLED SECTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                {/* Preview Circle */}
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gray-100 border-2 border-gray-300 overflow-hidden flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Choose Photo
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/jpg,image/jpeg,image/png"
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, JPEG or PNG. Max 5MB.
                  </p>
                </div>
              </div>
              {errors.profilePicture && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.profilePicture}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
              {errors.fullName && (
                <p className="text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
              {errors.password && (
                <p className="text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              />
              {errors.confirmPassword && (
                <p className="text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="userType"
                    value="Reader"
                    checked={form.userType === "Reader"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Reader
                  </span>
                </label>
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="userType"
                    value="Author"
                    checked={form.userType === "Author"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Author
                  </span>
                </label>
              </div>
              {errors.userType && (
                <p className="text-red-600">{errors.userType}</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-green-600"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" className="text-green-600 underline">
                    Terms & Conditions
                  </a>
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-red-600">{errors.termsAccepted}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
