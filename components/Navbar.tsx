"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bitcoin,
  Home,
  Wallet,
  ArrowLeftRight,
  Box,
  Activity,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Address", path: "/address", icon: Wallet },
  { label: "Transaction", path: "/tx", icon: ArrowLeftRight },
  { label: "Blocks", path: "/blocks", icon: Box },
  { label: "Mempool", path: "/mempool", icon: Activity },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Bitcoin className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Bit<span className="text-primary">Scope</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}