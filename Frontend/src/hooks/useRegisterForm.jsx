import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createUserInServer } from "../service/userService";

export default function useRegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form, setForm] = useState({
    profilePicture: "",
    fullName: "aaaaaaaaaaaaaaaaaa",
    email: "ade@gmail.com",
    password: "aaaaaa",
    confirmPassword: "aaaaaa",
    userType: "",
    termsAccepted: false,
  });

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (type === "file" && e.target.files[0]) {
      const file = e.target.files[0];

      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      useEffect(() => {
        return () => {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        };
      }, [previewUrl]);

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];

      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setLoading(true);
      setErrors({});

      try {
        await createUserInServer(form);

        navigate("/auth/login");
      } catch (err) {
        if (err.errors?.length) {
          const newErrors = {};

          err.errors.forEach(({ path, msg }) => {
            newErrors[path] = msg;
          });

          setErrors(newErrors);
        }
      } finally {
        setLoading(false);
      }
    },
    [form, navigate],
  );

  return {
    form,
    previewUrl,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}
