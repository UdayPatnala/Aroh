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
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans bg-mesh-gold">
      {/* Radial Glow Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05),transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-amber-500/20 p-8 rounded-3xl shadow-2xl relative z-10 border-gold-glow"
      >
        <div className="flex flex-col items-center mb-6">
          <img src="/aroh-logo.png" alt="AROH Logo" className="h-16 w-16 object-contain mb-3 rounded-2xl border border-amber-500/30 shadow-xl shadow-amber-500/10" />
          <span className="font-extrabold tracking-[0.3em] text-2xl text-gradient-gold">
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
                  ? "bg-amber-500 text-zinc-950 shadow-md"
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
                  ? "bg-amber-500 text-zinc-950 shadow-md"
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
                  ? "bg-amber-500 text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              User
            </button>
          </div>
        )}

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight">
            {isForgotPassword
              ? "Reset Workspace Password"
              : isRegister
              ? "Register Ecosystem Identity"
              : `Sign In as ${selectedRole.toUpperCase()}`}
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            {isForgotPassword
              ? "Enter your email address to receive password recovery instructions."
              : isRegister
              ? "Create a new unified profile under the AROH Platform."
              : "Enter your workspace credentials to access services."}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        {resetSent ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs text-center space-y-4">
            <p>Password recovery email sent to <strong>{email}</strong>.</p>
            <Button
              variant="secondary"
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-xs"
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="authDisplayName" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Display Name
                </label>
                <input
                  id="authDisplayName"
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-xs"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="authEmail" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Workspace Email
              </label>
              <input
                id="authEmail"
                type="email"
                placeholder="name@aroh.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-xs"
                required
              />
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="authPassword" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Password
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="authPassword"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-xs"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 font-bold text-xs mt-2"
            >
              {isLoading
                ? "Authenticating..."
                : isForgotPassword
                ? "Send Reset Link"
                : isRegister
                ? "Create Account"
                : `Sign In to ${selectedRole.toUpperCase()} Account`}
            </Button>
          </form>
        )}

        <div className="mt-6 border-t border-white/5 pt-4 text-center">
          {!isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {isRegister
                ? "Already have an account? Sign in"
                : "Don't have an account? Register identity"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
