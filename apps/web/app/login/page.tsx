"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, sendPasswordReset, isAuthenticated, isLoading, error, clearError } = usePlatformStore();

  const [isRegister, setIsRegister] = React.useState(false);
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const [email, setEmail] = React.useState("admin@aroh.co");
  const [password, setPassword] = React.useState("admin");
  const [displayName, setDisplayName] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<"admin" | "operator" | "user">("admin");

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    clearError();
    setResetSent(false);
  }, [isRegister, isForgotPassword, clearError]);

  const handleProfileSelect = (role: "admin" | "operator" | "user") => {
    setSelectedRole(role);
    if (role === "admin") {
      setEmail("admin@aroh.co");
      setPassword("admin");
    } else if (role === "operator") {
      setEmail("operator@aroh.co");
      setPassword("operator");
    } else {
      setEmail("user@aroh.co");
      setPassword("user");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      if (isForgotPassword) {
        await sendPasswordReset(email);
        setResetSent(true);
      } else if (isRegister) {
        if (!password || !displayName) return;
        await register(email, displayName, password);
      } else {
        if (!password) return;
        await login(email, password);
      }
    } catch (err) {
      // Error handled by store state
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans bg-mesh-logo">
      {/* Radial Glow Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-cyan-500/20 p-8 rounded-3xl shadow-2xl relative z-10 border-logo-glow"
      >
        <div className="flex flex-col items-center mb-6">
          <img src="/aroh-logo.png" alt="AROH Logo" className="h-16 w-16 object-contain mb-3 rounded-2xl border border-cyan-500/30 shadow-xl shadow-cyan-500/10" />
          <span className="font-extrabold tracking-[0.3em] text-2xl text-gradient-logo">
            AROH
          </span>
        </div>

        {/* Profile Quick Selector Tabs (Integrated Admin, Operator, User profiles) */}
        {!isForgotPassword && !isRegister && (
          <div className="mb-6 bg-zinc-900/80 border border-white/10 p-1 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => handleProfileSelect("admin")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                selectedRole === "admin"
                  ? "bg-gradient-to-r from-cyan-500 to-amber-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Admin (∞ AROS)
            </button>
            <button
              type="button"
              onClick={() => handleProfileSelect("operator")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                selectedRole === "operator"
                  ? "bg-zinc-800 text-white border border-white/10"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Operator
            </button>
            <button
              type="button"
              onClick={() => handleProfileSelect("user")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                selectedRole === "user"
                  ? "bg-zinc-800 text-white border border-white/10"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              User
            </button>
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-center text-white mb-2">
          {isForgotPassword ? "Reset Password" : isRegister ? "Create Profile" : `Sign In as ${selectedRole.toUpperCase()}`}
        </h1>
        <p className="text-zinc-400 text-xs text-center mb-6">
          {isForgotPassword
            ? "Enter your email to receive a password reset link"
            : isRegister
            ? "Register to access the AROH unified platform"
            : "Enter your credentials to manage your AROH ecosystem services"}
        </p>

        <AnimatePresence mode="wait">
          {resetSent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs mb-6 text-center"
            >
              Password reset link sent! Check your inbox.
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs mb-6 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isRegister && !isForgotPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                key="name-field"
              >
                <label htmlFor="displayName" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Aroh Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-xs"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aroh.co"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-xs"
              required
            />
          </div>

          {!isForgotPassword && (
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-xs"
                required
              />
            </div>
          )}

          {!isRegister && !isForgotPassword && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-xs text-amber-400 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded px-1"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            className="w-full py-3 mt-4 text-center flex justify-center items-center font-bold text-xs focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : isForgotPassword ? (
              "Send Reset Link"
            ) : isRegister ? (
              "Sign Up Account"
            ) : (
              `Sign In as ${selectedRole.toUpperCase()}`
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {isForgotPassword ? (
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-xs text-amber-400 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1 w-full block"
            >
              Back to Sign In
            </button>
          ) : (
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1 w-full block"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Need a new account? Register Profile"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
