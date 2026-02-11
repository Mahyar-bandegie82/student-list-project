import { useState } from "react";
import { createStudent } from "../api/studentApi";

function AddStudentForm({ onStudentCreated }) {
  const [studentCode, setStudentCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("student_code", studentCode);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("phone", phone);
    if (image) {
      formData.append("image", image);
    }
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);


    try {
      await createStudent(formData);
      setMessage("Student added ✅");

      setStudentCode("");
      setFirstName("");
      setLastName("");
      setPhone("");

      if (onStudentCreated) onStudentCreated();
    } catch (error) {
      setMessage("Failed to add student ❌");
    }
  };

  return (
    <div  style={{ marginBottom: 30 , marginTop : 30}}>
      <h3>Add Student</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Student Code"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />
        <br />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        
        <br />
        <br />

        <button
          className="get-location-btn"
          type="button"
          onClick={() => {
            if (!navigator.geolocation) {
              alert("Geolocation not supported");
              return;
            }

            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                alert("Location captured ✅");
              },
              () => {
                alert("Failed to get location ❌");
              },
            );
          }}
        >
          Get Location
        </button>

        <br />
        <br />

        {latitude && (
          <p>
            Lat: {latitude} | Lng: {longitude}
          </p>
        )}

        <button className="btn-primary" type="submit">Add Student</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default AddStudentForm;
