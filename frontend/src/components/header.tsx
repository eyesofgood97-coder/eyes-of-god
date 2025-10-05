"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LeLoLogo } from "./lelo-logo";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname(); // 👈 Saber en qué página estamos

  // 🌌 Detecta el fondo a aplicar según la ruta
  const getBackgroundClass = () => {
    switch (pathname) {
      case "/register":
        return "bg-gradient-to-b from-[#0b0e19] to-[#14284a]";
      case "/login":
        return "bg-gradient-to-b from-[#0b0e19] to-[#2d1b47]";
      default:
        return "bg-gradient-to-b from-[#0b0e19] to-[#141a2f]";
    }
  };

  // Manejo de scroll (para ocultar header)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Desplazamiento interno
  const scrollToSection = (id: string) => {
    if (!id) return;
    const element = document.querySelector(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  // 🚀 Navegación + cambio de fondo
  const handleNavigation = (label: string, id: string) => {
    if (id.startsWith("#")) {
      scrollToSection(id);
    } else {
      if (label === "Register") {
        router.push("/register");
        document.body.className = "transition-all duration-700 " + getBackgroundClass();
      }
      if (label === "Login") {
        router.push("/login");
        document.body.className = "transition-all duration-700 " + getBackgroundClass();
      }
      if (label === "Home") {
        router.push("/");
        document.body.className = "transition-all duration-700 " + getBackgroundClass();
      }
    }
  };

  const links = [
    { label: "Home", id: "#home" },
    { label: "Description", id: "#description" },
    { label: "Object", id: "#objectives" },
    { label: "Technology", id: "#technology" },
    { label: "Register", id: "register" },
    { label: "Login", id: "login" },
  ];

  return (
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div
        className={`flex items-center justify-center gap-6 px-6 py-3 rounded-2xl border transition-all duration-300
          ${
            isScrolled
              ? "bg-background/90 backdrop-blur-xl border-border/40 shadow-2xl"
              : "bg-background/95 backdrop-blur-lg border-border/30 shadow-lg"
          }`}
      >
        {/* Logo */}
        <div className="transform transition-transform duration-200 hover:scale-105 cursor-pointer" onClick={() => handleNavigation("Home", "home")}>
          <LeLoLogo />
        </div>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavigation(link.label, link.id)}
              className={`relative text-foreground/80 hover:text-foreground transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-foreground/5 transform hover:scale-110 hover:rotate-1 cursor-pointer
                ${pathname.includes(link.id) ? "text-primary font-semibold" : ""}`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-4"></span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
