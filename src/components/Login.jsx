import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password)
      return setErr("Email and password are required");

    try {
      await post("/auth/login", { email, password });
      navigate("/landing");
    } catch (error) {
      setErr(error.message || "Login failed");
    }
  };

  return (
    <div className="login-root">
      <div className="formbg">
        <h2>Log In</h2>

        {err && <p className="error-message">{err}</p>}

        <form onSubmit={loginUser}>
          <label>Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          <input type="submit" value="Login" />
        </form>

        <div className="footer-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
