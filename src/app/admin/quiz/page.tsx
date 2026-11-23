"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BadgeHelp,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  X,
  Map,
  Layers,
  AlertCircle,
  FileQuestion,
  Info,
} from "lucide-react";
import { Header } from "@/components/header";
import { supabase, QuizQuestion } from "@/lib/supabase";
import { useSoundEffects } from "@/providers/sound-provider";

const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    question: "Qual pino do Arduino Uno deve ser conectado ao terminal negativo de um circuito?",
    options: ["5V", "GND", "RESET", "AREF"],
    correct_option_index: 1,
    explanation: "GND significa Ground (Terra) e representa o polo negativo/referência de 0V no circuito.",
    category: "eletronica",
    created_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    question: "Qual função no código do Arduino é executada repetidamente em um loop infinito?",
    options: ["setup()", "loop()", "pinMode()", "digitalWrite()"],
    correct_option_index: 1,
    explanation: "A função void loop() roda continuamente enquanto o Arduino estiver ligado.",
    category: "programacao",
    created_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    question: "Qual componente é essencial para evitar que um LED queime ao ser conectado a uma fonte de 5V?",
    options: ["Capacitor", "Resistor", "Potenciômetro", "Diodo Zener"],
    correct_option_index: 1,
    explanation: "O resistor limita a corrente elétrica que passa pelo LED, impedindo sobrecarga térmica.",
    category: "eletronica",
    created_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    question: "Qual é o valor da tensão de saída dos pinos digitais do Arduino Uno quando em estado HIGH?",
    options: ["3.3V", "5V", "12V", "0V"],
    correct_option_index: 1,
    explanation: "No Arduino Uno (baseado em 5V), o estado HIGH fornece uma tensão contínua de 5 Volts.",
    category: "hardware",
    created_at: new Date().toISOString(),
  },
];

