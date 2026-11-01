"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, Sparkles, RotateCcw, ArrowLeft, Trophy } from "lucide-react";
import { useSoundEffects } from "@/providers/sound-provider";

interface QuizResultModalProps {
  isOpen: boolean;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  xpGained: number;
  onRestart: () => void;
  onBackToGames: () => void;
}

export function QuizResultModal({
  isOpen,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  xpGained,
  onRestart,
  onBackToGames,
}: QuizResultModalProps) {
  const { playPopupOpen, playPopupClose, playSuccess, playClick } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      playPopupOpen();
      // Play celebratory sound if user passed or had good score
      if (correctAnswers > 0) {
        setTimeout(() => {
          playSuccess();
        }, 200);
      }
    }
  }, [isOpen, correctAnswers, playPopupOpen, playSuccess]);

  if (!isOpen) return null;

  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const getPerformanceMessage = () => {
    if (percentage === 100) return "Desempenho Perfeito! Você domina o assunto!";
    if (percentage >= 80) return "Excelente resultado! Você tem ótimo raciocínio!";
    if (percentage >= 60) return "Bom trabalho! Continue praticando para gabaritar.";
    return "Valeu a tentativa! Pratique mais um pouco e tente novamente.";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      data-sound="none"
    >
      <div
        className="bg-[#262626] border border-[#5e5e5e] text-white w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        {/* Top ambient glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#883cec]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot + Trophy Header */}
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

          <div className="flex items-center gap-2 text-amber-400">
            <Trophy className="w-5 h-5 fill-amber-400 stroke-amber-400" />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">
              Quiz Concluído
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Parabéns pelo Progresso!
          </h2>

          <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6 relative z-10">
          {/* Acertos */}
          <div className="bg-[#1f2d24] border border-emerald-600/40 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1 shadow-inner">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Acertos</span>
            </div>
            <span className="text-2xl font-black text-emerald-300">
              {correctAnswers}
            </span>
            <span className="text-[11px] text-emerald-400/80">
              de {totalQuestions}
            </span>
          </div>

          {/* Erros */}
          <div className="bg-[#2d1f22] border border-rose-600/40 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1 shadow-inner">
            <div className="flex items-center gap-1.5 text-rose-400">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Erros</span>
            </div>
            <span className="text-2xl font-black text-rose-300">
              {incorrectAnswers}
            </span>
            <span className="text-[11px] text-rose-400/80">
              erros
            </span>
          </div>

          {/* XP Ganho */}
          <div className="bg-[#2d2216] border border-amber-600/40 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1 shadow-inner">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              <span className="text-xs font-semibold uppercase">XP Total</span>
            </div>
            <span className="text-2xl font-black text-amber-300">
              +{xpGained}
            </span>
            <span className="text-[11px] text-amber-400/80">
              pontos
            </span>
          </div>
        </div>

        {/* Percentage bar */}
        <div className="flex flex-col gap-1.5 mb-6 relative z-10">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>Aproveitamento Geral</span>
            <span className="font-bold text-white">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#444444]">
            <div
              className="h-full bg-gradient-to-r from-[#883cec] to-emerald-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full relative z-10">
          {/* Voltar para Jogos */}
          <button
            type="button"
            onClick={() => {
              playClick();
              playPopupClose();
              onBackToGames();
            }}
            className="w-full sm:flex-1 py-3.5 px-5 bg-[#333333] hover:bg-[#3d3d3d] text-white border border-[#5e5e5e] rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            data-sound="none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Jogos</span>
          </button>

          {/* Concluir / Jogar Novamente */}
          <button
            type="button"
            onClick={() => {
              playClick();
              playPopupClose();
              onRestart();
            }}
            className="w-full sm:flex-1 py-3.5 px-5 bg-[#883cec] hover:bg-[#782bdc] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#883cec]/25 transition-all cursor-pointer active:scale-[0.99]"
            data-sound="none"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>
        </div>
      </div>
    </div>
  );
}

