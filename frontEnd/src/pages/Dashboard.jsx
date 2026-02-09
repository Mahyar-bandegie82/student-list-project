import { useEffect, useState } from "react";
import { getStudents, uploadExcel } from "../services/studentService";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      setMessage("Failed to load students ❌");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an Excel file");
      return;
    }

    try {
      await uploadExcel(file);
      setMessage("Upload successful ✅");
      fetchStudents(); // refresh table
    } catch (error) {
      setMessage("Upload failed ❌");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Teacher Dashboard</h2>

      {/* Excel Upload */}
      <h3>Upload Students Excel</h3>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button type="submit">Upload</button>
      </form>

      <p>{message}</p>

      {/* Students Table */}
      <h3>Students List</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>id</th>
            <th>Student Code</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Image</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.student_code}</td>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.phone || "-"}</td>
              <td>
                {student.image ? (
                  <img
                    src={`http://127.0.0.1:8000${student.image}`}
                    width="60"
                  />
                ) : "No Image"}
              </td>
              <td>{student.latitude ?? "-"}</td>
              <td>{student.longitude ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
