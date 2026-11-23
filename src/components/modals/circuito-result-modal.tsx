"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Trophy, Star, Zap } from "lucide-react";
import { useSoundEffects } from "@/providers/sound-provider";

interface CircuitoResultModalProps {
  isOpen: boolean;
  circuitTitle: string;
  xpGained: number;
  totalSlots: number;
  hasNextCircuit: boolean;
  onNextCircuit: () => void;
  onRestart: () => void;
  onBackToGames: () => void;
}

export function CircuitoResultModal({
  isOpen,
  circuitTitle,
  xpGained,
  totalSlots,
  hasNextCircuit,
  onNextCircuit,
  onRestart,
  onBackToGames,
}: CircuitoResultModalProps) {
  const { playPopupOpen, playSuccess, playClick } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      playPopupOpen();
      const timer = setTimeout(() => {
        playSuccess();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, playPopupOpen, playSuccess]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121926]/70 backdrop-blur-xs animate-fade-in"
      data-sound="none"
    >
      <div
        className="bg-lab-surface border border-lab-border text-lab-text w-full max-w-[540px] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        {/* Glow ambient background effect */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-lab-secondary/25 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot & Header */}
        <div className="flex flex-col items-center text-center gap-3 relative z-10">
          <div className="relative w-28 h-36 sm:w-32 sm:h-40 flex items-center justify-center">
            <Image
              src="/characters/happy.svg"
              alt="Mascote Comemorando"
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-contain filter drop-shadow-lg"
              priority
            />
          </div>

          <div className="flex items-center gap-2 text-lab-success-text">
            <Zap className="w-5 h-5 fill-current" />
            <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase">
              Circuito Energizado com Sucesso!
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-lab-text">
            Montagem Perfeita!
          </h2>

          <p className="text-sm text-lab-muted max-w-md leading-relaxed">
            Todas as conexões e componentes do circuito <strong className="text-lab-text font-bold">&ldquo;{circuitTitle}&rdquo;</strong> foram alocados com exatidão lógica e elétrica.
          </p>

          {/* 3 Stars Animation */}
          <div className="flex items-center justify-center gap-3 my-2">
            {[1, 2, 3].map((star) => (
              <div
                key={star}
                className="w-10 h-10 rounded-full bg-lab-amber-bg border border-lab-amber-border flex items-center justify-center shadow-sm"
              >
                <Star className="w-6 h-6 text-lab-amber-text fill-lab-amber animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-5 relative z-10">
          <div className="bg-lab-success-bg border border-lab-success-border rounded-xl p-3.5 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-lab-success-text">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Slots Conectados</span>
            </div>
            <span className="text-2xl font-extrabold text-lab-success-text">
              {totalSlots} / {totalSlots}
            </span>
            <span className="text-[11px] text-lab-muted">100% dos componentes corretos</span>
          </div>

          <div className="bg-lab-amber-bg border border-lab-amber-border rounded-xl p-3.5 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-lab-amber-text">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Recompensa</span>
            </div>
            <span className="text-2xl font-extrabold text-lab-amber-text">
              +{xpGained} XP
            </span>
            <span className="text-[11px] text-lab-muted">Acumulado no Perfil</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative z-10">
          <button
            type="button"
            onClick={() => {
              playClick();
              onBackToGames();
            }}
            className="w-full sm:w-1/3 bg-lab-tint hover:bg-lab-border/70 text-lab-text border border-lab-border py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Catálogo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              onRestart();
            }}
            className="w-full sm:w-1/3 bg-lab-tint hover:bg-lab-border/70 text-lab-text border border-lab-border py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repetir</span>
          </button>

          {hasNextCircuit ? (
            <button
              type="button"
              onClick={() => {
                playClick();
                onNextCircuit();
              }}
              className="w-full sm:w-1/3 bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-98"
            >
              <span>Próximo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                playClick();
                onBackToGames();
              }}
              className="w-full sm:w-1/3 bg-lab-secondary hover:opacity-90 text-[#1E2B3C] dark:text-[#121926] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-98"
            >
              <span>Concluir</span>
              <Trophy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
