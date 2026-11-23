"use client";

import { useEffect } from "react";
import { Crown, X } from "lucide-react";
import { useSoundEffects } from "@/providers/sound-provider";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RankingUser {
  position: number;
  name: string;
  xp: string;
  isCurrentUser?: boolean;
}

const STATIC_RANKING: RankingUser[] = [
  { position: 1, name: "Você", xp: "1.150xp", isCurrentUser: true },
  { position: 2, name: "Mariana", xp: "800xp" },
  { position: 3, name: "Arthur", xp: "750xp" },
  { position: 4, name: "Gabriel", xp: "640xp" },
  { position: 5, name: "Sophia", xp: "580xp" }
];

export function RankingModal({ isOpen, onClose }: RankingModalProps) {
  const { playPopupOpen, playPopupClose } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      playPopupOpen();
    }
  }, [isOpen, playPopupOpen]);

  const handleClose = () => {
    playPopupClose();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121926]/70 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
      data-sound="none"
    >
      <div
        className="bg-lab-surface border border-lab-border text-lab-text w-full max-w-[501px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-sound="none"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-lab-border">
          <div className="flex items-center gap-3">
            <Crown className="w-7 h-7 text-lab-amber-text" />
            <h2 className="text-2xl font-bold tracking-tight text-lab-text">
              Ranking
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fechar ranking"
            data-sound="none"
            className="p-1.5 text-lab-muted hover:text-lab-text rounded-xl hover:bg-lab-tint transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Ranking List */}
        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col">
            {STATIC_RANKING.map((user) => (
              <div
                key={user.position}
                className={`flex items-center justify-between py-4 border-b border-lab-border last:border-b-0 ${
                  user.isCurrentUser ? "bg-lab-tint -mx-4 px-4 rounded-xl border-b-transparent my-1" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {user.position === 1 ? (
                      <Crown className="w-6 h-6 text-lab-amber-text fill-lab-amber" />
                    ) : (
                      <span className="text-lab-muted font-bold text-base">
                        {user.position}
                      </span>
                    )}
                  </div>
                  <span className={`text-lg ${user.isCurrentUser ? "text-lab-text font-extrabold" : "text-lab-text font-semibold"}`}>
                    {user.name}
                  </span>
                </div>

                <span className="text-sm font-bold text-lab-primary-strong bg-lab-tint border border-lab-border px-3 py-1 rounded-full">
                  {user.xp}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            data-sound="none"
            className="w-full bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] font-bold py-3.5 rounded-xl text-base transition-colors cursor-pointer mt-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
