import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // <-- create this file for your template CSS

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password || !confirm)
      return setErr("All fields are required");

    if (password !== confirm)
      return setErr("Passwords do not match");

    try {
      setLoading(true);
      const res = await post("/auth/signup", {
        email,
        password,
        confirmPassword: confirm,
      });

      // Save email for OTP screen
      localStorage.setItem("signup_email", res.email || email);

      navigate("/verify-otp");
    } catch (error) {
      if (error.status === 409 && error.data?.shouldLogin) {
        if (window.confirm("Account exists. Go to login?")) {
          navigate("/login");
        }
        return;
      }

      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="box-root flex-flex flex-direction--column" style={{ minHeight: "100vh", flexGrow: 1 }}>
        
        {/* Background Area */}
        <div className="loginbackground box-background--white padding-top--64">
          <div className="loginbackground-gridContainer">
            {/* Background design (same as your template) */}
          </div>
        </div>

        {/* Content */}
        <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
          
          <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
            <h1>Sign Up</h1>
          </div>

          <div className="formbg-outer">
            <div className="formbg">
              <div className="formbg-inner padding-horizontal--48">

                <span className="padding-bottom--15">Create your account</span>

                {err && <div style={{ color: "red", marginBottom: "10px" }}>{err}</div>}

                <form onSubmit={handleSignup}>

                  <div className="field padding-bottom--24">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="field padding-bottom--24">
                    <label>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="field padding-bottom--24">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>

                  <div className="field padding-bottom--24">
                    <input type="submit" value={loading ? "Sending OTP..." : "Create Account"} />
                  </div>

                </form>

              </div>
            </div>

            <div className="footer-link padding-top--24">
              <span>Already have an account? <a href="/login">Sign In</a></span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
