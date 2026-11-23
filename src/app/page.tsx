import Link from "next/link";
import { Route, BadgeHelp, Dices, Play } from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-lab-canvas text-lab-text font-sans flex flex-col justify-between">
      <div className="absolute inset-0 opacity-55 dark:opacity-35 pointer-events-none lab-dot-grid" />

      <Header />

      <main className="relative z-10 flex-1 max-w-[1216px] w-full mx-auto px-6 lg:px-0 py-12 flex flex-col justify-center gap-12">
        <div className="flex flex-col gap-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-lab-text tracking-[-0.015em] leading-[1.2]">
            Laboratório de Aprendizado
          </h1>
          <p className="text-lg text-lab-muted font-semibold leading-relaxed max-w-2xl">
            Teste e aprimore suas habilidades em robótica básica, eletrônica e reconhecimento de hardware de forma interativa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Jogo de Eletrônica */}
          <div className="bg-lab-surface border border-lab-border text-lab-text min-h-[470px] flex flex-col justify-between p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-start gap-7">
              <div className="w-20 h-20 rounded-2xl bg-lab-tint border border-lab-border flex items-center justify-center">
                <Route className="w-11 h-11 text-lab-primary-strong stroke-[1.75]" />
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-lab-text">
                  Jogo de Eletrônica
                </h2>
                <p className="text-lab-muted text-sm md:text-base leading-relaxed">
                  Desafie seus conhecimentos teóricos e práticos sobre circuitos! Neste jogo, você vai explorar o funcionamento de componentes, entender a lógica das conexões e dominar os principais conceitos eletrônicos aplicados ao ecossistema Arduino.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full pt-6">
              <div className="w-full border-t border-lab-border" />
              <div>
                <Link
                  href="/jogos/eletronica"
                  className="bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] px-7 py-3.5 rounded-xl font-bold text-base inline-flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>Jogar agora</span>
                  <Play className="w-4 h-4 fill-current" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Jogo de Perguntas (Quiz) */}
          <div className="bg-lab-surface border border-lab-border text-lab-text min-h-[470px] flex flex-col justify-between p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-start gap-7">
              <div className="w-20 h-20 rounded-2xl bg-lab-lavender-bg border border-lab-lavender-border/50 flex items-center justify-center">
                <BadgeHelp className="w-11 h-11 text-lab-lavender-text stroke-[1.75]" />
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-lab-text">
                  Jogo de Perguntas (Quiz)
                </h2>
                <p className="text-lab-muted text-sm md:text-base leading-relaxed">
                  Teste sua mente com perguntas dinâmicas sobre robótica básica! Um quiz interativo para você validar o que aprendeu sobre programação em Arduino, lógica de controle e automação de forma divertida e rápida.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full pt-6">
              <div className="w-full border-t border-lab-border" />
              <div>
                <Link
                  href="/jogos/quiz"
                  className="bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] px-7 py-3.5 rounded-xl font-bold text-base inline-flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>Jogar agora</span>
                  <Play className="w-4 h-4 fill-current" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Jogo de Memorização */}
          <div className="bg-lab-surface border border-lab-border text-lab-text min-h-[470px] flex flex-col justify-between p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-start gap-7">
              <div className="w-20 h-20 rounded-2xl bg-lab-success-bg border border-lab-success-border/50 flex items-center justify-center">
                <Dices className="w-11 h-11 text-lab-success-text stroke-[1.75]" />
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-lab-text">
                  Jogo de Memorização
                </h2>
                <p className="text-lab-muted text-sm md:text-base leading-relaxed">
                  Ative sua memória visual! Exercite o reconhecimento rápido de sensores, atuadores, placas e ferramentas essenciais da robótica básica, associando os nomes corretos ao hardware do Arduino real.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full pt-6">
              <div className="w-full border-t border-lab-border" />
              <div>
                <Link
                  href="/jogos/memorizacao"
                  className="bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] px-7 py-3.5 rounded-xl font-bold text-base inline-flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>Jogar agora</span>
                  <Play className="w-4 h-4 fill-current" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-lab-border bg-lab-surface/60">
        <div className="max-w-[1216px] w-full mx-auto px-6 lg:px-0 py-6 text-center text-sm font-semibold text-lab-muted">
          <p>LabApp — Projeto LabiNEC (UFC / SMD)</p>
        </div>
      </footer>
    </div>
  );
}
