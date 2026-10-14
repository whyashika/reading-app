import { motion } from "framer-motion";
import { Layers3, Map as MapIcon, Moon, Stamp, Sun } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { APP_NAME } from "../config";
import { useTheme } from "../lib/hooks";

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
      <path d="M3 18 H10 L16 8 H23" fill="none" stroke="rgb(var(--s-philosophy))" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 8 H8 L13 13 L18 18 H23" fill="none" stroke="rgb(var(--s-finance))" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="13" cy="13" r="4.2" fill="rgb(var(--card))" stroke="rgb(var(--ink))" strokeWidth="2" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className={`grid h-11 w-11 place-items-center rounded-full text-muted transition hover:bg-ink/5 hover:text-ink ${className}`}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.span key={dark ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.span>
    </button>
  );
}

const TABS = [
  { to: "/", label: "Feed", icon: Layers3 },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/passport", label: "Passport", icon: Stamp },
];

function isActive(to: string, pathname: string) {
  return to === "/" ? pathname === "/" || pathname.startsWith("/piece") : pathname.startsWith(to);
}

export function TopNav() {
  const { pathname } = useLocation();
  return (
    <header className="fixed inset-x-0 top-0 z-40 hidden h-[var(--topnav-h)] border-b border-rule/70 bg-paper/85 backdrop-blur-md md:block">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-8 px-6">
        <NavLink to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-xl font-semibold tracking-tight">{APP_NAME}</span>
        </NavLink>
        <nav className="flex gap-1" aria-label="Main">
          {TABS.map(({ to, label, icon: Icon }) => {
            const active = isActive(to, pathname);
            return (
              <NavLink
                key={to}
                to={to}
                className={`relative flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span layoutId="topnav-pill" className="absolute inset-0 rounded-full bg-ink/[0.07]" transition={{ type: "spring", damping: 30, stiffness: 400 }} />
                )}
                <Icon size={18} className="relative" />
                <span className="relative">{label}</span>
              </NavLink>
            );
          })}
        </nav>
        <ThemeToggle className="ml-auto" />
      </div>
    </header>
  );
}

export function TabBar() {
  const { pathname } = useLocation();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule/70 bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Main"
    >
      <div className="flex h-[var(--tabbar-h)] items-stretch">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = isActive(to, pathname);
          return (
            <NavLink key={to} to={to} className="relative flex flex-1 flex-col items-center justify-center gap-0.5">
              {active && (
                <motion.span layoutId="tab-pill" className="absolute top-1.5 h-8 w-16 rounded-full bg-ink/[0.08]" transition={{ type: "spring", damping: 30, stiffness: 400 }} />
              )}
              <Icon size={22} className={`relative mt-1 ${active ? "text-ink" : "text-muted"}`} />
              <span className={`relative text-[0.7rem] font-semibold ${active ? "text-ink" : "text-muted"}`}>{label}</span>
            </NavLink>
          );
        })}
        <div className="flex flex-1 items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
