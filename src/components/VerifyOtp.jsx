import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // Reusing login styles

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("signup_email");
  const navigate = useNavigate();

  const submitOtp = async (e) => {
    e.preventDefault();
    setErr("");

    if (!otp) {
      setErr("Please enter the OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await post("/auth/verify-otp", { email, otp });
      
      // Success message
      alert("✅ Email verified successfully!");
      
      localStorage.removeItem("signup_email");
      navigate("/login");

    } catch (error) {
      setErr(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await post("/auth/resend-otp", { email });
      alert("📧 OTP has been resent to your email!");
      setErr("");
    } catch (err) {
      setErr("Failed to resend OTP. Please try again.");
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
            <h1>📧 Verify OTP</h1>
          </div>
          <div className="formbg-outer">
            <div className="formbg">
              <div className="formbg-inner padding-horizontal--48">
                <span className="padding-bottom--15">
                  We sent a verification code to<br />
                  <strong style={{ color: '#5469d4' }}>{email}</strong>
                </span>
                
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
                    ⚠️ {err}
                  </div>
                )}

                <form onSubmit={submitOtp}>
                  <div className="field padding-bottom--24">
                    <label htmlFor="otp">Enter OTP Code</label>
                    <input 
                      type="text" 
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                      pattern="[0-9]*"
                      required
                      style={{ 
                        textAlign: 'center', 
                        fontSize: '24px', 
                        letterSpacing: '8px',
                        fontWeight: 'bold'
                      }}
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    <input 
                      type="submit" 
                      value={loading ? "Verifying..." : "Verify OTP"}
                      disabled={loading}
                    />
                  </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#697386' }}>
                    Didn't receive the code?{' '}
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); resendOtp(); }}
                      style={{ 
                        color: '#5469d4', 
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      Resend OTP
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="footer-link padding-top--24">
              <span>
                <a href="/login">← Back to Login</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}