"use client";

import React from "react";
import Image from "next/image";
import { RotateCw, Eye, Tag, Cpu, Info } from "lucide-react";

export interface FlashcardData {
  id: string;
  name: string;
  category: string;
  description: string;
  functionText: string;
  imageSrc: string;
  options: string[];
  correctOptionIndex: number;
  synonyms: string[];
}

interface FlashcardProps {
  card: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}

export function Flashcard({ card, isFlipped, onFlip, className = "" }: FlashcardProps) {
  return (
    <div className={`w-full max-w-[460px] h-[480px] select-none ${className}`} style={{ perspective: "1200px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={onFlip}
      >
        <div
          className="absolute inset-0 w-full h-full bg-lab-surface border border-lab-border hover:border-lab-primary rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-lab-muted uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-lab-primary-strong" />
              <span>Hardware / Componente</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="text-xs font-semibold text-lab-muted hover:text-lab-text flex items-center gap-1 px-3 py-1.5 rounded-xl bg-lab-tint hover:bg-lab-border/60 border border-lab-border transition-colors"
              title="Virar o card"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Virar card</span>
            </button>
          </div>

          <div className="relative flex-1 w-full flex items-center justify-center my-4 p-4 bg-lab-tint rounded-2xl border border-lab-border overflow-hidden">
            <div className="relative w-full h-full max-h-[220px]">
              <Image
                src={card.imageSrc}
                alt={card.name}
                fill
                sizes="(max-width: 640px) 280px, 360px"
                className="object-contain filter drop-shadow-md"
                priority
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-lab-muted pt-3 border-t border-lab-border">
            <span className="font-semibold text-lab-text">
              Qual é o nome deste componente?
            </span>
            <span className="text-[11px] text-lab-muted flex items-center gap-1 font-semibold">
              <Eye className="w-3.5 h-3.5 text-lab-primary-strong" />
              <span>Clique para virar</span>
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 w-full h-full bg-lab-surface border-2 border-lab-primary rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-md"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-lab-lavender-text bg-lab-lavender-bg border border-lab-lavender-border px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>{card.category}</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="text-xs font-semibold text-lab-muted hover:text-lab-text flex items-center gap-1 px-3 py-1.5 rounded-xl bg-lab-tint hover:bg-lab-border/60 border border-lab-border transition-colors"
              title="Voltar para a imagem"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Ver imagem</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4 my-2">
            <div>
              <span className="text-xs font-bold text-lab-muted uppercase tracking-wide">
                Identificação do Componente
              </span>
              <h2 className="text-2xl font-extrabold text-lab-text leading-tight mt-1">
                {card.name}
              </h2>
            </div>

            <div className="bg-lab-amber-bg border border-lab-amber-border rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-lab-amber-text">
                <Info className="w-4 h-4" />
                <span>Função Principal no Arduino</span>
              </div>
              <p className="text-xs sm:text-sm text-lab-text leading-relaxed">
                {card.functionText}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-lab-muted leading-relaxed">
              {card.description}
            </p>
          </div>

          <div className="text-[11px] text-lab-muted pt-3 border-t border-lab-border flex items-center justify-between font-semibold">
            <span>Memorização Ativa</span>
            <span>LABiNEC • Robótica Básica</span>
          </div>
        </div>
      </div>
    </div>
  );
}
