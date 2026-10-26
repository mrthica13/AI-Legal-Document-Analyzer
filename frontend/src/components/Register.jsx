
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        "https://ai-legal-document-analyzer-backend-4654.onrender.com/register",
        {
          username,
          email,
          password,
        }
      );

      alert("✅ Registration Successful");
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);

      const message =
        error.response?.data?.detail ||
        "Registration Failed. Please try again.";

      alert("❌ " + message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>⚖ AI Legal Document Analyzer</h1>

        <h2>Register</h2>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>
          Register
        </button>

        <p style={{ marginTop: "20px", color: "white" }}>
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color: "#00e5ff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
