"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeHelp, Crown, Home as HomeIcon, Menu, Settings, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isHome = pathname === "/";
  const isAjuda = pathname === "/ajuda";
  const isConfig = pathname === "/configuracoes";
  const isRanking = pathname === "/ranking";

  return (
    <header className="relative z-20 w-full border-b border-[#5a5a5a] bg-[#212121]">
      <div className="max-w-[1216px] w-full mx-auto px-6 lg:px-0 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-12 h-10 relative flex items-center justify-center">
            <svg viewBox="0 0 71 62" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M35.5 0C15.8954 0 0 13.8792 0 31C0 48.1208 15.8954 62 35.5 62C55.1046 62 71 48.1208 71 31C71 13.8792 55.1046 0 35.5 0ZM35.5 48C24.4543 48 15.5 39.0457 15.5 28C15.5 16.9543 24.4543 8 35.5 8C46.5457 8 55.5 16.9543 55.5 28C55.5 39.0457 46.5457 48 35.5 48Z" fill="#883CEC" />
              <circle cx="35.5" cy="31" r="14" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="text-3xl tracking-tight text-white">
            <strong className="font-bold italic">Lab</strong>
            <span className="font-light italic">App</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className={`flex items-center gap-2 py-2 text-[#f6f6f9] text-lg font-normal transition-opacity ${
              isHome
                ? "border-b-2 border-[#883cec] font-semibold"
                : "opacity-85 hover:opacity-100"
            }`}
          >
            <HomeIcon className="w-6 h-6 text-white" />
            <span>Início</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-2 py-2 text-[#f6f6f9] text-lg font-normal transition-opacity ${
              isConfig
                ? "border-b-2 border-[#883cec] font-semibold"
                : "opacity-85 hover:opacity-100"
            }`}
          >
            <Settings className="w-6 h-6 text-white" />
            <span>Configurações</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-2 py-2 text-[#f6f6f9] text-lg font-normal transition-opacity ${
              isRanking
                ? "border-b-2 border-[#883cec] font-semibold"
                : "opacity-85 hover:opacity-100"
            }`}
          >
            <Crown className="w-6 h-6 text-white" />
            <span>Ranking</span>
          </Link>
          <Link
            href="/ajuda"
            className={`flex items-center gap-2 py-2 text-[#f6f6f9] text-lg font-normal transition-opacity ${
              isAjuda
                ? "border-b-2 border-[#883cec] font-semibold"
                : "opacity-85 hover:opacity-100"
            }`}
          >
            <BadgeHelp className="w-6 h-6 text-white" />
            <span>Ajuda / Como Jogar</span>
          </Link>
          <Link
            href="/admin/quiz"
            className={`flex items-center gap-2 py-2 text-[#f6f6f9] text-lg font-normal transition-opacity ${
              pathname === "/admin/quiz"
                ? "border-b-2 border-[#883cec] font-semibold"
                : "opacity-85 hover:opacity-100"
            }`}
          >
            <Settings className="w-6 h-6 text-[#883cec]" />
            <span>Gerenciar Quiz</span>
          </Link>
        </nav>

        {/* Tablet & Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Alternar menu"
          className="lg:hidden p-2 text-white hover:text-gray-300 focus:outline-none cursor-pointer rounded-lg bg-[#262626] border border-[#5e5e5e]"
        >
          {isOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
        </button>
      </div>

      {/* Dropdown Menu for Tablet and Mobile */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#262626] border-b border-[#5e5e5e] px-6 py-4 shadow-xl z-30 flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-[#f6f6f9] text-base font-normal transition-colors ${
              isHome
                ? "bg-[#883cec]/20 border-l-4 border-[#883cec] font-semibold"
                : "hover:bg-[#333333]"
            }`}
          >
            <HomeIcon className="w-6 h-6 text-white" />
            <span>Início</span>
          </Link>

          <Link
            href="#"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-[#f6f6f9] text-base font-normal transition-colors ${
              isConfig
                ? "bg-[#883cec]/20 border-l-4 border-[#883cec] font-semibold"
                : "hover:bg-[#333333]"
            }`}
          >
            <Settings className="w-6 h-6 text-white" />
            <span>Configurações</span>
          </Link>

          <Link
            href="#"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-[#f6f6f9] text-base font-normal transition-colors ${
              isRanking
                ? "bg-[#883cec]/20 border-l-4 border-[#883cec] font-semibold"
                : "hover:bg-[#333333]"
            }`}
          >
            <Crown className="w-6 h-6 text-white" />
            <span>Ranking</span>
          </Link>

          <Link
            href="/ajuda"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-[#f6f6f9] text-base font-normal transition-colors ${
              isAjuda
                ? "bg-[#883cec]/20 border-l-4 border-[#883cec] font-semibold"
                : "hover:bg-[#333333]"
            }`}
          >
            <BadgeHelp className="w-6 h-6 text-white" />
            <span>Ajuda / Como Jogar</span>
          </Link>

          <Link
            href="/admin/quiz"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-[#f6f6f9] text-base font-normal transition-colors ${
              pathname === "/admin/quiz"
                ? "bg-[#883cec]/20 border-l-4 border-[#883cec] font-semibold"
                : "hover:bg-[#333333]"
            }`}
          >
            <Settings className="w-6 h-6 text-[#883cec]" />
            <span>Gerenciar Quiz</span>
          </Link>
        </div>
      )}
    </header>
  );
}
