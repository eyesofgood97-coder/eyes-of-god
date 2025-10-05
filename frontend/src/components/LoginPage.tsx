"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LogIn, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

export function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string | null)?.trim() ?? "";
    const password = (formData.get("password") as string | null)?.trim() ?? "";

    // Validaciones básicas
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Simulación de autenticación (reemplazar por llamada real)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // simulación: 80% success
      if (Math.random() > 0.2) {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    }, 1200);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative overflow-hidden"
    >
      {/* Fondo animado */}
      <div className="absolute inset-0 -z-10 animate-background-gradient bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.08),transparent_70%)]" />

      {/* Botón volver */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 text-sm text-foreground/60 hover:text-foreground transition-all flex items-center gap-2"
      >
        <span className="text-primary">←</span> Back to Home
      </button>

      {/* Panel principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl border border-border bg-card/70 backdrop-blur-2xl shadow-2xl text-left"
      >
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="w-8 h-8 text-primary mb-3 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-wide">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Sign in to your account and explore the cosmos
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {/* Email */}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="you@cosmos.space"
              required
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Password</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-all"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Errores */}
          {error && (
            <p className="text-destructive-foreground text-sm text-center" role="alert">
              {error}
            </p>
          )}

          {/* Botón principal */}
          <Button
            type="submit"
            disabled={loading}
            className={`mt-3 w-full bg-primary text-primary-foreground font-semibold rounded-lg py-2 transition-all duration-200 shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-80 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </>
            )}
          </Button>
        </form>

        {/* Enlace a registro */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Don’t have an account?{" "}
          <span onClick={() => router.push("/register")} className="underline hover:text-primary cursor-pointer">
            Register
          </span>
        </p>
      </motion.div>
    </motion.section>
  );
}
