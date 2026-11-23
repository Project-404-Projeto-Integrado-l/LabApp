"use client";

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

export type LabTheme = "light" | "dark";

interface ThemeContextType {
  theme: LabTheme;
  setTheme: (theme: LabTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = "labapp-theme";
const THEME_CHANGE_EVENT = "labapp-theme-change";

function applyThemeToDom(theme: LabTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  } else {
    root.removeAttribute("data-theme");
    root.classList.remove("dark");
  }
}

function getStoredTheme(): LabTheme {
  if (typeof window === "undefined") return "light";
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function subscribeTheme(callback: () => void) {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<LabTheme>(
    subscribeTheme,
    getStoredTheme,
    () => "light"
  );

  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: LabTheme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // ignore storage errors
    }
    applyThemeToDom(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
