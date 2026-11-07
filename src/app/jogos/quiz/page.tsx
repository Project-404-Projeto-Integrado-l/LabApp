"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  Lightbulb,
  Code2
} from "lucide-react";
import { Header } from "@/components/header";
import { QuizOption, OptionStatus } from "@/components/quiz/quiz-option";
import { QuizMascot, MascotPose } from "@/components/quiz/quiz-mascot";
import { QuizResultModal } from "@/components/modals/quiz-result-modal";
import { useSoundEffects } from "@/providers/sound-provider";
import { supabase, QuizQuestion } from "@/lib/supabase";

interface ExtendedQuizQuestion extends QuizQuestion {
  code_snippet?: string;
}

const DEFAULT_QUIZ_QUESTIONS: ExtendedQuizQuestion[] = [
  {
    id: "q-01",
    question: "Qual pino do Arduino Uno deve ser conectado ao terminal negativo (terra) de um circuito elétrico?",
    options: ["5V", "GND", "RESET", "AREF"],
    correct_option_index: 1,
    explanation: "GND significa 'Ground' (Terra) e representa a referência de 0 Volts (polo negativo) em circuitos eletrônicos.",
    category: "Eletrônica",
  },
  {
    id: "q-02",
    question: "Qual função do Arduino é executada continuamente em um loop infinito após a inicialização da placa?",
    options: ["setup()", "loop()", "pinMode()", "digitalWrite()"],
    correct_option_index: 1,
    explanation: "A função void loop() roda repetidamente em ciclo infinito enquanto a placa estiver ligada à alimentação.",
    category: "Programação",
    code_snippet: "void loop() {\n  // Este bloco de comandos repete continuamente\n}",
  },
  {
    id: "q-03",
    question: "Qual componente é obrigatório conectar em série com um LED para evitar que ele queime por excesso de corrente elétrica?",
    options: ["Capacitor", "Resistor", "Potenciômetro", "Diodo Zener"],
    correct_option_index: 1,
    explanation: "O resistor limita a corrente que percorre o circuito do LED, protegendo o componente semicondutor contra queima térmica.",
    category: "Eletrônica",
  },
  {
    id: "q-04",
    question: "O que o comando digitalRead(pino) faz quando chamado no código do Arduino?",
    options: [
      "Envia um sinal de 5V para o pino",
      "Lê se o pino está em estado HIGH (5V) ou LOW (0V)",
      "Configura o pino como saída de alta potência",
      "Reinicia o microcontrolador ATmega328P"
    ],
    correct_option_index: 1,
    explanation: "digitalRead() realiza a leitura lógica de um pino digital, retornando HIGH (nível alto ~5V) ou LOW (nível baixo ~0V).",
    category: "Programação",
    code_snippet: "int estadoBotao = digitalRead(7);",
  },
  {
    id: "q-05",
    question: "Qual sensor é mais indicado para medir a distância de um obstáculo utilizando ondas de som (eco)?",
    options: [
      "LDR (Sensor de Luz)",
      "Sensor Ultrassônico HC-SR04",
      "Sensor de Temperatura DHT11",
      "Potenciômetro Linear"
    ],
    correct_option_index: 1,
    explanation: "O sensor ultrassônico HC-SR04 emite um pulso de som inaudível e mede o tempo que o eco leva para retornar após bater em um obstáculo.",
    category: "Sensores",
  }
];

const XP_PER_CORRECT_ANSWER = 20;

