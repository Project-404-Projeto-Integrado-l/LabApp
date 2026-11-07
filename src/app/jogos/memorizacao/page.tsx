"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Gamepad2, 
  Keyboard, 
  Layers
} from "lucide-react";
import { Header } from "@/components/header";
import { Flashcard, FlashcardData } from "@/components/memorizacao/flashcard";
import { MemorizacaoResultModal } from "@/components/modals/memorizacao-result-modal";
import { QuizMascot, MascotPose } from "@/components/quiz/quiz-mascot";
import { useSoundEffects } from "@/providers/sound-provider";

const MEMORIZATION_CARDS: FlashcardData[] = [
  {
    id: "card-resistor",
    name: "Resistor",
    category: "Componente Passivo",
    description: "Componente eletrônico que oferece oposição à passagem da corrente elétrica. É fundamental para limitar a corrente e proteger LEDs e outros circuitos contra queima.",
    functionText: "Limitar corrente elétrica e atuar como divisor de tensão no circuito.",
    imageSrc: "/components/resistor.png",
    options: ["Resistor", "Capacitor", "Indutor", "Diodo Zener"],
    correctOptionIndex: 0,
    synonyms: ["resistor", "resistencia", "resistor de filme", "resistor 220", "resistor 220 ohm", "resistor 220 ohms"],
  },
  {
    id: "card-led",
    name: "LED (Diodo Emissor de Luz)",
    category: "Semicondutor Óptico",
    description: "Diodo semicondutor que emite luz quando percorrido por corrente contínua no sentido direto. Possui polaridade definida: terminal longo é o anodo (+) e terminal curto é o catodo (-).",
    functionText: "Sinalização luminosa de estados e indicadores visuais no projeto.",
    imageSrc: "/components/led-vermelho.png",
    options: ["LDR (Fotoresistor)", "LED (Diodo Emissor de Luz)", "Fototransistor", "Lâmpada Neon"],
    correctOptionIndex: 1,
    synonyms: ["led", "led vermelho", "diodo emissor de luz", "diodo led"],
  },
  {
    id: "card-arduino",
    name: "Arduino Uno",
    category: "Placa Microcontroladora",
    description: "Placa de desenvolvimento aberta baseada no microcontrolador ATmega328P. Possui 14 pinos digitais, 6 pinos analógicos e conexão USB para alimentação e gravação de firmware.",
    functionText: "Cérebro do projeto: processa comandos em código C++, lê sensores e controla atuadores.",
    imageSrc: "/components/arduino.png",
    options: ["Raspberry Pi", "Protoboard", "Arduino Uno", "Módulo ESP32"],
    correctOptionIndex: 2,
    synonyms: ["arduino", "arduino uno", "placa arduino", "microcontrolador arduino"],
  },
  {
    id: "card-capacitor",
    name: "Capacitor",
    category: "Componente Passivo",
    description: "Componente capaz de armazenar cargas elétricas em um campo eletrostático e liberá-las rapidamente. Essencial para filtragem de ruídos em fontes e desacoplamento de sinais.",
    functionText: "Armazenar cargas e estabilizar variações de tensão na alimentação.",
    imageSrc: "/components/capacitor.png",
    options: ["Transformador", "Bateria", "Potenciômetro", "Capacitor"],
    correctOptionIndex: 3,
    synonyms: ["capacitor", "condensador", "capacitor eletrolitico", "capacitor ceramico"],
  },
  {
    id: "card-botao",
    name: "Botão (Push Button)",
    category: "Entrada Digital",
    description: "Chave táctil momentânea que fecha o contato elétrico apenas enquanto pressionada. Permite que o microcontrolador receba comandos humanos de pulso digital (HIGH ou LOW).",
    functionText: "Fornecer sinal digital de acionamento manual ao microcontrolador.",
    imageSrc: "/components/botao.png",
    options: ["Botão (Push Button)", "Relé Eletromecânico", "Chave Alavanca", "Trimpot"],
    correctOptionIndex: 0,
    synonyms: ["botao", "botão", "push button", "pulsador", "chave tactil", "chave táctil", "interruptor"],
  },
  {
    id: "card-bateria",
    name: "Bateria 9V",
    category: "Fonte de Energia",
    description: "Fonte portátil de alimentação de corrente contínua (DC) com tensão nominal de 9 Volts. Usada para garantir funcionamento móvel e autônomo ao protótipo sem conexão USB.",
    functionText: "Fornecer tensão contínua portátil para alimentar o Arduino e módulos.",
    imageSrc: "/components/bateria-9v.png",
    options: ["Pilha AA", "Bateria 9V", "Célula de Lítio", "Power Bank USB"],
    correctOptionIndex: 1,
    synonyms: ["bateria", "bateria 9v", "bateria de 9v", "bateria 9 volts", "fonte 9v", "pilha 9v"],
  }
];

