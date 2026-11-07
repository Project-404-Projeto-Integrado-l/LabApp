import Link from "next/link";
import { Route, BadgeHelp, Dices, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";

export default function JogosPage() {
  return (
    <div className="relative min-h-screen bg-[#212121] text-white font-sans flex flex-col justify-between">
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cccccc 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <Header />

      <main className="relative z-10 flex-1 max-w-[1216px] w-full mx-auto px-6 lg:px-0 py-12 flex flex-col justify-center gap-12">
        <div className="flex flex-col gap-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#883cec]">
            <span>Módulos Interativos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Central de Jogos e Desafios
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
            Escolha uma modalidade para exercitar seus conhecimentos de eletrônica, programação e circuitos do ecossistema Arduino.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Jogo de Eletrônica */}
          <div className="bg-[#262626] border border-[#5e5e5e] text-white h-[500px] flex flex-col justify-between p-8 rounded-lg shadow-lg">
            <div className="flex flex-col items-start gap-8">
              <Route className="w-24 h-24 text-white stroke-[1.5]" />
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-white">
                  Jogo de Eletrônica
                </h2>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  Desafie seus conhecimentos teóricos e práticos sobre circuitos! Neste jogo, você vai explorar o funcionamento de componentes, entender a lógica das conexões e dominar os principais conceitos eletrônicos aplicados ao ecossistema Arduino.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="w-full border-t border-[#5e5e5e]" />
              <div>
                <Link
                  href="/jogos/eletronica"
                  className="bg-[#883cec] hover:bg-[#782bdc] text-white px-8 py-4 rounded-lg font-bold text-base inline-flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>Jogar agora</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Jogo de Perguntas (Quiz) */}
          <div className="bg-[#262626] border border-[#5e5e5e] text-white h-[500px] flex flex-col justify-between p-8 rounded-lg shadow-lg">
            <div className="flex flex-col items-start gap-8">
              <BadgeHelp className="w-24 h-24 text-white stroke-[1.5]" />
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-white">
                  Jogo de Perguntas (Quiz)
                </h2>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  Teste sua mente com perguntas dinâmicas sobre robótica básica! Um quiz interativo para você validar o que aprendeu sobre programação em Arduino, lógica de controle e automação de forma divertida e rápida.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="w-full border-t border-[#5e5e5e]" />
              <div>
                <Link
                  href="/jogos/quiz"
                  className="bg-[#883cec] hover:bg-[#782bdc] text-white px-8 py-4 rounded-lg font-bold text-base inline-flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>Jogar agora</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Jogo de Memorização */}
          <div className="bg-[#262626] border border-[#5e5e5e] text-white h-[500px] flex flex-col justify-between p-8 rounded-lg shadow-lg">
            <div className="flex flex-col items-start gap-8">
              <Dices className="w-24 h-24 text-white stroke-[1.5]" />
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-white">
                  Jogo de Memorização
                </h2>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  Ative sua memória visual! Exercite o reconhecimento rápido de sensores, atuadores, placas e ferramentas essenciais da robótica básica, associando os nomes corretos ao hardware do Arduino real.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="w-full border-t border-[#5e5e5e]" />
              <div>
                <Link
                  href="/jogos/memorizacao"
                  className="bg-[#883cec] hover:bg-[#782bdc] text-white px-8 py-4 rounded-lg font-bold text-base inline-flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>Jogar agora</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[#333]">
        <div className="max-w-[1216px] w-full mx-auto px-6 lg:px-0 py-6 text-center text-sm text-white">
          <p>LabApp — Projeto LabiNEC (UFC / SMD)</p>
        </div>
      </footer>
    </div>
  );
}

