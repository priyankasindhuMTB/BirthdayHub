"use client";

import { useState } from "react";
import {
  FaBirthdayCake,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaTwitter,
  FaArrowRight,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden lg:flex flex-col justify-between p-12" style={{ background: "var(--bh-ink)", color: "#ece8e0" }}>
        <div className="flex items-center gap-3">
          <div className="bh-brand-mark"><FaBirthdayCake /></div>
          <strong className="tracking-wide">BirthdayHub</strong>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--bh-gold)" }}>Private calendar studio</p>
          <h1 className="text-5xl font-semibold leading-tight mt-3">Remember people, not just dates.</h1>
          <p className="mt-4 max-w-md text-sm" style={{ color: "#9aa3b2" }}>
            A quiet workspace for birthdays, reminders, and the people who matter.
          </p>
        </div>
        <p className="text-xs" style={{ color: "#6d7584" }}>Never miss a birthday wish.</p>
      </section>

      <section className="grid place-items-center p-6" style={{ background: "var(--bh-bg)" }}>
        <div className="w-full max-w-md bh-card p-7 relative overflow-hidden">
          <div className="h-1 absolute top-0 left-0 right-0" style={{ background: "linear-gradient(90deg, var(--bh-accent), var(--bh-gold))" }} />
          <div className="flex flex-col items-center mb-6">
            <div className="bh-brand-mark mb-3"><FaBirthdayCake /></div>
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-sm mt-1" style={{ color: "var(--bh-muted)" }}>Never miss a birthday wish</p>
          </div>

          {error && (
            <div className="bh-error mb-4">
              <FaTimes className="w-3 h-3" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-xs font-semibold">
              <span className="flex items-center gap-1.5 mb-1.5" style={{ color: "var(--bh-muted)" }}>
                <FaEnvelope className="w-3 h-3" style={{ color: "var(--bh-accent)" }} /> Email Address
              </span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bh-input" />
            </label>
            <label className="block text-xs font-semibold">
              <span className="flex items-center gap-1.5 mb-1.5" style={{ color: "var(--bh-muted)" }}>
                <FaLock className="w-3 h-3" style={{ color: "var(--bh-accent)" }} /> Password
              </span>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className="bh-input pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--bh-muted)" }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <div className="flex justify-end">
              <button type="button" className="text-xs font-medium" style={{ color: "var(--bh-accent)" }}>Forgot password?</button>
            </div>
            <button type="submit" disabled={loading} className="bh-btn w-full">
              {loading ? <><FaSpinner className="animate-spin" /> Signing in...</> : <>Sign In <FaArrowRight /></>}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: "var(--bh-line)" }} /></div>
            <div className="relative flex justify-center"><span className="px-3 text-[10px] font-medium" style={{ background: "var(--bh-surface)", color: "var(--bh-muted)" }}>or continue with</span></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" className="bh-icon-btn w-full"><FaGoogle className="text-red-500" /></button>
            <button type="button" className="bh-icon-btn w-full"><FaGithub /></button>
            <button type="button" className="bh-icon-btn w-full"><FaTwitter className="text-sky-500" /></button>
          </div>
          <p className="text-center text-sm mt-5" style={{ color: "var(--bh-muted)" }}>
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-semibold" style={{ color: "var(--bh-accent)" }}>Create one free</a>
          </p>
        </div>
      </section>
    </main>
  );
}
