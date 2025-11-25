import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/globals.css";
import Landing from "./components/Landing";
import EmailChecker from "./components/EmailChecker";
import PasswordChecker from "./components/PasswordChecker";
import NotFound from "./components/NotFound";
import UrlChecker from "./components/UrlChecker";
import IpScanner from "./components/IpScanner";
import OwaspScanner from "./components/OwaspScanner";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Footer from "./components/Footer";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import ErrorBoundary from "./components/ErrorBoundary";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: "opacity, transform" }}
      className="flex flex-col min-h-screen"
    >
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </motion.div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><PageWrapper><Landing /></PageWrapper></ProtectedRoute>} />
            <Route path="/email-check" element={<ProtectedRoute><PageWrapper><EmailChecker /></PageWrapper></ProtectedRoute>} />
            <Route path="/password-check" element={<ProtectedRoute><PageWrapper><PasswordChecker /></PageWrapper></ProtectedRoute>} />
            <Route path="/url-check" element={<ProtectedRoute><PageWrapper><UrlChecker /></PageWrapper></ProtectedRoute>} />
            <Route path="/ip-scan" element={<ProtectedRoute><PageWrapper><IpScanner /></PageWrapper></ProtectedRoute>} />
            <Route path="/owasp-scan" element={<ProtectedRoute><PageWrapper><OwaspScanner /></PageWrapper></ProtectedRoute>} />

            <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ErrorBoundary>
  );
}
