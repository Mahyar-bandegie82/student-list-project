const API_URL = "http://127.0.0.1:8000/api/students/";

export async function createStudent(studentData) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: studentData
  });

  if (!response.ok) {
    throw new Error("Failed to create student");
  }

  return await response.json();
}
