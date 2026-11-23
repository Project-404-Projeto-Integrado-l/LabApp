"use client";

import { useEffect } from "react";
import { Moon, Music, Settings, Sun, Volume2, X } from "lucide-react";
import { useSoundEffects } from "@/providers/sound-provider";
import { useTheme } from "@/providers/theme-provider";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const { theme, toggleTheme } = useTheme();
  const {
    soundEffectsEnabled,
    backgroundMusicEnabled,
    setSoundEffectsEnabled,
    setBackgroundMusicEnabled,
    playPopupOpen,
    playPopupClose,
    playToggle,
  } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      playPopupOpen();
    }
  }, [isOpen, playPopupOpen]);

  const handleClose = () => {
    playPopupClose();
    onClose();
  };

  const handleToggleSoundEffects = () => {
    const nextState = !soundEffectsEnabled;
    setSoundEffectsEnabled(nextState);
    playToggle(nextState);
  };

  const handleToggleBackgroundMusic = () => {
    const nextState = !backgroundMusicEnabled;
    setBackgroundMusicEnabled(nextState);
    playToggle(nextState);
  };

  const handleToggleTheme = () => {
    const nextDark = theme !== "dark";
    toggleTheme();
    playToggle(nextDark);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121926]/70 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
      data-sound="none"
    >
      <div
        className="bg-lab-surface border border-lab-border text-lab-text w-full max-w-[501px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-lab-border">
          <div className="flex items-center gap-3">
            <Settings className="w-7 h-7 text-lab-primary-strong" />
            <h2 className="text-2xl font-bold tracking-tight text-lab-text">
              Configurações
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fechar configurações"
            data-sound="none"
            className="p-1.5 text-lab-muted hover:text-lab-text rounded-xl hover:bg-lab-tint transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 flex flex-col gap-6">
          {/* Appearance Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 border-b border-lab-border pb-3">
              <h3 className="text-lg font-bold text-lab-text">
                Aparência
              </h3>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-4">
                {theme === "dark" ? (
                  <Moon className="w-6 h-6 text-lab-primary-strong" />
                ) : (
                  <Sun className="w-6 h-6 text-lab-primary-strong" />
                )}
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-lab-text">
                    Modo Escuro (Dark Mode)
                  </span>
                  <span className="text-xs text-lab-muted">
                    {theme === "dark" ? "Tema Midnight Lab ativado" : "Tema Cloud White ativado"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={theme === "dark"}
                onClick={handleToggleTheme}
                data-sound="none"
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  theme === "dark" ? "bg-lab-primary" : "bg-lab-border"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform top-0 relative ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Section Header */}
            <div className="flex flex-col gap-2 border-b border-lab-border pb-3">
              <h3 className="text-lg font-bold text-lab-text">
                Áudio e Mídia
              </h3>
            </div>

            {/* Setting Item 1: Efeitos Sonoros */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-4">
                <Volume2 className="w-6 h-6 text-lab-primary-strong" />
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-lab-text">
                    Efeitos Sonoros
                  </span>
                  <span className="text-xs text-lab-muted">
                    Sons ao interagir com o app
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={soundEffectsEnabled}
                onClick={handleToggleSoundEffects}
                data-sound="none"
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  soundEffectsEnabled ? "bg-lab-primary-strong dark:bg-lab-primary" : "bg-lab-border"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform top-0 relative ${
                    soundEffectsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Setting Item 2: Música de Fundo */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-4">
                <Music className="w-6 h-6 text-lab-primary-strong" />
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-lab-text">
                    Música de Fundo
                  </span>
                  <span className="text-xs text-lab-muted">
                    Trilha sonora do LabiNEC
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={backgroundMusicEnabled}
                onClick={handleToggleBackgroundMusic}
                data-sound="none"
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  backgroundMusicEnabled ? "bg-lab-primary-strong dark:bg-lab-primary" : "bg-lab-border"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform top-0 relative ${
                    backgroundMusicEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            data-sound="none"
            className="w-full bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] font-bold py-3.5 rounded-xl text-base transition-colors cursor-pointer mt-2"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
