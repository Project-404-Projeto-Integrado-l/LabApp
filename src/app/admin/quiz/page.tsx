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
  Sparkles,
  Layers,
  AlertCircle,
  FileQuestion,
  Info
} from "lucide-react";
import { Header } from "@/components/header";
import { supabase, QuizQuestion } from "@/lib/supabase";

const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: "sample-1",
    question: "Qual pino do Arduino Uno deve ser conectado ao terminal negativo de um circuito?",
    options: ["5V", "GND", "RESET", "AREF"],
    correct_option_index: 1,
    explanation: "GND significa Ground (Terra) e representa o polo negativo/referência de 0V no circuito.",
    category: "eletronica",
    created_at: new Date().toISOString()
  },
  {
    id: "sample-2",
    question: "Qual função no código do Arduino é executada repetidamente em um loop infinito?",
    options: ["setup()", "loop()", "pinMode()", "digitalWrite()"],
    correct_option_index: 1,
    explanation: "A função void loop() roda continuamente enquanto o Arduino estiver ligado.",
    category: "programacao",
    created_at: new Date().toISOString()
  },
  {
    id: "sample-3",
    question: "Qual componente é essencial para evitar que um LED queime ao ser conectado a uma fonte de 5V?",
    options: ["Capacitor", "Resistor", "Potenciômetro", "Diodo Zener"],
    correct_option_index: 1,
    explanation: "O resistor limita a corrente elétrica que passa pelo LED, impedindo sobrecarga térmica.",
    category: "eletronica",
    created_at: new Date().toISOString()
  },
  {
    id: "sample-4",
    question: "Qual é o valor da tensão de saída dos pinos digitais do Arduino Uno quando em estado HIGH?",
    options: ["3.3V", "5V", "12V", "0V"],
    correct_option_index: 1,
    explanation: "No Arduino Uno (baseado em 5V), o estado HIGH fornece uma tensão contínua de 5 Volts.",
    category: "hardware",
    created_at: new Date().toISOString()
  }
];

