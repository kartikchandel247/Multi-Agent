"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Bot,
  Building2,
  KeyRound,
  Radio,
  Info,
  ChevronDown,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MeshGradient } from "@/components/ui/MeshGradient";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "signin" | "signup";
type AccountType = "customer" | "organization";

export function AuthPage() {
  const { login, signup, ssoLogin, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");

  // Account Type: Customer vs Organization
  const [accountType, setAccountType] = useState<AccountType>("customer");
  const [organizationName, setOrganizationName] = useState("");

  // SSO Mode
  const [isSsoActive, setIsSsoActive] = useState(false);
  const [ssoDomain, setSsoDomain] = useState("");

  // Standard Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // Handle Standard Login / Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSsoActive) {
      if (!ssoDomain.trim()) {
        setError("Please enter your company domain or email.");
        return;
      }
      const res = await ssoLogin(ssoDomain);
      if (!res.success && res.error) {
        setError(res.error);
      }
      return;
    }

    if (mode === "signin") {
      if (!email.trim()) {
        setError("Please enter your email.");
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        return;
      }
      const res = await login(
        email,
        password,
        accountType,
        accountType === "organization" ? organizationName : "Personal"
      );
      if (!res.success && res.error) {
        setError(res.error);
      }
    } else {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!email.trim()) {
        setError("Please enter your email.");
        return;
      }
      if (password.length > 0 && password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
      }
      if (accountType === "organization" && !organizationName.trim()) {
        setError("Please enter your organization name.");
        return;
      }
      const res = await signup(
        name,
        email,
        password,
        accountType,
        accountType === "organization" ? organizationName : "Personal"
      );
      if (!res.success && res.error) {
        setError(res.error);
      }
    }
  };

  // Password strength helper
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: "", color: "" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9!@#$%^&*]/.test(password)) score += 1;

    if (score <= 1) return { score: 25, text: "Weak", color: "bg-amber-400" };
    if (score === 2) return { score: 50, text: "Medium", color: "bg-blue-500" };
    if (score === 3) return { score: 75, text: "Good", color: "bg-indigo-500" };
    return { score: 100, text: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-800 selection:bg-blue-500/20 selection:text-blue-700">
      {/* Animated Subtle Mesh Gradient Background */}
      <MeshGradient />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Simple & Welcoming Overview */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col justify-center space-y-6 lg:pr-4"
        >
          {/* Logo */}
          <div>
            <Logo className="scale-105 origin-left" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 border border-blue-400/25 backdrop-blur-md">
              <Radio className="w-2.5 h-2.5 text-blue-500 animate-pulse" />
              <span>Worldwide Travel Agent Ready</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              AI Travel & Booking{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-lg">
              Book hotels, buses, trains, and flights in any city, district, or tehsil.
              Your country, region, and currency are automatically detected.
            </p>
          </div>

          {/* AI Assistants Showcase with Very Simple Vocabulary */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/40 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Agent Nova</p>
                <p className="text-[11px] text-slate-500">Booking Assistant</p>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Agent Atlas</p>
                <p className="text-[11px] text-slate-500">Calendar Manager</p>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Agent Vera</p>
                <p className="text-[11px] text-slate-500">Safety & Rules</p>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Agent Nexus</p>
                <p className="text-[11px] text-slate-500">Reports & Insights</p>
              </div>
            </div>
          </div>

          {/* Simple Trust Badges */}
          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Instant Confirmation</span>
            <span className="text-slate-300">•</span>
            <span>No Double Bookings</span>
            <span className="text-slate-300">•</span>
            <span>Safe & Encrypted</span>
          </div>
        </motion.div>

        {/* Right Column: Clean Modern Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 w-full"
        >
          <div className="relative rounded-3xl bg-white/60 backdrop-blur-3xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(31,38,135,0.12),0_0_0_1px_rgba(255,255,255,0.95)_inset] p-6 sm:p-8 overflow-hidden">
            {/* Top specular reflection line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

            {/* Mode Switcher Tabs (Sign In vs Create Account) */}
            {!isSsoActive && (
              <div className="relative flex items-center bg-white/45 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className={`relative flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer text-center ${
                    mode === "signin"
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className={`relative flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer text-center ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200/70 text-rose-600 text-xs font-semibold flex items-start gap-2"
                >
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Reset Alert */}
            <AnimatePresence>
              {forgotPasswordNotice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-2xl bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <span>A password reset link has been sent to your email.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SSO Mode Screen */}
            {isSsoActive ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSsoActive(false);
                      setError(null);
                    }}
                    className="p-1.5 rounded-xl hover:bg-white/60 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Sign in with SSO</h2>
                    <p className="text-xs text-slate-500">Single Sign-On for your company account</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Company Domain or Email
                    </label>
                    <div className="relative flex items-center">
                      <Building2 className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={ssoDomain}
                        onChange={(e) => setSsoDomain(e.target.value)}
                        placeholder="company.com or name@company.com"
                        className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/85 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:bg-white/90 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)_inset]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Enter your company domain to authenticate with your organization.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_32px_-5px_rgba(79,70,229,0.55)] transition-all duration-300 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Continue with SSO</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSsoActive(false);
                      setError(null);
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    Back to regular login
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Form (Sign In & Create Account) */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Sign Up only) */}
                <AnimatePresence>
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5"
                    >
                      <label className="block text-xs font-semibold text-slate-600">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/85 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:bg-white/90 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)_inset]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Account Type Selection (Customer vs Organization) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">
                    Account Type
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as AccountType)}
                      className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/85 px-4 py-2.5 text-sm font-medium text-slate-900 transition-all duration-200 focus:outline-none focus:bg-white/90 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)_inset] cursor-pointer appearance-none"
                    >
                      <option value="customer">I am a Customer (Personal Account)</option>
                      <option value="organization">I represent a Company / Organization</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Custom Organization Input (Only appears if user represents an organization) */}
                <AnimatePresence>
                  {accountType === "organization" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5"
                    >
                      <label className="block text-xs font-semibold text-slate-600">
                        Organization Name
                      </label>
                      <div className="relative flex items-center">
                        <Building2 className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="e.g. Acme Studio or Tech Corp"
                          className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/85 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:bg-white/90 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)_inset]"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Type your company or business name.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/85 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:bg-white/90 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)_inset]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-600">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setForgotPasswordNotice(true)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/85 pl-10 pr-11 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:bg-white/90 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)_inset]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator (Sign Up) */}
                  {mode === "signup" && password && (
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Password strength</span>
                        <span className="font-bold text-slate-700">{strength.text}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-white/80 bg-white/50 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>

                {/* Primary Action Button */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4),0_0_0_1px_rgba(255,255,255,0.3)_inset] hover:shadow-[0_15px_32px_-5px_rgba(79,70,229,0.55)] hover:brightness-105 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:pointer-events-none mt-2"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {/* SSO Single Sign-On Button & Guest Access */}
                <div className="pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSsoActive(true);
                      setError(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/80 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-indigo-500" />
                    <span>Sign in with SSO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => login("guest.traveler@auraai.global")}
                    className="w-full text-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-1 cursor-pointer"
                  >
                    Continue as Guest Traveler ➔
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Note */}
            <p className="mt-5 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe & 256-bit encrypted</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
