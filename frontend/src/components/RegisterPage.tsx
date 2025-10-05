"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function RegisterPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de registro
    console.log("Register form submitted");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative overflow-hidden"
    >
      {/* Botón de regreso */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 text-sm text-foreground/60 hover:text-foreground transition-all flex items-center gap-2"
      >
        <span className="text-primary">←</span> Back to Home
      </button>

      {/* Card principal */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card/70 backdrop-blur-2xl shadow-2xl text-left">
        {/* Ícono y encabezado */}
        <div className="flex flex-col items-center mb-6">
          <Rocket className="w-8 h-8 text-primary mb-3 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-wide">
            Join the Explorers
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Contribute your images to uncover the unknown
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Username</label>
            <Input
              type="text"
              placeholder="CosmicExplorer47"
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input
              type="email"
              placeholder="explorer@cosmos.space"
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Botón que usa colores globales */}
          <Button
            type="submit"
            className="mt-3 w-full bg-primary text-primary-foreground font-semibold rounded-lg py-2 hover:opacity-80 active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            <Rocket className="w-4 h-4 mr-2" /> Create Account
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By joining, you become part of humanity’s greatest space exploration community.
        </p>
      </div>
    </motion.section>
  );
}
