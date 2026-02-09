import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginTeacher } from "../api/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginTeacher(username, password);
      setMessage("Login successful ✅");

      navigate("/dashboard"); // ⭐ THIS WAS MISSING
    } catch (error) {
      setMessage("Invalid username or password ❌");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Teacher Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Login;
