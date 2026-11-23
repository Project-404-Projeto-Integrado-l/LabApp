"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, Trophy } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121926]/70 backdrop-blur-xs animate-fade-in"
      data-sound="none"
    >
      <div
        className="bg-lab-surface border border-lab-border text-lab-text w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        {/* Top ambient glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-lab-primary/25 rounded-full blur-3xl pointer-events-none" />

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

          <div className="flex items-center gap-2 text-lab-amber-text">
            <Trophy className="w-5 h-5 fill-lab-amber" />
            <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase">
              Quiz Concluído
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-lab-text">
            Parabéns pelo Progresso!
          </h2>

          <p className="text-sm text-lab-muted max-w-sm leading-relaxed">
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6 relative z-10">
          {/* Acertos */}
          <div className="bg-lab-success-bg border border-lab-success-border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-lab-success-text">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Acertos</span>
            </div>
            <span className="text-2xl font-extrabold text-lab-success-text">
              {correctAnswers}
            </span>
            <span className="text-[11px] text-lab-muted">
              de {totalQuestions}
            </span>
          </div>

          {/* Erros */}
          <div className="bg-lab-error-bg border border-lab-error-border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-lab-error-text">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Erros</span>
            </div>
            <span className="text-2xl font-extrabold text-lab-error-text">
              {incorrectAnswers}
            </span>
            <span className="text-[11px] text-lab-muted">
              erros
            </span>
          </div>

          {/* XP Ganho */}
          <div className="bg-lab-amber-bg border border-lab-amber-border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-1.5 text-lab-amber-text">
              <span className="text-xs font-bold uppercase">XP Total</span>
            </div>
            <span className="text-2xl font-extrabold text-lab-amber-text">
              +{xpGained}
            </span>
            <span className="text-[11px] text-lab-muted">
              pontos
            </span>
          </div>
        </div>

        {/* Percentage bar */}
        <div className="flex flex-col gap-1.5 mb-6 relative z-10">
          <div className="flex items-center justify-between text-xs text-lab-muted">
            <span>Aproveitamento Geral</span>
            <span className="font-extrabold text-lab-text">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-lab-tint rounded-full overflow-hidden border border-lab-border">
            <div
              className="h-full bg-gradient-to-r from-lab-primary to-lab-secondary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full relative z-10">
          <button
            type="button"
            onClick={() => {
              playClick();
              playPopupClose();
              onBackToGames();
            }}
            className="w-full sm:flex-1 py-3.5 px-5 bg-lab-tint hover:bg-lab-border/70 text-lab-text border border-lab-border rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
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
            <span>Jogar Novamente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
