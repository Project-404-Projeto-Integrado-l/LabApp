"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeHelp, Crown, Home as HomeIcon, Menu, Settings, X, Dices, Cpu, Sun, Moon } from "lucide-react";
import { RankingModal } from "@/components/modals/ranking-modal";
import { ConfigModal } from "@/components/modals/config-modal";
import { LabAppLogo } from "@/components/brand/labapp-logo";
import { useTheme } from "@/providers/theme-provider";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const isHome = pathname === "/";
  const isAjuda = pathname === "/ajuda";
  const isJogos = pathname.startsWith("/jogos");

  return (
    <header className="relative z-20 w-full border-b border-lab-border bg-lab-surface transition-colors">
      <div className="max-w-[1216px] w-full mx-auto px-6 lg:px-0 h-24 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0" aria-label="LabApp — Página inicial">
          <LabAppLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={`flex items-center gap-2 py-2 text-base transition-colors ${
              isHome
                ? "border-b-2 border-lab-primary-strong text-lab-primary-strong font-bold"
                : "text-lab-muted hover:text-lab-text font-semibold"
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span>Início</span>
          </Link>
          <Link
            href="/jogos"
            className={`flex items-center gap-2 py-2 text-base transition-colors ${
              isJogos
                ? "border-b-2 border-lab-primary-strong text-lab-primary-strong font-bold"
                : "text-lab-muted hover:text-lab-text font-semibold"
            }`}
          >
            <Dices className="w-5 h-5" />
            <span>Jogos</span>
          </Link>
          <button
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-2 py-2 text-lab-muted hover:text-lab-text text-base font-semibold transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </button>
          <button
            onClick={() => setIsRankingOpen(true)}
            className="flex items-center gap-2 py-2 text-lab-muted hover:text-lab-text text-base font-semibold transition-colors cursor-pointer"
          >
            <Crown className="w-5 h-5" />
            <span>Ranking</span>
          </button>
          <Link
            href="/ajuda"
            className={`flex items-center gap-2 py-2 text-base transition-colors ${
              isAjuda
                ? "border-b-2 border-lab-primary-strong text-lab-primary-strong font-bold"
                : "text-lab-muted hover:text-lab-text font-semibold"
            }`}
          >
            <BadgeHelp className="w-5 h-5" />
            <span>Ajuda</span>
          </Link>
          <Link
            href="/admin/circuitos"
            className={`flex items-center gap-1.5 py-2 text-base transition-colors ${
              pathname === "/admin/circuitos"
                ? "border-b-2 border-lab-lavender text-lab-lavender-text font-bold"
                : "text-lab-muted hover:text-lab-text font-semibold"
            }`}
          >
            <Cpu className="w-5 h-5 text-lab-lavender-text" />
            <span>Circuitos</span>
          </Link>
          <Link
            href="/admin/quiz"
            className={`flex items-center gap-1.5 py-2 text-base transition-colors ${
              pathname === "/admin/quiz"
                ? "border-b-2 border-lab-lavender text-lab-lavender-text font-bold"
                : "text-lab-muted hover:text-lab-text font-semibold"
            }`}
          >
            <Settings className="w-5 h-5 text-lab-lavender-text" />
            <span>Quiz</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            title={theme === "dark" ? "Mudar para Light Mode" : "Mudar para Dark Mode"}
            className="ml-1 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lab-tint hover:bg-lab-border/60 border border-lab-border text-lab-text text-sm font-bold transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-lab-amber" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-lab-primary-strong" />
                <span>Dark</span>
              </>
            )}
          </button>
        </nav>

        {/* Tablet & Mobile Actions */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            className="p-2.5 text-lab-text rounded-xl bg-lab-tint border border-lab-border hover:bg-lab-border/60 transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-lab-amber" />
            ) : (
              <Moon className="w-5 h-5 text-lab-primary-strong" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Alternar menu"
            className="p-2 text-lab-text focus:outline-none cursor-pointer rounded-xl bg-lab-tint border border-lab-border"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Tablet and Mobile */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-lab-surface border-b border-lab-border px-6 py-4 shadow-xl z-30 flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-colors ${
              isHome
                ? "bg-lab-tint border-l-4 border-lab-primary-strong text-lab-primary-strong font-bold"
                : "text-lab-text hover:bg-lab-tint font-semibold"
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span>Início</span>
          </Link>

          <Link
            href="/jogos"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-colors ${
              isJogos
                ? "bg-lab-tint border-l-4 border-lab-primary-strong text-lab-primary-strong font-bold"
                : "text-lab-text hover:bg-lab-tint font-semibold"
            }`}
          >
            <Dices className="w-6 h-6" />
            <span>Jogos</span>
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsConfigOpen(true);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-lab-text text-base font-semibold transition-colors hover:bg-lab-tint cursor-pointer text-left w-full"
          >
            <Settings className="w-6 h-6" />
            <span>Configurações</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsRankingOpen(true);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-lab-text text-base font-semibold transition-colors hover:bg-lab-tint cursor-pointer text-left w-full"
          >
            <Crown className="w-6 h-6" />
            <span>Ranking</span>
          </button>

          <Link
            href="/ajuda"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-colors ${
              isAjuda
                ? "bg-lab-tint border-l-4 border-lab-primary-strong text-lab-primary-strong font-bold"
                : "text-lab-text hover:bg-lab-tint font-semibold"
            }`}
          >
            <BadgeHelp className="w-6 h-6" />
            <span>Ajuda / Como Jogar</span>
          </Link>

          <Link
            href="/admin/circuitos"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-colors ${
              pathname === "/admin/circuitos"
                ? "bg-lab-lavender-bg border-l-4 border-lab-lavender text-lab-lavender-text font-bold"
                : "text-lab-text hover:bg-lab-tint font-semibold"
            }`}
          >
            <Cpu className="w-6 h-6 text-lab-lavender-text" />
            <span>Gerenciar Circuitos</span>
          </Link>

          <Link
            href="/admin/quiz"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-colors ${
              pathname === "/admin/quiz"
                ? "bg-lab-lavender-bg border-l-4 border-lab-lavender text-lab-lavender-text font-bold"
                : "text-lab-text hover:bg-lab-tint font-semibold"
            }`}
          >
            <Settings className="w-6 h-6 text-lab-lavender-text" />
            <span>Gerenciar Quiz</span>
          </Link>
        </div>
      )}

      {/* Popups / Modals */}
      <RankingModal isOpen={isRankingOpen} onClose={() => setIsRankingOpen(false)} />
      <ConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </header>
  );
}
