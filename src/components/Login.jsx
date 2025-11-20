import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await post("/auth/login", { email, password });
      localStorage.setItem("token", res.token);
      navigate("/landing");
    } catch (error) {
      setErr(error.message || "Login failed. Please try again.");

      if (error.status === 403) {
        localStorage.setItem("signup_email", email);
        navigate("/verify-otp");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="box-root flex-flex flex-direction--column" style={{ minHeight: '100vh', flexGrow: 1 }}>
        <div className="loginbackground box-background--white padding-top--64">
          <div className="loginbackground-gridContainer">
            <div className="box-root flex-flex" style={{ gridArea: '4 / 2 / auto / 5' }}>
              <div className="box-root box-divider--light-all-2 animationLeftRight tans3s" style={{ flexGrow: 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ gridArea: '6 / start / auto / 2' }}>
              <div className="box-root box-background--blue animationLeftRight" style={{ flexGrow: 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ gridArea: '2 / start / auto / 2' }}>
              <div className="box-root box-background--blue animationRightLeft tans4s" style={{ flexGrow: 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ gridArea: '3 / start / auto / 3' }}>
              <div className="box-root box-background--blue animationRightLeft" style={{ flexGrow: 1, zIndex: 0 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ gridArea: '8 / 4 / auto / 6' }}>
              <div className="box-root box-background--gray100 animationLeftRight tans3s" style={{ flexGrow: 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ gridArea: '2 / 15 / auto / end' }}>
              <div className="box-root box-background--cyan200 animationRightLeft tans3s" style={{ flexGrow: 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ gridArea: '3 / 14 / auto / end' }}>
              <div className="box-root box-background--blue animationRightLeft" style={{ flexGrow: 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ gridArea: '4 / 17 / auto / 20' }}>
              <div className="box-root box-background--gray100 animationRightLeft tans4s" style={{ flexGrow: 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ gridArea: '5 / 14 / auto / 17' }}>
              <div className="box-root box-divider--light-all-2 animationRightLeft tans3s" style={{ flexGrow: 1 }}></div>
            </div>
          </div>
        </div>
        <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
          <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
            <h1>Welcome to breach Detector!</h1>
          </div>
          <div className="formbg-outer">
            <div className="formbg">
              <div className="formbg-inner padding-horizontal--48">
                <span className="padding-bottom--15">Log in to your account</span>
                
                {err && (
                  <div style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    color: '#dc2626', 
                    padding: '12px', 
                    borderRadius: '4px', 
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}>
                    {err}
                  </div>
                )}

                <form onSubmit={loginUser}>
                  <div className="field padding-bottom--24">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    <div className="grid--50-50">
                      <label htmlFor="password">Password</label>
                    </div>
                    <input 
                      type="password" 
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    <input 
                      type="submit" 
                      value={loading ? "Logging in..." : "Login"}
                      disabled={loading}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="footer-link padding-top--24">
              <span>Don't have an account? <a href="/signup">Sign up</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}