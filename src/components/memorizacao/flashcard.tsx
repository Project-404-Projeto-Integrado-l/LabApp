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
          className="absolute inset-0 w-full h-full bg-[#262626] border border-[#5e5e5e] hover:border-[#777777] rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#883cec]" />
              <span>Hardware / Componente</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#333333] hover:bg-[#3d3d3d] border border-[#555555] transition-colors"
              title="Virar o card"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Virar card</span>
            </button>
          </div>

          
          <div className="relative flex-1 w-full flex items-center justify-center my-4 p-4 bg-[#1b1b1b] rounded-xl border border-[#3d3d3d] overflow-hidden">
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

          
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#3d3d3d]">
            <span className="font-medium text-gray-300">
              Qual é o nome deste componente?
            </span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#883cec]" />
              <span>Clique para virar</span>
            </span>
          </div>
        </div>

        
        <div
          className="absolute inset-0 w-full h-full bg-[#262626] border border-[#883cec] rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#883cec] bg-[#883cec]/15 border border-[#883cec]/40 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>{card.category}</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#333333] hover:bg-[#3d3d3d] border border-[#555555] transition-colors"
              title="Voltar para a imagem"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Ver imagem</span>
            </button>
          </div>

          
          <div className="flex-1 flex flex-col justify-center gap-4 my-2">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Identificação do Componente
              </span>
              <h2 className="text-2xl font-extrabold text-white leading-tight mt-1">
                {card.name}
              </h2>
            </div>

            <div className="bg-[#1c1c1c] border border-[#444444] rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Info className="w-4 h-4" />
                <span>Função Principal no Arduino</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {card.functionText}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {card.description}
            </p>
          </div>

          
          <div className="text-[11px] text-gray-400 pt-2 border-t border-[#3d3d3d] flex items-center justify-between">
            <span>Memorização Ativa</span>
            <span>LABiNEC • Robótica Básica</span>
          </div>
        </div>
      </div>
    </div>
  );
}
