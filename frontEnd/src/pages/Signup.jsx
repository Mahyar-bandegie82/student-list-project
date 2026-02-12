import { useState } from "react";
import { signupTeacher } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signupTeacher({
        username,
        password,
        recovery_question: question,
        recovery_answer: answer,
      });

      setMessage("Account created ✅");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setMessage("Signup failed ❌");
    }
  };

  return (
    <div className="container">
      <h2>Create Teacher Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Recovery Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Recovery Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <br /><br />

        <button className="btn-primary" type="submit">
          Sign Up
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Signup;
