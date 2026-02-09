import { saveTokens } from "../utils/auth";

const BASE_URL = "http://127.0.0.1:8000/api/auth/";

export async function loginTeacher(username, password) {
  const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();

  // ⭐ Save tokens in localStorage
  // backend returns `access_token` and `refresh_token`
  // prefer the shared helper
  saveTokens(
    data.access_token || data.access,
    data.refresh_token || data.refresh,
  );

  return data;
}

export const signupTeacher = async (formData) => {
  const response = await fetch(BASE_URL + "signup/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
};
