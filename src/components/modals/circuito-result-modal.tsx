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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      data-sound="none"
    >
      <div
        className="bg-[#262626] border border-[#5e5e5e] text-white w-full max-w-[540px] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        {/* Glow ambient background effect */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

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

          <div className="flex items-center gap-2 text-emerald-400">
            <Zap className="w-5 h-5 fill-emerald-400" />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">
              Circuito Energizado com Sucesso!
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Montagem Perfeita!
          </h2>

          <p className="text-sm text-gray-300 max-w-md leading-relaxed">
            Todas as conexões e componentes do circuito <strong className="text-white font-semibold">&ldquo;{circuitTitle}&rdquo;</strong> foram alocados com exatidão lógica e elétrica.
          </p>

          {/* 3 Stars Animation */}
          <div className="flex items-center justify-center gap-3 my-2">
            {[1, 2, 3].map((star) => (
              <div
                key={star}
                className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shadow-lg"
              >
                <Star className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-5 relative z-10">
          <div className="bg-[#1f2d24] border border-emerald-600/40 rounded-xl p-3.5 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Slots Conectados</span>
            </div>
            <span className="text-2xl font-black text-emerald-300">
              {totalSlots} / {totalSlots}
            </span>
            <span className="text-[11px] text-gray-300">100% dos componentes corretos</span>
          </div>

          <div className="bg-[#241e30] border border-[#883cec]/50 rounded-xl p-3.5 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-purple-400">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold uppercase">Recompensa</span>
            </div>
            <span className="text-2xl font-black text-purple-300">
              +{xpGained} XP
            </span>
            <span className="text-[11px] text-gray-300">Acumulado no Perfil</span>
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
            className="w-full sm:w-1/3 bg-[#383838] hover:bg-[#454545] text-gray-200 border border-[#5e5e5e] py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
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
            className="w-full sm:w-1/3 bg-[#383838] hover:bg-[#454545] text-gray-200 border border-[#5e5e5e] py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
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
              className="w-full sm:w-1/3 bg-[#883cec] hover:bg-[#782bdc] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#883cec]/25 cursor-pointer active:scale-98"
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
              className="w-full sm:w-1/3 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 cursor-pointer active:scale-98"
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

