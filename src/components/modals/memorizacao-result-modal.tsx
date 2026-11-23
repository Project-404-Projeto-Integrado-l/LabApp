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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121926]/70 backdrop-blur-xs animate-fade-in"
      data-sound="none"
    >
      <div
        className="bg-lab-surface border border-lab-border text-lab-text w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 relative animate-scale-in"
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

          <div className="flex items-center gap-2 text-lab-primary-strong">
            <Trophy className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase">
              Memorização Concluída
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-lab-text">
            Excelente Prática!
          </h2>

          <p className="text-sm text-lab-muted max-w-sm leading-relaxed">
            Você revisou todos os componentes deste módulo e reforçou o reconhecimento visual de hardware.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="bg-lab-tint border border-lab-border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-lab-muted">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Cards</span>
            </div>
            <span className="text-2xl font-extrabold text-lab-text">
              {totalCards}
            </span>
            <span className="text-[11px] text-lab-muted">
              revisados
            </span>
          </div>

          <div className="bg-lab-success-bg border border-lab-success-border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-lab-success-text">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Acertos</span>
            </div>
            <span className="text-2xl font-extrabold text-lab-success-text">
              {correctAnswers}
            </span>
            <span className="text-[11px] text-lab-muted">
              de {totalCards}
            </span>
          </div>

          <div className="bg-lab-lavender-bg border border-lab-lavender-border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <span className="text-xs font-bold text-lab-lavender-text uppercase">
              Modo
            </span>
            <span className="text-base font-extrabold text-lab-text capitalize mt-1">
              {gameMode === "ludico" ? "Lúdico" : "Avançado"}
            </span>
            <span className="text-[11px] text-lab-muted">
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
            className="w-full sm:flex-1 py-3.5 px-5 bg-lab-tint hover:bg-lab-border/70 text-lab-text border border-lab-border rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]"
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
            className="w-full sm:flex-1 py-3.5 px-5 bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]"
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
