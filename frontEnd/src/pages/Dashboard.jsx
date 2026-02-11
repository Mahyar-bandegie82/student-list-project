import { useEffect, useState } from "react";
import { getStudents, uploadExcel } from "../services/studentService";
import AddStudentForm from "../components/AddStudentForm";
import { deleteStudent, updateStudent } from "../services/studentService";
import { logoutTeacher } from "../api/auth";
import { useNavigate } from "react-router-dom";

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

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;

    try {
      await deleteStudent(id);
      fetchStudents();
    } catch {
      alert("Delete failed");
    }
  };

  const handleEdit = async (student) => {
    const first_name = prompt("First name:", student.first_name);
    const last_name = prompt("Last name:", student.last_name);
    const phone = prompt("Phone:", student.phone || "");

    if (!first_name || !last_name) return;

    try {
      await updateStudent(student.id, {
        student_code: student.student_code,
        first_name,
        last_name,
        phone,
        latitude: student.latitude,
        longitude: student.longitude,
      });

      fetchStudents();
    } catch {
      alert("Update failed");
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logoutTeacher();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Teacher Dashboard</h2>
      <button className="btn-secondary" onClick={handleLogout}>Logout</button>

      <br />
      <br />

      <AddStudentForm onStudentCreated={fetchStudents} />

      {/* Excel Upload */}
      <h3>Upload Students Excel</h3>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <br />
        <button className="upload-btn" type="submit">Upload</button>
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td className="student-code">{student.student_code}</td>
              <td className="first-name">{student.first_name}</td>
              <td className="last-name">{student.last_name}</td>
              <td className="location">{student.phone || "-"}</td>
              <td>
                {student.image && (
                  <img
                    src={`http://127.0.0.1:8000${student.image}`}
                    width="60"
                  />
                )}
              </td>
              <td>
                {student.latitude && student.longitude
                  ? `${student.latitude}`
                  : "No location"}
              </td>
              <td>
                {student.latitude && student.longitude
                  ? `${student.longitude}`
                  : "No location"}
              </td>
              <td style={{display : "flex"}}>
                <button className="btn-primary" onClick={() => handleEdit(student)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
