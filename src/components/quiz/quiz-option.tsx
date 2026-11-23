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
        return "border-lab-success-border bg-lab-success-bg text-lab-text ring-1 ring-lab-success-border";
      case "incorrect":
        return "border-lab-error-border bg-lab-error-bg text-lab-text ring-1 ring-lab-error-border";
      case "dimmed":
        return "border-lab-border bg-lab-tint/40 text-lab-muted opacity-50 cursor-not-allowed";
      case "default":
      default:
        return "border-lab-border bg-lab-surface text-lab-text hover:border-lab-primary hover:bg-lab-tint/60 cursor-pointer active:scale-[0.99]";
    }
  };

  const getBadgeStyles = () => {
    switch (status) {
      case "correct":
        return "bg-lab-secondary text-[#121926] font-extrabold border-lab-success-border";
      case "incorrect":
        return "bg-lab-coral text-[#121926] font-extrabold border-lab-error-border";
      case "dimmed":
        return "bg-lab-tint text-lab-muted border-lab-border";
      case "default":
      default:
        return "bg-lab-tint text-lab-text border-lab-border font-bold group-hover:bg-lab-primary-strong group-hover:text-white dark:group-hover:bg-lab-primary dark:group-hover:text-[#121926] group-hover:border-transparent";
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      disabled={disabled}
      className={`group w-full min-h-[64px] p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 select-none ${getContainerStyles()}`}
      data-sound="none"
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <span
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm sm:text-base border transition-colors duration-200 ${getBadgeStyles()}`}
        >
          {label}
        </span>
        <span className="text-sm sm:text-base leading-relaxed break-words font-semibold">
          {text}
        </span>
      </div>

      {status === "correct" && (
        <div className="animate-scale-in">
          <CheckCircle2 className="w-6 h-6 text-lab-success-text stroke-[2.2]" />
        </div>
      )}

      {status === "incorrect" && (
        <div className="animate-scale-in">
          <XCircle className="w-6 h-6 text-lab-error-text stroke-[2.2]" />
        </div>
      )}
    </button>
  );
}
