import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Landing from "./components/Landing";
import EmailChecker from "./components/EmailChecker";
import PasswordChecker from "./components/PasswordChecker";
import NotFound from "./components/NotFound";
import UrlChecker from "./components/UrlChecker";
import Signup from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import VerifyOtp from "./components/VerifyOtp.jsx";

function LoginWrapper() {
  const navigate = useNavigate();
  return <Login onVerified={() => navigate("/landing")} />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Default route -> go to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<PageWrapper><LoginWrapper /></PageWrapper>} />

        {/* Main Landing Page */}
        <Route path="/landing" element={<PageWrapper><Landing /></PageWrapper>} />

        {/* Tools */}
        <Route path="/email" element={<PageWrapper><EmailChecker /></PageWrapper>} />
        <Route path="/password" element={<PageWrapper><PasswordChecker /></PageWrapper>} />
        <Route path="/check-url" element={<PageWrapper><UrlChecker /></PageWrapper>} />

        {/* 404 */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />


      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
