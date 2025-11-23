import React, { useState, useEffect, useRef } from "react";
import { post } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LoginNew.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canvasRef = useRef(null);

  const loginUser = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password)
      return setErr(t('auth.error.required'));

    try {
      await post("/auth/login", { email, password });
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } catch (error) {
      setErr(error.message || t('auth.error.loginFailed'));
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Particle Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;

    // Configuration
    const particleCount = 70;
    const connectionDistance = 140;
    const moveSpeed = 0.25;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * moveSpeed;
        this.vy = (Math.random() - 0.5) * moveSpeed;
        this.size = Math.random() * 2 + 1;
        // Randomly assign Blue or Purple/Pink to match theme
        this.color = Math.random() > 0.5 ? '74, 163, 255' : '192, 132, 252';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(${this.color}, 0.6)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Connection lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = 1 - (dist / connectionDistance);
            // Gradient line between particles
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            gradient.addColorStop(0, `rgba(${particles[i].color}, ${opacity * 0.15})`);
            gradient.addColorStop(1, `rgba(${particles[j].color}, ${opacity * 0.15})`);

            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial setup
    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="login-page-wrapper">
      {/* Background Animation */}
      <canvas id="network-canvas" ref={canvasRef}></canvas>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md p-6">

        <div className="glass-panel rounded-2xl p-8 w-full relative overflow-hidden">
          {/* Scanline effect overlay */}
          <div className="scan-overlay"></div>

          {/* Header / Logo */}
          <div className="flex flex-col items-center mb-10 relative z-20">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <img src="/aegis_logo.png" alt="Aegis Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Aegis</h1>
            <p className="text-indigo-200 text-sm mt-2">{t('auth.subtitle')}</p>
          </div>

          {/* Error Message */}
          {err && (
            <div className="relative z-20 mb-6 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
              {err}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={loginUser} className="space-y-6 relative z-20">

            {/* Email Input */}
            <div className="input-group">
              <input
                type="email"
                id="email"
                className="input-field w-full px-4 py-3.5 rounded-lg outline-none text-sm"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email" className="input-label">
                <i className="fas fa-envelope mr-2"></i>{t('auth.emailLabel')}
              </label>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="input-field w-full px-4 py-3.5 rounded-lg outline-none text-sm"
                placeholder=" "
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password" className="input-label">
                <i className="fas fa-lock mr-2"></i>{t('auth.passwordLabel')}
              </label>
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-purple-400 transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} id="eye-icon"></i>
              </button>
            </div>

            {/* Options */}
            <div className="flex justify-between items-center text-xs text-indigo-300">
              <label className="flex items-center cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="mr-2 custom-checkbox accent-purple-600 rounded bg-gray-800 border-gray-700" />
                {t('auth.rememberDevice')}
              </label>
              <a href="#" className="hover:text-purple-400 transition-colors font-medium">{t('auth.forgotPassword')}</a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-btn w-full text-white font-bold py-3.5 rounded-lg text-sm tracking-wider uppercase shadow-lg">
              {t('auth.loginButton')}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center relative z-20">
            <p className="text-indigo-300 text-xs">
              {t('auth.noAccount')}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300 ml-1 font-semibold transition-colors">
                {t('auth.signupLink')}
              </Link>
            </p>
          </div>

          {/* Decorative decorative elements matching the screenshot icons (Gold/Green/Blue) */}
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-600 blur-[70px] opacity-20 rounded-full"></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-purple-600 blur-[70px] opacity-20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