export default function QuizPlayPage() {
  const router = useRouter();
  const { playSuccess, playError, playClick } = useSoundEffects();

  const [questions, setQuestions] = useState<ExtendedQuizQuestion[]>(DEFAULT_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [mascotPose, setMascotPose] = useState<MascotPose>("question");
  const [mascotDialogue, setMascotDialogue] = useState<string>("");
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load questions from Supabase or use default fallback bank
  useEffect(() => {
    async function loadQuestions() {
      try {
        const { data, error } = await supabase
          .from("quiz_questions")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted: ExtendedQuizQuestion[] = data.map((q) => ({
            id: q.id,
            question: q.question,
            options: Array.isArray(q.options)
              ? q.options
              : typeof q.options === "string"
              ? JSON.parse(q.options)
              : [],
            correct_option_index: q.correct_option_index ?? 0,
            explanation: q.explanation || "",
            category: q.category || "Robótica",
          }));
          setQuestions(formatted);
        }
      } catch {
        // Use default educational questions
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  const currentQuestion = questions[currentIndex] || DEFAULT_QUIZ_QUESTIONS[0];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const totalXp = correctCount * XP_PER_CORRECT_ANSWER;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correct_option_index;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setMascotPose("happy");
      setMascotDialogue("Mandou bem! Resposta certinha! +" + XP_PER_CORRECT_ANSWER + " XP 🎉");
      playSuccess();
    } else {
      setIncorrectCount((prev) => prev + 1);
      setMascotPose("nervous");
      setMascotDialogue("Ops, quase lá! Dê uma olhada na explicação abaixo para aprender.");
      playError();
    }
  };

  const handleNextQuestion = () => {
    playClick();

    if (isLastQuestion) {
      // Save ranking entry in Supabase or localStorage
      try {
        supabase
          .from("rankings")
          .insert({
            player_name: "Você",
            game_type: "quiz",
            score: (correctCount + (selectedOption === currentQuestion.correct_option_index ? 1 : 0)) * XP_PER_CORRECT_ANSWER,
            duration_seconds: 45,
          })
          .then(() => {});
      } catch {
        // guest mode
      }

      setIsCompletedModalOpen(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setMascotPose("question");
      setMascotDialogue("Leia a questão com atenção e escolha a alternativa correta.");
    }
  };

  const handleRestartQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setMascotPose("question");
    setMascotDialogue("Vamos recomeçar! Concentre-se e tente gabaritar!");
    setIsCompletedModalOpen(false);
  }, []);

  const handleBackToGames = () => {
    setIsCompletedModalOpen(false);
    router.push("/jogos");
  };

  const getOptionStatus = (optionIndex: number): OptionStatus => {
    if (!isAnswered) {
      return "default";
    }

    if (optionIndex === currentQuestion.correct_option_index) {
      return "correct";
    }

    if (optionIndex === selectedOption) {
      return "incorrect";
    }

    return "dimmed";
  };

  const optionLabels = ["A", "B", "C", "D"];
  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#212121] text-white font-sans flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Carregando perguntas do quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#212121] text-white font-sans flex flex-col justify-between">
      {/* Background subtle dot pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cccccc 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <Header />

      <main className="relative z-10 flex-1 max-w-[1216px] w-full mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-8 flex flex-col gap-6">
        {/* Navigation & Module Indicator Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#3a3a3a]">
          <Link
            href="/jogos"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar para Jogos</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold text-[#883cec] bg-[#883cec]/15 border border-[#883cec]/35 px-3 py-1 rounded-full uppercase tracking-wider">
              {currentQuestion.category || "Robótica Básica"}
            </span>

            <div className="flex items-center text-xs sm:text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              <span>+{totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-white tracking-wide">
              Pergunta {String(currentIndex + 1).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}
            </span>
            <span className="text-gray-400">
              Progresso: {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden border border-[#444444]">
            <div
              className="h-full bg-gradient-to-r from-[#883cec] to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Quiz Area: Question + Mascot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          {/* Question & Options Area (Left/Center Column) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Question Box Card */}
            <div className="bg-[#262626] border border-[#5e5e5e] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <HelpCircle className="w-4 h-4 text-[#883cec]" />
                <span>Módulo de Robótica & Arduino</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
                {currentQuestion.question}
              </h1>

              {/* Optional Code Snippet Block */}
              {currentQuestion.code_snippet && (
                <div className="bg-[#181818] border border-[#444444] rounded-xl p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto shadow-inner flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] pb-1 border-b border-[#333333]">
                    <Code2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>Trecho de Código C++ Arduino</span>
                  </div>
                  <pre className="pt-2 leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.code_snippet}
                  </pre>
                </div>
              )}
            </div>

            {/* 4 Options Grid */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((optionText, optIndex) => (
                <QuizOption
                  key={optIndex}
                  index={optIndex}
                  label={optionLabels[optIndex] || String(optIndex + 1)}
                  text={optionText}
                  status={getOptionStatus(optIndex)}
                  disabled={isAnswered}
                  onSelect={handleSelectOption}
                />
              ))}
            </div>

            {/* Answer Explanation & Feedback Banner (Appears after answer) */}
            {isAnswered && (
              <div
                className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 animate-fade-in ${
                  selectedOption === currentQuestion.correct_option_index
                    ? "bg-[#182a1e] border-emerald-500/60 text-emerald-200"
                    : "bg-[#2d1b1e] border-rose-500/60 text-rose-200"
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {selectedOption === currentQuestion.correct_option_index ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 mt-0.5" />
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-base text-white">
                      {selectedOption === currentQuestion.correct_option_index
                        ? "Correto! Resposta certa!"
                        : "Incorreto! A resposta correta foi destacada em verde."}
                    </span>
                    {currentQuestion.explanation && (
                      <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Next Question / Finish Button */}
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#883cec] hover:bg-[#782bdc] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>{isLastQuestion ? "Ver Resultado" : "Próxima Pergunta"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mascot Side Panel (Right Column) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4">
            <div className="sticky top-28 w-full flex flex-col items-center">
              <QuizMascot
                pose={mascotPose}
                dialogueText={mascotDialogue}
                className="w-full max-w-[320px]"
              />

              {/* Educational Tip Box below mascot */}
              <div className="mt-4 w-full max-w-[280px] bg-[#262626] border border-[#444444] rounded-xl p-3.5 text-xs text-gray-300 flex items-start gap-2.5 shadow-md">
                <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5" />
                <span className="leading-relaxed">
                  Dica: leia atentamente cada alternativa antes de clicar para garantir seu bônus de XP!
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

      {/* Completion Modal (Matching Figma node-id=161-2474) */}
      <QuizResultModal
        isOpen={isCompletedModalOpen}
        totalQuestions={totalQuestions}
        correctAnswers={correctCount}
        incorrectAnswers={incorrectCount}
        xpGained={totalXp}
        onRestart={handleRestartQuiz}
        onBackToGames={handleBackToGames}
      />
    </div>
  );
}

