"use client";
 
import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore, isMockEnv } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion, AnimatePresence } from "framer-motion";
 
export default function LoginPage() {
  const router = useRouter();
  const { login, register, sendPasswordReset, isAuthenticated, isLoading, error, clearError } = usePlatformStore();
 
  const [isRegister, setIsRegister] = React.useState(false);
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
 
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);
 
  React.useEffect(() => {
    clearError();
    setResetSent(false);
  }, [isRegister, isForgotPassword, clearError]);
 
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
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />
 
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <img src="/aroh-logo.png" alt="AROH Logo" className="h-12 w-12 object-contain mb-3 rounded-lg border border-white/10 shadow-lg" />
          <img src="/aroh-text.png" alt="AROH Wordmark" className="h-5 object-contain" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent mb-2">
          {isForgotPassword ? "Reset Password" : isRegister ? "Create Account" : "Access Ecosystem"}
        </h1>
        <p className="text-zinc-400 text-sm text-center mb-8">
          {isForgotPassword
            ? "Enter your email to receive a password reset link"
            : isRegister
            ? "Register to access the AROH unified platform"
            : "Enter your credentials to manage your AROH services"}
        </p>
 
        <AnimatePresence mode="wait">
          {resetSent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm mb-6 text-center"
            >
              Password reset link sent! Check your inbox.
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
 
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="popLayout">
            {isRegister && !isForgotPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                key="name-field"
              >
                <label htmlFor="displayName" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Aroh Developer"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
 
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@aroh.co"
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
              required
            />
          </div>
 
          {!isForgotPassword && (
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                required
              />
            </div>
          )}
 
          {!isRegister && !isForgotPassword && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-xs text-amber-500 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded px-1"
              >
                Forgot Password?
              </button>
            </div>
          )}
 
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 text-center flex justify-center items-center focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isForgotPassword ? (
              "Send Reset Link"
            ) : isRegister ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
 
        <div className="mt-8 text-center space-y-3">
          {isForgotPassword ? (
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-xs text-amber-500 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1 w-full block"
            >
              Back to Sign In
            </button>
          ) : (
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-amber-500 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1 w-full block"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Register"}
            </button>
          )}
        </div>
 
        {/* Demo credentials hint */}
        {isMockEnv && !isRegister && !isForgotPassword && (
          <div className="mt-6 p-4 rounded-lg bg-white/2 border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-300 block mb-1">Demo Accounts:</span>
            <div className="flex justify-between">
              <span>Admin: <strong className="text-zinc-300">admin@aroh.co</strong></span>
              <span>Pass: <strong className="text-zinc-300">admin</strong></span>
            </div>
            <div className="flex justify-between">
              <span>Operator: <strong className="text-zinc-300">operator@aroh.co</strong></span>
              <span>Pass: <strong className="text-zinc-300">operator</strong></span>
            </div>
            <div className="flex justify-between">
              <span>User: <strong className="text-zinc-300">user@aroh.co</strong></span>
              <span>Pass: <strong className="text-zinc-300">user</strong></span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
