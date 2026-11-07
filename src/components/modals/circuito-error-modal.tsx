"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { AlertCircle, RotateCcw, Lightbulb, XCircle, ArrowRight } from "lucide-react";
import { useSoundEffects } from "@/providers/sound-provider";
import { AVAILABLE_COMPONENTS } from "@/lib/circuitos-data";

export interface SlotValidationError {
  slotName: string;
  expectedComponentId: string;
  actualComponentId: string | null;
  slotDescription: string;
}

interface CircuitoErrorModalProps {
  isOpen: boolean;
  errors: SlotValidationError[];
  pedagogicalTips: string[];
  onRetry: () => void;
  onClose: () => void;
}

export function CircuitoErrorModal({
  isOpen,
  errors,
  pedagogicalTips,
  onRetry,
  onClose,
}: CircuitoErrorModalProps) {
  const { playPopupOpen, playError, playClick } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      playPopupOpen();
      const timer = setTimeout(() => {
        playError();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, playPopupOpen, playError]);

  if (!isOpen) return null;

  const getComponentName = (id: string | null) => {
    if (!id) return "Vazio (não preenchido)";
    const comp = AVAILABLE_COMPONENTS.find((c) => c.id === id);
    return comp ? comp.name : id;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      data-sound="none"
    >
      <div
        className="bg-[#262626] border border-rose-500/40 text-white w-full max-w-[580px] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        {/* Ambient top red glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot + Title */}
        <div className="flex flex-col items-center text-center gap-3 relative z-10">
          <div className="relative w-28 h-36 sm:w-32 sm:h-40 flex items-center justify-center">
            <Image
              src="/characters/nervous.svg"
              alt="Mascote Pensativo"
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-contain filter drop-shadow-lg"
              priority
            />
          </div>

          <div className="flex items-center gap-2 text-rose-400">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">
              Circuito com Falha de Conexão
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ops! Quase lá...
          </h2>

          <p className="text-sm text-gray-300 max-w-md leading-relaxed">
            Alguns componentes não foram colocados na posição correta ou estão em falta. Veja os detalhes abaixo para corrigir sua montagem:
          </p>
        </div>

        {/* Error Breakdown List */}
        <div className="my-5 flex flex-col gap-3 relative z-10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Pontos a Corrigir ({errors.length})</span>
          </h3>

          <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {errors.map((err, idx) => (
              <div
                key={idx}
                className="bg-[#2e2023] border border-rose-500/30 rounded-xl p-3 flex flex-col gap-1 text-xs sm:text-sm"
              >
                <div className="flex items-center justify-between text-rose-300 font-semibold">
                  <span>{err.slotName}</span>
                </div>
                <div className="text-gray-300 text-xs">
                  Esperava: <strong className="text-emerald-300 font-medium">{getComponentName(err.expectedComponentId)}</strong>
                  {err.actualComponentId ? (
                    <span>
                      {" "}• Alocado: <strong className="text-rose-300 font-medium">{getComponentName(err.actualComponentId)}</strong>
                    </span>
                  ) : (
                    <span> • <strong className="text-amber-300 font-medium">Slot Vazio</strong></span>
                  )}
                </div>
                {err.slotDescription && (
                  <p className="text-[11px] text-gray-400 italic">
                    Dica: {err.slotDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical Hints (RF21) */}
        {pedagogicalTips && pedagogicalTips.length > 0 && (
          <div className="bg-[#2c2738] border border-[#883cec]/40 rounded-xl p-4 flex flex-col gap-2 mb-6 relative z-10 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Dicas Pedagógicas do Professor</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-xs leading-relaxed">
              {pedagogicalTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => {
              playClick();
              onRetry();
              onClose();
            }}
            className="w-full bg-[#883cec] hover:bg-[#782bdc] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#883cec]/25 cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ajustar Componentes na Bancada</span>
          </button>
        </div>
      </div>
    </div>
  );
}