export default function AdminQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states
  const [formQuestion, setFormQuestion] = useState("");
  const [formCategory, setFormCategory] = useState("eletronica");
  const [formOptions, setFormOptions] = useState<string[]>(["", "", "", ""]);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn("Supabase fetch notice:", error?.message || "Nenhuma pergunta encontrada, usando dados de demonstração.");
        setQuestions(SAMPLE_QUESTIONS);
      } else {
        const formatted: QuizQuestion[] = data.map((item) => ({
          ...item,
          options: typeof item.options === "string" ? JSON.parse(item.options) : item.options
        }));
        setQuestions(formatted);
      }
    } catch (err) {
      console.error("Erro ao buscar perguntas:", err);
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
          setQuestions(SAMPLE_QUESTIONS);
        } else {
          const formatted: QuizQuestion[] = data.map((item) => ({
            ...item,
            options: typeof item.options === "string" ? JSON.parse(item.options) : item.options
          }));
          setQuestions(formatted);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Erro ao carregar inicial:", err);
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
    }, 4000);
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormQuestion("");
    setFormCategory("eletronica");
    setFormOptions(["", "", "", ""]);
    setFormCorrectIndex(0);
    setFormExplanation("");
    setIsModalOpen(true);
  };

  const openEditModal = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setFormQuestion(q.question);
    setFormCategory(q.category || "eletronica");
    setFormOptions(Array.isArray(q.options) && q.options.length >= 4 ? [...q.options] : [q.options[0] || "", q.options[1] || "", q.options[2] || "", q.options[3] || ""]);
    setFormCorrectIndex(q.correct_option_index || 0);
    setFormExplanation(q.explanation || "");
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

    const filledOptions = formOptions.map(opt => opt.trim());
    if (filledOptions.some(opt => opt === "")) {
      showToast("Por favor, preencha as 4 opções de resposta.", "error");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      question: formQuestion.trim(),
      options: filledOptions,
      correct_option_index: formCorrectIndex,
      explanation: formExplanation.trim(),
      category: formCategory.toLowerCase().trim()
    };

    try {
      if (editingQuestion) {
        // Update
        const { error } = await supabase
          .from("quiz_questions")
          .update(payload)
          .eq("id", editingQuestion.id);

        if (error) {
          // Local fallback state update
          setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? { ...q, ...payload } : q));
        } else {
          await fetchQuestions();
        }
        showToast("Pergunta atualizada com sucesso!");
      } else {
        // Create
        const { data, error } = await supabase
          .from("quiz_questions")
          .insert([payload])
          .select();

        if (error || !data) {
          const newLocalQuestion: QuizQuestion = {
            id: `custom-${Date.now()}`,
            ...payload,
            created_at: new Date().toISOString()
          };
          setQuestions(prev => [newLocalQuestion, ...prev]);
        } else {
          await fetchQuestions();
        }
        showToast("Nova pergunta criada com sucesso!");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      showToast("Erro ao salvar pergunta no banco de dados.", "error");
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
        setQuestions(prev => prev.filter(q => q.id !== id));
      } else {
        setQuestions(prev => prev.filter(q => q.id !== id));
      }
      showToast("Pergunta excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setQuestions(prev => prev.filter(q => q.id !== id));
      showToast("Pergunta excluída localmente.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleRestoreDefaults = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("quiz_questions")
        .insert(
          SAMPLE_QUESTIONS.map(q => ({
            question: q.question,
            options: q.options,
            correct_option_index: q.correct_option_index,
            explanation: q.explanation,
            category: q.category
          }))
        );

      if (error) {
        setQuestions(SAMPLE_QUESTIONS);
      } else {
        await fetchQuestions();
      }
      showToast("Perguntas padrão restauradas!");
    } catch (err) {
      console.error("Erro ao restaurar:", err);
      setQuestions(SAMPLE_QUESTIONS);
      showToast("Perguntas padrão restauradas.");
    } finally {
      setLoading(false);
    }
  };

  // Categories list
  const categoriesList = Array.from(new Set(questions.map(q => q.category || "geral")));

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.explanation && q.explanation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "todas" || (q.category || "geral").toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-[#212121] text-white font-sans flex flex-col justify-between">
      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#cccccc 1.5px, transparent 1.5px)`,
          backgroundSize: `24px 24px`
        }}
      />

      <Header />

      {/* Notification Toast */}
      {toastMessage && (
        <div className={`fixed top-28 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg border shadow-xl text-white transition-all transform translate-y-0 ${
          toastMessage.type === "error" ? "bg-red-900/90 border-red-500 text-white" : "bg-[#883cec] border-[#a855f7] text-white"
        }`}>
          {toastMessage.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-white" />}
          <span className="font-medium text-sm md:text-base">{toastMessage.text}</span>
        </div>
      )}

      <main className="relative z-10 flex-1 max-w-[1216px] w-full mx-auto px-6 lg:px-0 py-12 flex flex-col gap-10">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#262626] border border-[#5e5e5e] p-8 rounded-lg shadow-lg">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#883cec]/20 border border-[#883cec] rounded-lg">
                <FileQuestion className="w-8 h-8 text-[#883cec]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Gerenciamento de Quiz
                </h1>
                <p className="text-gray-300 text-sm md:text-base">
                  Crie, edite e remova perguntas e respostas do Quiz de Robótica e Eletrônica.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRestoreDefaults}
              className="bg-[#333333] hover:bg-[#444444] border border-[#5e5e5e] text-white px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer"
              title="Restaurar perguntas de exemplo se a lista estiver vazia"
            >
              <RotateCcw className="w-4 h-4 text-gray-300" />
              <span>Restaurar Padrão</span>
            </button>

            <button
              onClick={openCreateModal}
              className="bg-[#883cec] hover:bg-[#722bc9] text-white px-6 py-3 rounded-lg font-medium text-sm md:text-base flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5 text-white" />
              <span>Nova Pergunta</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#262626] border border-[#5e5e5e] p-6 rounded-lg flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-lg">
              <BadgeHelp className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">{questions.length}</span>
              <span className="text-gray-400 text-sm">Total de Perguntas Cadastradas</span>
            </div>
          </div>

          <div className="bg-[#262626] border border-[#5e5e5e] p-6 rounded-lg flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-blue-950/50 border border-blue-500/30 rounded-lg">
              <Layers className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">{categoriesList.length}</span>
              <span className="text-gray-400 text-sm">Categorias Ativas</span>
            </div>
          </div>

          <div className="bg-[#262626] border border-[#5e5e5e] p-6 rounded-lg flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-lg">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">{questions.length * 4}</span>
              <span className="text-gray-400 text-sm">Opções de Resposta Mapeadas</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#262626] border border-[#5e5e5e] p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pergunta ou explicação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#5e5e5e] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#883cec]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs uppercase text-gray-400 font-semibold mr-1">Filtrar:</span>
            <button
              onClick={() => setSelectedCategory("todas")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === "todas"
                  ? "bg-[#883cec] text-white"
                  : "bg-[#333333] text-gray-300 hover:bg-[#444444]"
              }`}
            >
              Todas ({questions.length})
            </button>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap capitalize cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#883cec] text-white"
                    : "bg-[#333333] text-gray-300 hover:bg-[#444444]"
                }`}
              >
                {cat} ({questions.filter(q => (q.category || "geral").toLowerCase() === cat.toLowerCase()).length})
              </button>
            ))}
          </div>
        </div>

        {/* Question Cards List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#262626] border border-[#5e5e5e] rounded-lg">
            <div className="w-10 h-10 border-4 border-[#883cec] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-300 text-base">Carregando perguntas do quiz...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-[#262626] border border-[#5e5e5e] rounded-lg text-center gap-4">
            <HelpCircle className="w-16 h-16 text-gray-500 stroke-[1.5]" />
            <h3 className="text-xl font-bold text-white">Nenhuma pergunta encontrada</h3>
            <p className="text-gray-400 text-sm max-w-md">
              Não encontramos nenhuma pergunta com os filtros aplicados. Tente buscar por outro termo ou adicione novas perguntas.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 bg-[#883cec] hover:bg-[#722bc9] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer"
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
                className="bg-[#262626] border border-[#5e5e5e] p-6 rounded-lg flex flex-col gap-6 shadow-md hover:border-[#777777] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#883cec]/20 border border-[#883cec] text-[#883cec] font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#333333] border border-[#5e5e5e] text-[#a855f7] px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider">
                          {q.category || "geral"}
                        </span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                        {q.question}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => openEditModal(q)}
                      className="bg-[#333333] hover:bg-[#444444] border border-[#5e5e5e] text-white px-3.5 py-2 rounded-lg font-medium text-xs md:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Editar Pergunta"
                    >
                      <Edit3 className="w-4 h-4 text-blue-400" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(q.id)}
                      className="bg-[#333333] hover:bg-red-950/40 border border-[#5e5e5e] text-red-400 hover:border-red-500/50 px-3.5 py-2 rounded-lg font-medium text-xs md:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Excluir Pergunta"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
                  {q.options && q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correct_option_index;
                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-lg border flex items-start gap-3 transition-colors ${
                          isCorrect
                            ? "bg-emerald-950/30 border-emerald-500/60 text-emerald-100"
                            : "bg-[#1c1c1c] border-[#444444] text-gray-300"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${
                          isCorrect ? "bg-emerald-500 text-black" : "bg-[#333333] text-gray-400 border border-[#555]"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="flex-1 text-sm font-medium leading-relaxed">
                          {opt}
                        </div>
                        {isCorrect && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Correta
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation note if present */}
                {q.explanation && (
                  <div className="pl-0 md:pl-11">
                    <div className="bg-[#1c1c1c] border border-[#444444] p-3.5 rounded-lg flex items-start gap-3 text-xs md:text-sm text-gray-300">
                      <Info className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <strong className="text-purple-300 font-semibold">Explicação pedagógica: </strong>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#262626] border border-[#5e5e5e] text-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#444444]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#883cec]/20 rounded-lg">
                  <FileQuestion className="w-6 h-6 text-[#883cec]" />
                </div>
                <h3 className="text-xl font-bold">
                  {editingQuestion ? "Editar Pergunta" : "Nova Pergunta do Quiz"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#333] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 flex flex-col gap-6">
              {/* Question Text */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-200">
                  Enunciado da Pergunta *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Ex: Qual função no código do Arduino é executada uma única vez ao ligar o componente?"
                  className="w-full bg-[#1c1c1c] border border-[#5e5e5e] rounded-lg p-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#883cec]"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-200">
                  Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="eletronica, programacao, hardware, etc."
                  className="w-full bg-[#1c1c1c] border border-[#5e5e5e] rounded-lg p-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#883cec]"
                />
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-200">
                    Opções de Resposta (Selecione a Correta) *
                  </label>
                  <span className="text-xs text-gray-400">Marque o radio button da alternativa certa</span>
                </div>

                <div className="flex flex-col gap-3">
                  {formOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        formCorrectIndex === idx ? "bg-emerald-950/20 border-emerald-500/50" : "bg-[#1c1c1c] border-[#444444]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="correct_option"
                        id={`opt-radio-${idx}`}
                        checked={formCorrectIndex === idx}
                        onChange={() => setFormCorrectIndex(idx)}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                      <span className="font-bold text-sm w-6 text-gray-300">
                        {String.fromCharCode(65 + idx)}:
                      </span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Digite a opção ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                      />
                      {formCorrectIndex === idx && (
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Correta
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-200">
                  Explicação / Dica Didática (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Explicativa técnica sobre o porquê desta alternativa ser a correta..."
                  className="w-full bg-[#1c1c1c] border border-[#5e5e5e] rounded-lg p-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#883cec]"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#444444]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#333333] hover:bg-[#444444] text-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#883cec] hover:bg-[#722bc9] text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#262626] border border-[#5e5e5e] text-white w-full max-w-md rounded-xl p-6 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold">Confirmar Exclusão</h3>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Tem certeza de que deseja remover esta pergunta permanentemente? Esta ação não poderá ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-[#333333] hover:bg-[#444444] text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={() => handleDeleteQuestion(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-md"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#333]">
        <div className="max-w-[1216px] w-full mx-auto px-6 lg:px-0 py-6 text-center text-sm text-white">
          <p>LabApp — Painel Administrativo de Conteúdo (UFC / SMD)</p>
        </div>
      </footer>
    </div>
  );
}
