import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/auth.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password || !confirm)
      return setErr(t('auth.error.allRequired'));

    if (password !== confirm)
      return setErr(t('auth.error.passwordMismatch'));

    try {
      await post("/auth/signup", { email, password, confirmPassword: confirm });
      alert(t('auth.success.created'));
      navigate("/login");
    } catch (error) {
      if (error.status === 409) {
        return setErr(t('auth.error.exists'));
      }
      setErr(error.message || t('auth.error.signupFailed'));
    }
  };

  return (
    <div className="login-root">
      <div className="formbg">
        <h2>{t('auth.signupTitle')}</h2>

        {err && <p className="error-message">{err}</p>}

        <form onSubmit={handleSignup}>
          <label>{t('auth.emailLabel')}</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <label>{t('auth.passwordLabel')}</label>
          <input
            type="password"
            placeholder="min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          <label>{t('auth.confirmPasswordLabel')}</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <br />

          <input type="submit" value={t('auth.signupButton')} />
        </form>

        <div className="footer-link">
          {t('auth.hasAccount')} <Link to="/login">{t('auth.loginLink')}</Link>
        </div>
      </div>
    </div>
  );
}
