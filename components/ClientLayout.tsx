"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Moon, Sun } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setTimeout(() => {
      setIsDarkMode(initialDark);
    }, 0);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (isAdmin) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        {/* Floating dark mode toggle for admin */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-highest transition-colors shadow-sm"
          title="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={18} className="text-on-surface" /> : <Moon size={18} className="text-on-surface" />}
        </button>
        {children}
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
