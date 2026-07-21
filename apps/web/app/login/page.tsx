"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePlatformStore } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion } from "framer-motion";

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
      // Handled by store
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans bg-mesh-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-black/5 p-8 rounded-3xl shadow-xl relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <span className="font-extrabold tracking-[0.3em] text-2xl text-slate-900">
            AROH
          </span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isForgotPassword
              ? "Reset Workspace Password"
              : isRegister
              ? "Register Ecosystem Identity"
              : "Sign In to Account"}
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-normal">
            {isForgotPassword
              ? "Enter your email address to receive password recovery instructions."
              : isRegister
              ? "Create a new unified profile under the AROH Platform."
              : "Enter your workspace credentials to access services."}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        {resetSent ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-xs text-center space-y-4">
            <p>Password recovery email sent to <strong>{email}</strong>.</p>
            <Button
              variant="secondary"
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-xs bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200"
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="authDisplayName" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Display Name
                </label>
                <input
                  id="authDisplayName"
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-xs"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="authEmail" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Workspace Email
              </label>
              <input
                id="authEmail"
                type="email"
                placeholder="name@aroh.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-xs"
                required
              />
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="authPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] text-sky-600 hover:underline cursor-pointer font-semibold"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-xs"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 font-bold text-xs mt-2 bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10"
            >
              {isLoading
                ? "Authenticating..."
                : isForgotPassword
                ? "Send Reset Link"
                : isRegister
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>
        )}

        <div className="mt-6 border-t border-black/5 pt-4 text-center">
          {!isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
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