export default function AdminQuizPage() {
  const { playPopupOpen, playPopupClose } = useSoundEffects();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [formQuestion, setFormQuestion] = useState("");
  const [formCategory, setFormCategory] = useState("eletronica");
  const [formOptions, setFormOptions] = useState<string[]>(["", "", "", ""]);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const formatErrorMessage = (err: unknown): string => {
    const rawMsg = err instanceof Error ? err.message : typeof err === "object" && err && "message" in err ? String((err as { message: unknown }).message) : String(err);
    if (rawMsg.includes("Failed to fetch") || rawMsg.includes("fetch")) {
      return "Erro de rede no navegador (Failed to fetch). Dica: Reinicie o servidor 'npm run dev' para recarregar o .env.local ou verifique bloqueadores (AdBlock/Brave). Alteração mantida localmente.";
    }
    return rawMsg;
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        if (error) {
          console.warn("Supabase fetch notice:", error.message);
          setIsOfflineMode(error.message.includes("Failed to fetch") || error.message.includes("fetch"));
        }
        setQuestions(SAMPLE_QUESTIONS);
      } else {
        const formatted: QuizQuestion[] = data.map((item) => ({
          ...item,
          options: typeof item.options === "string" ? JSON.parse(item.options) : item.options,
        }));
        setQuestions(formatted);
        setIsOfflineMode(false);
      }
    } catch (err) {
      console.error("Erro ao buscar perguntas:", err);
      setIsOfflineMode(true);
      setQuestions(SAMPLE_QUESTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from("quiz_questions")
          .select("*")
          .order("created_at", { ascending: false });

        if (ignore) return;

        if (error || !data || data.length === 0) {
          if (error) {
            console.warn("Aviso ao carregar perguntas:", error.message);
            setIsOfflineMode(error.message.includes("Failed to fetch") || error.message.includes("fetch"));
          }
          setQuestions(SAMPLE_QUESTIONS);
        } else {
          const formatted: QuizQuestion[] = data.map((item) => ({
            ...item,
            options: typeof item.options === "string" ? JSON.parse(item.options) : item.options,
          }));
          setQuestions(formatted);
          setIsOfflineMode(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Erro ao carregar inicial:", err);
          setIsOfflineMode(true);
          setQuestions(SAMPLE_QUESTIONS);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormQuestion("");
    setFormCategory("eletronica");
    setFormOptions(["", "", "", ""]);
    setFormCorrectIndex(0);
    setFormExplanation("");
    playPopupOpen();
    setIsModalOpen(true);
  };

  const openEditModal = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setFormQuestion(q.question);
    setFormCategory(q.category || "eletronica");
    setFormOptions(Array.isArray(q.options) && q.options.length >= 4 ? [...q.options] : [q.options[0] || "", q.options[1] || "", q.options[2] || "", q.options[3] || ""]);
    setFormCorrectIndex(q.correct_option_index || 0);
    setFormExplanation(q.explanation || "");
    playPopupOpen();
    setIsModalOpen(true);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...formOptions];
    updated[index] = value;
    setFormOptions(updated);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      showToast("Por favor, preencha a pergunta.", "error");
      return;
    }

    const filledOptions = formOptions.map((opt) => opt.trim());
    if (filledOptions.some((opt) => opt === "")) {
      showToast("Por favor, preencha as 4 opções de resposta.", "error");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      question: formQuestion.trim(),
      options: filledOptions,
      correct_option_index: formCorrectIndex,
      explanation: formExplanation.trim(),
      category: formCategory.toLowerCase().trim(),
    };

    try {
      if (editingQuestion) {
        const { error } = await supabase
          .from("quiz_questions")
          .update(payload)
          .eq("id", editingQuestion.id);

        if (error) {
          console.error("Erro ao atualizar no Supabase:", error);
          showToast(`Aviso: ${formatErrorMessage(error)}`, "error");
          setQuestions((prev) => prev.map((q) => (q.id === editingQuestion.id ? { ...q, ...payload } : q)));
        } else {
          showToast("Pergunta atualizada no banco de dados com sucesso!");
          await fetchQuestions();
        }
      } else {
        const { error } = await supabase
          .from("quiz_questions")
          .insert([payload]);

        if (error) {
          console.error("Erro ao inserir no Supabase:", error);
          showToast(`Aviso: ${formatErrorMessage(error)}`, "error");
          const localUuid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-0000-0000-${Date.now().toString().padStart(12, "0")}`;
          const newLocalQuestion: QuizQuestion = {
            id: localUuid,
            ...payload,
            created_at: new Date().toISOString(),
          };
          setQuestions((prev) => [newLocalQuestion, ...prev]);
        } else {
          showToast("Nova pergunta criada e salva no banco!");
          await fetchQuestions();
        }
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Erro ao salvar:", err);
      showToast(`Erro ao salvar: ${formatErrorMessage(err)}`, "error");
      const localUuid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-0000-0000-${Date.now().toString().padStart(12, "0")}`;
      if (!editingQuestion) {
        setQuestions((prev) => [{ id: localUuid, ...payload, created_at: new Date().toISOString() }, ...prev]);
      } else {
        setQuestions((prev) => prev.map((q) => (q.id === editingQuestion.id ? { ...q, ...payload } : q)));
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao excluir do Supabase:", error);
        showToast(`Aviso: ${formatErrorMessage(error)}`, "error");
      } else {
        showToast("Pergunta excluída do banco de dados!");
      }
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: unknown) {
      console.error("Erro ao excluir:", err);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      showToast("Pergunta removida localmente.", "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleRestoreDefaults = async () => {
    setLoading(true);
    try {
      const sampleData = SAMPLE_QUESTIONS.map((q) => ({
        question: q.question,
        options: q.options,
        correct_option_index: q.correct_option_index,
        explanation: q.explanation,
        category: q.category,
      }));

      const { error } = await supabase
        .from("quiz_questions")
        .insert(sampleData);

      if (error) {
        console.error("Erro ao restaurar no Supabase:", error);
        showToast(`Aviso: ${formatErrorMessage(error)}`, "error");
        setQuestions(SAMPLE_QUESTIONS);
      } else {
        showToast("Perguntas padrão inseridas no banco de dados!");
        await fetchQuestions();
      }
    } catch (err: unknown) {
      console.error("Erro ao restaurar:", err);
      setQuestions(SAMPLE_QUESTIONS);
      showToast("Perguntas padrão carregadas localmente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const categoriesList = Array.from(new Set(questions.map((q) => q.category || "geral")));

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.explanation && q.explanation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "todas" || (q.category || "geral").toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-lab-canvas text-lab-text font-sans flex flex-col justify-between">
      <div className="absolute inset-0 opacity-55 dark:opacity-35 pointer-events-none lab-dot-grid" />

      <Header />

      {toastMessage && (
        <div className={`fixed top-28 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl transition-all ${
          toastMessage.type === "error"
            ? "bg-lab-error-bg border-lab-error-border text-lab-error-text"
            : "bg-lab-success-bg border-lab-success-border text-lab-success-text"
        }`}>
          {toastMessage.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="font-bold text-sm md:text-base">{toastMessage.text}</span>
        </div>
      )}

      <main className="relative z-10 flex-1 max-w-[1216px] w-full mx-auto px-6 lg:px-0 py-12 flex flex-col gap-10">
        {isOfflineMode && (
          <div className="bg-lab-amber-bg border border-lab-amber-border p-5 rounded-2xl text-lab-text flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-6 h-6 text-lab-amber-text flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <strong className="font-extrabold text-lab-amber-text text-base">
                Banco Supabase Indisponível (Modo de Demonstração Local Ativo)
              </strong>
              <p className="text-lab-muted text-sm leading-relaxed">
                O servidor do Supabase (<code className="bg-lab-code-bg text-[#7BB8FA] px-1.5 py-0.5 rounded font-mono text-xs">tukgaroslokvosweqdiz.supabase.co</code>) não está respondendo. Projetos gratuitos no Supabase entram em pausa automaticamente por inatividade. Para reativar o banco remoto, acesse o <strong className="text-lab-text">Dashboard do Supabase</strong> e clique em <em>Restore project</em>. Suas edições continuam funcionando localmente durante esta sessão.
              </p>
            </div>
          </div>
        )}

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-lab-surface border border-lab-border p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-lab-tint border border-lab-border rounded-xl">
                <FileQuestion className="w-8 h-8 text-lab-primary-strong" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-lab-text tracking-tight">
                  Gerenciamento de Quiz
                </h1>
                <p className="text-lab-muted text-sm md:text-base font-semibold">
                  Crie, edite e remova perguntas e respostas do Quiz de Robótica e Eletrônica.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRestoreDefaults}
              className="bg-lab-tint hover:bg-lab-border/70 border border-lab-border text-lab-text px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              title="Restaurar perguntas de exemplo se a lista estiver vazia"
            >
              <RotateCcw className="w-4 h-4 text-lab-muted" />
              <span>Restaurar Padrão</span>
            </button>

            <button
              onClick={openCreateModal}
              className="bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] px-6 py-3 rounded-xl font-bold text-sm md:text-base flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Pergunta</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-lab-surface border border-lab-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-lab-lavender-bg border border-lab-lavender-border rounded-xl">
              <BadgeHelp className="w-8 h-8 text-lab-lavender-text" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-lab-text">{questions.length}</span>
              <span className="text-lab-muted text-sm font-semibold">Total de Perguntas Cadastradas</span>
            </div>
          </div>

          <div className="bg-lab-surface border border-lab-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-lab-tint border border-lab-border rounded-xl">
              <Layers className="w-8 h-8 text-lab-primary-strong" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-lab-text">{categoriesList.length}</span>
              <span className="text-lab-muted text-sm font-semibold">Categorias Ativas</span>
            </div>
          </div>

          <div className="bg-lab-surface border border-lab-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-lab-success-bg border border-lab-success-border rounded-xl">
              <Map className="w-8 h-8 text-lab-success-text" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-lab-text">{questions.length * 4}</span>
              <span className="text-lab-muted text-sm font-semibold">Opções de Resposta Mapeadas</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-lab-surface border border-lab-border p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-lab-muted" />
            <input
              type="text"
              placeholder="Buscar pergunta ou explicação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-lab-tint border border-lab-border rounded-xl pl-10 pr-4 py-2.5 text-lab-text placeholder-lab-muted text-sm focus:outline-none focus:border-lab-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs uppercase text-lab-muted font-extrabold mr-1">Filtrar:</span>
            <button
              onClick={() => setSelectedCategory("todas")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === "todas"
                  ? "bg-lab-primary-strong text-white dark:bg-lab-primary dark:text-[#121926]"
                  : "bg-lab-tint text-lab-muted hover:text-lab-text"
              }`}
            >
              Todas ({questions.length})
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap capitalize cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-lab-primary-strong text-white dark:bg-lab-primary dark:text-[#121926]"
                    : "bg-lab-tint text-lab-muted hover:text-lab-text"
                }`}
              >
                {cat} ({questions.filter((q) => (q.category || "geral").toLowerCase() === cat.toLowerCase()).length})
              </button>
            ))}
          </div>
        </div>

        {/* Question Cards List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-lab-surface border border-lab-border rounded-2xl">
            <div className="w-10 h-10 border-4 border-lab-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-lab-muted text-base font-semibold">Carregando perguntas do quiz...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-lab-surface border border-lab-border rounded-2xl text-center gap-4">
            <HelpCircle className="w-16 h-16 text-lab-muted stroke-[1.5]" />
            <h3 className="text-xl font-extrabold text-lab-text">Nenhuma pergunta encontrada</h3>
            <p className="text-lab-muted text-sm max-w-md">
              Não encontramos nenhuma pergunta com os filtros aplicados. Tente buscar por outro termo ou adicione novas perguntas.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Primeira Pergunta</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredQuestions.map((q, index) => (
              <div
                key={q.id}
                className="bg-lab-surface border border-lab-border p-6 rounded-2xl flex flex-col gap-6 shadow-sm hover:border-lab-primary transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-lab-tint border border-lab-border text-lab-primary-strong font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-lab-lavender-bg border border-lab-lavender-border text-lab-lavender-text px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {q.category || "geral"}
                        </span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-lab-text leading-snug">
                        {q.question}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => openEditModal(q)}
                      className="bg-lab-tint hover:bg-lab-border/70 border border-lab-border text-lab-text px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Editar Pergunta"
                    >
                      <Edit3 className="w-4 h-4 text-lab-primary-strong" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => {
                        playPopupOpen();
                        setDeleteConfirmId(q.id);
                      }}
                      className="bg-lab-error-bg hover:opacity-90 border border-lab-error-border text-lab-error-text px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Excluir Pergunta"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
                  {q.options &&
                    q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correct_option_index;
                      return (
                        <div
                          key={optIdx}
                          className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                            isCorrect
                              ? "bg-lab-success-bg border-lab-success-border text-lab-text"
                              : "bg-lab-tint/50 border-lab-border text-lab-muted"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center mt-0.5 ${
                              isCorrect
                                ? "bg-lab-secondary text-[#121926]"
                                : "bg-lab-surface text-lab-muted border border-lab-border"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <div className="flex-1 text-sm font-semibold leading-relaxed text-lab-text">
                            {opt}
                          </div>
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-xs font-bold text-lab-success-text bg-lab-surface border border-lab-success-border px-2 py-0.5 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Correta
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>

                {q.explanation && (
                  <div className="pl-0 md:pl-11">
                    <div className="bg-lab-tint/50 border border-lab-border p-3.5 rounded-xl flex items-start gap-3 text-xs md:text-sm text-lab-muted">
                      <Info className="w-5 h-5 text-lab-lavender-text mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-lab-lavender-text font-bold">Explicação pedagógica: </strong>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Create & Edit Question */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121926]/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-lab-surface border border-lab-border text-lab-text w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-6 border-b border-lab-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-lab-tint border border-lab-border rounded-xl">
                  <FileQuestion className="w-6 h-6 text-lab-primary-strong" />
                </div>
                <h3 className="text-xl font-extrabold">
                  {editingQuestion ? "Editar Pergunta" : "Nova Pergunta do Quiz"}
                </h3>
              </div>
              <button
                onClick={() => {
                  playPopupClose();
                  setIsModalOpen(false);
                }}
                className="text-lab-muted hover:text-lab-text p-1.5 rounded-xl hover:bg-lab-tint transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-lab-text">
                  Enunciado da Pergunta *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Ex: Qual função no código do Arduino é executada uma única vez ao ligar o componente?"
                  className="w-full bg-lab-tint border border-lab-border rounded-xl p-3 text-lab-text placeholder-lab-muted text-sm focus:outline-none focus:border-lab-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-lab-text">
                  Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="eletronica, programacao, hardware, etc."
                  className="w-full bg-lab-tint border border-lab-border rounded-xl p-3 text-lab-text placeholder-lab-muted text-sm focus:outline-none focus:border-lab-primary"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-lab-text">
                    Opções de Resposta (Selecione a Correta) *
                  </label>
                  <span className="text-xs text-lab-muted">Marque o radio button da alternativa certa</span>
                </div>

                <div className="flex flex-col gap-3">
                  {formOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        formCorrectIndex === idx
                          ? "bg-lab-success-bg border-lab-success-border"
                          : "bg-lab-tint border-lab-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="correct_option"
                        id={`opt-radio-${idx}`}
                        checked={formCorrectIndex === idx}
                        onChange={() => setFormCorrectIndex(idx)}
                        className="w-4 h-4 accent-lab-secondary cursor-pointer"
                      />
                      <span className="font-extrabold text-sm w-6 text-lab-text">
                        {String.fromCharCode(65 + idx)}:
                      </span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Digite a opção ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 bg-transparent text-lab-text placeholder-lab-muted text-sm focus:outline-none"
                      />
                      {formCorrectIndex === idx && (
                        <span className="text-xs font-bold text-lab-success-text bg-lab-surface border border-lab-success-border px-2 py-0.5 rounded-lg">
                          Correta
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-lab-text">
                  Explicação / Dica Didática (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Explicativa técnica sobre o porquê desta alternativa ser a correta..."
                  className="w-full bg-lab-tint border border-lab-border rounded-xl p-3 text-lab-text placeholder-lab-muted text-sm focus:outline-none focus:border-lab-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-lab-border">
                <button
                  type="button"
                  onClick={() => {
                    playPopupClose();
                    setIsModalOpen(false);
                  }}
                  className="bg-lab-tint hover:bg-lab-border/70 text-lab-text px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>{editingQuestion ? "Salvar Alterações" : "Criar Pergunta"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121926]/70 backdrop-blur-xs">
          <div className="bg-lab-surface border border-lab-border text-lab-text w-full max-w-md rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center gap-3 text-lab-error-text">
              <div className="p-3 bg-lab-error-bg border border-lab-error-border rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-lab-text">Confirmar Exclusão</h3>
            </div>

            <p className="text-lab-muted text-sm leading-relaxed">
              Tem certeza de que deseja remover esta pergunta permanentemente? Esta ação não poderá ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  playPopupClose();
                  setDeleteConfirmId(null);
                }}
                className="bg-lab-tint hover:bg-lab-border/70 text-lab-text px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={() => handleDeleteQuestion(deleteConfirmId)}
                className="bg-lab-coral hover:opacity-90 text-[#121926] px-5 py-2 rounded-xl text-sm font-extrabold transition-colors cursor-pointer shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 border-t border-lab-border bg-lab-surface/60">
        <div className="max-w-[1216px] w-full mx-auto px-6 lg:px-0 py-6 text-center text-sm font-semibold text-lab-muted">
          <p>LabApp — Painel Administrativo de Conteúdo (UFC / SMD)</p>
        </div>
      </footer>
    </div>
  );
}
