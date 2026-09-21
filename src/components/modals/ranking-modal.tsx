"use client";

import { Crown, X } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#262626] border border-[#5e5e5e] text-white w-full max-w-[501px] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#5e5e5e]">
          <div className="flex items-center gap-3">
            <Crown className="w-7 h-7 text-[#883cec]" />
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Ranking
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar ranking"
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Content - Ranking List */}
        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col">
            {STATIC_RANKING.map((user) => (
              <div 
                key={user.position}
                className={`flex items-center justify-between py-4 border-b border-[#444444] last:border-b-0 ${
                  user.isCurrentUser ? "bg-[#883cec]/15 -mx-4 px-4 rounded-lg border-b-transparent my-1" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {user.position === 1 ? (
                      <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
                    ) : (
                      <span className="text-gray-400 font-bold text-base">
                        {user.position}
                      </span>
                    )}
                  </div>
                  <span className={`text-lg font-medium ${user.isCurrentUser ? "text-white font-bold" : "text-gray-200"}`}>
                    {user.name}
                  </span>
                </div>

                <span className="text-base font-semibold text-[#883cec] bg-[#883cec]/20 border border-[#883cec]/40 px-3 py-1 rounded-full">
                  {user.xp}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3.5 rounded-lg text-base transition-colors cursor-pointer mt-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
