const API_URL = import.meta.env.VITE_API_URL;

export const createUserInServer = async (form) => {
  const formData = new FormData();

  formData.append("profilePicture", form.profilePicture);
  formData.append("fullName", form.fullName);
  formData.append("email", form.email);
  formData.append("password", form.password);
  formData.append("confirmPassword", form.confirmPassword);
  formData.append("userType", form.userType);

  // ✅ ensure correct type
  formData.append("termsAccepted", form.termsAccepted ? "true" : "false");

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const loginUserInServer = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const user = await response.json(); // parse JSON **before** throwing

  if (!response.ok) {
    // throw the actual backend response
    throw user;
  }

  // return success response
  return { status: response.status, ok: response.ok, user };
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      credentials: "include", // 🔑 send cookie with request
    });

    if (!response.ok) {
      return { loggedIn: false, user: null };
    }

    return await response.json(); // { loggedIn: true, user: {...} }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("Error fetching current user:", err);
    }
    return { loggedIn: false, user: null };
  }
};

export const logoutUserInServer = async () => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // 👈 include cookie
  });

  return res.json();
};

export const updateUserInServer = async (id, updatedData) => {
  const response = await fetch(`${API_URL}/auth/user/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }
  return { status: response.status, ok: response.ok, result };
};

export const deleteUserInServer = async (id) => {
  const response = await fetch(`${API_URL}/auth/user/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const result = await response.json();
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  console.log("forgot pass", result);

  return result;
};

export const verifyCaptcha = async (email, captcha) => {
  const response = await fetch(`${API_URL}/auth/verify-captcha`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, captcha }),
  });

  const result = await response.json();
  console.log("verify-captcha", result);

  return result;
};

export const resetPassword = async (email, newPassword) => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, newPassword }),
  });

  const result = await response.json();
  console.log("verify-captcha", result);

  return result;
};
