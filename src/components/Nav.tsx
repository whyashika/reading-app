import { motion } from "framer-motion";
import { CircleHelp, Layers3, Map as MapIcon, Menu, Moon, Route as RouteIcon, Stamp, Sun } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { openIntro } from "../lib/onboarding";
import { BottomSheet } from "./BottomSheet";
import { APP_NAME } from "../config";
import { useTheme } from "../lib/hooks";

function Logo() {
  // Same mark as the app icon (public/icons/icon.svg): a bookmark ribbon with a dot, forming an "i".
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" aria-hidden>
      <rect width="100" height="100" rx="22" fill="#16130F" stroke="rgb(var(--rule))" strokeWidth="2" />
      <path d="M39 35.5 H61 V83.5 L50 74 L39 83.5 Z" fill="#EDE6DA" />
      <circle cx="50" cy="22.5" r="6.5" fill="#F08C64" />
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
  { to: "/passport", label: "Passport", icon: Stamp },
  { to: "/map", label: "Map", icon: MapIcon },
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
        <button
          onClick={openIntro}
          className="ml-auto flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted transition hover:bg-ink/5 hover:text-ink"
        >
          <CircleHelp size={18} /> How it works
        </button>
        <ThemeToggle />
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
        <MoreButton />
        <ThemeTab />
      </div>
    </nav>
  );
}

/** Dark/light switch kept right on the phone tab bar, as Yashika asked. */
function ThemeTab() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="relative flex flex-1 flex-col items-center justify-center gap-0.5"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.span key={dark ? "sun" : "moon"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="relative mt-1 text-muted">
        {dark ? <Sun size={22} /> : <Moon size={22} />}
      </motion.span>
      <span className="relative text-[0.7rem] font-semibold text-muted">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

/** Phone tab bar's fourth slot: the quieter extras live here instead of on every screen. */
function MoreButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const row = "flex min-h-14 w-full items-center gap-4 rounded-2xl px-3 text-left font-sans text-[1.02rem] font-semibold transition hover:bg-ink/5";
  return (
    <>
      <button onClick={() => setOpen(true)} className="relative flex flex-1 flex-col items-center justify-center gap-0.5" aria-haspopup="dialog">
        <Menu size={22} className="relative mt-1 text-muted" />
        <span className="relative text-[0.7rem] font-semibold text-muted">More</span>
      </button>
      <BottomSheet open={open} onClose={() => setOpen(false)} label="More">
        <div className="pb-2 pt-6">
          <button
            className={row}
            onClick={() => {
              setOpen(false);
              openIntro();
            }}
          >
            <CircleHelp size={22} className="text-muted" /> How {APP_NAME} works
          </button>
          <button
            className={row}
            onClick={() => {
              setOpen(false);
              navigate("/route");
            }}
          >
            <RouteIcon size={22} className="text-muted" /> Plan a reading route
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
