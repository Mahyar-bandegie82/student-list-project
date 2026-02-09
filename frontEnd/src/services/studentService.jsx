export async function getStudents() {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://127.0.0.1:8000/api/students/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return await response.json();
}


export async function uploadExcel(file) {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:8000/api/students/upload_excel/", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to upload Excel");
  }

  return await response.json();
}
