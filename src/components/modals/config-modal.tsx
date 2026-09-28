"use client";

import { useEffect } from "react";
import { Music, Settings, Volume2, X } from "lucide-react";
import { useSoundEffects } from "@/providers/sound-provider";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
      data-sound="none"
    >
      <div 
        className="bg-[#262626] border border-[#5e5e5e] text-white w-full max-w-[501px] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#5e5e5e]">
          <div className="flex items-center gap-3">
            <Settings className="w-7 h-7 text-[#883cec]" />
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Configurações
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fechar configurações"
            data-sound="none"
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            {/* Section Header */}
            <div className="flex flex-col gap-2 border-b border-[#5e5e5e] pb-3">
              <h3 className="text-lg font-bold text-white">
                Áudio e Mídia
              </h3>
            </div>

            {/* Setting Item 1: Efeitos Sonoros */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <Volume2 className="w-6 h-6 text-[#883cec]" />
                <div className="flex flex-col">
                  <span className="text-base font-medium text-white">
                    Efeitos Sonoros
                  </span>
                  <span className="text-xs text-gray-400">
                    Sons ao interagir com o app
                  </span>
                </div>
              </div>

              {/* Custom Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={soundEffectsEnabled}
                onClick={handleToggleSoundEffects}
                data-sound="none"
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  soundEffectsEnabled ? "bg-[#883cec]" : "bg-[#444444]"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform top-0.5 relative ${
                    soundEffectsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Setting Item 2: Música de Fundo */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <Music className="w-6 h-6 text-[#883cec]" />
                <div className="flex flex-col">
                  <span className="text-base font-medium text-white">
                    Música de Fundo
                  </span>
                  <span className="text-xs text-gray-400">
                    Trilha sonora do LabiNEC
                  </span>
                </div>
              </div>

              {/* Custom Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={backgroundMusicEnabled}
                onClick={handleToggleBackgroundMusic}
                data-sound="none"
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  backgroundMusicEnabled ? "bg-[#883cec]" : "bg-[#444444]"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform top-0.5 relative ${
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
            className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3.5 rounded-lg text-base transition-colors cursor-pointer mt-2"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
