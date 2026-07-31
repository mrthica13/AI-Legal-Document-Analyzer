import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email: email,
          password: password,
        }
      );

      // Save JWT Token
      localStorage.setItem(
        "token",
        response.data.access_token
      );

      alert("✅ Login Successful");

      // Go to Dashboard
      navigate("/dashboard");

    } catch (error) {
  console.log("Full Error:", error);

  if (error.response) {
    console.log("Response:", error.response.data);

    alert(JSON.stringify(error.response.data, null, 2));
  } else {
    alert(error.message);
  }

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("❌ Server Error");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>⚖ AI Legal Document Analyzer</h1>

        <h2>Login</h2>

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

        <button onClick={handleLogin}>
          Login
        </button>
        <p style={{ marginTop: "20px", color: "white" }}>
         Don't have an account?{" "}
         <Link
          to="/register"
         style={{
          color: "#00e5ff",
          textDecoration: "none",
          fontWeight: "bold",
         }}
         >
          Register
         </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;