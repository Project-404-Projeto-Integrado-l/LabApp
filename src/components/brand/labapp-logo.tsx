import React from "react";
import Image from "next/image";

interface LabAppLogoProps {
  className?: string;
}

export function LabAppLogo({ className = "h-10 w-auto min-w-[138px]" }: LabAppLogoProps) {
  return (
    <span className="inline-flex items-center px-2 py-1">
      {/* Light Mode Official Horizontal Logo */}
      <Image
        src="/brand/labapp-logo-light.svg"
        alt="LabApp"
        width={220}
        height={64}
        priority
        className={`block dark:hidden select-none ${className}`}
      />
      {/* Dark Mode Official Horizontal Logo */}
      <Image
        src="/brand/labapp-logo-dark.svg"
        alt="LabApp"
        width={220}
        height={64}
        priority
        className={`hidden dark:block select-none ${className}`}
      />
    </span>
  );
}

export function LabAppSymbol({ className = "w-8 h-8 min-w-[24px] min-h-[24px]" }: LabAppLogoProps) {
  return (
    <Image
      src="/brand/labapp-symbol.svg"
      alt="LabApp Robô LabBot"
      width={64}
      height={64}
      className={`select-none ${className}`}
    />
  );
}
