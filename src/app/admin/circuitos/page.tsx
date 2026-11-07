"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Layers, 
  Move, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Eye, 
  Settings2,
  X,
  HelpCircle,
  Cpu
} from "lucide-react";
import { Header } from "@/components/header";
import { useSoundEffects } from "@/providers/sound-provider";
import { 
  CircuitChallenge, 
  CircuitSlot, 
  CircuitDifficulty,
  AVAILABLE_COMPONENTS, 
  getStoredCircuits, 
  saveStoredCircuits, 
  resetStoredCircuits 
} from "@/lib/circuitos-data";

const PRESET_CIRCUIT_IMAGES = [
  { label: "Circuito 01 - Bateria 9V com LED e Resistor", path: "/circuitos/circuito01.png" },
  { label: "Circuito 02 - Arduino com Botão e LED", path: "/circuitos/circuito02.png" },
  { label: "Circuito 03 - Semáforo Duplo (2 LEDs)", path: "/circuitos/circuito03.png" },
  { label: "Circuito 04 - Sensor de Luz LDR com Arduino", path: "/circuitos/circuito04.png" },
  { label: "Circuito 05 - Motor DC com Arduino Uno", path: "/circuitos/circuito05.png" },
];

export default function AdminCircuitosPage() {
  const { playClick, playSuccess, playError, playToggle } = useSoundEffects();

  const [circuits, setCircuits] = useState<CircuitChallenge[]>([]);
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Dragging slot on canvas
  const [isDraggingSlotOnCanvas, setIsDraggingSlotOnCanvas] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    if (type === "success") playSuccess();
    else playError();
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load circuits on mount
  useEffect(() => {
    const loaded = getStoredCircuits();
    setCircuits(loaded);
    if (loaded.length > 0) {
      setSelectedCircuitId(loaded[0].id);
      if (loaded[0].slots.length > 0) {
        setSelectedSlotId(loaded[0].slots[0].id);
      }
    }
  }, []);

  const currentCircuit = circuits.find((c) => c.id === selectedCircuitId) || null;
  const currentSlot = currentCircuit?.slots.find((s) => s.id === selectedSlotId) || null;

  // Update circuit fields
  const handleUpdateCircuitField = <K extends keyof CircuitChallenge>(
    field: K,
    value: CircuitChallenge[K]
  ) => {
    if (!currentCircuit) return;
    setCircuits((prev) =>
      prev.map((c) => (c.id === currentCircuit.id ? { ...c, [field]: value } : c))
    );
  };

  // Update slot fields
  const handleUpdateSlotField = <K extends keyof CircuitSlot>(
    slotId: string,
    field: K,
    value: CircuitSlot[K]
  ) => {
    if (!currentCircuit) return;
    const updatedSlots = currentCircuit.slots.map((s) =>
      s.id === slotId ? { ...s, [field]: value } : s
    );
    handleUpdateCircuitField("slots", updatedSlots);
  };

  // Canvas click to add or reposition slot
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !currentCircuit || isDraggingSlotOnCanvas) return;
    
    // Ignore clicks if clicking directly on a slot pin
    if ((e.target as HTMLElement).closest("[data-slot-pin='true']")) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const percentX = Math.round((clickX / rect.width) * 1000) / 10;
    const percentY = Math.round((clickY / rect.height) * 1000) / 10;

    // Create a new slot at this clicked position
    const newSlotNumber = currentCircuit.slots.length + 1;
    const newSlotId = `slot-${Date.now()}`;
    const newSlot: CircuitSlot = {
      id: newSlotId,
      name: `Slot ${newSlotNumber} - Novo Componente`,
      description: "Descreva a função do componente neste slot para o aluno.",
      hint: "Dica curta para o placeholder do slot",
      targetComponentId: "resistor",
      x: Math.max(5, Math.min(95, percentX)),
      y: Math.max(5, Math.min(95, percentY)),
      width: 12,
      height: 14,
    };

    const updatedSlots = [...currentCircuit.slots, newSlot];
    handleUpdateCircuitField("slots", updatedSlots);
    setSelectedSlotId(newSlotId);
    playToggle(true);
    showToast(`Slot ${newSlotNumber} adicionado na posição X: ${percentX}%, Y: ${percentY}%`);
  };

  // Handle slot drag on canvas
  const handleSlotPointerDown = (slotId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedSlotId(slotId);
    setIsDraggingSlotOnCanvas(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleSlotPointerMove = (slotId: string, e: React.PointerEvent) => {
    if (!isDraggingSlotOnCanvas || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const moveY = e.clientY - rect.top;

    const percentX = Math.max(4, Math.min(96, Math.round((moveX / rect.width) * 1000) / 10));
    const percentY = Math.max(4, Math.min(96, Math.round((moveY / rect.height) * 1000) / 10));

    handleUpdateSlotField(slotId, "x", percentX);
    handleUpdateSlotField(slotId, "y", percentY);
  };

  const handleSlotPointerUp = (e: React.PointerEvent) => {
    setIsDraggingSlotOnCanvas(false);
  };

  // Delete slot
  const handleDeleteSlot = (slotId: string) => {
    if (!currentCircuit) return;
    playClick();
    const updated = currentCircuit.slots.filter((s) => s.id !== slotId);
    handleUpdateCircuitField("slots", updated);
    if (selectedSlotId === slotId) {
      setSelectedSlotId(updated[0]?.id || null);
    }
    showToast("Slot removido com sucesso.");
  };

  // Create new circuit challenge
  const handleCreateNewCircuit = () => {
    playClick();
    const newId = `circuito-${Date.now()}`;
    const newCircuit: CircuitChallenge = {
      id: newId,
      title: `Novo Circuito ${circuits.length + 1}`,
      practicalObjective: "Defina o objetivo prático que o aluno deve atingir.",
      description: "Orientações gerais sobre a montagem do circuito.",
      difficulty: "iniciante",
      image_url: "/circuitos/circuito01.png",
      xpReward: 50,
      allowedComponents: ["arduino", "resistor", "led-vermelho", "bateria-9v"],
      explanation: "Explicação teórica de como o circuito funciona.",
      pedagogicalTips: [
        "Preste atenção à polaridade dos componentes.",
        "Resistores são essenciais para evitar sobrecarga de corrente."
      ],
      slots: [
        {
          id: `slot-${Date.now()}-1`,
          name: "Slot 1 - Componente Inicial",
          description: "Primeiro componente obrigatório do circuito.",
          hint: "Arraste o componente aqui",
          targetComponentId: "bateria-9v",
          x: 50,
          y: 50,
          width: 12,
          height: 14
        }
      ]
    };

    const updated = [...circuits, newCircuit];
    setCircuits(updated);
    setSelectedCircuitId(newId);
    setSelectedSlotId(newCircuit.slots[0].id);
    showToast("Novo circuito criado! Configure os slots e objetivos.");
  };

  // Delete circuit
  const handleDeleteCircuit = (id: string) => {
    if (circuits.length <= 1) {
      showToast("Não é possível remover todos os circuitos. Pelo menos um deve permanecer.", "error");
      return;
    }
    playClick();
    const updated = circuits.filter((c) => c.id !== id);
    setCircuits(updated);
    setSelectedCircuitId(updated[0].id);
    setSelectedSlotId(updated[0].slots[0]?.id || null);
    saveStoredCircuits(updated);
    showToast("Circuito excluído.");
  };

  // Save changes
  const handleSaveAll = () => {
    playClick();
    saveStoredCircuits(circuits);
    showToast("Todos os circuitos e slots foram salvos com sucesso!");
  };

  // Reset to default
  const handleResetToDefaults = () => {
    if (confirm("Deseja restaurar os circuitos e slots para os 5 padrões originais do sistema? Todas as alterações personalizadas serão redefinidas.")) {
      playClick();
      const defaults = resetStoredCircuits();
      setCircuits(defaults);
      setSelectedCircuitId(defaults[0].id);
      setSelectedSlotId(defaults[0].slots[0]?.id || null);
      showToast("Circuitos e slots restaurados para o padrão original!");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#212121] text-white font-sans flex flex-col justify-between">
      {/* Background dot grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cccccc 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <Header />

      <main className="relative z-10 flex-1 max-w-[1340px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className={`fixed top-24 right-6 z-50 p-4 rounded-xl border shadow-2xl flex items-center gap-3 animate-fade-in ${
            toastMessage.type === "success"
              ? "bg-[#183120] border-emerald-500/50 text-emerald-200"
              : "bg-[#331c22] border-rose-500/50 text-rose-200"
          }`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span className="text-sm font-semibold">{toastMessage.text}</span>
          </div>
        )}

        {/* Top Header & Global Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#3e3e3e]">
          <div className="flex items-center gap-4">
            <Link
              href="/jogos"
              className="p-2.5 rounded-xl bg-[#2a2a2a] hover:bg-[#383838] border border-[#5e5e5e] text-gray-300 hover:text-white transition-all flex items-center gap-2 text-sm font-semibold cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Jogos</span>
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#883cec] bg-[#883cec]/15 px-2.5 py-0.5 rounded-md border border-[#883cec]/30">
                  Painel de Gestão Pedagógica
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {circuits.length} Circuitos Cadastrados
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                Gerenciador de Circuitos e Slots Interativos
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/jogos/eletronica"
              className="bg-[#2a2a2a] hover:bg-[#353535] text-purple-300 border border-[#883cec]/50 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Testar no Jogo</span>
            </Link>

            <button
              onClick={handleResetToDefaults}
              className="bg-[#2b2b2b] hover:bg-[#383838] text-gray-300 border border-[#555] px-3.5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Restaurar circuitos para os 5 desafios de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrões</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="bg-[#883cec] hover:bg-[#782bdc] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#883cec]/30 cursor-pointer active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>

        {/* Circuit Tabs / Selector */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            {circuits.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  playClick();
                  setSelectedCircuitId(c.id);
                  setSelectedSlotId(c.slots[0]?.id || null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  c.id === selectedCircuitId
                    ? "bg-[#883cec] text-white shadow-md shadow-[#883cec]/30"
                    : "bg-[#282828] text-gray-300 hover:bg-[#333333] border border-[#444]"
                }`}
              >
                <span>{`#${idx + 1} ${c.title.slice(0, 24)}...`}</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full font-mono">
                  {c.slots.length} slots
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateNewCircuit}
            className="bg-[#2a3a2e] hover:bg-[#344b3a] text-emerald-300 border border-emerald-500/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Circuito</span>
          </button>
        </div>

        {currentCircuit && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Canvas Area (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[#1b1b1b] border-2 border-[#444444] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-gray-300 border-b border-[#333] pb-2">
                  <div className="flex items-center gap-2">
                    <Move className="w-4 h-4 text-[#883cec]" />
                    <span className="font-bold uppercase tracking-wider text-gray-200">
                      Bancada Visual: Clique na imagem para criar slots ou arraste-os
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Posicionamento Relativo (0% a 100%)
                  </span>
                </div>

                {/* Canvas Container */}
                <div
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-[#555] bg-[#121212] cursor-crosshair select-none group"
                  title="Clique em qualquer lugar da imagem do circuito para posicionar um novo slot"
                >
                  {/* Circuit Background Illustration */}
                  <Image
                    src={currentCircuit.image_url}
                    alt={currentCircuit.title}
                    fill
                    className="object-contain pointer-events-none"
                    priority
                  />

                  {/* Helper click guide banner */}
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs border border-white/10 px-3 py-1.5 rounded-lg text-[11px] text-gray-300 pointer-events-none flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#883cec]" />
                    <span>Clique na imagem para adicionar um slot onde desejar</span>
                  </div>

                  {/* Interactive Visual Slots */}
                  {currentCircuit.slots.map((slot, index) => {
                    const isSelected = slot.id === selectedSlotId;
                    const comp = AVAILABLE_COMPONENTS.find((c) => c.id === slot.targetComponentId);

                    return (
                      <div
                        key={slot.id}
                        data-slot-pin="true"
                        style={{
                          left: `${slot.x}%`,
                          top: `${slot.y}%`,
                          width: `${slot.width || 12}%`,
                          height: `${slot.height || 14}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onPointerDown={(e) => handleSlotPointerDown(slot.id, e)}
                        onPointerMove={(e) => handleSlotPointerMove(slot.id, e)}
                        onPointerUp={handleSlotPointerUp}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSlotId(slot.id);
                          playClick();
                        }}
                        className={`absolute rounded-xl flex flex-col items-center justify-between p-1.5 cursor-grab active:cursor-grabbing transition-shadow z-20 ${
                          isSelected
                            ? "bg-[#883cec]/80 border-2 border-white shadow-2xl ring-4 ring-[#883cec]/50 scale-105"
                            : "bg-[#242424]/85 border-2 border-amber-400/80 hover:border-white shadow-lg"
                        }`}
                      >
                        <div className="w-full flex items-center justify-between">
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-black/70 text-white">
                            #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSlot(slot.id);
                            }}
                            className="w-4 h-4 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center text-[10px] cursor-pointer"
                            title="Remover slot"
                          >
                            ×
                          </button>
                        </div>

                        {comp && (
                          <div className="relative w-full flex-1 flex items-center justify-center pointer-events-none">
                            <Image
                              src={comp.image_url}
                              alt={comp.name}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                        )}

                        <span className="text-[9px] font-bold text-center truncate w-full text-white bg-black/60 rounded px-0.5">
                          {comp ? comp.name.split(" ")[0] : "Slot"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Slots Overview List */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#333]">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Slots Configurados Neste Circuito ({currentCircuit.slots.length})
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {currentCircuit.slots.map((s, idx) => {
                      const comp = AVAILABLE_COMPONENTS.find((c) => c.id === s.targetComponentId);
                      const isSelected = s.id === selectedSlotId;

                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSelectedSlotId(s.id);
                            playClick();
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#883cec]/20 border-[#883cec] text-white shadow-sm"
                              : "bg-[#252525] border-[#444] text-gray-300 hover:bg-[#2d2d2d]"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-black/40 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold truncate text-white">{s.name}</span>
                            <span className="text-[10px] text-gray-400 truncate">
                              {comp ? comp.name : "Nenhum"} • ({s.x}%, {s.y}%)
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Inspector and Circuit Form (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Selected Slot Inspector */}
              <div className="bg-[#262626] border border-[#5e5e5e] rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#3e3e3e] pb-3">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-[#883cec]" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                      Configuração do Slot Selecionado
                    </h2>
                  </div>

                  {currentSlot && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(currentSlot.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir Slot</span>
                    </button>
                  )}
                </div>

                {currentSlot ? (
                  <div className="flex flex-col gap-4">
                    {/* Slot Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-300">
                        Nome / Rótulo do Slot
                      </label>
                      <input
                        type="text"
                        value={currentSlot.name}
                        onChange={(e) => handleUpdateSlotField(currentSlot.id, "name", e.target.value)}
                        placeholder="Ex: Slot 1 - Resistor de Proteção"
                        className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>

                    {/* Target Component */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                        <span>Componente Obrigatório / Esperado</span>
                        <span className="text-[10px] text-purple-400">Verificação Lógica</span>
                      </label>
                      <select
                        value={currentSlot.targetComponentId}
                        onChange={(e) => handleUpdateSlotField(currentSlot.id, "targetComponentId", e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none cursor-pointer"
                      >
                        {AVAILABLE_COMPONENTS.map((comp) => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name} ({comp.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Placeholder Hint (Dica no Placeholder) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                        <span>Dica do Placeholder do Slot</span>
                        <span className="text-[10px] text-amber-400">Visível no Jogo</span>
                      </label>
                      <input
                        type="text"
                        value={currentSlot.hint || ""}
                        onChange={(e) => handleUpdateSlotField(currentSlot.id, "hint", e.target.value)}
                        placeholder="Ex: Arraste o Resistor aqui (limita a corrente)"
                        className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none"
                      />
                      <span className="text-[11px] text-gray-400">
                        Texto curto exibido no centro do slot vazio para orientar o aluno.
                      </span>
                    </div>

                    {/* Slot Detailed Description */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-300">
                        Descrição Pedagógica / Feedback de Erro
                      </label>
                      <textarea
                        rows={2}
                        value={currentSlot.description}
                        onChange={(e) => handleUpdateSlotField(currentSlot.id, "description", e.target.value)}
                        placeholder="Ex: O resistor protege o LED contra corrente excessiva."
                        className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none resize-none"
                      />
                    </div>

                    {/* Slot Coordinates Fine-tuning */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#3e3e3e]">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Posição X (%)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          value={currentSlot.x}
                          onChange={(e) => handleUpdateSlotField(currentSlot.id, "x", parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#1e1e1e] border border-[#4a4a4a] rounded-xl px-3 py-1.5 text-sm text-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Posição Y (%)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          value={currentSlot.y}
                          onChange={(e) => handleUpdateSlotField(currentSlot.id, "y", parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#1e1e1e] border border-[#4a4a4a] rounded-xl px-3 py-1.5 text-sm text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                    <Info className="w-5 h-5 text-gray-500" />
                    <span>Nenhum slot selecionado. Clique em um slot no painel ao lado ou na imagem para editar.</span>
                  </div>
                )}
              </div>

              {/* Circuit General Metadata Settings */}
              <div className="bg-[#262626] border border-[#5e5e5e] rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#3e3e3e] pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#883cec]" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                      Dados Gerais do Circuito
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCircuit(currentCircuit.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Circuito</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Circuit Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300">
                      Título do Desafio
                    </label>
                    <input
                      type="text"
                      value={currentCircuit.title}
                      onChange={(e) => handleUpdateCircuitField("title", e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  {/* Practical Objective (RF14) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                      <span>Objetivo Prático do Desafio (RF14)</span>
                      <span className="text-[10px] text-amber-400">Requisito RF14</span>
                    </label>
                    <textarea
                      rows={2}
                      value={currentCircuit.practicalObjective}
                      onChange={(e) => handleUpdateCircuitField("practicalObjective", e.target.value)}
                      placeholder="Ex: Ligar um LED com Bateria 9V protegendo com Resistor."
                      className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none resize-none"
                    />
                  </div>

                  {/* Circuit Illustration Image */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300">
                      Ilustração do Circuito (Pasta circuitos/)
                    </label>
                    <select
                      value={currentCircuit.image_url}
                      onChange={(e) => handleUpdateCircuitField("image_url", e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none cursor-pointer"
                    >
                      {PRESET_CIRCUIT_IMAGES.map((img) => (
                        <option key={img.path} value={img.path}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300">
                      Nível de Dificuldade
                    </label>
                    <select
                      value={currentCircuit.difficulty}
                      onChange={(e) => handleUpdateCircuitField("difficulty", e.target.value as CircuitDifficulty)}
                      className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none cursor-pointer"
                    >
                      <option value="iniciante">Iniciante</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </div>

                  {/* Circuit Theoretical Explanation */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300">
                      Explicação Teórica de Funcionamento
                    </label>
                    <textarea
                      rows={2}
                      value={currentCircuit.explanation}
                      onChange={(e) => handleUpdateCircuitField("explanation", e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#4a4a4a] focus:border-[#883cec] rounded-xl px-3 py-2 text-sm text-white outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