type GameMode = "ludico" | "avancado";

export default function MemorizacaoPage() {
  const router = useRouter();
  const { playSuccess, playError, playClick, playToggle } = useSoundEffects();

  const [cards] = useState<FlashcardData[]>(MEMORIZATION_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>("ludico");
  const [isFlipped, setIsFlipped] = useState(false);

  // Modo Lúdico state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Modo Avançado state
  const [typedAnswer, setTypedAnswer] = useState("");

  // Validation & feedback state
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Results
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Mascot state
  const [mascotPose, setMascotPose] = useState<MascotPose>("question");
  const [mascotDialogue, setMascotDialogue] = useState<string>(
    "Observe o formato e terminais do componente para identificá-lo!"
  );

  const currentCard = cards[currentIndex] || MEMORIZATION_CARDS[0];
  const totalCards = cards.length;
  const isLastCard = currentIndex === totalCards - 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalCards) * 100);

  const handleModeChange = (newMode: GameMode) => {
    if (newMode === gameMode) return;
    playToggle(newMode === "avancado");
    setGameMode(newMode);
    setSelectedOption(null);
    setTypedAnswer("");
    setIsAnswered(false);
    setIsCorrect(null);
    setValidationWarning(null);
    setIsFlipped(false);
    setMascotPose("question");
    setMascotDialogue(
      newMode === "ludico"
        ? "Modo Lúdico ativado: escolha a alternativa correspondente!"
        : "Modo Avançado ativado: digite o nome exato do componente!"
    );
  };

  const handleFlipCard = () => {
    playClick();
    setIsFlipped((prev) => !prev);
  };

  // Helper to normalize strings for advanced mode answer check
  const normalize = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "");
  };

  const handleConfirmAnswer = () => {
    setValidationWarning(null);

    if (gameMode === "ludico") {
      // Estado de quando tentar confirmar resposta sem selecionar uma alternativa (node-id=92-1755)
      if (selectedOption === null) {
        setValidationWarning("Selecione uma alternativa antes de confirmar a resposta!");
        playError();
        return;
      }

      setIsAnswered(true);
      const correct = selectedOption === currentCard.correctOptionIndex;
      setIsCorrect(correct);

      if (correct) {
        setCorrectCount((prev) => prev + 1);
        setMascotPose("happy");
        setMascotDialogue("Correto! Você identificou o componente perfeitamente! 🎉");
        playSuccess();
      } else {
        setIncorrectCount((prev) => prev + 1);
        setMascotPose("nervous");
        setMascotDialogue("Não foi dessa vez! Vire o card para memorizar a função dele.");
        playError();
      }
    } else {
      // Modo Avançado (node-id=84-2118)
      if (!typedAnswer.trim()) {
        setValidationWarning("Digite o nome do componente antes de confirmar!");
        playError();
        return;
      }

      setIsAnswered(true);
      const userNorm = normalize(typedAnswer);
      const correct = currentCard.synonyms.some((syn) => normalize(syn) === userNorm);
      setIsCorrect(correct);

      if (correct) {
        setCorrectCount((prev) => prev + 1);
        setMascotPose("happy");
        setMascotDialogue("Sensacional! Você escreveu o nome correto sem opções! 🎉");
        playSuccess();
      } else {
        setIncorrectCount((prev) => prev + 1);
        setMascotPose("nervous");
        setMascotDialogue("Quase lá! O nome correto foi revelado. Vire o card para estudar os detalhes.");
        playError();
      }
    }
  };

  const handleNextCard = () => {
    playClick();

    if (isLastCard) {
      setIsCompletedModalOpen(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTypedAnswer("");
      setIsAnswered(false);
      setIsCorrect(null);
      setValidationWarning(null);
      setIsFlipped(false);
      setMascotPose("question");
      setMascotDialogue("Novo componente na tela! Consegue reconhecer este hardware?");
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer("");
    setIsAnswered(false);
    setIsCorrect(null);
    setValidationWarning(null);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setMascotPose("question");
    setMascotDialogue("Vamos treinar novamente! A repetição leva à memorização!");
    setIsCompletedModalOpen(false);
  };

  const handleBackToGames = () => {
    setIsCompletedModalOpen(false);
    router.push("/jogos");
  };

  const optionLabels = ["A", "B", "C", "D"];

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

      <main className="relative z-10 flex-1 max-w-[1216px] w-full mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-8 flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#3a3a3a]">
          <Link
            href="/jogos"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar para Jogos</span>
          </Link>

          
          <div className="flex items-center gap-2 bg-[#1a1a1a] p-1 rounded-xl border border-[#444444]">
            <button
              type="button"
              onClick={() => handleModeChange("ludico")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                gameMode === "ludico"
                  ? "bg-[#883cec] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#282828]"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Modo Lúdico (Opções)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("avancado")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                gameMode === "avancado"
                  ? "bg-[#883cec] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#282828]"
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Modo Avançado (Digitação)</span>
            </button>
          </div>
        </div>

        
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-white tracking-wide">
              Flashcard {String(currentIndex + 1).padStart(2, "0")} / {String(totalCards).padStart(2, "0")}
            </span>
            <span className="text-gray-400">
              Progresso do Módulo: {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden border border-[#444444]">
            <div
              className="h-full bg-gradient-to-r from-[#883cec] to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        
        {validationWarning && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/70 text-amber-200 flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium">
              {validationWarning}
            </span>
          </div>
        )}

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          
          <div className="lg:col-span-5 flex flex-col items-center justify-center w-full">
            <Flashcard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={handleFlipCard}
            />

            
            <button
              type="button"
              onClick={handleFlipCard}
              className="mt-3 text-xs text-gray-300 hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#262626] border border-[#444444] hover:bg-[#333333] transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#883cec]" />
              <span>{isFlipped ? "Voltar para imagem frontal" : "Virar card para consultar detalhes"}</span>
            </button>
          </div>

          
          <div className="lg:col-span-4 flex flex-col gap-5 w-full">
            
            {gameMode === "ludico" && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Selecione a resposta correta:
                </span>

                {currentCard.options.map((opt, idx) => {
                  let buttonStyle = "bg-[#262626] border-[#444444] text-white hover:border-[#883cec] hover:bg-[#2d2d2d]";
                  let badgeStyle = "bg-[#333333] text-gray-200 border-[#555555]";

                  if (!isAnswered && selectedOption === idx) {
                    buttonStyle = "bg-[#2d2438] border-[#883cec] text-white ring-1 ring-[#883cec]";
                    badgeStyle = "bg-[#883cec] text-white border-[#883cec]";
                  }

                  if (isAnswered) {
                    if (idx === currentCard.correctOptionIndex) {
                      // Correct state (node-id=85-962)
                      buttonStyle = "border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-500/60";
                      badgeStyle = "bg-emerald-500 text-white border-emerald-400 font-bold";
                    } else if (idx === selectedOption) {
                      // Incorrect state (node-id=85-1573)
                      buttonStyle = "border-rose-500 bg-rose-950/40 text-white ring-1 ring-rose-500/60";
                      badgeStyle = "bg-rose-500 text-white border-rose-400 font-bold";
                    } else {
                      buttonStyle = "border-[#383838] bg-[#222222] text-gray-500 opacity-40 cursor-not-allowed";
                      badgeStyle = "bg-[#333333] text-gray-500 border-[#444444]";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => {
                        setSelectedOption(idx);
                        setValidationWarning(null);
                        playClick();
                      }}
                      className={`w-full min-h-[58px] p-4 rounded-xl border text-left transition-colors flex items-center justify-between gap-3 select-none cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${badgeStyle}`}>
                          {optionLabels[idx]}
                        </span>
                        <span className="text-sm font-medium leading-snug">
                          {opt}
                        </span>
                      </div>

                      {isAnswered && idx === currentCard.correctOptionIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}

                      {isAnswered && idx === selectedOption && idx !== currentCard.correctOptionIndex && (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            
            {gameMode === "avancado" && (
              <div className="bg-[#262626] border border-[#5e5e5e] rounded-2xl p-6 flex flex-col gap-4">
                <div>
                  <label htmlFor="component-input" className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                    Digite o nome do componente:
                  </label>
                  <input
                    id="component-input"
                    type="text"
                    disabled={isAnswered}
                    value={typedAnswer}
                    onChange={(e) => {
                      setTypedAnswer(e.target.value);
                      setValidationWarning(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isAnswered) {
                        handleConfirmAnswer();
                      }
                    }}
                    placeholder="Ex: Resistor, LED, Arduino..."
                    className="w-full bg-[#1b1b1b] border border-[#444444] focus:border-[#883cec] focus:outline-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 transition-colors"
                  />
                </div>

                {isAnswered && (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isCorrect
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                      : "bg-rose-950/40 border-rose-500/50 text-rose-200"
                  }`}>
                    <span className="font-bold block mb-1">
                      {isCorrect ? "Correto! Resposta precisa." : "Nome correto do componente:"}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {currentCard.name}
                    </span>
                  </div>
                )}
              </div>
            )}

            
            <div className="flex flex-col gap-3">
              {!isAnswered ? (
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  className="w-full py-4 bg-[#883cec] hover:bg-[#782bdc] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>Confirmar Resposta</span>
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="w-full py-4 bg-[#883cec] hover:bg-[#782bdc] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>{isLastCard ? "Ver Resumo da Prática" : "Próximo Flashcard"}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              
              <button
                type="button"
                onClick={handleFlipCard}
                className="w-full py-3 bg-[#333333] hover:bg-[#3d3d3d] text-gray-200 border border-[#555555] rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#883cec]" />
                <span>{isFlipped ? "Ver imagem do componente" : "Virar card e conferir resposta"}</span>
              </button>
            </div>
          </div>

          
          <div className="lg:col-span-3 flex flex-col items-center justify-center p-2">
            <div className="sticky top-28 w-full flex flex-col items-center">
              <QuizMascot
                pose={mascotPose}
                dialogueText={mascotDialogue}
                className="w-full max-w-[280px]"
              />

              <div className="mt-4 w-full max-w-[260px] bg-[#262626] border border-[#444444] rounded-xl p-3 text-xs text-gray-300 flex items-start gap-2">
                <Layers className="w-4 h-4 text-[#883cec] mt-0.5" />
                <span className="leading-relaxed">
                  Dica: Você pode virar o card a qualquer momento para memorizar a função técnica do componente!
                </span>
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

      
      <MemorizacaoResultModal
        isOpen={isCompletedModalOpen}
        totalCards={totalCards}
        correctAnswers={correctCount}
        incorrectAnswers={incorrectCount}
        gameMode={gameMode}
        onRestart={handleRestart}
        onBackToGames={handleBackToGames}
      />
    </div>
  );
}
