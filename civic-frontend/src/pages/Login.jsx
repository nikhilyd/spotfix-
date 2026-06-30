/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { Link, useNavigate } from "react-router-dom";
// ----------------------
// Schema & Types
// ----------------------
const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ----------------------
// Small UI helpers
// ----------------------
const Field = ({ label, icon: Icon, children, error }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      )}
      {children}
    </div>
    {error && (
      <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);


export default function Login() {
  const {user, setUser} = useContext(UserContext);
  const navigate  =useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setDone(false);
    setError("");
    await new Promise((res) => setTimeout(res, 1200));
    const apiUrl = `${import.meta.env.VITE_API_URL}/user/login`;
    console.log("Requesting URL:", apiUrl);
    try {
      const response = await axios.post(apiUrl, data, {
        withCredentials:true
      })
      if(response.data.success) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        setUser(response.data.user);
        setDone(true);
        console.log("ok")
        navigate("/");
      
      }
    } catch (error) {
      console.error("Login failed:", error);
      console.error("Error config:", error.config);
      console.error("Error response:", error.response);
      console.error("Error request:", error.request);
      setError(error.response?.data?.error || error.message || "Login failed. Please try again.");
      return;
      
    }
    reset({ email: data.email, password: "" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ y: [0, 12, 0], x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        <motion.div
          className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
          animate={{ y: [0, -10, 0], x: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
      </motion.div>

      <div className="relative w-full max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr] items-start">
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-500 grid place-items-center text-white shadow-lg shadow-cyan-500/20">
                  <LogIn className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                    Welcome back
                  </h1>
                  <p className="text-sm text-slate-300">
                    Sign in to continue to your civic dashboard.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <Field label="Email" icon={Mail} error={errors?.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    className="w-full pl-10 pr-3 h-12 rounded-3xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </Field>

                <Field label="Password" icon={Lock} error={errors?.password?.message}>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 h-12 rounded-3xl border border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="••••••••"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full h-12 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </motion.button>

                {done && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-emerald-500/10 border border-emerald-400/20 px-4 py-3 text-sm text-emerald-200"
                  >
                    <span className="font-medium">Success!</span> You are now logged in.
                  </motion.div>
                )}

                <div className="flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:justify-between">
                  <a href="/officerlogin" className="underline underline-offset-4 hover:text-white">
                    sign via officer
                  </a>
                  <Link to="/register" className="underline underline-offset-4 hover:text-white">
                    Create account
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.18)] backdrop-blur-3xl"
          >
            <div className="text-sm uppercase tracking-[0.24em] text-cyan-300 mb-4">
              Demo Credentials
            </div>
            <div className="space-y-4 text-sm text-slate-200">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-slate-400">email</div>
                <div className="mt-2 font-semibold">nikhil123@gmail.com</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-slate-400">password</div>
                <div className="mt-2 font-semibold">Nikhil@123</div>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              This is a prototype — use the credentials above to test functionality.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

