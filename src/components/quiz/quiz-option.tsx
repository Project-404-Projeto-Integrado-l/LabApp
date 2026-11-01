"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export type OptionStatus = "default" | "correct" | "incorrect" | "dimmed";

interface QuizOptionProps {
  index: number;
  label: string;
  text: string;
  status: OptionStatus;
  disabled: boolean;
  onSelect: (index: number) => void;
}

export function QuizOption({
  index,
  label,
  text,
  status,
  disabled,
  onSelect,
}: QuizOptionProps) {
  const getContainerStyles = () => {
    switch (status) {
      case "correct":
        return "border-emerald-500 bg-emerald-950/40 text-white shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/60";
      case "incorrect":
        return "border-rose-500 bg-rose-950/40 text-white shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/60";
      case "dimmed":
        return "border-[#383838] bg-[#222222] text-gray-500 opacity-45 cursor-not-allowed";
      case "default":
      default:
        return "border-[#444444] bg-[#262626] text-white hover:border-[#883cec] hover:bg-[#2e2e2e] cursor-pointer active:scale-[0.99]";
    }
  };

  const getBadgeStyles = () => {
    switch (status) {
      case "correct":
        return "bg-emerald-500 text-white font-bold border-emerald-400";
      case "incorrect":
        return "bg-rose-500 text-white font-bold border-rose-400";
      case "dimmed":
        return "bg-[#333333] text-gray-500 border-[#444444]";
      case "default":
      default:
        return "bg-[#333333] text-gray-200 border-[#555555] group-hover:bg-[#883cec] group-hover:text-white group-hover:border-[#883cec]";
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      disabled={disabled}
      className={`group w-full min-h-[64px] p-4 sm:p-5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-4 select-none ${getContainerStyles()}`}
      data-sound="none"
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <span
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm sm:text-base border transition-colors duration-200 ${getBadgeStyles()}`}
        >
          {label}
        </span>
        <span className="text-sm sm:text-base leading-relaxed break-words font-medium">
          {text}
        </span>
      </div>

      {status === "correct" && (
        <div className="animate-scale-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2.2]" />
        </div>
      )}

      {status === "incorrect" && (
        <div className="animate-scale-in">
          <XCircle className="w-6 h-6 text-rose-400 stroke-[2.2]" />
        </div>
      )}
    </button>
  );
}

