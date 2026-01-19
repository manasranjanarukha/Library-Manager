const API_URL = import.meta.env.VITE_API_URL;
export const createUserInServer = async (
  profilePicture,
  fullName,
  email,
  password,
  confirmPassword,
  userType,
  termsAccepted
) => {
  const formData = new FormData();
  formData.append("profilePicture", profilePicture);
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("confirmPassword", confirmPassword);
  formData.append("userType", userType);
  formData.append("termsAccepted", termsAccepted);

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const user = await response.json(); // parse JSON **before** throwing

  if (!response.ok) {
    // throw the actual backend response
    throw user;
  }

  // return success response
  return { status: response.status, ok: response.ok, user };
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
    console.error("Error fetching current user:", err);
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
