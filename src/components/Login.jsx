import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./global.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await post("/auth/login", { email, password });
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (error) {
      setErr(error.message);

      if (error.status === 403) {
        localStorage.setItem("signup_email", email);
        navigate("/verify-otp");
      }
    }
  };

  return (
    <div className="login-root">
      <div className="formbg">
        <form onSubmit={loginUser}>
          <h2>Login</h2>

          {err && <p style={{ color: "red" }}>{err}</p>}

          <label>Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" value="Login" />
        </form>

        <div className="footer-link padding-top--24">
          <span>No account? <a href="/signup">Sign Up</a></span>
        </div>
      </div>
    </div>
  );
}
