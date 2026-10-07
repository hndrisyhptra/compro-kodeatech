"use client";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
const subscribe = (callback: () => void) => { window.addEventListener("kodea-theme", callback); return () => window.removeEventListener("kodea-theme", callback); };
export function ThemeToggle() { const theme = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme || "light", () => "light"); return <button className="icon-button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={() => { const next = theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = next; localStorage.setItem("kodea-theme", next); window.dispatchEvent(new Event("kodea-theme")); }}>{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</button>; }
