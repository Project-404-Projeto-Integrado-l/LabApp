import Link from "next/link";
import { Route, BadgeHelp, Dices, Settings, Crown, Home as HomeIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#212121] text-white font-sans flex flex-col justify-between">
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#cccccc 1.5px, transparent 1.5px)`,
          backgroundSize: `24px 24px`
        }}
      />

      <header className="relative z-10 w-full border-b border-[#5a5a5a] px-6 md:px-28 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-10 relative flex items-center justify-center">
            <svg viewBox="0 0 71 62" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M35.5 0C15.8954 0 0 13.8792 0 31C0 48.1208 15.8954 62 35.5 62C55.1046 62 71 48.1208 71 31C71 13.8792 55.1046 0 35.5 0ZM35.5 48C24.4543 48 15.5 39.0457 15.5 28C15.5 16.9543 24.4543 8 35.5 8C46.5457 8 55.5 16.9543 55.5 28C55.5 39.0457 46.5457 48 35.5 48Z" fill="#883CEC" />
              <circle cx="35.5" cy="31" r="14" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="text-3xl tracking-tight text-white">
            <strong className="font-bold italic">Lab</strong>
            <span className="font-light italic">App</span>
          </span>
        </div>

        <nav className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 py-2 border-b-2 border-[#883cec] text-white font-semibold">
            <HomeIcon className="w-6 h-6 text-white" />
            <span>Início</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 py-2 text-white opacity-85 hover:opacity-100 transition-opacity">
            <Settings className="w-6 h-6 text-white" />
            <span>Configurações</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 py-2 text-white opacity-85 hover:opacity-100 transition-opacity">
            <Crown className="w-6 h-6 text-white" />
            <span>Ranking</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 py-2 text-white opacity-85 hover:opacity-100 transition-opacity">
            <BadgeHelp className="w-6 h-6 text-white" />
            <span>Ajuda / Como Jogar</span>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center gap-12">
        <div className="flex flex-col gap-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Laboratório de Aprendizado
          </h1>
          <p className="text-lg text-white leading-relaxed max-w-2xl">
            Teste e aprimore suas habilidades em robótica básica, eletrônica e reconhecimento de hardware de forma interativa.
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
                <button className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-base flex items-center gap-2 transition-colors cursor-pointer">
                  <span className="text-black font-medium">Jogar agora</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polygon points="6 3 20 12 6 21 6 3" fill="none" />
                  </svg>
                </button>
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
                <button className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-base flex items-center gap-2 transition-colors cursor-pointer">
                  <span className="text-black font-medium">Jogar agora</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polygon points="6 3 20 12 6 21 6 3" fill="none" />
                  </svg>
                </button>
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
                <button className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-base flex items-center gap-2 transition-colors cursor-pointer">
                  <span className="text-black font-medium">Jogar agora</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polygon points="6 3 20 12 6 21 6 3" fill="none" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-sm text-white border-t border-[#333]">
        <p>LabApp — Projeto LabiNEC (UFC / SMD)</p>
      </footer>
    </div>
  );
}
