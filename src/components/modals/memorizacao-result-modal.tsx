"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, RotateCcw, ArrowLeft, Trophy, Layers } from "lucide-react";
import { useSoundEffects } from "@/providers/sound-provider";

interface MemorizacaoResultModalProps {
  isOpen: boolean;
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  gameMode: "ludico" | "avancado";
  onRestart: () => void;
  onBackToGames: () => void;
}

export function MemorizacaoResultModal({
  isOpen,
  totalCards,
  correctAnswers,
  gameMode,
  onRestart,
  onBackToGames,
}: MemorizacaoResultModalProps) {
  const { playPopupOpen, playPopupClose, playSuccess, playClick } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      playPopupOpen();
      setTimeout(() => {
        playSuccess();
      }, 200);
    }
  }, [isOpen, playPopupOpen, playSuccess]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      data-sound="none"
    >
      <div
        className="bg-[#262626] border border-[#5e5e5e] text-white w-full max-w-[500px] rounded-2xl overflow-hidden flex flex-col p-6 sm:p-8 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative w-28 h-36 sm:w-32 sm:h-40 flex items-center justify-center">
            <Image
              src="/characters/happy.svg"
              alt="Mascote Comemorando"
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-contain filter drop-shadow-md"
              priority
            />
          </div>

          <div className="flex items-center gap-2 text-[#883cec]">
            <Trophy className="w-5 h-5 text-[#883cec]" />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">
              Memorização Concluída
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Excelente Prática!
          </h2>

          <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
            Você revisou todos os componentes deste módulo e reforçou o reconhecimento visual de hardware.
          </p>
        </div>

        
        <div className="grid grid-cols-3 gap-3 my-6">
          
          <div className="bg-[#1f1f1f] border border-[#444444] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Cards</span>
            </div>
            <span className="text-2xl font-black text-white">
              {totalCards}
            </span>
            <span className="text-[11px] text-gray-400">
              revisados
            </span>
          </div>

          
          <div className="bg-[#1f2d24] border border-emerald-600/40 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Acertos</span>
            </div>
            <span className="text-2xl font-black text-emerald-300">
              {correctAnswers}
            </span>
            <span className="text-[11px] text-emerald-400/80">
              de {totalCards}
            </span>
          </div>

          
          <div className="bg-[#241d2f] border border-[#883cec]/40 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <span className="text-xs font-semibold text-[#883cec] uppercase">
              Modo
            </span>
            <span className="text-base font-bold text-white capitalize mt-1">
              {gameMode === "ludico" ? "Lúdico" : "Avançado"}
            </span>
            <span className="text-[11px] text-gray-400">
              {gameMode === "ludico" ? "com opções" : "digitação"}
            </span>
          </div>
        </div>

        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          
          <button
            type="button"
            onClick={() => {
              playClick();
              playPopupClose();
              onBackToGames();
            }}
            className="w-full sm:flex-1 py-3.5 px-5 bg-[#333333] hover:bg-[#3d3d3d] text-white border border-[#5e5e5e] rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]"
            data-sound="none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Jogos</span>
          </button>

          
          <button
            type="button"
            onClick={() => {
              playClick();
              playPopupClose();
              onRestart();
            }}
            className="w-full sm:flex-1 py-3.5 px-5 bg-[#883cec] hover:bg-[#782bdc] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]"
            data-sound="none"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Praticar Novamente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
