import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password || !confirm)
      return setErr("All fields are required");

    if (password !== confirm)
      return setErr("Passwords do not match");

    try {
      await post("/auth/signup", { email, password, confirmPassword: confirm });
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      if (error.status === 409) {
        return setErr("Account already exists. Please log in.");
      }
      setErr(error.message || "Signup failed");
    }
  };

  return (
    <div className="login-root">
      <div className="formbg">
        <h2>Create Account</h2>

        {err && <p className="error-message">{err}</p>}

        <form onSubmit={handleSignup}>
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
            placeholder="min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <br />

          <input type="submit" value="Sign up" />
        </form>

        <div className="footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
