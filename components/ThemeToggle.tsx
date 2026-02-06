"use client";

import { useEffect, useRef } from "react";
import { Sun } from "lucide-react";

export default function ThemeToggle() {
  const iconRef = useRef<HTMLDivElement>(null);

  // Apply saved theme on first load
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "light") {
      document.documentElement.classList.add("light");
      iconRef.current?.classList.add("rotate-180");
    }
  }, []);

  const toggleTheme = () => {
    const isLight = document.documentElement.classList.toggle("light");

    localStorage.setItem("theme", isLight ? "light" : "dark");

    iconRef.current?.classList.toggle("rotate-180");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-md border border-border bg-secondary hover:bg-muted transition-all duration-300"
    >
      <div
        ref={iconRef}
        className="transition-transform duration-500 ease-in-out"
      >
        <Sun className="h-5 w-5 text-primary" />
      </div>
    </button>
  );
}