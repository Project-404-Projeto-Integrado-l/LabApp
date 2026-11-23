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
  Layers,
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
  },
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
    <div className="relative min-h-screen bg-lab-canvas text-lab-text font-sans flex flex-col justify-between">
      <div className="absolute inset-0 opacity-55 dark:opacity-35 pointer-events-none lab-dot-grid" />

      <Header />

      <main className="relative z-10 flex-1 max-w-[1216px] w-full mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-lab-border">
          <Link
            href="/jogos"
            className="flex items-center gap-2 text-sm font-bold text-lab-muted hover:text-lab-text transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar para Jogos</span>
          </Link>

          <div className="flex items-center gap-1.5 bg-lab-tint p-1.5 rounded-2xl border border-lab-border">
            <button
              type="button"
              onClick={() => handleModeChange("ludico")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                gameMode === "ludico"
                  ? "bg-lab-primary-strong text-white dark:bg-lab-primary dark:text-[#121926]"
                  : "text-lab-muted hover:text-lab-text hover:bg-lab-surface"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Modo Lúdico (Opções)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("avancado")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                gameMode === "avancado"
                  ? "bg-lab-primary-strong text-white dark:bg-lab-primary dark:text-[#121926]"
                  : "text-lab-muted hover:text-lab-text hover:bg-lab-surface"
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Modo Avançado (Digitação)</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-extrabold text-lab-text tracking-wide">
              Flashcard {String(currentIndex + 1).padStart(2, "0")} / {String(totalCards).padStart(2, "0")}
            </span>
            <span className="text-lab-muted font-semibold">
              Progresso do Módulo: {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-lab-tint rounded-full overflow-hidden border border-lab-border">
            <div
              className="h-full bg-gradient-to-r from-lab-primary to-lab-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {validationWarning && (
          <div className="p-4 rounded-2xl bg-lab-amber-bg border border-lab-amber-border text-lab-amber-text flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-bold">
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
              className="mt-3 text-xs font-bold text-lab-muted hover:text-lab-text flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lab-surface border border-lab-border hover:bg-lab-tint transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-lab-primary-strong" />
              <span>{isFlipped ? "Voltar para imagem frontal" : "Virar card para consultar detalhes"}</span>
            </button>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5 w-full">
            {gameMode === "ludico" && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-lab-muted">
                  Selecione a resposta correta:
                </span>

                {currentCard.options.map((opt, idx) => {
                  let buttonStyle = "bg-lab-surface border-lab-border text-lab-text hover:border-lab-primary hover:bg-lab-tint/60";
                  let badgeStyle = "bg-lab-tint text-lab-text border-lab-border font-bold";

                  if (!isAnswered && selectedOption === idx) {
                    buttonStyle = "bg-lab-tint border-lab-primary text-lab-text ring-1 ring-lab-primary";
                    badgeStyle = "bg-lab-primary-strong text-white dark:bg-lab-primary dark:text-[#121926] border-transparent font-extrabold";
                  }

                  if (isAnswered) {
                    if (idx === currentCard.correctOptionIndex) {
                      buttonStyle = "border-lab-success-border bg-lab-success-bg text-lab-text ring-1 ring-lab-success-border";
                      badgeStyle = "bg-lab-secondary text-[#121926] border-lab-success-border font-extrabold";
                    } else if (idx === selectedOption) {
                      buttonStyle = "border-lab-error-border bg-lab-error-bg text-lab-text ring-1 ring-lab-error-border";
                      badgeStyle = "bg-lab-coral text-[#121926] border-lab-error-border font-extrabold";
                    } else {
                      buttonStyle = "border-lab-border bg-lab-tint/40 text-lab-muted opacity-50 cursor-not-allowed";
                      badgeStyle = "bg-lab-tint text-lab-muted border-lab-border";
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
                      className={`w-full min-h-[58px] p-4 rounded-2xl border text-left transition-colors flex items-center justify-between gap-3 select-none cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs border ${badgeStyle}`}>
                          {optionLabels[idx]}
                        </span>
                        <span className="text-sm font-semibold leading-snug">
                          {opt}
                        </span>
                      </div>

                      {isAnswered && idx === currentCard.correctOptionIndex && (
                        <CheckCircle2 className="w-5 h-5 text-lab-success-text" />
                      )}

                      {isAnswered && idx === selectedOption && idx !== currentCard.correctOptionIndex && (
                        <XCircle className="w-5 h-5 text-lab-error-text" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {gameMode === "avancado" && (
              <div className="bg-lab-surface border border-lab-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                <div>
                  <label htmlFor="component-input" className="text-xs font-extrabold uppercase tracking-wider text-lab-muted block mb-2">
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
                    className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary focus:outline-none rounded-xl px-4 py-3.5 text-sm text-lab-text placeholder-lab-muted transition-colors"
                  />
                </div>

                {isAnswered && (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isCorrect
                      ? "bg-lab-success-bg border-lab-success-border text-lab-success-text"
                      : "bg-lab-error-bg border-lab-error-border text-lab-error-text"
                  }`}>
                    <span className="font-bold block mb-1">
                      {isCorrect ? "Correto! Resposta precisa." : "Nome correto do componente:"}
                    </span>
                    <span className="text-sm font-extrabold text-lab-text">
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
                  className="w-full py-4 bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>Confirmar Resposta</span>
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="w-full py-4 bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>{isLastCard ? "Ver Resumo da Prática" : "Próximo Flashcard"}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleFlipCard}
                className="w-full py-3 bg-lab-tint hover:bg-lab-border/70 text-lab-text border border-lab-border rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-lab-primary-strong" />
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

              <div className="mt-4 w-full max-w-[260px] bg-lab-surface border border-lab-border rounded-2xl p-3.5 text-xs text-lab-muted flex items-start gap-2 shadow-sm">
                <Layers className="w-4 h-4 text-lab-primary-strong mt-0.5 shrink-0" />
                <span className="leading-relaxed font-semibold">
                  Dica: Você pode virar o card a qualquer momento para memorizar a função técnica do componente!
                </span>
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
