import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const email = localStorage.getItem("signup_email");
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  const submitOtp = async (e) => {
    e.preventDefault();
    setErr("");

    if (!otp) return setErr("Enter OTP");

    try {
      const res = await post("/auth/verify-otp", { email, otp });

      alert("Verified successfully!");

      localStorage.removeItem("signup_email");
      navigate("/login");

    } catch (error) {
      setErr(error.message);
    }
  };

  const resendOtp = async () => {
    try {
      await post("/auth/resend-otp", { email });
      alert("OTP resent");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Verify OTP</h2>
      <p>We sent an OTP to <b>{email}</b></p>

      {err && <div style={{ color: "red" }}>{err}</div>}

      <form onSubmit={submitOtp}>
        <input 
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <button type="submit">Verify</button>
      </form>

      <button onClick={resendOtp}>Resend OTP</button>
    </div>
  );
}
