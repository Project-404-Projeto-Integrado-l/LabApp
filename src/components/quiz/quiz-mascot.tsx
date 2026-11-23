"use client";

import Image from "next/image";

export type MascotPose = "question" | "happy" | "nervous";

interface QuizMascotProps {
  pose: MascotPose;
  dialogueText?: string;
  className?: string;
}

export function QuizMascot({ pose, dialogueText, className = "" }: QuizMascotProps) {
  const getPoseSrc = (p: MascotPose) => {
    switch (p) {
      case "happy":
        return "/characters/happy.svg";
      case "nervous":
        return "/characters/nervous.svg";
      case "question":
      default:
        return "/characters/question.svg";
    }
  };

  const getDefaultSpeech = (p: MascotPose) => {
    switch (p) {
      case "happy":
        return "Mandou muito bem! Resposta certinha! 🎉";
      case "nervous":
        return "Ops, quase lá! Veja a explicação para aprender.";
      case "question":
      default:
        return "Leia a questão com calma e selecione a alternativa correta.";
    }
  };

  const speech = dialogueText || getDefaultSpeech(pose);

  return (
    <div className={`flex flex-col items-center justify-end relative select-none ${className}`}>
      {/* Speech bubble */}
      <div className="relative mb-3 max-w-[260px] bg-lab-surface border border-lab-border text-lab-text px-4 py-3 rounded-2xl shadow-md transition-all duration-300 animate-fade-in">
        <p className="text-xs sm:text-sm font-semibold leading-snug text-lab-text">
          {speech}
        </p>
        {/* Tail of speech bubble */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px]"
          style={{ borderTopColor: "var(--lab-border-subtle)" }}
        />
        <div
          className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px]"
          style={{ borderTopColor: "var(--lab-bg-surface)" }}
        />
      </div>

      {/* Mascot character container */}
      <div className="relative w-44 sm:w-52 h-64 sm:h-72 flex items-center justify-center">
        {/* Background ambient circular glow behind character */}
        <div
          className={`absolute inset-4 rounded-full blur-xl transition-colors duration-500 opacity-30 ${
            pose === "happy"
              ? "bg-lab-secondary"
              : pose === "nervous"
              ? "bg-lab-coral"
              : "bg-lab-primary"
          }`}
        />

        <div className="relative w-full h-full">
          <Image
            src={getPoseSrc(pose)}
            alt={`Mascote LabApp - pose ${pose}`}
            fill
            sizes="(max-width: 640px) 176px, 208px"
            className="object-contain filter drop-shadow-md transition-all duration-300"
            priority
          />
        </div>
      </div>
    </div>
  );
}
